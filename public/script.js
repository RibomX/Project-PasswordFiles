// --- FUNKCIA PRE MENU ---
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// --- LOADING SCREEN & ANIMÁCIA PO ŠTARTE ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 100) progress = 100;
        loadFill.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loader-hidden');
                setTimeout(() => {
                    mainContent.classList.add('content-visible');
                }, 400);
            }, 500);
        }
    }, 150);
});

// --- LOGIKA UPLOADU ---
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) return alert("Vyber súbor!");

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    status.innerText = 'Nahrávam...';

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        if (response.ok) {
            progressBar.style.width = '100%';
            status.innerHTML = '<span style="color:green">Hotovo!</span>';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                status.innerText = '';
            }, 2000);
        } else {
            status.innerText = 'Chyba pri nahrávaní.';
        }
    } catch (err) {
        status.innerText = 'Chyba servera.';
    }
}

// --- LOGIKA DOWNLOADU ---
async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    if (!password) return alert("Zadaj heslo!");

    status.innerText = 'Overujem...';
    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        const data = await response.json();

        if (data.found) {
            status.innerHTML = `<a href="${data.url}" target="_blank">Stiahnuť súbor: ${data.name}</a>`;
        } else {
            status.innerText = 'Nesprávne heslo.';
        }
    } catch (err) {
        status.innerText = 'Chyba pripojenia.';
    }
}
