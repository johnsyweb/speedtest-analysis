import { ProcessedData } from "./types";

declare const Chart: any;

export class ChartManager {
  private chart: any = null;

  /**
   * Initialize the chart
   */
  initializeChart(data: ProcessedData[]): void {
    const ctx = (
      document.getElementById("speedChart") as HTMLCanvasElement
    ).getContext("2d");
    if (!ctx) {
      throw new Error("Could not get chart context");
    }

    // Prepare data for Chart.js with time-based x-axis
    const downloads = data.map((d) => ({ x: d.timestamp, y: d.download }));
    const uploads = data.map((d) => ({ x: d.timestamp, y: d.upload }));
    const pings = data.map((d) => ({ x: d.timestamp, y: d.ping }));

    const hoverData = data.map((d) => ({
      timestamp: d.timestamp.toLocaleString("en-AU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      }),
      download: d.download.toFixed(1),
      upload: d.upload.toFixed(1),
      ping: d.ping.toFixed(1),
      server_name: d.server.name,
      server_country: d.server.country,
      server_sponsor: d.server.sponsor,
      server_distance: d.server.d.toFixed(1),
      client_isp: d.client.isp,
      client_country: d.client.country,
      client_ip: d.client.ip,
      share_url: d.share,
      interface_name: d.interface.hasData ? d.interface.name : "N/A",
      interface_ip: d.interface.hasData ? d.interface.ip : "N/A",
      interface_mtu: d.interface.hasData ? d.interface.mtu.toString() : "N/A",
      interface_status: d.interface.hasData ? d.interface.status : "N/A",
      ip_type: d.interface.ipType,
    }));

    // Define colors for different IP types
    const getPointColor = (ipType: string) => {
      switch (ipType) {
        case "public":
          return "rgba(75, 192, 192, 0.8)"; // Teal
        case "private":
          return "rgba(255, 159, 64, 0.8)"; // Orange
        case "n/a":
          return "rgba(201, 203, 207, 0.8)"; // Grey
        default:
          return "rgba(201, 203, 207, 0.8)"; // Default grey
      }
    };

    const getBorderColor = (ipType: string) => {
      switch (ipType) {
        case "public":
          return "rgb(75, 192, 192)"; // Teal
        case "private":
          return "rgb(255, 159, 64)"; // Orange
        case "n/a":
          return "rgb(201, 203, 207)"; // Grey
        default:
          return "rgb(201, 203, 207)"; // Default grey
      }
    };

    const chartData = {
      datasets: [
        {
          label: "Download (Mbps)",
          data: downloads,
          backgroundColor: data.map((d) => getPointColor(d.interface.ipType)),
          borderColor: "rgb(75, 192, 192)", // Teal line for download
          yAxisID: "y",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Upload (Mbps)",
          data: uploads,
          backgroundColor: data.map((d) => getPointColor(d.interface.ipType)),
          borderColor: "rgb(255, 99, 132)", // Red line for upload
          yAxisID: "y",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Ping (ms)",
          data: pings,
          backgroundColor: data.map((d) => getPointColor(d.interface.ipType)),
          borderColor: "rgb(54, 162, 235)", // Blue line for ping
          yAxisID: "y1",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };

    this.chart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              generateLabels: function (chart: any) {
                const original =
                  Chart.defaults.plugins.legend.labels.generateLabels;
                const originalLabels = original.call(this, chart);

                // Add IP type legend items
                const ipTypeLabels = [
                  {
                    text: "Public IP",
                    fillStyle: "rgb(75, 192, 192)",
                    strokeStyle: "rgb(75, 192, 192)",
                    lineWidth: 2,
                    pointStyle: "circle",
                    hidden: false,
                    datasetIndex: -1,
                  },
                  {
                    text: "Private IP",
                    fillStyle: "rgb(255, 159, 64)",
                    strokeStyle: "rgb(255, 159, 64)",
                    lineWidth: 2,
                    pointStyle: "circle",
                    hidden: false,
                    datasetIndex: -1,
                  },
                  {
                    text: "N/A IP",
                    fillStyle: "rgb(201, 203, 207)",
                    strokeStyle: "rgb(201, 203, 207)",
                    lineWidth: 2,
                    pointStyle: "circle",
                    hidden: false,
                    datasetIndex: -1,
                  },
                ];

                return [...originalLabels, ...ipTypeLabels];
              },
            },
          },
          tooltip: {
            callbacks: {
              title: function (context: any) {
                const index = context[0].dataIndex;
                const hd = hoverData[index];
                return hd.timestamp;
              },
              afterBody: function (context: any) {
                const index = context[0].dataIndex;
                const hd = hoverData[index];
                const tooltipLines = [
                  `Download: ${hd.download} Mbps`,
                  `Upload: ${hd.upload} Mbps`,
                  `Ping: ${hd.ping} ms`,
                  "",
                  `Server: ${hd.server_name}, ${hd.server_country}`,
                  `Sponsor: ${hd.server_sponsor}`,
                  `Distance: ${hd.server_distance} km`,
                  "",
                  `ISP: ${hd.client_isp} (${hd.client_country})`,
                ];

                if (hd.interface_name !== "N/A") {
                  const ipTypeDisplay = hd.ip_type.toUpperCase();
                  tooltipLines.push(
                    `Interface: ${hd.interface_name} (${hd.interface_ip})`,
                    `MTU: ${hd.interface_mtu}`,
                    `Status: ${hd.interface_status}`,
                    `IP Type: ${ipTypeDisplay}`,
                  );
                }

                if (hd.share_url && hd.share_url !== "N/A") {
                  tooltipLines.push(
                    "",
                    `Share URL: ${hd.share_url}`,
                    "Click point to open result",
                  );
                }

                return tooltipLines;
              },
            },
          },
        },
        onClick: function (event: any, elements: any) {
          if (elements.length > 0) {
            const element = elements[0];
            const index = element.index;
            const hd = hoverData[index];

            if (hd.share_url && hd.share_url !== "N/A") {
              window.open(hd.share_url, "_blank");
            }
          }
        },
        scales: {
          x: {
            type: "time" as const,
            display: true,
            title: {
              display: true,
              text: "Time",
            },
            time: {
              displayFormats: {
                hour: "MMM dd HH:mm",
                day: "MMM dd",
                week: "MMM dd",
                month: "MMM yyyy",
              },
            },
          } as any,
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Speed (Mbps)",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Ping (ms)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        } as any,
      } as any,
    });
  }

  /**
   * Destroy the chart
   */
  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
