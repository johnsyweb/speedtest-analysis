(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function i(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(t){if(t.ep)return;t.ep=!0;const a=i(t);fetch(t.href,a)}})();class f{parseTimestamp(e){let i;if(e.includes(".3NZ")){const n=e.replace(".3NZ",".000+00:00");i=new Date(n)}else e.endsWith("+00:00Z")?i=new Date(e.slice(0,-1)):e.endsWith("Z")?i=new Date(e.slice(0,-1)+"+00:00"):e.includes("+")?i=new Date(e):i=new Date(e+"+00:00");if(isNaN(i.getTime()))throw new Error(`Invalid timestamp: ${e}`);return i}classifyIP(e){if(!e||e==="N/A"||e.trim()==="")return"n/a";if([/^10\./,/^172\.(1[6-9]|2[0-9]|3[0-1])\./,/^192\.168\./,/^127\./,/^169\.254\./,/^::1$/,/^fe80:/,/^fc00:/,/^fd00:/].some(a=>a.test(e)))return"private";const n=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,t=/^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;return n.test(e)||t.test(e)?"public":"n/a"}processSpeedtestData(e){const i=[];for(const n of e)if(!("error"in n))try{const t=this.parseTimestamp(n.timestamp),a=n["x-ifconfig"]!==void 0,r=a?n["x-ifconfig"].ipv4_addr:"N/A",l={timestamp:t,download:(n.download||0)/1e6,upload:(n.upload||0)/1e6,ping:n.ping||0,server:{name:n.server.name||"N/A",country:n.server.country||"N/A",sponsor:n.server.sponsor||"N/A",d:n.server.d||0},client:{isp:n.client.isp||"N/A",country:n.client.country||"N/A",ip:n.client.ip||"N/A"},share:n.share||"",interface:{name:a?n["x-ifconfig"].name:"N/A",ip:r,mac:a?n["x-ifconfig"].mac_addr:"N/A",mtu:a?n["x-ifconfig"].mtu:0,status:a?n["x-ifconfig"].status:"N/A",hasData:a,ipType:this.classifyIP(r)}};i.push(l)}catch(t){console.warn(`Warning: Could not parse timestamp in data: ${t}`);continue}return i.sort((n,t)=>n.timestamp.getTime()-t.timestamp.getTime())}calculateSummaryStats(e){if(e.length===0)return{totalTests:0,avgDownload:0,avgUpload:0,avgPing:0,maxDownload:0,maxUpload:0,minPing:0,publicIPTests:0,privateIPTests:0,dateRange:{start:new Date,end:new Date}};const i=e.map(r=>r.download),n=e.map(r=>r.upload),t=e.map(r=>r.ping),a=e.filter(r=>r.interface.hasData&&r.interface.ipType==="public").length;return{totalTests:e.length,avgDownload:i.reduce((r,l)=>r+l,0)/i.length,avgUpload:n.reduce((r,l)=>r+l,0)/n.length,avgPing:t.reduce((r,l)=>r+l,0)/t.length,maxDownload:Math.max(...i),maxUpload:Math.max(...n),minPing:Math.min(...t),publicIPTests:a,privateIPTests:e.length-a,dateRange:{start:e[0].timestamp,end:e[e.length-1].timestamp}}}}class g{constructor(){this.chart=null}initializeChart(e){const i=document.getElementById("speedChart").getContext("2d");if(!i)throw new Error("Could not get chart context");const n=e.map(s=>({x:s.timestamp,y:s.download})),t=e.map(s=>({x:s.timestamp,y:s.upload})),a=e.map(s=>({x:s.timestamp,y:s.ping})),r=e.map(s=>({timestamp:s.timestamp.toLocaleString("en-AU",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1,timeZoneName:"short"}),download:s.download.toFixed(1),upload:s.upload.toFixed(1),ping:s.ping.toFixed(1),server_name:s.server.name,server_country:s.server.country,server_sponsor:s.server.sponsor,server_distance:s.server.d.toFixed(1),client_isp:s.client.isp,client_country:s.client.country,client_ip:s.client.ip,share_url:s.share,interface_name:s.interface.hasData?s.interface.name:"N/A",interface_ip:s.interface.hasData?s.interface.ip:"N/A",interface_mtu:s.interface.hasData?s.interface.mtu.toString():"N/A",interface_status:s.interface.hasData?s.interface.status:"N/A",ip_type:s.interface.ipType})),l=s=>{switch(s){case"public":return"rgba(75, 192, 192, 0.8)";case"private":return"rgba(255, 159, 64, 0.8)";case"n/a":return"rgba(201, 203, 207, 0.8)";default:return"rgba(201, 203, 207, 0.8)"}},m=s=>{switch(s){case"public":return"rgb(75, 192, 192)";case"private":return"rgb(255, 159, 64)";case"n/a":return"rgb(201, 203, 207)";default:return"rgb(201, 203, 207)"}},h={datasets:[{label:"Download (Mbps)",data:n,backgroundColor:e.map(s=>l(s.interface.ipType)),borderColor:e.map(s=>m(s.interface.ipType)),yAxisID:"y",pointRadius:6,pointHoverRadius:8},{label:"Upload (Mbps)",data:t,backgroundColor:e.map(s=>l(s.interface.ipType)),borderColor:e.map(s=>m(s.interface.ipType)),yAxisID:"y",pointRadius:6,pointHoverRadius:8},{label:"Ping (ms)",data:a,backgroundColor:e.map(s=>l(s.interface.ipType)),borderColor:e.map(s=>m(s.interface.ipType)),yAxisID:"y1",pointRadius:6,pointHoverRadius:8}]};this.chart=new Chart(i,{type:"line",data:h,options:{responsive:!0,maintainAspectRatio:!1,interaction:{intersect:!1,mode:"index"},plugins:{tooltip:{callbacks:{title:function(s){const c=s[0].dataIndex;return r[c].timestamp},afterBody:function(s){const c=s[0].dataIndex,o=r[c],d=[`Download: ${o.download} Mbps`,`Upload: ${o.upload} Mbps`,`Ping: ${o.ping} ms`,"",`Server: ${o.server_name}, ${o.server_country}`,`Sponsor: ${o.server_sponsor}`,`Distance: ${o.server_distance} km`,"",`ISP: ${o.client_isp} (${o.client_country})`];if(o.interface_name!=="N/A"){const p=o.ip_type.toUpperCase();d.push(`Interface: ${o.interface_name} (${o.interface_ip})`,`MTU: ${o.interface_mtu}`,`Status: ${o.interface_status}`,`IP Type: ${p}`)}return o.share_url&&o.share_url!=="N/A"&&d.push("",`Share URL: ${o.share_url}`,"Click point to open result"),d}}}},onClick:function(s,c){if(c.length>0){const d=c[0].index,p=r[d];p.share_url&&p.share_url!=="N/A"&&window.open(p.share_url,"_blank")}},scales:{x:{type:"time",display:!0,title:{display:!0,text:"Time"},time:{displayFormats:{hour:"MMM dd HH:mm",day:"MMM dd",week:"MMM dd",month:"MMM yyyy"}}},y:{type:"linear",display:!0,position:"left",title:{display:!0,text:"Speed (Mbps)"}},y1:{type:"linear",display:!0,position:"right",title:{display:!0,text:"Ping (ms)"},grid:{drawOnChartArea:!1}}}}})}destroy(){this.chart&&(this.chart.destroy(),this.chart=null)}}class v{showLoading(){document.getElementById("loadingIndicator").style.display="block",document.getElementById("errorMessage").style.display="none",document.getElementById("content").style.display="none"}hideLoading(){document.getElementById("loadingIndicator").style.display="none"}showError(e){document.getElementById("loadingIndicator").style.display="none",document.getElementById("errorMessage").style.display="block",document.getElementById("errorText").textContent=e,document.getElementById("content").style.display="none"}showContent(){document.getElementById("loadingIndicator").style.display="none",document.getElementById("errorMessage").style.display="none",document.getElementById("content").style.display="block"}updateSummaryStats(e){const i=document.getElementById("summaryStats");i.innerHTML=`
      <div class="stat-card">
        <div class="stat-value">${e.totalTests}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.avgDownload.toFixed(1)}</div>
        <div class="stat-label">Avg Download (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.avgUpload.toFixed(1)}</div>
        <div class="stat-label">Avg Upload (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.avgPing.toFixed(1)}</div>
        <div class="stat-label">Avg Ping (ms)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.maxDownload.toFixed(1)}</div>
        <div class="stat-label">Max Download (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.maxUpload.toFixed(1)}</div>
        <div class="stat-label">Max Upload (Mbps)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.minPing.toFixed(1)}</div>
        <div class="stat-label">Min Ping (ms)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.publicIPTests}</div>
        <div class="stat-label">Public IP Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${e.privateIPTests}</div>
        <div class="stat-label">Private IP Tests</div>
      </div>
    `}updateDetailedTable(e){const i=document.getElementById("detailedTable"),n=`
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
          ${e.map(t=>`
            <tr class="${t.interface.hasData&&this.isPublicIP(t.interface.ip)?"public-ip":"private-ip"}">
              <td>${t.timestamp.toLocaleString("en-AU",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}</td>
              <td>${t.download.toFixed(1)}</td>
              <td>${t.upload.toFixed(1)}</td>
              <td>${t.ping.toFixed(1)}</td>
              <td>${t.server.name}, ${t.server.country}</td>
              <td>${t.client.isp}</td>
              <td>${t.interface.hasData?`${t.interface.name} (${t.interface.ip})`:"N/A"}</td>
              <td>${t.interface.hasData?this.isPublicIP(t.interface.ip)?"PUBLIC":"Private":"N/A"}</td>
              <td>${t.share&&t.share!=="N/A"?`<a href="${t.share}" target="_blank" style="color: #007bff; text-decoration: underline;">View Result</a>`:"N/A"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;i.innerHTML=n}updateCSVData(e){const i=document.getElementById("csvData"),n=["Timestamp","Download (Mbps)","Upload (Mbps)","Ping (ms)","Server Name","Server Country","Server Sponsor","Server Distance (km)","Client ISP","Client Country","Client IP","Interface Name","Interface IP","Interface MAC","Interface MTU","Interface Status","IP Type","Share URL"].join(","),t=e.map(a=>[a.timestamp.toISOString(),a.download.toFixed(1),a.upload.toFixed(1),a.ping.toFixed(1),a.server.name,a.server.country,a.server.sponsor,a.server.d.toFixed(1),a.client.isp,a.client.country,a.client.ip,a.interface.hasData?a.interface.name:"",a.interface.hasData?a.interface.ip:"",a.interface.hasData?a.interface.mac:"",a.interface.hasData?a.interface.mtu.toString():"",a.interface.hasData?a.interface.status:"",a.interface.hasData?this.isPublicIP(a.interface.ip)?"PUBLIC":"Private":"",a.share].join(","));i.textContent=[n,...t].join(`
`)}isPublicIP(e){return![/^10\./,/^172\.(1[6-9]|2[0-9]|3[0-1])\./,/^192\.168\./,/^127\./,/^169\.254\./,/^::1$/,/^fe80:/,/^fc00:/,/^fd00:/].some(n=>n.test(e))}}class y{constructor(){this.currentData=[],this.dataProcessor=new f,this.chartManager=new g,this.uiManager=new v,this.setupEventListeners()}setupEventListeners(){document.getElementById("fileInput");const e=document.getElementById("loadDataBtn"),i=document.getElementById("downloadCsvBtn");e.addEventListener("click",()=>this.handleFileLoad()),i.addEventListener("click",()=>this.handleCSVDownload())}async handleFileLoad(){const i=document.getElementById("fileInput").files;if(!i||i.length===0){this.uiManager.showError("Please select one or more JSON files to load.");return}this.uiManager.showLoading();try{const n=[];for(let t=0;t<i.length;t++){const a=i[t],r=await this.readFileAsText(a);try{const l=JSON.parse(r);Array.isArray(l)?n.push(...l):n.push(l)}catch(l){console.warn(`Warning: Could not parse JSON from file ${a.name}:`,l);continue}}if(n.length===0){this.uiManager.showError("No valid speedtest data found in the selected files.");return}if(this.currentData=this.dataProcessor.processSpeedtestData(n),this.currentData.length===0){this.uiManager.showError("No valid speedtest data could be processed from the selected files.");return}this.updateUI()}catch(n){console.error("Error loading data:",n),this.uiManager.showError(`Error loading data: ${n instanceof Error?n.message:"Unknown error"}`)}}readFileAsText(e){return new Promise((i,n)=>{const t=new FileReader;t.onload=a=>{var r;return i((r=a.target)==null?void 0:r.result)},t.onerror=a=>n(new Error(`Failed to read file: ${e.name}`)),t.readAsText(e)})}updateUI(){const e=this.dataProcessor.calculateSummaryStats(this.currentData);this.uiManager.updateSummaryStats(e),this.uiManager.updateDetailedTable(this.currentData),this.uiManager.updateCSVData(this.currentData),this.chartManager.destroy(),this.chartManager.initializeChart(this.currentData),this.uiManager.showContent()}handleCSVDownload(){var a;const e=(a=document.getElementById("csvData"))==null?void 0:a.textContent;if(!e){alert("No data available to download.");return}const i=new Blob([e],{type:"text/csv"}),n=window.URL.createObjectURL(i),t=document.createElement("a");t.href=n,t.download="speedtest_data.csv",document.body.appendChild(t),t.click(),document.body.removeChild(t),window.URL.revokeObjectURL(n)}}document.addEventListener("DOMContentLoaded",()=>{new y});
