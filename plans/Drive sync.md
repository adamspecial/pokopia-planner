# Drive sync

Sync between devices through your own Google Drive. Plans, item sizes and item reviews are kept in a hidden folder in your Drive, one only this planner can open, that doesn't show among your files. There's no server and nothing to pay for.

The sign-in is for one person: the Google Cloud project stays in **Testing**, with you as its only test user. It doesn't need publishing, a homepage or a privacy policy.

## Setting it up

You did this once, on a computer. These are the steps, in case it ever needs doing again.

1. **Make a project.**
   1. Open [console.cloud.google.com](https://console.cloud.google.com) and sign in with your Google account.
   2. Click the project picker at the top, then **New project**.
   3. Name it `Pokopia Planner`, leave **Parent resource** as **No organisation**, and click **Create**.
   4. Check that the new project is the one selected at the top.
2. **Turn on the Drive API.** Open [the Google Drive API page](https://console.cloud.google.com/apis/library/drive.googleapis.com) and click **Enable**.
3. **Register the app for sign-in.**
   1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview) and click **Get started**.
   2. **App information:** app name `Pokopia Planner`, and your email as the user support email. **Next**.
   3. **Audience:** **External**. **Next**.
   4. **Contact information:** your email. **Next**.
   5. Tick the agreement, then **Continue** and **Create**.
4. **Ask for the hidden folder only.**
   1. Open **Data Access** and click **Add or remove scopes**.
   2. Type `drive.appdata` in the filter box.
   3. Tick `.../auth/drive.appdata`, described as "See, create, and delete its own configuration data in your Google Drive".
   4. Click **Update**, then **Save**. Add no other scope.
5. **Add yourself as the test user.**
   1. Open **Audience**. Leave Publishing status at **Testing**; don't publish.
   2. Under **Test users**, click **Add users**, enter the Gmail address you sign in to the planner with, and click **Save**.
6. **Make the sign-in ID.**
   1. Open **Clients** and click **Create client**.
   2. **Application type:** **Web application**. **Name:** `Pokopia Planner site`.
   3. Under **Authorized JavaScript origins**, click **Add URI** and enter `https://adamspecial.github.io`, with no slash at the end.
   4. Leave **Authorized redirect URIs** empty, and click **Create**.
7. **Put the Client ID in the planner.** It goes in `GD_CLIENT` in `app.js`. It isn't a secret. The client secret isn't used.

## How it works

- **Signing in.** Plans → **Sync between devices** → **Sign in with Google**, once on each device. Google asks to let Pokopia Planner "see, create, and delete its own configuration data in your Google Drive". It may first say the app isn't verified; that's normal for a testing app, so click **Continue**.
- **Where things are kept.** The hidden folder holds one file per plan, one for item sizes, one for item reviews and a small marker file, `account.json`. They take tens of KB a plan.
- **When it syncs.** It checks for changes when the planner opens, when you come back to it and every 30 seconds while it's open. Edits go up a few seconds after you stop.
- **Reconnect.** Google's sign-in lasts an hour, and only a tap can renew it.
  - When it runs out, or when you open the planner later, a notice offers **Reconnect**. One tap and sync carries on.
  - Until then, edits are kept on the device and sent afterwards.
  - Because the project is in testing, Google forgets your approval after 7 days, so about once a week Reconnect shows Google's approval screen again.
- **Clashes.** If a plan changed on two devices before they synced, the newer version keeps the plan, and the other is kept as a copy.
- **Removing it.** **Remove from Drive** in the sync card deletes everything the planner saved in your Drive and turns sync off. Plans stay on your devices. Drive's own settings do the same: on a computer, drive.google.com → ⚙ → Settings → Manage apps → Pokopia Planner → Options → Delete hidden app data.
- **A wipe never deletes plans on other devices.** When the marker file is gone, every other device turns its sync off and keeps its plans, instead of treating the empty folder as plans deleted elsewhere. Signing in again puts that device's plans back.
- **A new device.** Signing in on a device sends up its plans and brings down the ones already in Drive. Nothing is deleted on the way.

## Status

Switched on. Tested against a stand-in for Google's sign-in and Drive on a Pixel 7, a 1366×768 window and a 1920×1080 window, with these checks:

- sign-in, upload, download and edits between devices
- clashes, deletes and item sizes
- a Drive listing that lags behind, and duplicate files
- an expired or refused sign-in and Reconnect
- an unticked Drive box, a closed sign-in window and a full Drive
- switching accounts, and 12 plans at once
- Remove from Drive, a wipe from Drive's settings, signing in again afterwards, and a normal delete of the last plan still syncing

Real Google sign-in works on the owner's devices.
