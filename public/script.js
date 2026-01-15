async function checkWebsite() {
    const input = document.getElementById('urlInput');
    const btn = document.getElementById('checkBtn');
    const resultCard = document.getElementById('resultCard');
    const jsonOutput = document.getElementById('jsonOutput');
    
    // UI Elements
    const statusCodeEl = document.getElementById('statusCode');
    const statusTextEl = document.getElementById('statusText');
    const resStatusEl = document.getElementById('resStatus');
    const resTimeEl = document.getElementById('resTime');
    const statusRing = document.getElementById('statusRing');

    const url = input.value.trim();
    if (!url) {
        alert("Please enter a URL");
        return;
    }

    // Set Loading State
    btn.disabled = true;
    btn.textContent = "Checking...";
    resultCard.style.display = "none";

    try {
        // Fetch ke endpoint API backend sendiri
        // Dalam environment Vercel, relative path berfungsi
        const response = await fetch(`/api/check?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        // Render Data
        resultCard.style.display = "block";
        jsonOutput.textContent = JSON.stringify(data, null, 2);

        // Update Status Code & Ring
        statusCodeEl.textContent = data.status_code || "ERR";
        resTimeEl.textContent = data.response_time_ms ? `${data.response_time_ms}ms` : "-";
        
        // Handle Visuals based on Status
        statusRing.classList.remove('up', 'down');
        resStatusEl.classList.remove('up', 'down');

        if (data.status === 'up') {
            statusRing.classList.add('up');
            resStatusEl.textContent = "UP";
            resStatusEl.classList.add('up');
            statusTextEl.textContent = "Operational";
            statusTextEl.style.color = "var(--success)";
        } else {
            statusRing.classList.add('down');
            resStatusEl.textContent = "DOWN";
            resStatusEl.classList.add('down');
            statusTextEl.textContent = "Issues Found";
            statusTextEl.style.color = "var(--error)";
        }

    } catch (error) {
        console.error(error);
        alert("Failed to connect to API. Make sure backend is running.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Check Now";
    }
}
