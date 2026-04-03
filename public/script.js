async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) {
        alert("Vyber súbor!");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    // Zobraziť progress bar
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressBar.innerText = '0%';
    status.innerText = 'Uploading...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            progressBar.style.width = '100%';
            progressBar.innerText = '100%';
            status.innerHTML = '<span style="color: #27ae60;">File uploaded successfully!</span>';

            // Počkáme 1 sekundu a schováme progress bar
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        } else {
            const errData = await response.json();
            status.innerText = 'Upload failed: ' + (errData.error || 'Server error');
            progressContainer.style.display = 'none';
        }
    } catch (err) {
        status.innerText = 'Error: ' + err.message;
        progressContainer.style.display = 'none';
    }
}

async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    if (!password) {
        alert("Zadaj heslo!");
        return;
    }

    try {
        // Encode hesla je kľúčové, ak používaš špeciálne znaky
        const response = await fetch(`/check-password?password=${encodeURIComponent(password)}`);
        
        if (!response.ok) {
            throw new Error('Server responded with error');
        }

        const data = await response.json();

        if (data.found) {
            // Správne zobrazenie odkazu na stiahnutie ako vo videu
            status.innerHTML = `File found: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold; text-decoration: underline;">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password or file expired.';
        }
    } catch (err) {
        console.error(err);
        status.innerText = 'Error checking password. Is server running?';
    }
}
