# What works without internet? A plain-language guide

This is written for anyone at the school — not developers — who wants to know
what happens when a phone loses signal or data runs out.

## The short version

**Viewing things still works. Sending things gets held and sent later.**

Think of it like writing a letter and dropping it in a postbox. You can write
the letter (send a message, enter a score, submit an assessment) even if the
postman isn't around right now — it just sits safely in the box until he
comes. As soon as the phone finds internet again, everything in the box gets
sent automatically, in the order it was written. Nobody has to remember to
resend anything.

## What you can do with NO internet

- **Look at anything you've opened before.** If you checked a student's
  report card yesterday, you can still see it today with no signal — the app
  quietly kept a copy the last time it loaded. This applies to report cards,
  materials, assessments, messages, student lists, attendance, weekly
  efforts — anything you view.
- **Send a message.** It shows on your screen straight away, marked
  "Sending… (offline)", and goes out for real the moment signal returns.
- **Enter scores, mark attendance, submit an assessment, upload a weekly
  effort.** All of these are saved on the phone first and pushed to the
  server automatically once it's back online.
- **See how many things are waiting to send.** A banner at the top of the
  app shows you're offline and how many items are queued, with a button to
  retry manually if you want.

## What NEEDS internet — no way around it

- **Logging in, logging out, and changing your password.** These check
  something with the school's server directly (your password, your session,
  your old password), so they need a live connection every time — not just
  the first time. If you try one with no signal, the app now tells you
  plainly that you're offline instead of pretending it worked. Everything
  else described above still works with no signal, including staying logged
  in and viewing previously-loaded screens.
- **Asking Brainee anything.** Chat, explanations, hints, and drafting
  questions all need Brainee to actually think about your specific question
  right then — there's no sensible way to "queue" that for later, so these
  need signal too.
- **The admin's "Export to Excel" button.** This downloads an actual Excel
  file from the server. There's no offline version of a file that hasn't
  been downloaded yet, so this one specific feature needs a live connection.

Everything else in the app is built to cope with patchy or no signal — which
matters a lot for a Nigerian school where data and network reliability can't
always be counted on.

## Sharing a device with someone else

If a phone or tablet is used by more than one person — a staffroom tablet a
few teachers take turns on, say — each person's offline data (what they've
viewed, and anything they saved while offline that hasn't sent yet) is kept
separate and only visible to them. If you log out while you still have
changes waiting to send (the banner will say so), the app will warn you:
those changes stay safely on the device but won't actually reach the server
until you log back in on that same device again.

## One honest limitation to know about

If the *same* record — say, the same student's attendance for the same day —
gets edited offline on two different phones before either one reconnects,
whichever phone reconnects **second** wins, and its version quietly
overwrites the first. There's no pop-up warning either person about the
conflict.

Two things now help with this directly:
- **Every save is logged.** The admin's Audit Log now records who saved
  what, and when, for scores, attendance, remarks, and weekly efforts — so
  if something looks off, it's easy to see what happened and who was
  involved.
- **A class teacher can "close" her class.** Once a term's records are
  final — usually just before report cards go out — the class teacher can
  lock her class from the app. Once locked, nobody (not even her) can save
  further changes to that class's scores, attendance, remarks, or weekly
  efforts until she (or an admin) unlocks it again. Locking a class before
  it's finalized is the simplest way to make sure this overwrite issue
  never has a chance to happen for that term.

In practice this is unlikely to come up at all (it needs the same record
edited twice, offline, on two devices, before either syncs) — but it's
worth knowing if two staff members might ever cover the same class.

---
*For the technical version of this (which files, which code), see the
"Offline Support" section of the main `README.md`.*
