
function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    sb.classList.toggle('active');
    ov.classList.toggle('active');
}

// --- 1. UPLOAD FILE ---
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
        const response = await fetch('/upload', { method: 'POST', body: formData });
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
            status.innerText = 'Upload failed.';
            progressContainer.style.display = 'none';
        }
    } catch (err) {
        status.innerText = 'Server error.';
        progressContainer.style.display = 'none';
    }
}

// --- 2. CHECK PASSWORD ---
async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');
    if (!password) return alert("Enter password!");
    status.innerText = 'Checking...';
    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        const data = await response.json();
        if (data.found) {
            status.innerHTML = `Found: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold;">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password or expired.';
        }
    } catch (err) {
        status.innerText = 'Error connecting.';
    }
}

// --- 3. LOADING SCREEN ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        if (loadFill) loadFill.style.width = progress + '%';
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => loader.classList.add('loader-hidden'), 400);
        }
    }, 120);
});

// --- 4. SWITCH TABS (SCELNUTE BIELE POLICKA) ---
function switchTab(tab) {
    const content = document.getElementById('dynamic-content');
    const btns = [document.getElementById('btn-transfer'), document.getElementById('btn-sketch'), document.getElementById('btn-resizer'), document.getElementById('btn-lasso')];
    btns.forEach(btn => btn?.classList.remove('active'));

    // KLÚČOVÁ ZMENA: display: table zabezpečí, že sa box "stiahne" na šírku obsahu
    const cardBaseStyle = "background: white !important; padding: 25px !important; border-radius: 25px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important; text-align: center !important; display: table !important; margin: 0 auto !important; min-width: 320px !important; max-width: 90% !important; height: auto !important;";

    if (tab === 'resizer') {
        document.getElementById('btn-resizer')?.classList.add('active');
        document.body.classList.add('hide-brand');
        content.innerHTML = `
            <div style="padding-top: 20px; width: 100%;">
                <h1 style="margin-bottom: 15px; font-size: 3rem; text-align: center; font-weight: 900; color: #e67e22;">Image Resizer</h1>
                <div style="${cardBaseStyle}">
                    <p style="color: #888; font-size: 0.8rem; margin: 0 0 5px 0;">Target width (px):</p>
                    <input type="number" id="targetWidth" value="1080" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #eee; text-align: center; font-weight: 900; font-size: 1.2rem; color: #e67e22; outline: none; margin-bottom: 10px;">
                    <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; margin-bottom: 10px;">
                        <input type="file" id="imageInput" accept="image/*">
                    </div>
                    <button onclick="processResize()" id="resBtn" style="width: 100%; background: #e67e22; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer;">RESIZE IMAGE</button>
                    <div id="resStatus" style="margin-top: 10px; color: #e67e22;"></div>
                </div>
            </div>`;
    } 
    else if (tab === 'sketch') {
        document.getElementById('btn-sketch')?.classList.add('active');
        document.body.classList.add('hide-brand');
        content.innerHTML = `
            <div style="padding-top: 20px; width: 100%;">
                <h1 style="margin-bottom: 15px; font-size: 3rem; text-align: center; font-weight: 900; color: #9b59b6;">InstantFrames</h1>
                <div style="${cardBaseStyle}">
                    <p style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">Video to JPG Frames | Max 30s</p>
                    <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; margin-bottom: 10px;">
                        <input type="file" id="videoInput" accept="video/*">
                    </div>
                    <button onclick="processInstantFrames()" id="workBtn" style="width: 100%; background: #9b59b6; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer;">GENERATE ZIP</button>
                    <div id="sketchStatus" style="margin-top: 10px; color: #9b59b6;"></div>
                </div>
            </div>`;
    } 
    else if (tab === 'lasso') {
        document.getElementById('btn-lasso')?.classList.add('active');
        document.body.classList.add('hide-brand');
        content.innerHTML = `
            <div style="padding-top: 20px; width: 100%;">
                <h1 style="margin-bottom: 15px; font-size: 3rem; text-align: center; font-weight: 900; color: #2ecc71;">Lasso Tool</h1>
                <div id="lasso-step-1" style="${cardBaseStyle}">
                    <p style="color: #888; margin-bottom: 15px;">Select image and outline object.</p>
                    <div style="border: 2px dashed #2ecc71; padding: 20px; border-radius: 15px; background: #fafafa; margin-bottom: 20px;">
                        <input type="file" id="lassoInput" accept="image/*">
                    </div>
                    <button onclick="startLassoEditor()" style="width: 100%; background: #2ecc71; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 900; cursor: pointer;">START LASSO TOOL</button>
                </div>
                <div id="lasso-step-2" style="display: none; ${cardBaseStyle}">
                    <div id="lassoCanvasContainer" style="position: relative; cursor: crosshair; background: #f0f0f0; border-radius: 10px; overflow: hidden; line-height: 0;">
                        <canvas id="lassoCanvas"></canvas>
                    </div>
                    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                        <button id="lassoGenBtn" onclick="processLasso()" style="background: #2ecc71; color: white; border: none; padding: 12px 25px; border-radius: 10px; font-weight: 900; cursor: pointer;">GENERATE</button>
                        <button onclick="resetLasso()" style="background: #95a5a6; color: white; border: none; padding: 12px 25px; border-radius: 10px; cursor: pointer;">RESET</button>
                    </div>
                </div>
            </div>`;
    }
    else {
        location.reload();
    }
    if (typeof toggleSidebar === "function") toggleSidebar();
}

// --- 5. PROCESSING ---
async function processResize() {
    const input = document.getElementById('imageInput');
    const width = document.getElementById('targetWidth').value;
    const status = document.getElementById('resStatus');
    if (!input.files[0]) return alert("Select image!");
    status.innerText = "Processing...";
    const fd = new FormData(); fd.append('image', input.files[0]); fd.append('width', width);
    try {
        const res = await fetch('/resize-image', { method: 'POST', body: fd });
        if (res.ok) {
            const blob = await res.blob();
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "resized.jpg"; a.click();
            status.innerHTML = "Done!";
        }
    } catch(e) { status.innerText = "Error."; }
}

async function processInstantFrames() {
    const input = document.getElementById('videoInput');
    const status = document.getElementById('sketchStatus');
    if (!input.files[0]) return alert("Select video!");
    status.innerText = "Processing...";
    const fd = new FormData(); fd.append('video', input.files[0]);
    try {
        const res = await fetch('/process-sketchbook', { method: 'POST', body: fd });
        if (res.ok) {
            const blob = await res.blob();
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = "frames.zip"; a.click();
            status.innerHTML = "Done!";
        }
    } catch(e) { status.innerText = "Error."; }
}

// --- 6. LASSO LOGIC ---
let lassoPoints = [], isLassoDrawing = false, lassoCanvas, lassoCtx, lassoImg;

function startLassoEditor() {
    const input = document.getElementById('lassoInput');
    if (!input.files[0]) return alert("Select image!");
    const reader = new FileReader();
    reader.onload = (e) => {
        lassoImg = new Image();
        lassoImg.onload = () => {
            document.getElementById('lasso-step-1').style.display = 'none';
            const s2 = document.getElementById('lasso-step-2');
            s2.style.display = 'table'; 
            lassoCanvas = document.getElementById('lassoCanvas');
            lassoCtx = lassoCanvas.getContext('2d');
            const scale = Math.min((window.innerWidth * 0.9) / lassoImg.width, 450 / lassoImg.height, 1);
            lassoCanvas.width = lassoImg.width * scale;
            lassoCanvas.height = lassoImg.height * scale;
            drawLasso();
            lassoCanvas.onmousedown = (ev) => { isLassoDrawing = true; lassoPoints = []; addPt(ev); };
            window.onmousemove = (ev) => { if (isLassoDrawing) addPt(ev); };
            window.onmouseup = () => { isLassoDrawing = false; };
        };
        lassoImg.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
}

function addPt(e) {
    const r = lassoCanvas.getBoundingClientRect();
    lassoPoints.push([Math.round(e.clientX - r.left), Math.round(e.clientY - r.top)]);
    drawLasso();
}

function drawLasso() {
    lassoCtx.drawImage(lassoImg, 0, 0, lassoCanvas.width, lassoCanvas.height);
    if (lassoPoints.length > 1) {
        lassoCtx.beginPath(); lassoCtx.strokeStyle = "#2ecc71"; lassoCtx.lineWidth = 3;
        lassoCtx.moveTo(lassoPoints[0][0], lassoPoints[0][1]);
        lassoPoints.forEach(p => lassoCtx.lineTo(p[0], p[1]));
        lassoCtx.stroke();
    }
}

function resetLasso() { lassoPoints = []; drawLasso(); }

async function processLasso() {
    if (lassoPoints.length < 3) return;
    const fd = new FormData(); fd.append('image', document.getElementById('lassoInput').files[0]);
    const scale = lassoImg.width / lassoCanvas.width;
    fd.append('points', JSON.stringify(lassoPoints.map(p => [p[0]*scale, p[1]*scale])));
    const res = await fetch('/lasso-clipping', { method: 'POST', body: fd });
    if (res.ok) {
        const b = await res.blob();
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = "cutout.png"; a.click();
    }
}
