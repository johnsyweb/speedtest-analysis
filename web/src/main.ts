import { DataProcessor } from "./dataProcessor";
import { ChartManager } from "./chartManager";
import { UIManager } from "./uiManager";
import { SpeedtestData, ProcessedData } from "./types";

class SpeedtestApp {
  private dataProcessor: DataProcessor;
  private chartManager: ChartManager;
  private uiManager: UIManager;
  private currentData: ProcessedData[] = [];

  constructor() {
    this.dataProcessor = new DataProcessor();
    this.chartManager = new ChartManager();
    this.uiManager = new UIManager();
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const loadDataBtn = document.getElementById(
      "loadDataBtn",
    ) as HTMLButtonElement;
    const downloadCsvBtn = document.getElementById(
      "downloadCsvBtn",
    ) as HTMLButtonElement;

    loadDataBtn.addEventListener("click", () => this.handleFileLoad());
    downloadCsvBtn.addEventListener("click", () => this.handleCSVDownload());
  }

  /**
   /**
    * Handle file loading
    */
  private async handleFileLoad(): Promise<void> {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const files = fileInput.files;

    if (!files || files.length === 0) {
      this.uiManager.showError("Please select one or more JSON files to load.");
      return;
    }

    this.uiManager.showLoading();

    try {
      const allData: SpeedtestData[] = [];

      // Read all selected files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await this.readFileAsText(file);

        try {
          const jsonData = JSON.parse(text);

          // Handle both single objects and arrays
          if (Array.isArray(jsonData)) {
            allData.push(...jsonData);
          } else {
            allData.push(jsonData);
          }
        } catch (parseError) {
          console.warn(
            `Warning: Could not parse JSON from file ${file.name}:`,
            parseError,
          );
          continue;
        }
      }

      if (allData.length === 0) {
        this.uiManager.showError(
          "No valid speedtest data found in the selected files.",
        );
        return;
      }

      // Process the data
      this.currentData = this.dataProcessor.processSpeedtestData(allData);

      if (this.currentData.length === 0) {
        this.uiManager.showError(
          "No valid speedtest data could be processed from the selected files.",
        );
        return;
      }

      // Update UI
      this.updateUI();
    } catch (error) {
      console.error("Error loading data:", error);
      this.uiManager.showError(
        `Error loading data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Read file as text
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) =>
        reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsText(file);
    });
  }

  /**
   * Update the UI with current data
   */
  private updateUI(): void {
    // Calculate summary statistics
    const stats = this.dataProcessor.calculateSummaryStats(this.currentData);

    // Update UI components
    this.uiManager.updateSummaryStats(stats);
    this.uiManager.updateDetailedTable(this.currentData);
    this.uiManager.updateCSVData(this.currentData);

    // Initialize chart
    this.chartManager.destroy(); // Destroy existing chart if any
    this.chartManager.initializeChart(this.currentData);

    // Show content
    this.uiManager.showContent();
  }

  /**
   * Handle CSV download
   */
  private handleCSVDownload(): void {
    const csvData = document.getElementById("csvData")?.textContent;
    if (!csvData) {
      alert("No data available to download.");
      return;
    }

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "speedtest_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  new SpeedtestApp();
});
