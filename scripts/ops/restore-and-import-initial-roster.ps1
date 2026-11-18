[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$WorkbookPath,
    [Parameter(Mandatory=$true)][string]$BackupArtifactPath,
    [Parameter(Mandatory=$true)][string]$AgeIdentityPath,
    [switch]$Apply
)

$ErrorActionPreference = "Stop"
$ExpectedWorkbookSha256 = "56F18CAE5EBAB64C82BCCABF2A80547DFEC05FD6435A7A5159FAC89100CDA20"
$Repository = "https://github.com/PDS-David/sts-school-app.git"
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$WorkDir = Join-Path $env:USERPROFILE "Downloads\sts-school-roster-import-$Stamp"
$TempDir = Join-Path $env:TEMP "sts-school-backup-check-$Stamp"
$RestoreDb = "sts_school_backup_verify_$Stamp"
$pgBin = "C:\Program Files\PostgreSQL\18\bin"

function Read-ZipText($Zip, [string]$Name) {
    $entry = $Zip.GetEntry($Name)
    if (-not $entry) { throw "Backup artifact is missing $Name." }
    $reader = [IO.StreamReader]::new($entry.Open())
    try { $reader.ReadToEnd() } finally { $reader.Dispose() }
}

function Invoke-Importer([bool]$DoApply) {
    $args = @("--import","tsx","src/db/importPhysicalReportRoster.ts","--file=$ResolvedWorkbook","--confirm-database=sts_school_db_2")
    if ($DoApply) { $args += @("--apply","--owner-approved-initial-roster") }
    $output = & node @args 2>&1
    if ($LASTEXITCODE -ne 0) { $output | ForEach-Object { Write-Host $_ }; throw "Roster importer failed; stop and inspect before retrying." }
    $joined = ($output | ForEach-Object { "$_" }) -join [Environment]::NewLine
    $start = $joined.LastIndexOf("{")
    if ($start -lt 0) { throw "Importer did not return a JSON summary." }
    return ($joined.Substring($start) | ConvertFrom-Json)
}

$envNames = @("DATABASE_URL","DATABASE_SSL","DATABASE_SSL_REJECT_UNAUTHORIZED","NODE_ENV","RAW_DATABASE_URL")
$oldEnv = @{}
foreach ($name in $envNames) { $oldEnv[$name] = [Environment]::GetEnvironmentVariable($name,"Process") }

try {
    if (-not (Test-Path -LiteralPath $WorkbookPath -PathType Leaf)) { throw "Approved roster workbook not found." }
    $ResolvedWorkbook = (Resolve-Path -LiteralPath $WorkbookPath).Path
    if ([IO.Path]::GetFileName($ResolvedWorkbook) -ne "Student_Roster_Initial_Launch_Approved.xlsx") { throw "Unexpected workbook filename." }
    if ((Get-FileHash -LiteralPath $ResolvedWorkbook -Algorithm SHA256).Hash -ne $ExpectedWorkbookSha256) { throw "Workbook checksum mismatch; refusing to continue." }

    if (-not (Test-Path -LiteralPath $BackupArtifactPath -PathType Leaf)) { throw "Backup ZIP not found." }
    if (-not (Test-Path -LiteralPath $AgeIdentityPath -PathType Leaf)) { throw "Age private identity file not found." }
    $age = Get-Command age -ErrorAction SilentlyContinue
    if (-not $age) { throw "Install the age CLI before running this procedure." }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
    $zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $BackupArtifactPath).Path)
    try {
        $manifest = Read-ZipText $zip "manifest.txt"
        $evidence = Read-ZipText $zip "restore-verification.txt"
        if ($manifest -notmatch "(?m)^database=sts_school_db_2$" -or $manifest -notmatch "(?m)^disposable_restore=passed$") { throw "Backup manifest does not match the expected production database or lacks restore verification." }
        if ($evidence -notmatch "^sts_backup_restore_check\|PostgreSQL 18\.[0-9]+[^|]*\|45\|6\|0\|0\|4$") { throw "Backup restore evidence does not match the verified PostgreSQL 18 snapshot." }

        $encrypted = $zip.Entries | Where-Object { $_.Name -match '\.dump\.age$' } | Select-Object -First 1
        if (-not $encrypted) { throw "Encrypted database dump is missing." }
        $checksum = Read-ZipText $zip "$($encrypted.Name).sha256"
        $expectedHash = ($checksum.Trim() -split '\s+')[0].ToLowerInvariant()
        $encryptedPath = Join-Path $TempDir $encrypted.Name
        [IO.Compression.ZipFileExtensions]::ExtractToFile($encrypted,$encryptedPath,$true)
    } finally { $zip.Dispose() }

    if ((Get-FileHash -LiteralPath $encryptedPath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expectedHash) { throw "Encrypted dump checksum mismatch." }
    $dumpPath = Join-Path $TempDir "production.dump"
    & $age.Source --decrypt --identity $AgeIdentityPath --output $dumpPath $encryptedPath
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $dumpPath)) { throw "Backup decryption failed. No production operation was attempted." }

    foreach ($tool in @("pg_isready.exe","createdb.exe","pg_restore.exe","psql.exe")) {
        if (-not (Test-Path (Join-Path $pgBin $tool))) { throw "PostgreSQL 18 tool missing: $(Join-Path $pgBin $tool)" }
    }
    $pgReady = Join-Path $pgBin "pg_isready.exe"
    $createdb = Join-Path $pgBin "createdb.exe"
    $restore = Join-Path $pgBin "pg_restore.exe"
    $psql = Join-Path $pgBin "psql.exe"
    & $pgReady --host=localhost --port=5433 --username=postgres --dbname=postgres
    if ($LASTEXITCODE -ne 0) { throw "Local PostgreSQL 18 is not ready on localhost:5433." }

    $toc = Join-Path $TempDir "archive-list.txt"
    & $restore --list $dumpPath 1> $toc
    if ($LASTEXITCODE -ne 0 -or (Get-Item $toc).Length -eq 0) { throw "pg_restore --list failed." }

    $exists = & $psql --host=localhost --port=5433 --username=postgres --dbname=postgres --tuples-only --no-align --command "SELECT 1 FROM pg_database WHERE datname='$RestoreDb';"
    if ($LASTEXITCODE -ne 0) { throw "Could not inspect local databases." }
    if ("$exists".Trim() -eq "1") { throw "Restore target already exists; refusing to overwrite it." }

    & $createdb --host=localhost --port=5433 --username=postgres --template=template0 --encoding=UTF8 $RestoreDb
    if ($LASTEXITCODE -ne 0) { throw "Could not create separate UTF-8/template0 restore database." }
    & $restore --verbose --exit-on-error --single-transaction --no-owner --no-privileges --host=localhost --port=5433 --username=postgres --dbname=$RestoreDb $dumpPath
    if ($LASTEXITCODE -ne 0) { throw "Local PostgreSQL 18 restore failed. Production was not changed." }

    $sql = "SELECT concat_ws('|',current_database(),version(),(SELECT count(*)::text FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p')),(SELECT count(*)::text FROM schema_migrations),(SELECT count(*)::text FROM students),(SELECT count(*)::text FROM report_roster_memberships),(SELECT count(*)::text FROM audit_log));"
    $summary = & $psql --host=localhost --port=5433 --username=postgres --dbname=$RestoreDb --no-psqlrc --set=ON_ERROR_STOP=1 --tuples-only --no-align --command $sql
    if ($LASTEXITCODE -ne 0) { throw "Could not verify restored database." }
    $parts = "$summary".Trim() -split '\|'
    if ($parts.Count -ne 7 -or $parts[0] -ne $RestoreDb -or $parts[1] -notmatch 'PostgreSQL 18\.' -or $parts[2] -ne '45' -or $parts[3] -ne '6' -or $parts[4] -ne '0' -or $parts[5] -ne '0' -or $parts[6] -ne '4') { throw "Restored database counts differ from the verified backup evidence: $summary" }
    Write-Host "LOCAL RESTORE VERIFIED: PostgreSQL 18; UTF-8/template0; 45 tables; 6 migrations; 0 students; 0 report memberships; 4 audit events."
    Remove-Item -LiteralPath $dumpPath,$encryptedPath -Force

    & git clone --quiet --depth 1 --branch master $Repository $WorkDir
    if ($LASTEXITCODE -ne 0) { throw "Could not clone current master." }
    Push-Location $WorkDir
    try {
        & npm ci
        if ($LASTEXITCODE -ne 0) { throw "npm ci failed." }
        & node --import tsx --test tests/physical-roster-workbook.test.mts
        if ($LASTEXITCODE -ne 0) { throw "Roster workbook parser tests failed." }

        $secure = Read-Host "Render EXTERNAL database URL for sts_school_db_2 (hidden input)" -AsSecureString
        $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        try { $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
        finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
        $env:RAW_DATABASE_URL = $plain
        $url = & node -e 'const u=new URL(process.env.RAW_DATABASE_URL); for(const k of ["sslmode","sslrootcert","sslcert","sslkey"])u.searchParams.delete(k); process.stdout.write(u.toString())'
        if ($LASTEXITCODE -ne 0) { throw "Invalid database URL." }
        if (([Uri]$url).Host -notmatch '\.render\.com$') { throw "Database URL is not a Render external hostname." }
        $env:DATABASE_URL = $url
        $env:DATABASE_SSL = "true"
        $env:NODE_ENV = "production"
        Remove-Item Env:RAW_DATABASE_URL -ErrorAction SilentlyContinue
        $plain = $null
        $secure = $null

        Push-Location (Join-Path $WorkDir "backend")
        try {
            $dry = Invoke-Importer $false
            $expected = @{
                database_name="sts_school_db_2"; source_rows=104; verified_active_rows_considered=104
                transferred_rows_skipped=0; left_school_rows_skipped=0; matched_production_students=0
                new_student_rows=104; new_report_roster_memberships=104; reactivated_provisional_memberships=0
                already_active_and_unchanged=0; apply=$false; admission_numbers_created=0
                online_accounts_created=0; online_student_rows_updated=0
            }
            foreach ($key in $expected.Keys) { if ($dry.$key -ne $expected[$key]) { throw "Production dry-run mismatch for $key. No writes attempted." } }
            Write-Host "PRODUCTION DRY-RUN PASSED: 104 physical report students and 104 memberships; no online accounts or admission numbers."

            if ($Apply) {
                $answer = Read-Host 'Type exactly IMPORT 104 to authorize the production write'
                if ($answer -cne "IMPORT 104") { Write-Host "Not confirmed. Production unchanged."; return }
                $applied = Invoke-Importer $true
                if ($applied.database_name -ne "sts_school_db_2" -or $applied.source_rows -ne 104 -or $applied.new_student_rows -ne 104 -or $applied.new_report_roster_memberships -ne 104 -or $applied.apply -ne $true -or $applied.admission_numbers_created -ne 0 -or $applied.online_accounts_created -ne 0 -or $applied.online_student_rows_updated -ne 0) { throw "Apply summary unexpected; stop and inspect production immediately." }
                Write-Host "IMPORT COMPLETE: 104 physical report-roster records and 104 memberships."
            } else {
                Write-Host "Dry-run only. No production rows were changed. Re-run with -Apply only when ready."
            }
        } finally { Pop-Location }
    } finally { Pop-Location }
}
finally {
    if (Test-Path $TempDir) { Remove-Item -LiteralPath $TempDir -Recurse -Force -ErrorAction SilentlyContinue }
    foreach ($name in $envNames) {
        if ($null -eq $oldEnv[$name]) { [Environment]::SetEnvironmentVariable($name,$null,"Process") }
        else { [Environment]::SetEnvironmentVariable($name,$oldEnv[$name],"Process") }
    }
}
