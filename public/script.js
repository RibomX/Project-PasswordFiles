// Dark Mode Toggle
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.innerText = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const status = document.getElementById('uploadStatus');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');

    if (!fileInput.files[0] || !password) {
        status.innerText = "Please select a file and enter a password.";
        return;
    }

    // VALIDATION: Max 10MB
    const maxSize = 10 * 1024 * 1024; 
    if (fileInput.files[0].size > maxSize) {
        status.innerText = "Error: File size exceeds the 10MB limit.";
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', password);

    progressContainer.style.display = 'block';
    status.innerText = "Uploading...";

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // PROGRESS BAR LOGIC
    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percentComplete + '%';
            progressBar.innerText = percentComplete + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            status.innerHTML = `File uploaded successfully! <br> 
                                <button id="copyBtn" onclick="copyToClipboard('${password}')">Copy Password</button>`;
            
            // PO 3 SEKUNDÁCH TO VYČISTÍME
            setTimeout(() => {
                status.innerText = "";
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
                progressBar.innerText = '0%';
                fileInput.value = ""; // Vymaže vybraný súbor
                passwordInput.value = ""; // Vymaže zadané heslo
            }, 3000);

        } else {
            status.innerText = "Error during upload. Please try again.";
            setTimeout(() => { status.innerText = ""; progressContainer.style.display = 'none'; }, 3000);
        }
    };

    xhr.send(formData);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    // Zmeníme text na tlačidle, aby si mal spätnú väzbu
    const btn = document.getElementById('copyBtn');
    if(btn) btn.innerText = "Copied!";
}

async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    const response = await fetch('/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });

    const data = await response.json();
    if (data.found) {
        status.innerHTML = `File found: <a href="${data.url}" target="_blank">Download ${data.name}</a>`;
    } else {
        status.innerText = "Invalid password or file expired.";
    }
}
