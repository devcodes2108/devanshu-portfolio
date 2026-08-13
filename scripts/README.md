# LinkedIn Data Synchronization

## Overview

This directory contains the LinkedIn data synchronization system for the portfolio. It enables periodic updates of LinkedIn post data while maintaining the existing filtering rules and data model.

## Architecture

```
LinkedIn
    ↓
Agent-Reach (local CLI)
    ↓
JSON export
    ↓
scripts/sync-linkedin.py (process & filter)
    ↓
data/linkedin-import.ts
    ↓
GitHub Actions (commit & deploy)
    ↓
Vercel automatic deployment
    ↓
Updated portfolio
```

## Technical Limitations

### Why Full Automation Is Not Possible Without Credentials

LinkedIn's activity feed and post data **require authentication** to access programmatically. The following methods were investigated:

| Method | Status | Reason |
|--------|--------|--------|
| Jina Reader (public pages) | ❌ Blocked | LinkedIn returns 403 Forbidden |
| Agent-Reach + mcp-server-linkedin | ⚠️ Requires login | Needs browser automation + LinkedIn session |
| LinkedIn API | ❌ Requires OAuth | Needs registered app + user consent |
| RSS feeds | ❌ Not available | LinkedIn doesn't offer personal activity RSS |
| Simple web scraping | ❌ Blocked | Anti-bot protections + login walls |

**Conclusion:** There is no free, automated, credential-free method to sync LinkedIn posts programmatically. Any working solution requires either:
1. LinkedIn credentials (cookies/tokens) stored securely
2. A paid third-party service
3. Manual data export and import

## Implemented Solution: Hybrid Manual + GitHub Actions

Given the constraints, this implementation provides:

1. **Local sync script** (`scripts/sync-linkedin.py`) - Processes LinkedIn data exports locally
2. **GitHub Actions workflow** (`.github/workflows/linkedin-sync.yml`) - Can be triggered manually or on schedule
3. **Idempotent processing** - Existing posts are never duplicated; new posts are added; edits are preserved

## How to Use

### Option 1: Manual Local Sync (Recommended - No Credentials Needed)

1. **Export LinkedIn data locally:**
   ```bash
   # If you have Agent-Reach installed locally:
   agent-reach linkedin <your-profile-url> --format json > /tmp/linkedin-posts.json
   ```

2. **Run the sync script:**
   ```bash
   python scripts/sync-linkedin.py /tmp/linkedin-posts.json
   ```

3. **Commit and push:**
   ```bash
   git add data/linkedin-import.ts
   git commit -m "chore: update LinkedIn posts"
   git push origin main
   ```

### Option 2: GitHub Actions Manual Trigger

1. Go to your repository on GitHub
2. Navigate to **Actions** → **LinkedIn Data Sync**
3. Click **Run workflow**
4. Optionally provide a URL to a JSON file containing LinkedIn posts
5. Click **Run workflow**

The workflow will:
- Process any provided JSON data
- Apply exclusion filters
- Update `data/linkedin-import.ts`
- Commit and push changes

### Option 3: GitHub Actions Scheduled (Limited)

The workflow runs every 12 hours automatically, but **without credentials it cannot fetch new data**. It will:
- Verify data integrity
- Report status
- Make no changes if no new data is provided

## Data Format

Input JSON should be an array of LinkedIn posts:

```json
[
  {
    "id": "unique-post-id",
    "title": "Post title",
    "text": "Full post text",
    "excerpt": "Short summary",
    "date": "2025-08-13",
    "url": "https://www.linkedin.com/posts/...",
    "images": ["https://example.com/image1.jpg"],
    "imageAlt": "Image description",
    "hashtags": ["#AI", "#Tech"],
    "reactions": 42,
    "comments": 5,
    "impressions": 1200,
    "mediaType": "image",
    "category": "technical"
  }
]
```

## Exclusion Filters

Posts are automatically excluded if they match any of these criteria:

**Media Types (excluded):**
- `certificate`
- `document`
- `video`

**Categories (excluded):**
- `certification`
- `documentation`

**Keywords (excluded):**
- certificate
- certification
- certified
- document
- pdf
- video
- webinar recording

**Included:**
- technical posts
- cybersecurity
- programming
- projects
- learning
- career insights
- professional thoughts
- educational content
- interesting industry-related posts

## Idempotency

The sync process is idempotent:
- **Existing posts** are never duplicated (matched by URL and ID)
- **New posts** are added automatically
- **Edited posts** are not overwritten (existing data takes precedence)
- **Removed posts** are handled gracefully (no error)
- **Order** remains chronological (newest first)

## Secrets and Security

- **No credentials are stored in the repository**
- **No LinkedIn passwords or cookies are used**
- **No API keys are required**
- The GitHub Action uses only `GITHUB_TOKEN` (automatically provided by GitHub)

If you later decide to add automated LinkedIn fetching with credentials:
1. Store LinkedIn cookies/tokens in GitHub Secrets (Settings → Secrets → Actions)
2. Update the workflow to use a self-hosted runner or Docker container
3. **This is not recommended** unless you accept the risks of automated LinkedIn access

## Vercel Deployment

Any commit to the `main` branch automatically triggers a Vercel deployment. The LinkedIn data is baked into the static build at deploy time.

## Refresh Interval

- **Scheduled:** Every 12 hours (configurable in the workflow)
- **Actual data refresh:** Depends on how often you provide new JSON data
- **Without credentials:** The schedule only verifies data integrity; no new data is fetched

## Testing

Run verification locally:
```bash
python scripts/sync-linkedin.py --verify
```

This checks:
- Data integrity
- Duplicate URLs/IDs
- Exclusion filter application
- Date formatting

## Limitations

1. **No real-time sync** - Data is only updated when you provide new exports
2. **No credential-free automation** - LinkedIn requires authentication for activity feeds
3. **Manual step required** - You must export LinkedIn data locally or provide JSON
4. **Public data only** - Without login, only publicly accessible data is available

## Alternative: If You Later Want Full Automation

If you decide to use LinkedIn credentials (stored securely in GitHub Secrets):

1. Set up a self-hosted GitHub Actions runner on your machine
2. Store LinkedIn cookies in GitHub Secrets
3. Use `mcp-server-linkedin` or similar in the workflow
4. **Risks:** Credential storage, LinkedIn terms of service, potential account restrictions

This is **not implemented** by default per your requirements.
