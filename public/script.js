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

    // Reset a zobrazenie baru
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
            // Nastavíme na 100%
            progressBar.style.width = '100%';
            progressBar.innerText = '100%';
            status.innerHTML = '<span style="color: #27ae60;">File uploaded successfully!</span>';

            // POČKÁME 1 SEKUNDU A SCHOVÁME BAR
            setTimeout(() => {
                progressContainer.style.display = 'none';
                // Voliteľne: status.innerText = ''; // Ak chceš zmazať aj nápis "successfully"
            }, 1000);

        } else {
            status.innerText = 'Upload failed.';
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
        const response = await fetch(`/check-password?password=${password}`);
        const data = await response.json();

        if (data.found) {
            status.innerHTML = `File found: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold;">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password or file expired.';
        }
    } catch (err) {
        status.innerText = 'Error checking password.';
    }
}
