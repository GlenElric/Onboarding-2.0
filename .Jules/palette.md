## 2025-03-03 - [Login Page Accessibility & Feedback]
**Learning:** Even modern UI frameworks often miss basic accessibility links like `htmlFor` on labels. Adding these, along with visual feedback like loading spinners for async actions, significantly improves the perceived speed and usability of the application.
**Action:** Always check form labels for `htmlFor` and ensure buttons have loading states for any network-bound action.

## 2025-03-03 - [pnpm Workspace Lockfile Management]
**Learning:** Running `pnpm install` in subdirectories of a monorepo can inadvertently generate redundant `pnpm-lock.yaml` files, which causes repository noise and potential CI issues.
**Action:** Always run `pnpm` commands from the root or ensure no new lockfiles are created in workspace member directories before submitting.
