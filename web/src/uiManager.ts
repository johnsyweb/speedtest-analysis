import { ProcessedData, SummaryStats } from './types';

export class UIManager {
  /**
   * Show loading indicator
   */
  showLoading(): void {
    document.getElementById('loadingIndicator')!.style.display = 'block';
    document.getElementById('errorMessage')!.style.display = 'none';
    document.getElementById('content')!.style.display = 'none';
  }

  /**
   * Hide loading indicator
   */
  hideLoading(): void {
    document.getElementById('loadingIndicator')!.style.display = 'none';
  }

  /**
   * Show error message
   */
  showError(message: string): void {
    document.getElementById('loadingIndicator')!.style.display = 'none';
    document.getElementById('errorMessage')!.style.display = 'block';
    document.getElementById('errorText')!.textContent = message;
    document.getElementById('content')!.style.display = 'none';
  }

  /**
   * Show content
   */
  showContent(): void {
    document.getElementById('loadingIndicator')!.style.display = 'none';
    document.getElementById('errorMessage')!.style.display = 'none';
    document.getElementById('content')!.style.display = 'block';
  }

  /**
   * Update summary statistics
   */
  updateSummaryStats(stats: SummaryStats): void {
    const summaryContainer = document.getElementById('summaryStats')!;

    summaryContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${stats.totalTests}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgDownload.toFixed(1)}</div>
        <div class="stat-label">Avg Download (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgUpload.toFixed(1)}</div>
        <div class="stat-label">Avg Upload (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgPing.toFixed(1)}</div>
        <div class="stat-label">Avg Ping (ms)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.maxDownload.toFixed(1)}</div>
        <div class="stat-label">Max Download (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.maxUpload.toFixed(1)}</div>
        <div class="stat-label">Max Upload (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.minPing.toFixed(1)}</div>
        <div class="stat-label">Min Ping (ms)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.publicIPTests}</div>
        <div class="stat-label">Public IP Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.privateIPTests}</div>
        <div class="stat-label">Private IP Tests</div>
      </div>
    `;
  }

  /**
   * Update detailed table
   */
  updateDetailedTable(data: ProcessedData[]): void {
    const tableContainer = document.getElementById('detailedTable')!;

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Download (Mbps)</th>
            <th>Upload (Mbps)</th>
            <th>Ping (ms)</th>
            <th>Server</th>
            <th>ISP</th>
            <th>Interface</th>
            <th>IP Type</th>
            <th>Share URL</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(d => `
            <tr class="${d.interface.hasData && this.isPublicIP(d.interface.ip) ? 'public-ip' : 'private-ip'}">
              <td>${d.timestamp.toLocaleString("en-AU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}</td>
              <td>${d.download.toFixed(1)}</td>
              <td>${d.upload.toFixed(1)}</td>
              <td>${d.ping.toFixed(1)}</td>
              <td>${d.server.name}, ${d.server.country}</td>
              <td>${d.client.isp}</td>
              <td>${d.interface.hasData ? `${d.interface.name} (${d.interface.ip})` : 'N/A'}</td>
              <td>${d.interface.hasData ? (this.isPublicIP(d.interface.ip) ? 'PUBLIC' : 'Private') : 'N/A'}</td>
              <td>${d.share && d.share !== 'N/A' ? `<a href="${d.share}" target="_blank" style="color: #007bff; text-decoration: underline;">View Result</a>` : 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    tableContainer.innerHTML = tableHTML;
  }

  /**
   * Update CSV data
   */
  updateCSVData(data: ProcessedData[]): void {
    const csvContainer = document.getElementById('csvData')!;

    const csvHeaders = [
      'Timestamp',
      'Download (Mbps)',
      'Upload (Mbps)',
      'Ping (ms)',
      'Server Name',
      'Server Country',
      'Server Sponsor',
      'Server Distance (km)',
      'Client ISP',
      'Client Country',
      'Client IP',
      'Interface Name',
      'Interface IP',
      'Interface MAC',
      'Interface MTU',
      'Interface Status',
      'IP Type',
      'Share URL'
    ].join(',');

    const csvRows = data.map(d => [
      d.timestamp.toISOString(),
      d.download.toFixed(1),
      d.upload.toFixed(1),
      d.ping.toFixed(1),
      d.server.name,
      d.server.country,
      d.server.sponsor,
      d.server.d.toFixed(1),
      d.client.isp,
      d.client.country,
      d.client.ip,
      d.interface.hasData ? d.interface.name : '',
      d.interface.hasData ? d.interface.ip : '',
      d.interface.hasData ? d.interface.mac : '',
      d.interface.hasData ? d.interface.mtu.toString() : '',
      d.interface.hasData ? d.interface.status : '',
      d.interface.hasData ? (this.isPublicIP(d.interface.ip) ? 'PUBLIC' : 'Private') : '',
      d.share
    ].join(','));

    csvContainer.textContent = [csvHeaders, ...csvRows].join('\n');
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
}
