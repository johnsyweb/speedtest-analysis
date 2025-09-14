export interface SpeedtestData {
  timestamp: string;
  download: number; // bits per second (raw from speedtest-cli)
  upload: number; // bits per second (raw from speedtest-cli)
  ping: number; // milliseconds
  server: {
    name: string;
    country: string;
    sponsor: string;
    d: number;
  };
  client: {
    isp: string;
    country: string;
    ip: string;
  };
  share: string;
  'x-ifconfig'?: {
    name: string;
    ipv4_addr: string;
    mac_addr: string;
    mtu: number;
    status: string;
  };
  error?: string;
}

export interface ProcessedData {
  timestamp: Date;
  download: number; // Mbps (converted from bits/sec)
  upload: number; // Mbps (converted from bits/sec)
  ping: number; // milliseconds
  server: {
    name: string;
    country: string;
    sponsor: string;
    d: number;
  };
  client: {
    isp: string;
    country: string;
    ip: string;
  };
  share: string;
  interface: {
    name: string;
    ip: string;
    mac: string;
    mtu: number;
    status: string;
    hasData: boolean;
    ipType: 'public' | 'private' | 'n/a';
  };
}

export interface SummaryStats {
  totalTests: number;
  avgDownload: number; // Mbps
  avgUpload: number; // Mbps
  avgPing: number; // milliseconds
  maxDownload: number; // Mbps
  maxUpload: number; // Mbps
  minPing: number; // milliseconds
  publicIPTests: number;
  privateIPTests: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}
