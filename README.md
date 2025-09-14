
# Speedtest Analysis

A TypeScript web application for analysing and visualising speedtest data with public IP detection, interactive charts, and detailed reporting.

## 🌐 Live Demo

**[🚀 Try the Web Application](https://johnsy.com/speedtest-analysis/)** - Load your speedtest JSON files and explore interactive charts!

## 🚀 Features

- **📊 Interactive Charts** - Chronological time-based x-axis with Chart.js
- **🖱️ Clickable Data Points** - Click any point to open speedtest result
- **📁 File Upload Interface** - Drag & drop or select JSON files
- **🌍 Local Timezone** - All timestamps displayed in browser's local time
- **🔍 Public IP Detection** - Visual indicators for network configuration
- **📋 Detailed Tables** - Complete test-by-test breakdown with sortable columns
- **💾 CSV Export** - Download processed data for external analysis
- **📱 Responsive Design** - Works on all devices and screen sizes
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
├── .github/workflows/        # GitHub Actions deployment
│   └── deploy.yml           # Automatic GitHub Pages deployment
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

#### GitHub Actions Workflow:
The repository includes `.github/workflows/deploy.yml` that automatically:
- Builds the web application
- Deploys to GitHub Pages
- Runs on every push to main branch

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
