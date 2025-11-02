# file-social

Self-hosted personal media stream, like html VSCO

## Requirements

- [Node.js](https://nodejs.org/)
- Terminal app (Mac/Linux: built-in Terminal, Windows: [Git Bash](https://gitforwindows.org/))
- Recommended: [Cursor](https://cursor.sh) for editing files

## Local Setup

In your terminal, navigate to the project directory and enter these lines:

```bash
npm run setup
npm start
```

Open http://localhost:7650

## Adding Posts

```bash
npm run new
```

This creates a new post file with the correct date prefix. Or drop any file into `posts/`.

**Posts are displayed in reverse alphabetical order.** It's recommended to use the nesting system with year/month/day folders.

**Supported:** .txt, .jpg, .png, .gif, .webp, .mp4, .webm, .html, .url

## Customization

Edit these files in `public/config/` (created by `npm run setup`):
- **`-pins`**: Pin posts at top (one path per line: `2025/01/02/post.html`)
- **`-best`**: Mark posts as featured
- **`-backdrop`**: Set background image/video URL, or CSS color/gradient
- **`-(tagname)`**: Add custom filter tags (create new files starting with `-`)
- **`-order`**: Order your tags (one tag name per line, tags not listed appear after)

## Deployment

**All commands run from your computer.**

### 1. Get a server
Rent from [DigitalOcean](https://digitalocean.com) or [Linode](https://linode.com) ($5-10/mo). You'll get an IP address.

### 2. Configure & Deploy
```bash
npm run deploy:configure  # Enter server IP (sets up SSH + installs everything)
npm run deploy            # Uploads your site
```

Your site is live at `http://YOUR.SERVER.IP:7650` (replace with your actual IP, but keep the `:7650`)

### 3. Add domain (optional)
If you entered a domain in step 2:
- Point domain's A record to your server IP
- Wait 5-10 minutes for DNS
- Run: `npm run deploy:nginx`

Now at `https://yourdomain.com`

## Daily Use

```bash
npm run deploy
```

That's it. Syncs everything to your server.

