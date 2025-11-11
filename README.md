# file-social

Self-hosted personal media stream, like html VSCO

## Local Setup

```bash
npm run setup  # Installs dependencies, creates directories and config files
npm start
```

Open http://localhost:7650

## Requirements

- [Node.js](https://nodejs.org/)
- Terminal app (Mac/Linux: Terminal, Windows: [Git Bash](https://gitforwindows.org/))
- Recommended: [Cursor](https://cursor.sh) for editing files
- For deployment: Ubuntu 24 server or Raspberry Pi (Trixie)

## Adding Posts

```bash
npm run new
```

Creates a timestamped file in `posts/`. Or drag any file into `posts/`.

**Supported:** .txt, .jpg, .png, .gif, .webp, .mp4, .webm, .html, .url

Posts display in reverse alphabetical order (newest first). It's recommended to use the nesting system with year/month/day folders.

## Configuration

Edit files in `public/config/` (created by `npm run setup`):

- **`-pins`** - Pin posts to top (one path per line)
- **`-best`** - Featured posts
- **`-backdrop`** - Background image/video URL or CSS gradient
- **`-(anything)`** - Custom filter tags (any file starting with `-`)
- **`-order`** - Tag display order

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
- **`.html`** - Custom HTML posts (use `<script src="/lib.js"></script>` for styling)
- **`.url`** - File containing a URL to embed (images, videos, iframes)
- **Images/videos** - Display directly

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

