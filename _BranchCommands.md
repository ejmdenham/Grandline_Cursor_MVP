# Git feature branch commands

Quick reference for creating branches and merging them back. These commands work the same in zsh, bash, and other shells.

---

## Create and switch to a new branch

```bash
git checkout -b feature/my-feature-name
```

Or with newer syntax:

```bash
git switch -c feature/my-feature-name
```

---

## Work on the feature

```bash
git add .
git commit -m "Your message"
git push -u origin feature/my-feature-name   # optional: push to remote
```

---

## Merge back into main

```bash
git checkout main
git merge feature/my-feature-name
git push origin main
```

---

## Clean up after merge

```bash
git branch -d feature/my-feature-name
git push origin --delete feature/my-feature-name   # if you pushed the branch
```

---

## Quick reference

| Goal | Command |
|------|--------|
| Create & switch to new branch | `git checkout -b feature/thing` |
| See current branch | `git branch` or `git status` |
| Switch branch | `git checkout main` or `git switch main` |
| Merge feature into current branch | `git checkout main` then `git merge feature/thing` |
| Delete local branch | `git branch -d feature/thing` |

---

## Suggested workflow

1. Start from up-to-date main: `git checkout main` then `git pull`
2. Create feature branch: `git checkout -b feature/something`
3. Commit on the feature branch; push if using a remote
4. When done: `git checkout main` → `git merge feature/something` → `git push`
5. Delete the feature branch locally (and on remote if you pushed it)
