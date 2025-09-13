#!/bin/bash
#
# Speedtest Dependencies Installation Script
#
# This script installs all required dependencies for the automated speedtest system.

set -e -u -o pipefail

echo "Installing speedtest dependencies..."

# Check if Homebrew is installed
if ! command -v brew >/dev/null 2>&1; then
    echo "Error: Homebrew not found. Please install Homebrew first:" >&2
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"" >&2
    exit 1
fi

# Install dependencies
echo "Installing speedtest-cli..."
brew install speedtest-cli

echo "Installing jc (JSON converter)..."
brew install jc

echo "Installing jq (JSON processor)..."
brew install jq

echo "Installing matplotlib (for visualization)..."
pip3 install matplotlib

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "You can now run:"
echo "  ./speedtest.sh          # Run a single speedtest"
echo "  python3 speedtest_viz.py --summary  # View summary statistics"
echo "  python3 speedtest_viz.py --output chart.png  # Generate visualization"
echo ""
echo "To set up automated hourly testing:"
echo "  launchctl load ~/Library/LaunchAgents/com.speedtest.plist"
