const API_BASE = "http://127.0.0.1:5000/api";
const fetchBtn = document.getElementById('fetchBtn');
const downloadBtn = document.getElementById('downloadBtn');
const urlInput = document.getElementById('urlInput');
const preview = document.getElementById('preview');
const loader = document.getElementById('loader');

fetchBtn.addEventListener('click', async () => {
    const url = urlInput.value;
    if (!url) return alert("Please paste a URL!");

    loader.classList.remove('hidden');
    preview.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        document.getElementById('thumb').src = data.thumbnail;
        document.getElementById('videoTitle').innerText = data.title;
        document.getElementById('channelName').innerText = data.channel;
        
        loader.classList.add('hidden');
        preview.classList.remove('hidden');
    } catch (err) {
        loader.classList.add('hidden');
        alert("Error fetching video. Please check the URL.");
    }
});

downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value;
    const format = document.getElementById('formatSelect').value;

    downloadBtn.innerText = "Downloading...";
    downloadBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, format })
        });

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = ""; // Filename will be suggested by server headers
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (err) {
        alert("Download failed.");
    } finally {
        downloadBtn.innerText = "Download Now";
        downloadBtn.disabled = false;
    }
});