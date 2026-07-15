# Testing sts-school-app on Windows (before distribution)

This walks through running the **backend API** and the **mobile app** locally
on a Windows machine, end-to-end, so you can exercise every flow (including
the new 3rd Term + session collation work) before giving the app to real
teachers/parents/students.

Two ways to view the mobile app while testing: the **Android emulator**
(via Android Studio) or a **physical phone** running the **Expo Go** app.
Steps for both are included — pick one to start with; Expo Go on your own
phone is the fastest way to get moving.

---

## 1. Install prerequisites

| Tool | Why | Get it |
|---|---|---|
| **Node.js LTS (20.x or 22.x)** | Runs both backend and mobile tooling | https://nodejs.org — download the **LTS** Windows installer, accept defaults |
| **PostgreSQL** | The database | https://www.postgresql.org/download/windows/ — during install, set a password for the `postgres` user and **remember it** |
| **Git** (optional but recommended) | Not strictly required if you already have the project unzipped | https://git-scm.com/download/win |
| **Android Studio** (only if using the emulator route) | Provides the Android emulator | https://developer.android.com/studio |
| **Expo Go** app (only if using the physical-phone route) | Lets your phone run the app without a full native build | Install from Play Store / App Store on your phone |

After installing Node, open **PowerShell** and confirm:
```powershell
node -v
npm -v
```
Both should print version numbers. If PowerShell says it can't run scripts
(`running scripts is disabled on this system`), run PowerShell **as
Administrator** once and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
then reopen a normal PowerShell window.

---

## 2. Unzip the project

Unzip `sts-school-app-merged-final.zip` somewhere simple, e.g.
`C:\dev\sts-school-app` — avoid deeply nested folders like inside
`Downloads\some-folder\another-folder\...`, since Windows has a path-length
limit that `node_modules` (lots of small nested folders) can hit.

---

## 3. Set up PostgreSQL

Open **PowerShell** and use `psql` (installed with PostgreSQL; if `psql`
isn't recognized, add `C:\Program Files\PostgreSQL\<version>\bin` to your
Windows PATH, or use the **SQL Shell (psql)** app from the Start Menu
instead of PowerShell for this step).

```powershell
psql -U postgres
```
Enter the password you set during install. Then, at the `postgres=#` prompt:
```sql
CREATE DATABASE stsschool;
\q
```

Load the schema:
```powershell
psql -U postgres -d stsschool -f C:\dev\sts-school-app\backend\schema.sql
```

---

## 4. Set up and start the backend

```powershell
cd C:\dev\sts-school-app\backend
copy .env.example .env
```

Open `.env` in Notepad (or VS Code: `code .env`) and set:
- `DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/stsschool`
- `JWT_SECRET` and `JWT_REFRESH_SECRET` — replace both placeholders with
  long random strings (anything unique and long is fine for local testing;
  don't reuse these values in a real deployment).
- SMTP settings can be left as placeholders for local testing — email
  sending will just fail silently/log an error, it won't crash the server.
- Leave `NODE_ENV` as `development` for local testing (production mode
  will refuse to boot with placeholder JWT secrets, by design).

Install dependencies and seed the database:
```powershell
npm install
npm run db:seed
```
This creates the schools, a default **1st Term** for each, and default admin
and teacher logins (see `README.md` for the exact credentials, e.g.
`admin` / `Admin@1234` — must change password on first login).

**Optional — bring in the legacy 1st Term data**, per `SESSION_COLLATION.md`:
```powershell
npx tsx src/db/importFirstTerm.ts
```

Start the server:
```powershell
npm run dev
```
You should see it log that it's listening on port 4000. Leave this
PowerShell window open — the backend needs to keep running while you test
the app. Confirm it's reachable by opening
`http://localhost:4000` in a browser (a JSON response or a simple "not
found" for `/` is fine — it confirms the server is answering).

---

## 5. Find your Windows machine's IP address (needed for a physical phone)

If you're testing on the **Android emulator**, skip this — the emulator
already has a fixed route to your PC at `10.0.2.2`, which is what
`mobile/app.json` is set to by default.

If you're testing on a **physical phone** via Expo Go, your phone needs your
PC's actual LAN IP address (not `10.0.2.2`, which only means anything inside
an Android emulator). In PowerShell:
```powershell
ipconfig
```
Look for **IPv4 Address** under your active adapter (Wi-Fi or Ethernet),
e.g. `192.168.1.42`. Your phone and PC must be on the **same Wi-Fi
network**.

Edit `mobile/app.json` and change:
```json
"extra": { "apiUrl": "http://10.0.2.2:4000" }
```
to:
```json
"extra": { "apiUrl": "http://192.168.1.42:4000" }
```
using your actual IP.

### Windows Firewall

The first time the backend accepts a connection from another device,
Windows may prompt **"Windows Defender Firewall has blocked some features of
Node.js"** — click **Allow access** (at least for Private networks). If you
miss that prompt, or requests from your phone just time out, open **Windows
Defender Firewall → Advanced Settings → Inbound Rules → New Rule** and allow
TCP port `4000` for Private networks.

---

## 6. Set up and start the mobile app

Open a **second** PowerShell window (keep the backend running in the first):
```powershell
cd C:\dev\sts-school-app\mobile
npm install
npm start
```
This starts the Expo development server and shows a QR code in the terminal.

**Option A — physical phone (fastest to get started):**
1. Open the **Expo Go** app on your phone.
2. Scan the QR code shown in the terminal (Android: in-app scanner; iPhone:
   use the Camera app, then tap the notification).
3. The app should load. If it hangs on load or shows a network error, it's
   almost always the `apiUrl` / firewall step above — double check the IP
   and that both devices are on the same Wi-Fi.

**Option B — Android emulator:**
1. Open Android Studio → **More Actions → Virtual Device Manager** → create
   a device if you haven't (any recent Pixel + a recent Android version is
   fine) → start it.
2. With the emulator running, go back to the Expo terminal and press `a`.
   Expo will install and launch the app inside the emulator automatically.
   Since the emulator maps `10.0.2.2` to your PC, the default `app.json`
   value works without editing anything.

---

## 7. What to actually test

Log in as each role (admin / teacher / student / parent — seeded/imported
accounts, or ones you create via the Admin screens) and walk through:

- **Login, forced password change on first login, logout.**
- **Admin:** create a student, link a parent, link/unlink a student login
  (per the `StudentDetailScreen` work from the merge pass).
- **Teacher:** enter CA1/CA2/Exam scores for a student in **1st Term**, then
  switch the Term picker to **2nd Term** and enter scores there too.
- **Open 3rd Term** (this is the new part):
  - As admin, call `POST /academic/terms` (via the app's Terms management
    screen if it has a create-term UI, or directly with a tool like Postman/
    `curl` against `http://localhost:4000/academic/terms` while logged in as
    admin) with `{"name":"3rd Term","academic_year":"2025/2026","school_code":"..."}`.
  - Confirm a 4th term is correctly **rejected** — try creating a second
    "3rd Term" or a 4th distinct term for the same year and expect a 409
    error mentioning the session is capped at 3.
  - Mark 3rd Term current, then have the teacher enter some scores against
    it via the same Score Entry screen.
- **Session Report (new):** as student or parent, open **My Results** →
  **"View Session Report (1st + 2nd + 3rd Term)"**. Confirm:
  - It shows an "in progress" banner while any term is incomplete.
  - Totals per subject update correctly as more terms are entered.
  - It shows "Complete" once all 3 terms have scores for every subject.
- **Messaging/Chats, uploads, attendance, notifications** — anything else
  relevant to your rollout — using the existing regression checklist in
  `REGRESSION_REPORT.md`.

---

## 8. Common Windows-specific issues

| Symptom | Likely cause / fix |
|---|---|
| `npm : cannot be loaded because running scripts is disabled` | PowerShell execution policy — see step 1 |
| `psql` not recognized | Add PostgreSQL's `bin` folder to PATH, or use the **SQL Shell (psql)** shortcut from the Start Menu instead |
| Backend `EADDRINUSE` on port 4000 | Something else is already using that port — check with `netstat -ano \| findstr :4000`, or change `PORT` in `.env` |
| Phone can't reach the backend | Wrong `apiUrl` (using `10.0.2.2` on a real phone instead of your PC's LAN IP), phone/PC on different Wi-Fi networks, or Windows Firewall blocking the connection — see step 5 |
| `npm install` fails with path-too-long errors | Move the project to a shorter path, e.g. `C:\dev\sts-school-app`, rather than deep inside `Downloads` |
| Emulator is very slow | Enable virtualization (Intel VT-x/AMD-V) in your PC's BIOS if you haven't, and make sure Android Studio's emulator is using hardware acceleration (HAXM/WHPX) |

---

Once you've walked through section 7 without surprises, you're in good shape
to move to distribution — see `README.md`'s note on deploying the backend
somewhere reachable over the internet with HTTPS and updating
`mobile/app.json`'s `apiUrl` before building the real installable app
(`eas build` / `expo run:android`), since `10.0.2.2` and your home LAN IP
both only work for local testing.
