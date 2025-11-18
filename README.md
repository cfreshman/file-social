# file-social

Self-hosted personal media stream, like html VSCO

## Requirements

- [Node.js](https://nodejs.org/)
- Terminal app (Mac/Linux: Terminal, Windows: [Git Bash](https://gitforwindows.org/))
- Recommended: [Cursor](https://cursor.sh) for editing files
- For deployment: Ubuntu 24 server or Raspberry Pi (Trixie)

## Getting Started

**1. Get the code:**

Clone it:
```bash
git clone https://github.com/cfreshman/file-social.git
cd file-social
```

Or [download the zip](https://github.com/cfreshman/file-social/archive/refs/heads/m.zip) and extract it.

**2. Set up:**

```bash
npm run setup  # Installs dependencies, creates directories and config files
npm start
```

Open http://localhost:7650

**3. Eject (recommended for non-technical users!):**

Run this to set up content-only tracking:

```bash
npm run eject
```

This deletes the file-social git history and creates a fresh repo for YOUR content only. You'll use `npm run update` to get app updates (no merge conflicts!).

Skip if you're a developer who wants to manage merging git updates.

## Adding Posts

```bash
npm run new
```

Creates a timestamped file in `posts/`. Or drag any file into `posts/`.

**Supported:** .txt, .md (markdown), .jpg, .png, .gif, .webp, .mp4, .webm, .html, .url, .pdf, .glb, .gltf (3D models)

Posts display in reverse alphabetical order (newest first). It's recommended to use the nesting system with year/month/day folders.

## Configuration

Edit files in `public/config/` (created by `npm run setup`):

- **`-pins`** - Pin posts to top (one path per line)
- **`-best`** - Featured posts
- **`-backdrop`** - Background image/video URL or CSS gradient
- **`-(anything)`** - Custom filter tags (any file starting with `-`)
- **`-order`** - Tag display order

**Prefix entries with `-` to hide from main feed:**
- `-2025/11/14/0.html` in `-pins` → only shows pinned at top, not in chronological feed
- `-2025/11/01/1.html` in `-best` → only shows when "best" filter is active
- If ANY tag file has an item with `-` prefix, it's hidden from main feed

**What you can safely edit:**
- `posts/` - All your content
- `public/config/` - All config files
- `public/data/` - All your data files
- `server/custom/` - Custom API routes (see `server/custom.example/` for template)

These are preserved when you run `npm run update`. (The `_01/` directory is also preserved but auto-managed by the app.)

## Deployment

**All commands run from your computer.**

Choose one path:

- **Cloud server (rent from DigitalOcean, Linode, etc)** 
  - Cost: $6/month (basic option)
  - Deploy from anywhere
- **Raspberry Pi (cheap mini computer you'd run at home)**
  - Cost: $15+ one-time (Pi Zero W) + ~$2/year electricity
  - Deploy from your home network. Possible to deploy remotely if you follow some technical steps

### Path A: Cloud Server

**Requirements:** Ubuntu 24 server, root access

**Setup once:**
```bash
npm run deploy:configure
```
Enter your server IP. Script installs Node, PM2, nginx, and sets up SSL.

**Deploy updates:**
```bash
npm run deploy
```

**Add domain (optional):**
- Point A record to server IP
- Wait 5 minutes
- `npm run deploy:nginx`

Your site: `http://YOUR.IP:7650` or `https://yourdomain.com`

---

### Path B: Raspberry Pi

**Full beginner-friendly guide:** [yxorp.app/pi-social](https://yxorp.app/pi-social)

That guide walks through everything from flashing the SD card to getting a domain name.

**Deploy from outside your network?**

1. Set up SSH on multiple ports (search: **"how to provide ssh on multiple ports"**)
   - Keep port 22 for local access
   - Add port 2222 for external access

2. Set up port forwarding on your router to forward port 2222 to your Pi

3. Get your Pi's public IP: `curl http://v4.ident.me` **from device**

4. Run `npm run pi:configure` and enter your public IP and port 2222

---

## Keyboard Shortcuts

- `j` / `k` or `↑` / `↓` - Navigate posts
- `Home` / `End` - Jump to top/bottom

## File Types

- **`.txt`** - Plain text
- **`.md`** - Markdown with formatting (headings, lists, code blocks, links, etc)
- **`.html`** - Custom HTML posts (use `<script src="/lib.js"></script>` for styling)
- **`.url`** - File containing a URL to embed (images, videos, iframes)
- **Images/videos** - Display directly
- **`.glb` / `.gltf`** - 3D models with interactive viewer (rotate, zoom, auto-rotate)

**Example files:** Check `public/data/example/` for templates

## Updating file-social

Get the latest features and fixes:

```bash
npm run update
```

Your content is preserved (posts, config, data, custom routes). Everything else gets updated automatically.

## Daily Use

**Ubuntu:**
```bash
npm run deploy
```

**Raspberry Pi:**
```bash
npm run pi:deploy
```

That's it. Syncs everything to your server.

