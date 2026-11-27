# Drive sync

Sync between devices through each person's own Google Drive instead of Firebase. Anyone with the link can sign in with their Google account, and their plans, item sizes and item reviews are kept in a hidden folder in their own Drive. That folder is one only this planner can open, and it doesn't show among their files. There's no server and nothing to pay for.

## Setting it up

You do this once, on a computer, and it takes about 10 minutes. After that you only ever share the link.

1. **Make a project.**
   1. Open [console.cloud.google.com](https://console.cloud.google.com) and sign in with your Google account. Accept the terms if it asks.
   2. Click the project picker at the top (it may say **Select a project**), then **New project**.
   3. Name it `Pokopia Planner` and click **Create**.
   4. Check that the new project is the one selected at the top.
2. **Turn on the Drive API.** Open [the Google Drive API page](https://console.cloud.google.com/apis/library/drive.googleapis.com) and click **Enable**.
3. **Register the app for sign-in.**
   1. Open [Google Auth Platform](https://console.cloud.google.com/auth/overview) and click **Get started**.
   2. **App information:** app name `Pokopia Planner`, and your email as the user support email. **Next**.
   3. **Audience:** **External**. **Next**.
   4. **Contact information:** your email. **Next**.
   5. Tick the agreement, then **Continue** and **Create**.
4. **Ask for the hidden folder only.**
   1. In the menu on the left, open **Data Access** and click **Add or remove scopes**.
   2. Type `drive.appdata` in the filter box.
   3. Tick `.../auth/drive.appdata`, described as "See, create, and delete its own configuration data in your Google Drive".
   4. Click **Update**, then **Save**. Add no other scope.
5. **Let anyone sign in.**
   1. Open **Audience** and click **Publish app** under Publishing status, then **Confirm**.
   2. It should now say **In production**. Skip any offer to verify the app: that's only needed for a logo or for more permissions.
6. **Add the site's address.**
   1. Open **Branding**.
   2. Under **Authorized domains**, click **Add domain** and enter `adamspecial.github.io`.
   3. Click **Save**. Leave the logo empty.
7. **Make the sign-in ID.**
   1. Open **Clients** and click **Create client**.
   2. **Application type:** **Web application**.
   3. **Name:** `Pokopia Planner site`.
   4. Under **Authorized JavaScript origins**, click **Add URI** and enter `https://adamspecial.github.io`, with no slash at the end and no `/pokopia-planner`.
   5. Leave **Authorized redirect URIs** empty, and click **Create**.
8. **Send the Client ID.**
   1. Copy the **Client ID**. It looks like `123456789012-abc123….apps.googleusercontent.com`.
   2. Paste it into the chat. It isn't a secret.
   3. You can ignore the client secret if one is shown: the planner doesn't use it.

Once the ID is in the app, sign in on your phone and your PC: Plans → **Sync between devices** → **Sign in with Google**. Pick your account and click **Continue**. Google asks to let Pokopia Planner "see, create, and delete its own configuration data in your Google Drive". Your plans then show up on both devices. If Google ever shows a warning that the app isn't verified, say so, since it shouldn't with this one permission.

Friends do the same on their own devices. Nothing is needed from you.

## How it works

- **Where things are kept.** Each person's hidden app folder holds one file per plan, one for item sizes and one for item reviews. Nobody else can see them, you included. They use a little of that person's Drive storage, tens of KB a plan.
- **When it syncs.** It checks for changes when the planner opens, when you come back to it, and every 30 seconds while it's open. Edits go up a few seconds after you stop.
- **Reconnect.** Google's sign-in lasts an hour, and only a tap can renew it.
  - When it runs out, or when you open the planner later, a notice offers **Reconnect**. One tap and sync carries on.
  - Until then, edits are kept on the device and sent afterwards.
- **Clashes** work as before. If a plan changed on two devices before they synced, the newer version keeps the plan, and the other is kept as a copy.
- **Removing it.** **Remove from Drive** in the sync card deletes everything the planner saved in that person's Drive and turns sync off. Plans stay on their devices. Drive's own settings do the same: on a computer, drive.google.com → ⚙ → Settings → Manage apps → Pokopia Planner → Options → Delete hidden app data.
- **A wipe never deletes plans on other devices.**
  - The folder keeps a tiny marker file, `account.json`.
  - When the marker is gone, every other device turns its sync off and keeps its plans, instead of treating the empty folder as plans deleted elsewhere.
  - Signing in again puts that device's plans back.
- **Moving from Firebase.**
  - The first time you sign in with Drive on a device, that device's plans go up, and plans already in Drive come down.
  - Nothing is deleted on the way.
  - The Firebase project is left as it is, and the planner stops using it.

## Status

Built, and tested against a stand-in for Google's sign-in and Drive on a Pixel 7, a 1366×768 window and a 1920×1080 window, with these checks:

- sign-in, upload, download and edits between devices
- clashes, deletes and item sizes
- a Drive listing that lags behind, and duplicate files
- an expired or refused sign-in and Reconnect
- an unticked Drive box, a closed sign-in window and a full Drive
- switching accounts, 12 plans at once, and moving from Firebase
- Remove from Drive, a wipe from Drive's settings, signing in again afterwards, and a normal delete of the last plan still syncing

It switches on when the Client ID is added to `GD_CLIENT` in `app.js`. Until then the planner syncs through Firebase as before. Firebase stays in the code until Drive sync has worked on your phone and PC, and is removed after that.
