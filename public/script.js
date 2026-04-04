// --- 1. FUNKCIA PRE OTVÁRANIE/ZATVÁRANIE LIŠTY ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// --- 2. TVOJA PÔVODNÁ FUNKCIA NA UPLOAD SÚBORU ---
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) {
        alert("Prosím, vyber súbor!");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    // Zobrazenie progresu
    if (progressContainer) progressContainer.style.display = 'block';
    if (progressBar) progressBar.style.width = '0%';
    status.innerText = 'Nahrávam...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            if (progressBar) progressBar.style.width = '100%';
            status.innerHTML = '<span style="color: #27ae60; font-weight: bold;">Súbor úspešne nahraný!</span>';
            
            // Reset políčok po úspechu
            setTimeout(() => {
                if (progressContainer) progressContainer.style.display = 'none';
                status.innerText = '';
                passwordInput.value = '';
                fileInput.value = '';
            }, 2000);
        } else {
            status.innerText = 'Nahrávanie zlyhalo. Skús iné heslo alebo menší súbor.';
        }
    } catch (err) {
        console.error(err);
        status.innerText = 'Chyba servera pri nahrávaní.';
    }
}

// --- 3. TVOJA PÔVODNÁ FUNKCIA NA KONTROLU HESLA (DOWNLOAD) ---
async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    if (!password) {
        alert("Zadaj heslo pre stiahnutie!");
        return;
    }

    status.innerText = 'Overujem heslo...';

    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        if (!response.ok) throw new Error('Chyba servera');

        const data = await response.json();

        if (data.found) {
            status.innerHTML = `Nájdené: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold;">Stiahnuť ${data.name}</a>`;
        } else {
            status.innerText = 'Nesprávne heslo alebo súbor už expiroval.';
        }
    } catch (err) {
        status.innerText = 'Chyba pri pripájaní k databáze.';
    }
}
