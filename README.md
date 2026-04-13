
# Speedtest Analysis

A TypeScript web application for analysing and visualising speedtest data with public IP detection, interactive charts, and detailed reporting.

## ❓ Why this project exists

I built this tool to collect and visualise my ISP speedtest results over extended periods (e.g. 24 hours) so I could investigate intermittent issues. I open-sourced it because I believe in free, transparent tools for personal network diagnostics — use it, modify it, and share improvements.

This repository contains both the data-collection scripts (for automated speedtests) and a client-side web application to load and explore the resulting JSON files. Visit the [live app](https://www.johnsy.com/speedtest-analysis/) to get started.

## 🌐 Live Demo

**[🚀 Try the Web Application](https://www.johnsy.com/speedtest-analysis/)** - Load your speedtest JSON files and explore interactive charts!

## 🚀 Features

- **📊 Interactive Charts** - Chronological time-based x-axis with Chart.js
- **🖱️ Clickable Data Points** - Click any point to open speedtest result
- **📁 File Upload Interface** - Drag & drop or select JSON files
- **🌍 Local Timezone** - All timestamps displayed in browser's local time
- **🔍 Public IP Detection** - Visual indicators for network configuration
- **📋 Detailed Tables** - Complete test-by-test breakdown with sortable columns
- **💾 CSV Export** - Download processed data for external analysis
- **📱 Responsive Design** - Works on all devices and screen sizes
- **🎨 johnsy.com styling** - Matches main site palette, header, footer and breadcrumbs; light and dark mode
- **⚡ Real-time Processing** - Instant analysis of uploaded data

## 📁 Project Structure

```
speedtest-analysis/
├── web/                      # Web application
│   ├── src/
│   │   ├── main.ts          # Application entry point
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── dataProcessor.ts # Data processing logic
│   │   ├── chartManager.ts  # Chart.js integration
│   │   └── uiManager.ts     # DOM manipulation
│   ├── index.html           # Main HTML template
│   └── README.md            # Web app documentation
├── .github/
│   ├── dependabot.yml        # Grouped npm and GitHub Actions version updates
│   └── workflows/
│       ├── deploy.yml        # Build check and GitHub Pages deployment
│       └── dependabot-auto-merge.yml  # Merges Dependabot PRs after CI passes
├── speedtest.sh             # Data collection script
├── com.speedtest.plist      # macOS launchd configuration
├── install_speedtest_deps.sh # Dependencies installer
├── package.json             # Node.js project configuration
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript compiler configuration
└── README.md                # This file
```

## 🛠️ Quick Start

### Local Development
```bash
# Setup development environment (installs Node.js, pnpm, and dependencies)
pnpm run setup

# Start development server
pnpm run web:dev
# Opens http://localhost:3000

# Build for production
pnpm run web:build
```

### Deploy to GitHub Pages
```bash
# 1. Fork this repository
# 2. Enable GitHub Pages in repository settings:
#    - Go to Settings > Pages
#    - Source: "GitHub Actions"
# 3. Push to main branch - automatic deployment!

# Your app will be available at:
# https://your-username.github.io/speedtest-analysis/
```

**Usage**: Open the web app, click "Choose Files", select your speedtest JSON files, and click "Load Data".

### Development Environment

This project uses `mise` for development environment management and `pnpm` for package management:

- **mise**: Manages Node.js and pnpm versions automatically
- **pnpm**: Fast, disk space efficient package manager
- **Vite 8 / Rolldown on CI**: `package.json` sets `pnpm.supportedArchitectures` (Linux and macOS, x64 and arm64, glibc) so optional `@rolldown/binding-*` packages are installed and locked for GitHub’s Ubuntu runners as well as local development. Without this, a lockfile produced only on macOS can omit Linux bindings and `vite build` fails in CI.
- **Automatic setup**: Run `pnpm run setup` to install everything

#### Prerequisites
- [mise](https://mise.jdx.dev/) installed globally
- Or manually install Node.js 18+ and pnpm 8+

### Set Up Automated Data Collection

```bash
# Copy launchd configuration
cp com.speedtest.plist ~/Library/LaunchAgents/

# Load the service
launchctl load ~/Library/LaunchAgents/com.speedtest.plist
```

### How to generate speedtest data (step-by-step)

1. Install dependencies (macOS/Homebrew):

```bash
brew install speedtest-cli jc jq
```

2. Or run the included installer:

```bash
./install_speedtest_deps.sh
```

3. Run a one-off speedtest and save a JSON file:

```bash
./speedtest.sh
# Creates: ~/SpeedtestResults/speedtest_YYYYMMDD_HHMMSS.json
```

4. To enable automated, periodic tests (hourly by default using the provided LaunchAgent):

```bash
cp com.speedtest.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.speedtest.plist
```

Notes:
- Results are saved to `~/SpeedtestResults/`.
- The `speedtest.sh` script captures local interface info using `jc --ifconfig` and attaches it to each JSON result under the `x-ifconfig` key.
- Old files are rotated; the script keeps approximately the last 72 hours of data.

## 📊 What You Get

### Summary Statistics
- Average, min, max speeds and ping
- ISP and server information
- Time range with local timezone

### Interactive Chart
- Download, upload, and ping over time
- Colour-coded points (red = public IP, blue = private IP)
- Clickable data points opening speedtest URLs
- Hover tooltips with metadata

### Detailed Table
- Complete test-by-test breakdown
- Local timestamps for each test
- IP type indicators (PUBLIC/Private)
- Clickable "View Result" links
- Network interface information

### CSV Export
- Complete dataset with UTC and local timestamps
- One-click download functionality
- All metadata included

## 🎨 Visual Features

- Professional styling with gradients
- Responsive design for all screen sizes
- Colour-coded IP detection for easy identification
- Interactive elements with hover effects
- Clean typography and spacing

## 📈 Data Structure

Speedtest results are saved as JSON files in `~/SpeedtestResults/`:

```json
{
  "timestamp": "2025-09-12T04:11:17.302664+00:00Z",
  "download": 235094892.4549563,
  "upload": 20065685.585938457,
  "ping": 10.739,
  "server": {
    "name": "Melbourne",
    "country": "Australia",
    "sponsor": "Encoo",
    "d": 12.047217425890194
  },
  "client": {
    "isp": "Superloop",
    "country": "AU",
    "ip": "116.255.18.156"
  },
  "share": "http://www.speedtest.net/result/18214317402.png",
  "x-ifconfig": {
    "name": "en0",
    "ipv4_addr": "192.168.0.68",
    "mac_addr": "f8:73:df:1b:aa:92",
    "mtu": 1500,
    "state": ["UP", "BROADCAST", "SMART", "RUNNING", "SIMPLEX", "MULTICAST"]
  }
}
```


## 🚀 Deployment Options

### GitHub Pages
- Free hosting with automatic deployments
- Custom domain support
- HTTPS enabled by default
- Automatic builds on every push

#### Setup Instructions:
1. Fork this repository to your GitHub account
2. Enable GitHub Pages:
   - Go to Settings > Pages
   - Source: "GitHub Actions"
3. Push to main branch - automatic deployment starts!
4. Access your app at: `https://your-username.github.io/speedtest-analysis/`

#### GitHub Actions workflows
The repository includes:
- **`.github/workflows/deploy.yml`** — builds the web application, uploads the Pages artifact, and deploys when the branch is `main`. It runs on pushes to `main` and on pull requests targeting `main`, so every proposed change goes through the same build before merge.
- **`.github/workflows/dependabot-auto-merge.yml`** — after that workflow succeeds on a Dependabot pull request, merges the pull request with a squash merge so dependency updates land without manual clicking. The pull request author must be `dependabot[bot]` and the head branch must start with `dependabot/`. Your repository must allow **squash merges** (Settings → General → Pull requests); if you only allow merge commits, change the final `gh pr merge` line in that workflow to use `--merge` instead of `--squash`. If **branch protection** requires approving reviews, either allow the GitHub Actions bot to bypass where appropriate or use a personal access token with `contents` and `pull-requests` scope stored as a repository secret and pass it to `GH_TOKEN` for that step.

Dependabot updates are **batched** via groups in `.github/dependabot.yml`: one grouped pull request for npm dependencies and one for GitHub Actions, on the existing weekly schedule, which keeps the pull request queue small.

### Other Hosting Options
- Netlify: Drag & drop the `dist-web` folder
- Vercel: Connect your GitHub repository
- Firebase Hosting: Upload the `dist-web` folder
- Local sharing: Zip the `dist-web` folder and share

## 🚀 Automation

The system is designed for continuous monitoring:

1. Hourly execution - Launchd runs speedtests every hour
2. Automatic cleanup - Keeps only last 72 hours of data
3. Error handling - Graceful handling of network issues
4. Metadata capture - Network interface information included

## 📱 Browser Compatibility

- Modern browsers - Chrome, Firefox, Safari, Edge
- Mobile responsive - Works on phones and tablets
- Offline capable - HTML file works without internet (except for Chart.js CDN)

## 🛡️ Error Handling

- Chart.js fallback - Multiple CDN sources
- Loading indicators - User feedback during initialization
- Graceful degradation - Data still accessible if chart fails
- Network resilience - Handles connection issues

## 📄 License

MIT License - Free to use and modify.

## 🤝 Contributing

Contributions welcome for:
- Additional chart types
- Export formats
- UI improvements
- Performance optimisations

---

**Speedtest Analysis** - Network performance monitoring made simple! 🚀📊

## 🔎 SEO and Sharing

- A placeholder screenshot is available at `web/public/screenshot.svg` and is referenced in the web UI for social sharing and previews.
- A `sitemap.xml` is provided at `web/sitemap.xml` to aid discovery by crawlers; update the URLs if you host on a different domain.
