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

            // POČKÁME 1 SEKUNDU A VYČISTÍME TO
            setTimeout(() => {
                progressContainer.style.display = 'none'; // Schová bar
                status.innerText = '';                    // Zmaže text "successfully"
                passwordInput.value = '';                 // Zmaže heslo z políčka
                fileInput.value = '';                     // Resetuje výber súboru
            }, 1000);
        } else {
            status.innerText = 'Upload failed.';
            progressContainer.style.display = 'none';
        }
    } catch (err) {
        status.innerText = 'Error connecting to server.';
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

    status.innerText = 'Checking...';

    try {
        // EncodeURIComponent chráni pred chybou v adrese
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        
        if (!response.ok) {
            throw new Error('Network error');
        }

        const data = await response.json();

        if (data.found) {
            status.innerHTML = `File found: <a href="${data.url}" target="_blank" style="color: #3498db; font-weight: bold;">Download ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password or file expired.';
        }
    } catch (err) {
        console.error(err);
        status.innerText = 'Error checking password. Is server running?';
    }
}
