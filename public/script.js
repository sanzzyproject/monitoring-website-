// State Management
let websites = JSON.parse(localStorage.getItem('myWebsites')) || [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    // Cek otomatis setiap 60 detik
    setInterval(checkAllWebsites, 60000);
    // Cek saat pertama load (jika ada data)
    if(websites.length > 0) checkAllWebsites();
    
    // Minta izin notifikasi browser
    if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});

// 1. Add Website Function
function addWebsite() {
    const input = document.getElementById('urlInput');
    let url = input.value.trim();

    if (!url) return showToast('Please enter a URL', 'error');
    
    // Basic validation
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    // Cek duplikat
    if (websites.some(site => site.url === url)) {
        return showToast('Website already exists in list', 'error');
    }

    // Tambah ke array
    const newSite = {
        id: Date.now(),
        url: url,
        status: 'pending', // pending, up, down
        latency: 0,
        lastCheck: null
    };

    websites.push(newSite);
    saveData();
    input.value = '';
    
    renderDashboard();
    checkSingleWebsite(newSite.id); // Cek langsung
    showToast('Website added successfully', 'success');
}

// 2. Remove Website
function removeWebsite(id) {
    websites = websites.filter(site => site.id !== id);
    saveData();
    renderDashboard();
}

// 3. Core Function: Render UI
function renderDashboard() {
    // Update Stats
    const total = websites.length;
    const online = websites.filter(w => w.status === 'up').length;
    const offline = websites.filter(w => w.status === 'down').length;

    document.getElementById('totalCount').innerText = total;
    document.getElementById('onlineCount').innerText = online;
    document.getElementById('offlineCount').innerText = offline;

    // Render List
    const listContainer = document.getElementById('websiteList');
    listContainer.innerHTML = '';

    if (total === 0) {
        listContainer.innerHTML = '<div class="empty-state" style="text-align:center; padding:20px; color:#999;">No websites added yet.</div>';
    } else {
        websites.forEach(site => {
            let statusIcon = '';
            if(site.status === 'up') {
                statusIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#10B981"/></svg>`;
            } else if(site.status === 'down') {
                statusIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#EF4444"/></svg>`;
            } else {
                statusIcon = `<span style="color:#aaa;">...</span>`;
            }

            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="site-url" title="${site.url}">
                    ${site.url.replace('https://', '').replace('http://', '')}
                </div>
                <div class="site-actions">
                    <div class="status-icon">${statusIcon}</div>
                    <button class="btn-delete" onclick="removeWebsite(${site.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            listContainer.appendChild(item);
        });
    }

    // Render Charts
    renderCharts(total, online, offline);
}

// 4. Render Charts (CSS based)
function renderCharts(total, online, offline) {
    // Pie Chart Logic
    const pie = document.getElementById('statusPie');
    if (total > 0) {
        const onlinePct = (online / total) * 100;
        const offlinePct = (offline / total) * 100;
        pie.style.background = `conic-gradient(#10B981 0% ${onlinePct}%, #EF4444 ${onlinePct}% 100%)`;
        document.getElementById('legendUp').innerText = Math.round(onlinePct) + '%';
        document.getElementById('legendDown').innerText = Math.round(offlinePct) + '%';
    } else {
        pie.style.background = '#E5E7EB'; // Grey if empty
    }

    // Bar Chart Logic (Latency)
    const barContainer = document.getElementById('barChart');
    barContainer.innerHTML = '';
    
    if(total === 0) {
        barContainer.innerHTML = '<div class="placeholder-text">Add websites to see data</div>';
    } else {
        websites.forEach(site => {
            if(site.latency > 0) {
                // Normalisasi tinggi bar (max 100px untuk 1000ms misal)
                let height = Math.min((site.latency / 1000) * 100, 100); 
                if (height < 10) height = 10; // min height
                
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${height}%`;
                bar.style.background = site.status === 'up' ? '#10B981' : '#EF4444';
                bar.setAttribute('data-val', site.latency + 'ms');
                barContainer.appendChild(bar);
            }
        });
    }
}

// 5. Backend Connection (Tidak Mengubah API, hanya Loop)
async function checkSingleWebsite(id) {
    const index = websites.findIndex(w => w.id === id);
    if (index === -1) return;
    
    const site = websites[index];
    
    try {
        // Panggil API Backend Anda yang lama
        const response = await fetch(`/api/check?url=${encodeURIComponent(site.url)}`);
        const data = await response.json();
        
        // Update State
        const oldStatus = websites[index].status;
        websites[index].status = data.status; // 'up' or 'down'
        websites[index].latency = data.response_time_ms || 0;
        websites[index].lastCheck = new Date().toISOString();

        // Notification Check (Jika berubah jadi down)
        if (oldStatus === 'up' && data.status === 'down') {
            sendNotification(`⚠️ ALERT: ${site.url} is DOWN!`);
        }

    } catch (error) {
        console.error("Check failed", error);
        websites[index].status = 'down';
    }
    
    saveData();
    renderDashboard();
}

async function checkAllWebsites() {
    for (let site of websites) {
        await checkSingleWebsite(site.id);
    }
}

// Utils
function saveData() {
    localStorage.setItem('myWebsites', JSON.stringify(websites));
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function sendNotification(msg) {
    showToast(msg, 'error'); // Tampil di layar
    // Tampil di Browser System Notification
    if (Notification.permission === "granted") {
        new Notification("PingNotify Alert", { body: msg });
    }
}
