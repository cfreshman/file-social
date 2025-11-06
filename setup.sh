#!/bin/bash
set -e

# Colors for output
GRAY='\033[0;90m'
WHITE='\033[0;37m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${DIM}"
echo "╔════════════════════════════════════════╗"
echo "║       file-social Setup Script         ║"
echo "║     Setting up your personal feed      ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${DIM}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "✗ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "✓ Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo -e "✗ npm is not installed"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi
echo -e "✓ npm found: $(npm --version)"

if ! command -v git &> /dev/null; then
    echo -e "✗ git is not installed"
    echo "Please install git from https://git-scm.com/"
    exit 1
fi
echo -e "✓ git found: $(git --version)"

echo ""

# Install dependencies
echo -e "${DIM}Installing dependencies...${NC}"
npm install
echo -e "✓ Dependencies installed"
echo ""

# Create directory structure
echo -e "${DIM}Creating directory structure...${NC}"

# Create posts directories
mkdir -p posts/2025/11/02
echo -e "✓ Created posts/ directory structure"

# Create public/config directory
mkdir -p public/config
echo -e "✓ Created public/config/ directory"

# Create public/data directory
mkdir -p public/data
echo -e "✓ Created public/data/ directory"

# Create _01 directory for server-side persistence
mkdir -p _01
echo -e "✓ Created _01/ directory"

echo ""

# Create default config files if they don't exist
echo -e "${DIM}Setting up config files...${NC}"

# -backdrop
if [ ! -f public/config/-backdrop ]; then
    cat > public/config/-backdrop << 'EOF'
// Background for your timeline
// Can be a URL to an image/video, a CSS color, or a CSS gradient
// Examples:
// https://example.com/backdrop.jpg
// #1DA1F2
// linear-gradient(135deg, #667eea 0%, #764ba2 100%)

EOF
    echo -e "✓ Created public/config/-backdrop"
else
    echo -e "• public/config/-backdrop already exists"
fi

# -pins
if [ ! -f public/config/-pins ]; then
    cat > public/config/-pins << 'EOF'
// Pinned posts (one per line)
// These appear at the top of your timeline
// Format: path/to/post.html

EOF
    echo -e "✓ Created public/config/-pins"
else
    echo -e "• public/config/-pins already exists"
fi

# -best
if [ ! -f public/config/-best ]; then
    cat > public/config/-best << 'EOF'
// Best posts (one per line)
// Mark your favorite posts
// Format: path/to/post.html

EOF
    echo -e "✓ Created public/config/-best"
else
    echo -e "• public/config/-best already exists"
fi

# -order
if [ ! -f public/config/-order ]; then
    cat > public/config/-order << 'EOF'
// Order of tags (one per line)
// Tags not listed will appear after these in alphabetical order
best

EOF
    echo -e "✓ Created public/config/-order"
else
    echo -e "• public/config/-order already exists"
fi

echo ""

# Update .gitignore for user's own repository
echo -e "${DIM}Updating .gitignore for public sharing...${NC}"
if [ -f .gitignore.user ]; then
    cp .gitignore.user .gitignore
    echo -e "✓ Updated .gitignore (your posts will now be tracked by git)"
else
    echo -e "⚠ Warning: .gitignore.user not found, keeping existing .gitignore"
fi
echo ""

# Create .gitkeep files
touch posts/.gitkeep
touch public/config/.gitkeep
echo -e "✓ Created .gitkeep files"
echo ""

# Initialize git if needed
if [ ! -d .git ]; then
    echo -e "${DIM}Initializing git repository...${NC}"
    git init
    echo -e "✓ Git repository initialized"
    echo ""
fi

# Success message
echo ""
echo "Setup complete"
echo ""

echo "Next steps:"
echo ""
echo "1. Start the server locally:"
echo "   npm start"
echo ""
echo "2. Open in your browser:"
echo "   http://localhost:7650"
echo ""
echo "3. Add your first post:"
echo "   npm run new"
echo "   Then edit the created file in posts/"
echo ""
echo "4. Customize your timeline:"
echo "   • Edit public/config/-backdrop to set a background"
echo "   • Edit public/config/-pins to pin posts to the top"
echo "   • Edit public/config/-best to mark your favorites"
echo ""
echo "5. When ready to deploy:"
echo "   See the Deployment section in README.md"
echo ""
echo "Documentation: Check out README.md for more info"
echo "Example post: Look at posts/2025/11/01/0.html"
echo ""

