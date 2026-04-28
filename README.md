<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>YTGrab — YouTube Downloader</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet" />

  <style>
    :root {
      --bg:        #0c0c0e;
      --surface:   #131316;
      --border:    #222228;
      --accent:    #ff3c3c;
      --accent2:   #ff6b35;
      --text:      #e8e8f0;
      --muted:     #6b6b80;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem 4rem;
    }

    /* ── noise grain overlay ── */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 0;
    }

    .container {
      position: relative; z-index: 1;
      width: 100%; max-width: 640px;
    }

    /* ── header ── */
    header {
      text-align: center;
      margin-bottom: 3rem;
      padding-top: 1rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border-radius: 8px;
      display: grid; place-items: center;
    }

    .logo-text {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .logo-text span { color: var(--accent); }

    .tagline {
      font-family: 'Space Mono', monospace;
      font-size: 0.72rem;
      color: var(--muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    /* ── card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.75rem;
      margin-bottom: 1.25rem;
    }

    /* ── input row ── */
    .input-row {
      display: flex;
      gap: 0.625rem;
    }

    .url-input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      color: var(--text);
      font-family: 'Space Mono', monospace;
      font-size: 0.8rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .url-input::placeholder { color: var(--muted); }
    .url-input:focus { border-color: var(--accent); }

    .fetch-btn {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.75rem 1.25rem;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 0.2s, transform 0.1s;
    }

    .fetch-btn:hover:not(:disabled) { opacity: 0.88; }
    .fetch-btn:active:not(:disabled) { transform: scale(0.97); }
    .fetch-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── spinner ── */
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── error ── */
    .error-box {
      background: rgba(255, 60, 60, 0.08);
      border: 1px solid rgba(255, 60, 60, 0.3);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.78rem;
      color: #ff7070;
      margin-bottom: 1.25rem;
    }

    .error-icon { font-size: 1rem; flex-shrink: 0; }

    /* ── success ── */
    .success-box {
      background: rgba(60, 200, 100, 0.08);
      border: 1px solid rgba(60, 200, 100, 0.3);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.78rem;
      color: #5fe0a0;
      margin-bottom: 1.25rem;
    }

    /* ── preview card ── */
    .preview-inner {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .thumb-wrap {
      flex-shrink: 0;
      width: 130px; height: 76px;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg);
      border: 1px solid var(--border);
    }

    .thumb-wrap img {
      width: 100%; height: 100%;
      object-fit: cover;
    }

    .video-meta { flex: 1; min-width: 0; }

    .video-meta h2 {
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.4;
      margin-bottom: 0.3rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta-row {
      font-family: 'Space Mono', monospace;
      font-size: 0.7rem;
      color: var(--muted);
    }

    .meta-row .channel { color: var(--accent); }

    /* ── divider ── */
    .divider {
      border: none;
      border-top: 1px solid var(--border);
      margin: 1.25rem 0;
    }

    /* ── format select ── */
    .label {
      font-family: 'Space Mono', monospace;
      font-size: 0.68rem;
      color: var(--muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      display: block;
    }

    .format-select {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.7rem 1rem;
      color: var(--text);
      font-family: 'Syne', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      margin-bottom: 1rem;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%236b6b80' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.875rem center;
      background-size: 1rem;
    }

    .format-select:focus { border-color: var(--accent); }

    /* ── download btn ── */
    .dl-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 0.85rem;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      transition: opacity 0.2s, transform 0.1s;
    }

    .dl-btn:hover:not(:disabled) { opacity: 0.88; }
    .dl-btn:active:not(:disabled) { transform: scale(0.98); }
    .dl-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── footer ── */
    footer {
      margin-top: 2.5rem;
      text-align: center;
      font-family: 'Space Mono', monospace;
      font-size: 0.68rem;
      color: var(--muted);
      letter-spacing: 0.05em;
    }

    footer a { color: var(--accent); text-decoration: none; }

    /* ── hidden util ── */
    .hidden { display: none !important; }

    /* ── reveal animation ── */
    .reveal {
      animation: reveal 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
    }

    @keyframes reveal {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── mobile ── */
    @media (max-width: 480px) {
      .input-row { flex-direction: column; }
      .fetch-btn { justify-content: center; }
      .thumb-wrap { width: 100px; height: 60px; }
    }
  </style>
</head>
<body>

<div class="container">

  <!-- Header -->
  <header>
    <div class="logo">
      <div class="logo-icon">
        <!-- yt arrow icon -->
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v12M12 15l-4-4M12 15l4-4M3 19h18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="logo-text">YT<span>Grab</span></span>
    </div>
    <p class="tagline">// paste · fetch · download</p>
  </header>

  <!-- Error Banner -->
  <div id="errorBox" class="error-box hidden">
    <span class="error-icon">⚠</span>
    <span id="errorMsg">Something went wrong.</span>
  </div>

  <!-- Success Banner -->
  <div id="successBanner" class="success-box hidden">
    <span>✓</span>
    <span>Download started — check your Downloads folder.</span>
  </div>

  <!-- URL Input Card -->
  <div class="card">
    <div class="input-row">
      <input
        id="urlInput"
        class="url-input"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        autocomplete="off"
        spellcheck="false"
      />
      <button id="fetchBtn" class="fetch-btn">
        <div id="fetchSpinner" class="spinner hidden"></div>
        <span>Fetch Video</span>
      </button>
    </div>
  </div>

  <!-- Preview Card -->
  <div id="previewCard" class="card hidden reveal">

    <!-- Thumbnail + meta -->
    <div class="preview-inner">
      <div class="thumb-wrap">
        <img id="thumbnail" src="" alt="Video thumbnail" />
      </div>
      <div class="video-meta">
        <h2 id="videoTitle">Video Title</h2>
        <p class="meta-row">
          <span id="channelName" class="channel">Channel</span>
        </p>
        <p class="meta-row" id="videoDuration"></p>
      </div>
    </div>

    <hr class="divider" />

    <!-- Format chooser -->
    <label class="label" for="formatSelect">Select Format</label>
    <select id="formatSelect" class="format-select">
      <option value="mp4_best">🎬  MP4 Video — Best Quality</option>
      <option value="mp4_720">📺  MP4 Video — 720p</option>
      <option value="mp3">🎵  Audio Only — MP3 (192kbps)</option>
    </select>

    <!-- Download button -->
    <button id="downloadBtn" class="dl-btn">
      <div id="dlSpinner" class="spinner hidden"></div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
      </svg>
      <span id="dlText">Download</span>
    </button>

  </div><!-- /previewCard -->

  <!-- Footer -->
  <footer>
    <p>Built with Flask + yt-dlp &nbsp;·&nbsp; For personal use only</p>
    <p style="margin-top:0.4rem;">Respect YouTube's <a href="https://www.youtube.com/t/terms" target="_blank">Terms of Service</a></p>
  </footer>

</div><!-- /container -->

<script src="app.js"></script>
</body>
</html>
