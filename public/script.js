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
    status.innerText = 'Uploading...';

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        if (response.ok) {
            progressBar.style.width = '100%';
            progressBar.innerText = '100%';
            status.innerHTML = '<span style="color: #27ae60;">File uploaded successfully!</span>';

            // PO SEKUNDE VŠETKO ZMIZNE
            setTimeout(() => {
                progressContainer.style.display = 'none';
                status.innerText = '';
                passwordInput.value = ''; // Vymaže heslo
                fileInput.value = '';    // Vymaže súbor
            }, 1000);
        } else {
            status.innerText = 'Upload failed.';
        }
    } catch (err) {
        status.innerText = 'Error connecting to server.';
    }
}

async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        const data = await response.json();
        if (data.found) {
            status.innerHTML = `Found: <a href="${data.url}" target="_blank">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password.';
        }
    } catch (err) {
        status.innerText = 'Error checking password.';
    }
}
