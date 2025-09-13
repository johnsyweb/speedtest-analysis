import { ProcessedData } from './types';

declare const Chart: any;

export class ChartManager {
  private chart: any = null;

  /**
   * Initialize the chart
   */
  initializeChart(data: ProcessedData[]): void {
    const ctx = (document.getElementById('speedChart') as HTMLCanvasElement).getContext('2d');
    if (!ctx) {
      throw new Error('Could not get chart context');
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
      is_public_ip: d.interface.hasData ? this.isPublicIP(d.interface.ip) : false,
    }));

    // Use consistent colors for time-based chart
    const downloadColor = 'rgba(75, 192, 192, 0.8)';
    const downloadBorderColor = 'rgb(75, 192, 192)';
    
    const uploadColor = 'rgba(255, 99, 132, 0.8)';
    const uploadBorderColor = 'rgb(255, 99, 132)';
    
    const pingColor = 'rgba(54, 162, 235, 0.8)';
    const pingBorderColor = 'rgb(54, 162, 235)';

    const chartData = {
      datasets: [
        {
          label: 'Download (Mbps)',
          data: downloads,
          borderColor: downloadBorderColor,
          backgroundColor: downloadColor,
          yAxisID: 'y',
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Upload (Mbps)',
          data: uploads,
          borderColor: uploadBorderColor,
          backgroundColor: uploadColor,
          yAxisID: 'y',
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Ping (ms)',
          data: pings,
          borderColor: pingBorderColor,
          backgroundColor: pingColor,
          yAxisID: 'y1',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(context: any) {
                const index = context[0].dataIndex;
                const hd = hoverData[index];
                return hd.timestamp;
              },
              afterBody: function(context: any) {
                const index = context[0].dataIndex;
                const hd = hoverData[index];
                const tooltipLines = [
                  `Download: ${hd.download} Mbps`,
                  `Upload: ${hd.upload} Mbps`,
                  `Ping: ${hd.ping} ms`,
                  '',
                  `Server: ${hd.server_name}, ${hd.server_country}`,
                  `Sponsor: ${hd.server_sponsor}`,
                  `Distance: ${hd.server_distance} km`,
                  '',
                  `ISP: ${hd.client_isp} (${hd.client_country})`,
                ];

                if (hd.interface_name !== 'N/A') {
                  tooltipLines.push(
                    `Interface: ${hd.interface_name} (${hd.interface_ip})`,
                    `MTU: ${hd.interface_mtu}`,
                    `Status: ${hd.interface_status}`,
                    `IP Type: ${hd.is_public_ip ? 'PUBLIC' : 'Private'}`
                  );
                }

                if (hd.share_url && hd.share_url !== 'N/A') {
                  tooltipLines.push(
                    '',
                    `Share URL: ${hd.share_url}`,
                    'Click point to open result'
                  );
                }

                return tooltipLines;
              }
            }
          }
        },
        onClick: function(event: any, elements: any) {
          if (elements.length > 0) {
            const element = elements[0];
            const index = element.index;
            const hd = hoverData[index];
            
            if (hd.share_url && hd.share_url !== 'N/A') {
              window.open(hd.share_url, '_blank');
            }
          }
        },
        scales: {
          x: {
            type: 'time' as const,
            display: true,
            title: {
              display: true,
              text: 'Time'
            },
            time: {
              displayFormats: {
                hour: 'MMM dd HH:mm',
                day: 'MMM dd',
                week: 'MMM dd',
                month: 'MMM yyyy'
              }
            }
          } as any,
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Speed (Mbps)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Ping (ms)'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        } as any
      } as any
    });
  }

  /**
   * Check if IP address is public
   */
  private isPublicIP(ip: string): boolean {
    const privateRanges = [
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./, // 192.168.0.0/16
      /^127\./, // 127.0.0.0/8 (loopback)
      /^169\.254\./, // 169.254.0.0/16 (link-local)
      /^::1$/, // IPv6 loopback
      /^fe80:/, // IPv6 link-local
      /^fc00:/, // IPv6 unique local
      /^fd00:/, // IPv6 unique local
    ];

    return !privateRanges.some((range) => range.test(ip));
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
