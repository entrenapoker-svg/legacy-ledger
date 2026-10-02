# GitHub Actions workflows (not yet enabled)

These workflows were not pushed into `.github/workflows/` because the GitHub CLI token used to create the repo lacks the `workflow` scope. To enable them:

```bash
gh auth refresh -s workflow
mkdir -p .github/workflows && git mv ci/*.yml .github/workflows/
git commit -m "Enable CI and Pages workflows" && git push
```

- `ci.yml`: program unit tests + web app typecheck and build on every push.
- `pages.yml`: builds the web app and deploys it to GitHub Pages (then switch Pages to "GitHub Actions" in the repo settings).

Until then the app is published from the `gh-pages` branch, built locally with `scripts/publish-pages.sh`.
