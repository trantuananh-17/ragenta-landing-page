# Git Safety

## Never without being asked

- `git push`, any branch, any remote
- `git tag` — a tag triggers a release build and a deploy
- `git commit` outside an invoked commit workflow
- `git reset --hard`, `git clean`, `git checkout --`, `git stash`, or anything
  else that discards uncommitted work
- force pushes, history rewrites, amending a pushed commit
- edits to `.git/config`, remotes, hooks or branch tracking

## Releases

Tags are the release mechanism and they are immutable:

- `v1.2.0` goes to production
- `v1.2.0rc1` goes to staging

`release.yml` runs the same gate a pull request runs, builds the image, pushes
it to GHCR under that exact version, and deploys. There is no `latest` and no
moving `staging` pointer, which is what makes a rollback just re-deploying the
previous tag through `deploy.yml`.

Never re-point a tag that has been pushed. Its image is already in GHCR and may
already be running.

## Commits

One change per commit, per repository. The subject says what changed; the body
says why — the constraint, the bug it prevents, the alternative rejected. Never
stage files from two repositories together.
