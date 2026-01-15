// === PAGE NAVIGATION LOGIC ===
function showDashboard() {
    document.querySelector('.navbar').style.display = 'none'; // Sembunyikan Nav Home
    document.getElementById('homePage').style.display = 'none';
    
    const dash = document.getElementById('dashboardPage');
    dash.classList.remove('dashboard-hidden');
    dash.classList.add('dashboard-visible');
    
    // Trigger render ulang dashboard agar chart update ukurannya
    renderDashboard();
}

function showHome() {
    document.querySelector('.navbar').style.display = 'flex'; // Munculkan Nav Home
    document.getElementById('homePage').style.display = 'block';
    
    const dash = document.getElementById('dashboardPage');
    dash.classList.remove('dashboard-visible');
    dash.classList.add('dashboard-hidden');
}


// === CORE DASHBOARD LOGIC ===
let websites = JSON.parse(localStorage.getItem('myWebsites')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Background Check Interval (setiap 60 detik)
    setInterval(checkAllWebsites, 60000);
    
    // Cek saat pertama load jika ada data
    if(websites.length > 0) checkAllWebsites();
    
    // Request permission notifikasi
    if (Notification.permission !== "denied") Notification.requestPermission();
    
    renderDashboard();
});

function addWebsite() {
    const input = document.getElementById('urlInput');
    let url = input.value.trim();

    if (!url) return showToast('Please enter a URL', 'error');
    
    // Validasi format URL sederhana
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    // Cek duplikat
    if (websites.some(site => site.url === url)) {
        return showToast('Website already exists', 'error');
    }

    const newSite = { 
        id: Date.now(), 
        url: url, 
        status: 'pending', 
        latency: 0 
    };
    
    websites.push(newSite);
    saveData();
    input.value = '';
    
    renderDashboard();
    checkSingleWebsite(newSite.id); // Cek status segera
    showToast('Website added successfully', 'success');
}

function removeWebsite(id) {
    websites = websites.filter(site => site.id !== id);
    saveData();
    renderDashboard();
}

function renderDashboard() {
    // 1. Update Stats
    const total = websites.length;
    const online = websites.filter(w => w.status === 'up').length;
    const offline = websites.filter(w => w.status === 'down').length;

    document.getElementById('totalCount').innerText = total;
    document.getElementById('onlineCount').innerText = online;
    document.getElementById('offlineCount').innerText = offline;

    // 2. Render List
    const listContainer = document.getElementById('websiteList');
    listContainer.innerHTML = '';

    if (total === 0) {
        listContainer.innerHTML = '<div class="empty-state" style="text-align:center; padding:20px; color:#999; font-size:12px;">No websites added yet.</div>';
    } else {
        websites.forEach(site => {
            let statusIcon;
            let statusColor;

            if(site.status === 'up') {
                statusColor = '#10B981';
                statusIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${statusColor}"><circle cx="12" cy="12" r="10"/></svg>`;
            } else if(site.status === 'down') {
                statusColor = '#EF4444';
                statusIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${statusColor}"><circle cx="12" cy="12" r="10"/></svg>`;
            } else {
                statusColor = '#9CA3AF'; // Pending
                statusIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${statusColor}"><circle cx="12" cy="12" r="10"/></svg>`;
            }

            const item = document.createElement('div');
            item.className = 'list-item';
            // Menampilkan URL bersih (tanpa https://)
            const displayUrl = site.url.replace(/^https?:\/\//, '');

            item.innerHTML = `
                <div class="site-url" title="${site.url}">${displayUrl}</div>
                <div class="site-actions">
                    <span style="font-size:12px; font-weight:600; color:${statusColor}">
                        ${site.latency > 0 ? site.latency + 'ms' : '-'}
                    </span>
                    <div class="status-icon">${statusIcon}</div>
                    <button class="btn-delete" onclick="removeWebsite(${site.id})">×</button>
                </div>
            `;
            listContainer.appendChild(item);
        });
    }

    // 3. Render Charts
    renderCharts(total, online, offline);
}

function renderCharts(total, online, offline) {
    // Pie Chart Logic
    const pie = document.getElementById('statusPie');
    if (total > 0) {
        const onlinePct = (online / total) * 100;
        // Membuat Conic Gradient CSS untuk efek Pie Chart
        pie.style.background = `conic-gradient(#10B981 0% ${onlinePct}%, #EF4444 ${onlinePct}% 100%)`;
        document.getElementById('legendUp').innerText = Math.round(onlinePct) + '%';
        document.getElementById('legendDown').innerText = Math.round(100 - onlinePct) + '%';
    } else {
        pie.style.background = '#E5E7EB';
        document.getElementById('legendUp').innerText = '0%';
        document.getElementById('legendDown').innerText = '0%';
    }

    // Bar Chart Logic (Latency)
    const barContainer = document.getElementById('barChart');
    barContainer.innerHTML = '';
    
    if(total === 0) {
        barContainer.innerHTML = '<div class="placeholder-text">Add websites to see data</div>';
    } else {
        websites.forEach(site => {
            if(site.latency > 0) {
                // Menghitung tinggi bar relatif (max 100% untuk 500ms ke atas)
                let height = Math.min((site.latency / 500) * 100, 100);
                if (height < 10) height = 10; // Tinggi minimal agar terlihat

                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${height}%`;
                bar.style.background = site.status === 'up' ? '#10B981' : '#EF4444';
                // Tooltip sederhana menggunakan title
                bar.title = `${site.url}: ${site.latency}ms`;
                barContainer.appendChild(bar);
            }
        });
    }
}

// === FIX: MENGHUBUNGKAN KEMBALI KE BACKEND ===
async function checkSingleWebsite(id) {
    const index = websites.findIndex(w => w.id === id);
    if (index === -1) return;
    
    const site = websites[index];
    
    try {
        // [FIX] Menggunakan endpoint API Backend Anda
        const response = await fetch(`/api/check?url=${encodeURIComponent(site.url)}`);
        const data = await response.json();
        
        // Simpan status lama untuk cek perubahan
        const oldStatus = websites[index].status;

        // Update data berdasarkan response JSON Backend
        // Asumsi JSON Backend: { status: 'up'/'down', response_time_ms: 120, ... }
        websites[index].status = data.status || 'down'; 
        websites[index].latency = data.response_time_ms || 0;

        // Notifikasi jika status berubah menjadi DOWN
        if (oldStatus === 'up' && websites[index].status === 'down') {
            sendNotification(`⚠️ Alert: ${site.url} is DOWN!`);
        }
        
        // Notifikasi jika status berubah menjadi UP (Recovered)
        if (oldStatus === 'down' && websites[index].status === 'up') {
            showToast(`${site.url} is back UP!`, 'success');
        }

    } catch (error) {
        console.error("API Error:", error);
        websites[index].status = 'down';
        websites[index].latency = 0;
        // Optional: Notify error fetching API
    }
    
    saveData();
    renderDashboard();
}

async function checkAllWebsites() {
    for (let site of websites) {
        await checkSingleWebsite(site.id);
    }
}

function saveData() { 
    localStorage.setItem('myWebsites', JSON.stringify(websites)); 
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    
    // Hapus toast setelah 3 detik
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function sendNotification(msg) {
    showToast(msg, 'error'); // Tampil di UI
    // Tampil di Sistem OS/Browser
    if (Notification.permission === "granted") {
        new Notification("PingNotify Alert", { body: msg });
    }
}
