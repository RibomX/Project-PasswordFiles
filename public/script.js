function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    sb.classList.toggle('active');
    ov.classList.toggle('active');
}

// --- 1. UPLOAD FILE (Secure Transfer) ---
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) {
        alert("Please select a file!");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    status.innerHTML = 'Uploading...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            progressBar.style.width = '100%';
            status.innerHTML = '<span style="color: #27ae60; font-weight: bold;">File uploaded successfully!</span>';

            setTimeout(() => {
                progressContainer.style.display = 'none';
                status.innerText = '';
                passwordInput.value = '';
                fileInput.value = '';
            }, 1000);
        } else {
            status.innerText = 'Upload failed. Try a different password.';
            progressContainer.style.display = 'none';
        }
    } catch (err) {
        console.error(err);
        status.innerText = 'Server error.';
        progressContainer.style.display = 'none';
    }
}

// --- 2. CHECK PASSWORD (Download) ---
async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    if (!password) {
        alert("Enter password!");
        return;
    }

    status.innerText = 'Checking...';

    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        if (!response.ok) throw new Error('Server error');

        const data = await response.json();

        if (data.found) {
            status.innerHTML = `Found: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold;">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password or expired.';
        }
    } catch (err) {
        status.innerText = 'Error connecting to database.';
    }
}

// --- 3. LOADING SCREEN ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        if (loadFill) loadFill.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => loader.classList.add('loader-hidden'), 400);
            setTimeout(() => {
                if (mainContent) {
                    mainContent.classList.add('content-visible');
                    const h1 = mainContent.querySelector('h1');
                    if (h1) h1.style.color = "#3498db";
                }
            }, 800);
        }
    }, 120);
});

// --- 4. SWITCH TABS ---
function switchTab(tab) {
    const content = document.getElementById('dynamic-content');
    const btnTransfer = document.getElementById('btn-transfer');
    const btnSketch = document.getElementById('btn-sketch');
    const btnResizer = document.getElementById('btn-resizer');

    [btnTransfer, btnSketch, btnResizer].forEach(btn => btn?.classList.remove('active'));

    if (tab === 'resizer') {
        if (btnResizer) btnResizer.classList.add('active');
        document.body.classList.add('hide-brand');

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; padding-top: 30px; width: 100%;">
                <h1 style="margin-bottom: 15px; font-size: 3.2rem; text-align: center; font-weight: 900; color: #e67e22;">Image Resizer</h1>
                <div class="container animate-up" style="background: white; padding: 20px 30px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 360px; height: auto;">
                    <section class="upload-section" style="margin: 0; display: flex; flex-direction: column; gap: 5px;">
                        <p style="color: #888; font-size: 0.8rem; margin: 0;">Target width (px):</p>
                        <input type="number" id="targetWidth" value="1080" placeholder="e.g. 1080" 
                               style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #eee; text-align: center; font-weight: 900; font-size: 1.2rem; color: #e67e22; outline: none;">
                        <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; display: flex; justify-content: center; align-items: center;">
                            <input type="file" id="imageInput" accept="image/*" style="width: 165px; font-size: 0.8rem; cursor: pointer;">
                        </div>
                        <button onclick="processResize()" id="resBtn" class="upload-btn" 
                                style="width: 100%; background: #e67e22; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase;">
                            RESIZE IMAGE
                        </button>
                        <div id="resStatus" style="margin-top: 5px; font-size: 0.85rem; font-weight: bold; color: #e67e22;"></div>
                    </section>
                </div>
            </div>
        `;
    } 
    else if (tab === 'sketch') {
        if (btnSketch) btnSketch.classList.add('active');
        document.body.classList.add('hide-brand');

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; padding-top: 30px; width: 100%;">
                <h1 style="margin-bottom: 15px; font-size: 3.2rem; text-align: center; font-weight: 900; color: #9b59b6;">InstantFrames</h1>
                <div class="container animate-up" style="background: white; padding: 20px 30px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 360px; height: auto;">
                    <section class="upload-section" style="margin: 0; display: flex; flex-direction: column; gap: 5px;">
                        <p style="color: #888; font-size: 0.8rem; margin: 0;">Video to JPG Frames | Max 30s</p>
                        <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; display: flex; justify-content: center; align-items: center;">
                            <input type="file" id="videoInput" accept="video/*" style="width: 165px; font-size: 0.8rem; cursor: pointer;">
                        </div>
                        <button onclick="processInstantFrames()" id="workBtn" class="upload-btn" style="width: 100%; background: #9b59b6; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer; text-transform: uppercase;">
                            GENERATE ZIP
                        </button>
                        <div id="sketchStatus" style="margin-top: 5px; font-size: 0.85rem; font-weight: bold; color: #9b59b6;"></div>
                    </section>
                </div>
            </div>
        `;
    } 
    else {
        document.body.classList.remove('hide-brand');
        location.reload();
    }
    if (typeof toggleSidebar === "function") toggleSidebar();
}

// --- 5. PROCESSING LOGIC ---

async function processResize() {
    const input = document.getElementById('imageInput');
    const widthInput = document.getElementById('targetWidth');
    const status = document.getElementById('resStatus');
    const btn = document.getElementById('resBtn');
    
    if (!input.files[0]) return alert("Please select an image!");

    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('width', widthInput.value);

    status.innerText = "Processing image...";
    btn.disabled = true;

    try {
        const response = await fetch('/resize-image', { method: 'POST', body: formData });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resized_${widthInput.value}px.jpg`;
            a.click();
            status.innerHTML = '<span style="color: #27ae60;">Done! Downloading...</span>';
        } else {
            status.innerText = "Error on server.";
        }
    } catch (err) {
        status.innerText = "Connection error.";
    } finally {
        btn.disabled = false;
    }
}

async function processInstantFrames() {
    const videoInput = document.getElementById('videoInput');
    const status = document.getElementById('sketchStatus');
    const btn = document.getElementById('workBtn');
    
    if (!videoInput || !videoInput.files[0]) return alert("Please select a video!");

    const formData = new FormData();
    formData.append('video', videoInput.files[0]);

    status.innerText = "Processing video... wait please.";
    btn.disabled = true;

    try {
        const response = await fetch('/process-sketchbook', { method: 'POST', body: formData });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "InstantFrames.zip";
            a.click();
            status.innerHTML = '<span style="color: #27ae60;">ZIP downloaded!</span>';
        } else {
            status.innerText = "Error processing video.";
        }
    } catch (err) {
        status.innerText = "Connection error.";
    } finally {
        btn.disabled = false;
    }
}
