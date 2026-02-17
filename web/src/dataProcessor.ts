import { SpeedtestData, ProcessedData, SummaryStats } from "./types";

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
   * Classify IP address type
   */
  private classifyIP(ip: string): "public" | "private" | "n/a" {
    // Handle invalid or missing IPs
    if (!ip || ip === "N/A" || ip.trim() === "") {
      return "n/a";
    }

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

    // Check if it's a private IP
    if (privateRanges.some((range) => range.test(ip))) {
      return "private";
    }

    // Check if it looks like a valid IPv4 or IPv6 address
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;

    if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
      return "public";
    }

    // If it doesn't match known patterns, mark as n/a
    return "n/a";
  }

  /**
   * Process raw speedtest data
   */
  processSpeedtestData(rawData: SpeedtestData[]): ProcessedData[] {
    const processedData: ProcessedData[] = [];

    for (const speedtestData of rawData) {
      // Skip results with errors
      if ("error" in speedtestData) {
        continue;
      }

      try {
        const timestamp = this.parseTimestamp(speedtestData.timestamp);
        const hasInterfaceData = speedtestData["x-ifconfig"] !== undefined;

        const interfaceIP = hasInterfaceData
          ? speedtestData["x-ifconfig"]!.ipv4_addr
          : "N/A";

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
            name: hasInterfaceData ? speedtestData["x-ifconfig"]!.name : "N/A",
            ip: interfaceIP,
            mac: hasInterfaceData
              ? speedtestData["x-ifconfig"]!.mac_addr
              : "N/A",
            mtu: hasInterfaceData ? speedtestData["x-ifconfig"]!.mtu : 0,
            status: hasInterfaceData
              ? speedtestData["x-ifconfig"]!.status
              : "N/A",
            hasData: hasInterfaceData,
            ipType: this.classifyIP(interfaceIP),
          },
        };

        processedData.push(processed);
      } catch (error) {
        console.warn(`Warning: Could not parse timestamp in data: ${error}`);
        continue;
      }
    }

    return processedData.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
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

    const publicIPTests = data.filter(
      (d) => d.interface.hasData && d.interface.ipType === "public",
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
