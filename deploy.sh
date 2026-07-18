#!/bin/bash

# EnergyX 369 - Automated Deploy Script
# Deploys to Cloudflare Pages, then commits and pushes to GitHub

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 EnergyX 369 - Automated Deploy${NC}"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please create a .env file with the following variables:"
    echo "  CLOUDFLARE_API_TOKEN=your_token_here"
    echo "  GITHUB_TOKEN=your_token_here"
    echo ""
    echo "Example: cp .env.example .env"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

# Step 1: Deploy to Cloudflare Pages
echo -e "${YELLOW}🌐 Step 1: Deploying to Cloudflare Pages...${NC}"

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${RED}❌ Error: CLOUDFLARE_API_TOKEN not set in .env${NC}"
    exit 1
fi

npx wrangler pages deploy --project-name=energyx --force 2>&1 | tee /tmp/wrangler-deploy.log

# Check if deployment was successful
if grep -q "Deployment complete" /tmp/wrangler-deploy.log; then
    echo -e "${GREEN}✅ Cloudflare deployment successful${NC}"
else
    echo -e "${RED}❌ Cloudflare deployment failed${NC}"
    exit 1
fi

# Get deployment URL
DEPLOY_URL=$(grep "🌎 Deploying" /tmp/wrangler-deploy.log | sed 's/.*Take a peek over at //')
echo -e "${GREEN}🔗 Live URL: ${DEPLOY_URL}${NC}"
echo ""

# Step 2: Commit and Push
echo -e "${YELLOW}📤 Step 2: Committing and pushing to GitHub...${NC}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ Error: GITHUB_TOKEN not set in .env${NC}"
    exit 1
fi

# Stage all changes
git add -A

# Check if there are any changes
if git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
else
    # Create commit message with timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    COMMIT_MSG="Deploy v$(date +%s) - Auto-deploy $(date +"%H:%M:%S")

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"

    git commit -m "$COMMIT_MSG"

    # Push to GitHub
    git remote set-url origin "https://$GITHUB_TOKEN@github.com/RikiEnergyX/energyx-web.git"
    git push origin main

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully committed and pushed${NC}"
    else
        echo -e "${RED}❌ Failed to push to GitHub${NC}"
        exit 1
    fi
fi

# Clean up
rm -f /tmp/wrangler-deploy.log

# Summary
echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✅ Deploy Complete!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "🌐 Live Site: ${DEPLOY_URL}"
echo -e "📦 GitHub: https://github.com/RikiEnergyX/energyx-web"
echo ""
echo -e "${YELLOW}Note: The warning about uncommitted changes will disappear after the next deploy.${NC}"
