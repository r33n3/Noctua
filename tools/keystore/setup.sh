#!/bin/bash
# AgentForge Keystore — Quick Setup
# Run this once during Week 1 lab setup

set -e

echo "═══════════════════════════════════════════════════"
echo " AgentForge Keystore Setup"
echo " Encrypted local secret management"
echo "═══════════════════════════════════════════════════"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 required. Install it first."
    exit 1
fi
echo "✓ Python 3 found: $(python3 --version)"

# Install cryptography package
echo ""
echo "Installing cryptography package..."
pip install cryptography --break-system-packages -q 2>/dev/null || \
pip install cryptography -q 2>/dev/null || \
pip3 install cryptography --break-system-packages -q 2>/dev/null || \
pip3 install cryptography -q
echo "✓ cryptography package installed"

# Get the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Install noctua-keys to PATH
echo ""
echo "Installing noctua-keys command..."
chmod +x "$SCRIPT_DIR/noctua-keys"

# Try to symlink to a PATH location
if [ -d "$HOME/.local/bin" ]; then
    ln -sf "$SCRIPT_DIR/noctua-keys" "$HOME/.local/bin/noctua-keys"
    echo "✓ Installed to ~/.local/bin/noctua-keys"
elif [ -d "$HOME/bin" ]; then
    ln -sf "$SCRIPT_DIR/noctua-keys" "$HOME/bin/noctua-keys"
    echo "✓ Installed to ~/bin/noctua-keys"
else
    mkdir -p "$HOME/.local/bin"
    ln -sf "$SCRIPT_DIR/noctua-keys" "$HOME/.local/bin/noctua-keys"
    echo "✓ Created ~/.local/bin and installed"
    echo ""
    echo "  Add to PATH if not already there:"
    echo '  export PATH="$HOME/.local/bin:$PATH"'
fi

# Install git-secrets for pre-commit scanning
echo ""
echo "Installing git-secrets for leak prevention..."
if command -v brew &> /dev/null; then
    brew install git-secrets 2>/dev/null || echo "  git-secrets may already be installed"
elif command -v apt &> /dev/null; then
    sudo apt install -y git-secrets 2>/dev/null || echo "  Install manually: https://github.com/awslabs/git-secrets"
else
    echo "  Install git-secrets manually: https://github.com/awslabs/git-secrets"
fi

# Create .gitignore template
echo ""
echo "Creating .gitignore template with credential patterns..."
cat > "$SCRIPT_DIR/gitignore-credentials" << 'EOF'
# === CREDENTIAL PROTECTION ===
# Add these lines to your project .gitignore

# Environment files (NEVER commit)
.env
.env.local
.env.*.local
.env.production
.env.staging

# Vault files
*.enc
*.salt
vault.*

# Key files
*.pem
*.key
*.p12
*.pfx
*.jks

# Claude Code local settings that may contain paths
.claude/settings.local.json

# OS credential stores
.gnupg/
.ssh/id_*
.aws/credentials
.config/gcloud/

# Common secret patterns
*secret*
*credential*
*token*.json
EOF
echo "✓ Template created: $SCRIPT_DIR/gitignore-credentials"

echo ""
echo "═══════════════════════════════════════════════════"
echo " Setup complete! Next steps:"
echo "═══════════════════════════════════════════════════"
echo ""
echo " 1. Initialize your vault:"
echo "    noctua-keys init"
echo ""
echo " 2. Add your API keys:"
echo "    noctua-keys add ANTHROPIC_API_KEY"
echo "    noctua-keys add OPENAI_API_KEY"
echo ""
echo " 3. Load keys into your shell (add to ~/.bashrc or ~/.zshrc):"
echo '    eval $(noctua-keys export)'
echo ""
echo " 4. Set up git-secrets in your project:"
echo "    cd ~/agentforge"
echo "    git secrets --install"
echo '    git secrets --add "sk-ant-[a-zA-Z0-9]{20,}"'
echo '    git secrets --add "sk-[a-zA-Z0-9]{20,}"'
echo ""
echo " 5. Copy credential patterns to your .gitignore:"
echo "    cat $SCRIPT_DIR/gitignore-credentials >> ~/agentforge/.gitignore"
echo ""
