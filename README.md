# file-social

Self-hosted visual timeline platform. Share any file type in a beautiful feed.

**Recommended editor:** Download [Cursor](https://cursor.sh) to edit your files.

## Requirements

- [Node.js](https://nodejs.org/) (download and install if you don't have it)
- A terminal app (Mac/Linux: built-in Terminal, Windows: download [Git Bash](https://gitforwindows.org/))

## Getting Started

Open your terminal in this folder and run:

```bash
npm run setup
```

This will:
- Check your system has everything needed
- Install dependencies
- Create the directory structure
- Set up config files
- Prepare git to track your posts

Then start the server:

```bash
npm start
```

Open http://localhost:7650 in your browser. You should see your timeline!

**To put this online, see the [Deployment](#deployment) section below.**

---

## Usage

### Adding Posts

**The easy way:**
```bash
npm run new
```
This creates a new post file for you with the correct structure. It'll tell you where the file is, and you can click it in Cursor to open and edit it.

**Or manually:** Drop any file into the `posts/` folder. Newest files appear at the top.

**Supported file types:**
- Text files (.txt)
- Images (.jpg, .png, .gif, .webp)
- Videos (.mp4, .webm)  
- HTML files (for custom content)
- URL files (.url) - put a URL in the file and it loads the content

**For HTML posts**, copy this template:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8><script src="/lib.js"></script><meta data-hydrate data-style />
  <title>Your Title</title>
</head>
<body>
  <div data-hydrate data-title></div>
  <!-- your content here -->
</body>
</html>
```

Or just run `npm run new` and edit the file it creates.

### Keyboard Shortcuts

- **↓ or j**: Next post
- **↑ or k**: Previous post  
- **Home**: First post
- **End**: Last post

### Special Files

Create these files in `public/config/` to customize your timeline:

- **`-pins`**: List post paths (one per line) to pin at the top
- **`-best`**: Mark posts as featured/best content
- **`-backdrop`**: Set a background image or video (first line of file)

Example `public/config/-pins`:
```
2025/01/02/important.html
2024/12/25/favorite.html
```

## Configuration

Open `config.js` in Cursor to change:
- Port number (default: 7650)
- App name
- Where posts are stored

## Deployment

**Put your timeline online.** All commands run from your computer - no need to log into the server.

### First Time Setup

**1. Get a server**

Rent a server from [DigitalOcean](https://digitalocean.com), [Linode](https://linode.com), or similar ($5-10/month).
They'll give you an IP address like `123.45.67.89` - save it.

**2. Give your computer access to the server**

This lets your computer talk to the server automatically.

**Mac/Linux:**
```bash
ssh-copy-id root@123.45.67.89
```

**Windows (in Git Bash):**
```bash
cat ~/.ssh/id_rsa.pub | ssh root@123.45.67.89 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Type your server password when it asks.

**3. Configure**
```bash
npm run deploy:configure
```

Enter your server IP. If you have a domain (like `yourdomain.com`), enter it. Otherwise leave it blank.

**4. Set up the server**
```bash
npm run deploy:setup
```

This installs everything needed on your server (takes a few minutes).

**5. Deploy**
```bash
npm run deploy
```

Done! Your timeline is live at `http://123.45.67.89:7650`

**6. (Optional) Use a domain name**

If you entered a domain in step 3:
- Go to your domain settings (Cloudflare, Namecheap, etc.)
- Add an A record pointing to your server IP
- Wait 5-10 minutes
- Run: `npm run deploy:nginx`

Now your site is at `https://yourdomain.com`

---

## 🚀 Daily Usage

After setup, this is the only command you need to remember:

```bash
npm run deploy
```

This syncs all your posts and changes to your server.

