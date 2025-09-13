import { SpeedtestData, ProcessedData, SummaryStats } from './types';

export class DataProcessor {
  /**
   * Parse timestamp string and return Date object
   */
  private parseTimestamp(timestampStr: string): Date {
    let timestamp: Date;

    // Handle malformed timestamps from speedtest.sh
    if (timestampStr.includes(".3NZ")) {
      const fixedTimestamp = timestampStr.replace(".3NZ", ".000+00:00");
      timestamp = new Date(fixedTimestamp);
    } else if (timestampStr.endsWith("+00:00Z")) {
      timestamp = new Date(timestampStr.slice(0, -1));
    } else if (timestampStr.endsWith("Z")) {
      timestamp = new Date(timestampStr.slice(0, -1) + "+00:00");
    } else if (timestampStr.includes("+")) {
      timestamp = new Date(timestampStr);
    } else {
      timestamp = new Date(timestampStr + "+00:00");
    }

    if (isNaN(timestamp.getTime())) {
      throw new Error(`Invalid timestamp: ${timestampStr}`);
    }

    return timestamp;
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
   * Process raw speedtest data
   */
  processSpeedtestData(rawData: SpeedtestData[]): ProcessedData[] {
    const processedData: ProcessedData[] = [];

    for (const speedtestData of rawData) {
      // Skip results with errors
      if ('error' in speedtestData) {
        continue;
      }

      try {
        const timestamp = this.parseTimestamp(speedtestData.timestamp);
        const hasInterfaceData = speedtestData['x-ifconfig'] !== undefined;

        const processed: ProcessedData = {
          timestamp,
          download: (speedtestData.download || 0) / 1000000, // Convert bits/sec to Mbps
          upload: (speedtestData.upload || 0) / 1000000, // Convert bits/sec to Mbps
          ping: speedtestData.ping || 0,
          server: {
            name: speedtestData.server.name || "N/A",
            country: speedtestData.server.country || "N/A",
            sponsor: speedtestData.server.sponsor || "N/A",
            d: speedtestData.server.d || 0,
          },
          client: {
            isp: speedtestData.client.isp || "N/A",
            country: speedtestData.client.country || "N/A",
            ip: speedtestData.client.ip || "N/A",
          },
          share: speedtestData.share || "",
          interface: {
            name: hasInterfaceData ? speedtestData['x-ifconfig']!.name : "N/A",
            ip: hasInterfaceData ? speedtestData['x-ifconfig']!.ipv4_addr : "N/A",
            mac: hasInterfaceData ? speedtestData['x-ifconfig']!.mac_addr : "N/A",
            mtu: hasInterfaceData ? speedtestData['x-ifconfig']!.mtu : 0,
            status: hasInterfaceData ? speedtestData['x-ifconfig']!.status : "N/A",
            hasData: hasInterfaceData,
          },
        };

        processedData.push(processed);
      } catch (error) {
        console.warn(`Warning: Could not parse timestamp in data: ${error}`);
        continue;
      }
    }

    return processedData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Calculate summary statistics
   */
  calculateSummaryStats(data: ProcessedData[]): SummaryStats {
    if (data.length === 0) {
      return {
        totalTests: 0,
        avgDownload: 0,
        avgUpload: 0,
        avgPing: 0,
        maxDownload: 0,
        maxUpload: 0,
        minPing: 0,
        publicIPTests: 0,
        privateIPTests: 0,
        dateRange: { start: new Date(), end: new Date() },
      };
    }

    const downloads = data.map((d) => d.download);
    const uploads = data.map((d) => d.upload);
    const pings = data.map((d) => d.ping);

    const publicIPTests = data.filter((d) => 
      d.interface.hasData && this.isPublicIP(d.interface.ip)
    ).length;

    return {
      totalTests: data.length,
      avgDownload: downloads.reduce((a, b) => a + b, 0) / downloads.length,
      avgUpload: uploads.reduce((a, b) => a + b, 0) / uploads.length,
      avgPing: pings.reduce((a, b) => a + b, 0) / pings.length,
      maxDownload: Math.max(...downloads),
      maxUpload: Math.max(...uploads),
      minPing: Math.min(...pings),
      publicIPTests,
      privateIPTests: data.length - publicIPTests,
      dateRange: {
        start: data[0].timestamp,
        end: data[data.length - 1].timestamp,
      },
    };
  }
}
