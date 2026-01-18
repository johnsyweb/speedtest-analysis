# Speedtest Analysis Web Application

A modern TypeScript web application for analysing speedtest results with interactive charts and detailed reporting.

## ❓ Why this exists

This web UI was created to quickly inspect and visualise speedtest JSON files produced by the companion data-collection scripts. It is intentionally client-side so you can run the UI locally and keep your raw data private.

## Features

- **Runtime JSON Loading**: Load speedtest JSON files directly in the browser
- **Interactive Charts**: Chart.js-powered visualisations with hover tooltips and clickable data points
- **Summary Statistics**: Comprehensive statistics including public/private IP detection
- **Detailed Tables**: Sortable tables with all test data
- **CSV Export**: Download processed data as CSV files
- **Modern UI**: Clean, responsive interface with professional styling
- **Correct Units**: Automatic conversion from bits/sec (speedtest-cli) to Mbps for display

## Architecture

### Clean Separation of Concerns
- **HTML**: Clean template without embedded JavaScript
- **TypeScript**: Fully typed application logic
- **Modular Design**: Separate classes for data processing, chart management, and UI management

### Key Components

1. **DataProcessor**: Handles JSON parsing, timestamp fixing, speed unit conversion (bits/sec → Mbps), and data validation
2. **ChartManager**: Manages Chart.js initialization and updates
3. **UIManager**: Handles all DOM manipulation and UI updates
4. **SpeedtestApp**: Main application class coordinating all components

### Data Processing

- **Speed Conversion**: Converts speedtest-cli output from bits per second to Mbps (÷ 1,000,000)
- **Interface Data**: Correctly maps `jc --ifconfig` output fields:
  - `ipv4_addr` → interface IP address
  - `mac_addr` → interface MAC address
  - `name` → interface name (e.g., "en0")
  - `mtu` → interface MTU
  - `status` → interface status

## Development

### Prerequisites
- [mise](https://mise.jdx.dev/) installed globally
- Or manually install Node.js 18+ and pnpm 8+

### Setup
```bash
# Setup development environment (installs Node.js, pnpm, and dependencies)
pnpm run setup
```

### Development Server
```bash
pnpm run web:dev
```
Opens development server at http://localhost:3000

### Build for Production
```bash
pnpm run web:build
```

### Preview Production Build
```bash
pnpm run web:preview
```

## Usage

1. Open the web application in your browser
2. Click "Choose Files" and select your speedtest JSON files
3. Click "Load Data" to process and visualise the results
4. Hover over chart points to see detailed information
5. Click on any chart point to open the speedtest result in a new tab
6. Explore the detailed table for comprehensive data viewing
7. Download CSV data for external analysis

### Generating speedtest JSON files

This UI expects JSON files like those created by `speedtest.sh` in the repository root. To generate data:

```bash
# Install dependencies (macOS)
brew install speedtest-cli jc jq

# Run a single measurement
./speedtest.sh

# Enable automated testing (launchd)
cp ../com.speedtest.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.speedtest.plist
```

Saved files are written to `~/SpeedtestResults/` and can be loaded into the web UI via the file picker.

## Benefits Over Previous Approach

### ✅ **Maintainability**
- Clean separation of HTML, CSS, and TypeScript
- Modular architecture with single responsibility classes
- No embedded JavaScript in HTML templates

### ✅ **Type Safety**
- Full TypeScript support with proper interfaces
- Compile-time error checking
- Better IDE support and IntelliSense

### ✅ **Performance**
- Runtime loading eliminates need for server-side processing
- Client-side processing reduces server load
- Modern build system with optimisation

### ✅ **User Experience**
- File picker interface for easy data loading
- Real-time processing feedback
- Responsive design works on all devices

### ✅ **Development Experience**
- Hot reload during development
- Proper error handling and user feedback
- Easy to extend and modify

## File Structure

```
web/
├── index.html          # Clean HTML template
├── src/
│   ├── main.ts         # Main application entry point
│   ├── types.ts        # TypeScript interfaces
│   ├── dataProcessor.ts # Data processing logic
│   ├── chartManager.ts  # Chart.js management
│   └── uiManager.ts    # UI manipulation
└── README.md          # This file
```
