# Working on this repo

- Merge every update yourself, straight away: commit, push, open a pull request to `main` and merge it. Don't wait to be asked. The site (https://adamspecial.github.io/pokopia-planner/) only updates from `main`.
- When `index.html` changes, give `CACHE` in `sw.js` a new version and move `APP_BUILD` in `index.html` forward, so installed copies pick up the update.
- Write only code. Delete any comment you find: `//`, `/* */`, `#` and docstrings, in every code file.
- Care only about Android and Windows. Design, test and fix for Chrome and Edge on Android phones and tablets and on Windows PCs, and use Android device profiles (such as Pixel) for phone checks. Ignore iPhone, iPad, Mac and Safari.
