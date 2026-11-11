# SS1 Mathematics asset attachment

The Mathematics package now registers 12 original SVG assets: four zoomable logarithm/antilogarithm table pages and eight geometry, trigonometry, mensuration and statistics diagrams. The files are stored under `backend/src/db/ss1/assets/mathematics`; the three CSV manifests bind them to exact source-topic titles and order indexes.

The asset attachment script is deliberately dry-run-first. It never creates or changes `topics` rows; it only attaches assets to existing topic identities.

## Windows PowerShell

Run from the repository root after setting `DATABASE_URL` in the current PowerShell session to the intended database. Do not commit or paste the secret into Git.

```powershell
Set-Location .\backend

$assetFolder = ".\src\db\ss1\assets\mathematics"
$manifests = @(
  @{ File = "..\docs\ss1\resources\mathematics-assets-1st-term.csv"; Term = "1st Term" },
  @{ File = "..\docs\ss1\resources\mathematics-assets-2nd-term.csv"; Term = "2nd Term" },
  @{ File = "..\docs\ss1\resources\mathematics-assets-3rd-term.csv"; Term = "3rd Term" }
)

foreach ($item in $manifests) {
  node --import tsx .\src\db\attachTopicAssets.ts `
    --manifest $item.File `
    --assets $assetFolder `
    --subject "Mathematics" `
    --class-name "SS 1" `
    --term-label $item.Term `
    --school-code secondary `
    --dry-run

  if ($LASTEXITCODE -ne 0) {
    throw "Mathematics asset dry-run failed for $($item.Term). Do not apply."
  }
}
```

Review every dry-run result. Each manifest must resolve every expected title and order index exactly, with no missing topic, hash mismatch, or metadata conflict.

Only after all three dry-runs report the expected assets and zero conflicts, repeat the same three commands with `--apply` instead of `--dry-run`. The script applies each term in one transaction and is idempotent.

After attachment, run the Mathematics student topic-assets endpoint for the affected topics and confirm that the four table pages and eight diagrams are returned. Until this database attachment and UI check are complete, the Mathematics asset resolver intentionally withholds the registered assets and the two related open items remain blocking.
