# cashalo-tokens-test

Sandbox for validating the automated design-token regeneration pipeline before pointing it at the real iOS and Android repos.

## What it does

1. You edit `tokens-studio.json` and push to `main`.
2. A GitHub Action (`.github/workflows/generate-tokens.yml`) fires.
3. The Action runs Style Dictionary to transform the JSON into:
   - `dist/ios/Tokens.swift` — Swift class for iOS
   - `dist/android/Tokens.kt` — Kotlin object for Android
4. The Action opens a Pull Request **back to this same repo** with the generated files.
5. You review and merge.

Once this loop works end-to-end, we'll flip the workflow to open PRs in `empower-android-ph` and `ios-ph-cashalo` instead of the same repo.

## One-time setup

### 1. Create the repo and push

From this directory:

```bash
# Initialize git
git init
git add .
git commit -m "Initial scaffold: token regeneration pipeline"

# Create the repo on GitHub (private)
gh repo create juancastrence-tilt/cashalo-tokens-test --private --source=. --remote=origin --push
```

### 2. Enable PR creation for the GitHub Action

By default GitHub may restrict the Action's ability to open PRs. Enable it:

1. Go to `https://github.com/juancastrence-tilt/cashalo-tokens-test/settings/actions`
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 3. Test the pipeline

Edit `tokens-studio.json` (e.g. change `Cashalo.Blue.300` from `#0000ff` to `#0000ee`), then:

```bash
git add tokens-studio.json
git commit -m "tweak primary blue"
git push
```

Watch the Action run at `https://github.com/juancastrence-tilt/cashalo-tokens-test/actions`. Within ~30 seconds a PR titled **[Design Tokens] Regenerate from tokens-studio.json** should appear at `/pulls`.

## Local testing (no GitHub needed)

To verify Style Dictionary works locally before pushing:

```bash
npm install
npm run build:tokens
```

Check the generated files in `dist/ios/Tokens.swift` and `dist/android/Tokens.kt`.

## What's next (after sandbox is green)

1. Add more refined Style Dictionary transforms (color formats, naming conventions per platform team's preferences)
2. Generate a Personal Access Token with `repo` scope on Tilt's GitHub org
3. Update the workflow to push PRs to `empower-android-ph` and `ios-ph-cashalo` repos
4. Replace manual JSON commits with an n8n step that pulls the JSON from Figma after a `LIBRARY_PUBLISH` webhook (pending Figma admin access)

## Files

| File | Purpose |
|---|---|
| `tokens-studio.json` | Source of truth — design tokens in W3C/Tokens Studio format |
| `style-dictionary.config.js` | Transform config — defines iOS + Android outputs |
| `package.json` | Node dependencies (Style Dictionary, `@tokens-studio/sd-transforms`) |
| `.github/workflows/generate-tokens.yml` | The Action — runs Style Dictionary + opens PR |
