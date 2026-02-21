# RemoteJobsPH — Zero-API, File-Based Remote Jobs Directory

A production-ready, zero-API, file-based remote jobs directory built with **Bun** and **Next.js 14 (App Router)**. This system functions entirely without external API keys, AI services, or databases. All updates happen exclusively through CSV file modifications.

## Core Features

- **Git-as-CMS**: Edit `data/jobs.csv` → commit → push → Vercel auto-rebuilds.
- **Zero APIs**: No dependencies on external API calls or databases.
- **Client-Side Search**: Extremely fast fuzzy search powered by Fuse.js index.
- **3D Hero**: Self-contained React Three Fiber scene with inline shaders and no external assets.
- **Strict Validation**: Zod-based build-time validation of URLs, IDs, character lengths, and enums.

## Quick Start (Local Development)

1. **Install Bun**:
   If you don't have Bun installed:

   ```bash
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```

2. **Clone & Install**:

   ```bash
   bun install
   ```

3. **Validate CSV Data**:
   Ensure `data/jobs.csv` is correctly formatted before building.

   ```bash
   bun run validate
   ```

4. **Run Development Server**:
   ```bash
   bun run dev
   ```

## Maintainer Guide — How to Update Jobs

You have two ways to add or edit job links.

### Path A: Direct CSV Edit (Power User)

1. Open `data/jobs.csv` in your preferred editor (VS Code, Excel, etc.).
2. Add, modify or remove jobs exactly matching the necessary schema.
3. Run the validation before pushing!
   ```bash
   bun run validate
   ```
4. Commit and push your changes to GitHub to trigger a Vercel rebuild.

### Path B: Interactive CLI (Guided)

You can launch a guided prompt right from your terminal. We've built an interactive tool for you!

```bash
bun run add-job
```

Example session:

```
--- Add New Remote Job ---

Site name: remotejobsph
URL: https://github.com/cyalcala/remotejobsph
Category:
  1. freelance
  2. full-time
  3. part-time
  4. gig
  5. agency
Select [1-5]: 1
Tags (semicolon-separated) [e.g. dev;design;marketing]: tech;remote;philippines
Remote type:
  1. fully-remote
  2. hybrid
  3. remote-friendly
  4. unknown
Select [1-4]: 1
Rating (1-5, blank to skip): 5
Description (max 150 chars): The best file-based, zero-API remote jobs directory for Filipinos.
Hiring status:
  1. active
  2. slow
  3. unknown
Select [1-3]: 1

✅ Added 'remotejobsph' (id: remotejobsph) — run `git commit && git push` to publish
```

### Vercel Deployment

1. Make sure your repository is pushed to `github.com/cyalcala/remotejobsph`.
2. Go to [Vercel](https://vercel.com/new).
3. Import your GitHub repository.
4. Settings are automatically picked up from `vercel.json` and `next.config.js`. You don't need any environment variables.
5. Hit **Deploy**.

_Built with Bun + Next.js 14_
