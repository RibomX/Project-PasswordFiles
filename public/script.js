function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    sb.classList.toggle('active');
    ov.classList.toggle('active');
}
// --- 1. FUNKCIA PRE UPLOAD SÚBORU ---
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

    // Reset a zobrazenie progresu (čistý bar bez percent)
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

            // Zmiznutie po 1 sekunde a premazanie políčok
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

// --- 2. FUNKCIA PRE KONTROLU HESLA ---
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

// --- 3. LOGIKA PRE LOADING SCREEN (Simulácia + Animácia vysunutia) ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainContent = document.getElementById('mainContent');
   
    let progress = 0;
   
    // Simulácia plnenia baru pri štarte stránky
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
       
        if (progress > 100) progress = 100;
       
        if (loadFill) {
            loadFill.style.width = progress + '%';
        }
       
        if (progress === 100) {
            clearInterval(loadingInterval);
           
            // Fáza 1: Loader zmizne
            setTimeout(() => {
                loader.classList.add('loader-hidden');
            }, 400);

            // Fáza 2: Box sa vysunie zdola
            setTimeout(() => {
                if (mainContent) {
                    mainContent.classList.add('content-visible');
                }
            }, 800);
        }
    }, 120);
});
function switchTab(tab) {
    const content = document.getElementById('dynamic-content');
    const btnTransfer = document.getElementById('btn-transfer');
    const btnSketch = document.getElementById('btn-sketch');

    if (tab === 'sketch') {
        btnTransfer.classList.remove('active');
        btnSketch.classList.add('active');

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; width: 100%;">
                <h1 class="brand-name" style="margin-bottom: 20px;">Video to Sketch</h1>
                <div class="container animate-up" style="background: white; padding: 40px; border-radius: 30px; box-shadow: 0 15px 50px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 450px; margin: 0 auto;">
                    <section class="upload-section">
                        <p style="color: #888; font-size: 0.9rem; margin-bottom: 25px;">Max 30s | Max 100MB</p>
                        <div style="border: 2px dashed #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                            <input type="file" id="videoInput" accept="video/*" style="width: 100%;">
                        </div>
                        <button onclick="processSketchbook()" id="workBtn" class="upload-btn" style="width: 100%; cursor: pointer; border: none; padding: 15px; border-radius: 10px; font-weight: bold; background: #3498db; color: white;">
                            GENERATE ZIP
                        </button>
                        <div id="sketchStatus" style="margin-top: 20px; font-weight: bold; color: #3498db;"></div>
                    </section>
                    <div class="footer-info" style="margin-top: 25px; font-size: 0.8rem; opacity: 0.6;">
                        Auto-delete after 1 minute
                    </div>
                </div>
            </div>
        `;
    } else {
        location.reload();
    }
    
    if (typeof toggleSidebar === "function") {
        toggleSidebar();
    }
}

async function processSketchbook() {
    const videoInput = document.getElementById('videoInput');
    const status = document.getElementById('sketchStatus');
    
    if (!videoInput.files[0]) {
        alert("Please select a video first!");
        return;
    }
    
    status.innerText = "Processing video... please wait.";
}
