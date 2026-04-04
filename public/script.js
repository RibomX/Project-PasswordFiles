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
