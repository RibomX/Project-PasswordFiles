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

// --- 4. SWITCH TABS (TOTÁLNE BEZ BIELYCH MIEST) ---
function switchTab(tab) {
    const content = document.getElementById('dynamic-content');
    const btnTransfer = document.getElementById('btn-transfer');
    const btnSketch = document.getElementById('btn-sketch');
    const btnResizer = document.getElementById('btn-resizer');
    const btnLasso = document.getElementById('btn-lasso');

    [btnTransfer, btnSketch, btnResizer, btnLasso].forEach(btn => btn?.classList.remove('active'));

    // Fix: height: fit-content a min-height: auto zabezpečia, že biela končí hneď za tlačidlom
    const cardBaseStyle = "background: white !important; padding: 25px !important; border-radius: 25px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important; text-align: center !important; display: inline-flex !important; flex-direction: column !important; min-width: 320px !important; max-width: 95% !important; height: fit-content !important; min-height: auto !important;";
    
    const wrapperStyle = "display: flex; flex-direction: column; align-items: center; padding-top: 20px; width: 100%; height: auto;";

    if (tab === 'resizer') {
        if (btnResizer) btnResizer.classList.add('active');
        document.body.classList.add('hide-brand');

        content.innerHTML = `
            <div style="${wrapperStyle}">
                <h1 style="margin-bottom: 15px; font-size: 3rem; font-weight: 900; color: #e67e22;">Image Resizer</h1>
                <div class="container animate-up" style="${cardBaseStyle}">
                    <p style="color: #888; font-size: 0.8rem; margin: 0;">Target width (px):</p>
                    <input type="number" id="targetWidth" value="1080" style="width: 200px; margin: 5px auto 10px auto; padding: 12px; border-radius: 12px; border: 1px solid #eee; text-align: center; font-weight: 900; font-size: 1.2rem; color: #e67e22; outline: none;">
                    <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; margin-bottom: 10px; width: fit-content; align-self: center;">
                        <input type="file" id="imageInput" accept="image/*" style="width: auto;">
                    </div>
                    <button onclick="processResize()" id="resBtn" style="background: #e67e22; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 900; cursor: pointer; align-self: center;">RESIZE IMAGE</button>
                    <div id="resStatus" style="color: #e67e22; margin-top: 10px;"></div>
                </div>
            </div>`;
    } 
    else if (tab === 'sketch') {
        if (btnSketch) btnSketch.classList.add('active');
        document.body.classList.add('hide-brand');

        content.innerHTML = `
            <div style="${wrapperStyle}">
                <h1 style="margin-bottom: 15px; font-size: 3rem; font-weight: 900; color: #9b59b6;">InstantFrames</h1>
                <div class="container animate-up" style="${cardBaseStyle}">
                    <p style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">Video to JPG Frames | Max 30s</p>
                    <div style="border: 2px dashed #eee; padding: 10px; border-radius: 15px; background: #fafafa; margin-bottom: 15px; width: fit-content; align-self: center;">
                        <input type="file" id="videoInput" accept="video/*" style="width: auto;">
                    </div>
                    <button onclick="processInstantFrames()" id="workBtn" style="background: #9b59b6; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 900; cursor: pointer; align-self: center;">GENERATE ZIP</button>
                    <div id="sketchStatus" style="color: #9b59b6; margin-top: 10px;"></div>
                </div>
            </div>`;
    } 
    else if (tab === 'lasso') {
        if (btnLasso) btnLasso.classList.add('active');
        document.body.classList.add('hide-brand');

        content.innerHTML = `
            <div style="${wrapperStyle}">
                <h1 style="margin-bottom: 15px; font-size: 3rem; font-weight: 900; color: #2ecc71;">Lasso Tool</h1>
                <div id="lasso-step-1" class="container animate-up" style="${cardBaseStyle}">
                    <p style="color: #888; margin-bottom: 15px;">Select image and outline object.</p>
                    <div style="border: 2px dashed #2ecc71; padding: 20px; border-radius: 15px; background: #fafafa; margin-bottom: 20px; width: fit-content; align-self: center;">
                        <input type="file" id="lassoInput" accept="image/*" style="width: auto;">
                    </div>
                    <button onclick="startLassoEditor()" style="background: #2ecc71; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 900; cursor: pointer; align-self: center;">START LASO TOOL</button>
                </div>
                <div id="lasso-step-2" style="display: none; background: white; padding: 25px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; display: inline-flex; flex-direction: column; width: fit-content; height: fit-content; margin-top: 10px;">
                    <div id="lassoCanvasContainer" style="position: relative; display: inline-block; cursor: crosshair; background: #f0f0f0; border-radius: 10px; overflow: hidden; border: 1px solid #ddd; line-height: 0;">
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
        document.body.classList.remove('hide-brand');
        location.reload();
    }
    if (typeof toggleSidebar === "function") toggleSidebar();
}

// --- 5. & 6. ZVYŠOK LOGIKY ---
async function processResize() {
    const input = document.getElementById('imageInput');
    const widthInput = document.getElementById('targetWidth');
    const status = document.getElementById('resStatus');
    const btn = document.getElementById('resBtn');
    if (!input.files[0]) return alert("Please select an image!");
    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('width', widthInput.value);
    status.innerText = "Processing...";
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
            status.innerHTML = '<span style="color: #27ae60;">Done!</span>';
        }
    } catch (err) { status.innerText = "Error."; } finally { btn.disabled = false; }
}

async function processInstantFrames() {
    const videoInput = document.getElementById('videoInput');
    const status = document.getElementById('sketchStatus');
    const btn = document.getElementById('workBtn');
    if (!videoInput.files[0]) return alert("Please select a video!");
    const formData = new FormData();
    formData.append('video', videoInput.files[0]);
    status.innerText = "Processing...";
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
            status.innerHTML = '<span style="color: #27ae60;">Done!</span>';
        }
    } catch (err) { status.innerText = "Error."; } finally { btn.disabled = false; }
}

let lassoPoints = [];
let isLassoDrawing = false;
let lassoCanvas, lassoCtx, lassoImg;

function startLassoEditor() {
    const input = document.getElementById('lassoInput');
    if (!input || !input.files[0]) return alert("Please select an image first!");
    const reader = new FileReader();
    reader.onload = function(e) {
        lassoImg = new Image();
        lassoImg.onload = function() {
            document.getElementById('lasso-step-1').style.display = 'none';
            const step2 = document.getElementById('lasso-step-2');
            step2.style.display = 'inline-flex';
            lassoCanvas = document.getElementById('lassoCanvas');
            lassoCtx = lassoCanvas.getContext('2d');
            const maxW = window.innerWidth * 0.8;
            const maxH = 400; 
            let scale = Math.min(maxW / lassoImg.width, maxH / lassoImg.height);
            if (scale > 1) scale = 1;
            lassoCanvas.width = lassoImg.width * scale;
            lassoCanvas.height = lassoImg.height * scale;
            drawLassoState();
            lassoCanvas.onmousedown = (e) => {
                if (e.button === 0) {
                    isLassoDrawing = true;
                    lassoPoints = [];
                    addLassoPoint(e);
                }
            };
            window.onmousemove = (e) => { if (isLassoDrawing) addLassoPoint(e); };
            window.onmouseup = () => { isLassoDrawing = false; };
        };
        lassoImg.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
}

function addLassoPoint(e) {
    if (!lassoCanvas) return;
    const rect = lassoCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (lassoImg.width / lassoCanvas.width);
    const y = (e.clientY - rect.top) * (lassoImg.height / lassoCanvas.height);
    lassoPoints.push([Math.round(x), Math.round(y)]);
    drawLassoState();
}

function drawLassoState() {
    if (!lassoCtx) return;
    lassoCtx.clearRect(0, 0, lassoCanvas.width, lassoCanvas.height);
    lassoCtx.drawImage(lassoImg, 0, 0, lassoCanvas.width, lassoCanvas.height);
    if (lassoPoints.length > 1) {
        lassoCtx.beginPath();
        lassoCtx.setLineDash([5, 5]);
        lassoCtx.strokeStyle = "#2ecc71";
        lassoCtx.lineWidth = 2;
        const scale = lassoCanvas.width / lassoImg.width;
        lassoCtx.moveTo(lassoPoints[0][0] * scale, lassoPoints[0][1] * scale);
        for (let i = 1; i < lassoPoints.length; i++) {
            lassoCtx.lineTo(lassoPoints[i][0] * scale, lassoPoints[i][1] * scale);
        }
        lassoCtx.stroke();
    }
}

function resetLasso() {
    lassoPoints = [];
    drawLassoState();
}

async function processLasso() {
    if (lassoPoints.length < 3) return alert("Please draw a shape first!");
    const genBtn = document.getElementById('lassoGenBtn');
    genBtn.disabled = true;
    genBtn.innerText = "PROCESSING...";
    const input = document.getElementById('lassoInput');
    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('points', JSON.stringify(lassoPoints));
    try {
        const response = await fetch('/lasso-clipping', { method: 'POST', body: formData });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "cutout.png";
            a.click();
            switchTab('lasso');
        } else { alert("Server error."); }
    } catch (e) { alert("Connection error."); } finally {
        genBtn.disabled = false;
        genBtn.innerText = "GENERATE PICTURE";
    }
}
