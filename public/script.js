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
    const brandName = document.querySelector('.brand-name');

    if (tab === 'sketch') {
        btnTransfer.classList.remove('active');
        btnSketch.classList.add('active');
        
        if (brandName) brandName.style.display = 'none';

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; padding-top: 30px; width: 100%;">
                
                <h1 class="brand-name" style="margin-bottom: 15px; font-size: 3.2rem; text-align: center;">Video to Sketch</h1>

                <div class="container animate-up" style="background: white; padding: 20px 30px; border-radius: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; width: 90%; max-width: 360px; min-height: auto !important; height: auto !important;">
                    <section class="upload-section" style="margin: 0;">
                        <p style="color: #888; font-size: 0.8rem; margin-bottom: 15px;">Max 30s | Max 100MB</p>
                        
                        <div style="border: 2px dashed #eee; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
                            <input type="file" id="videoInput" accept="video/*" style="width: 100%; font-size: 0.8rem; cursor: pointer;">
                        </div>

                        <button onclick="processSketchbook()" id="workBtn" class="upload-btn" style="width: 100%; cursor: pointer; border: none; padding: 12px; border-radius: 10px; font-weight: 900; background: #3498db; color: white; font-size: 0.95rem; text-transform: uppercase;">
                            GENERATE ZIP
                        </button>
                        
                        <div id="sketchStatus" style="margin-top: 12px; font-size: 0.85rem; font-weight: bold; color: #3498db;"></div>
                    </section>

                    <div class="footer-info" style="margin-top: 15px; font-size: 0.7rem; opacity: 0.5; padding-bottom: 5px;">
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
