// SIDEBAR LOGIC
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// LOADING & REVEAL LOGIC
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        loadFill.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loader-hidden'); // Hide loader
                setTimeout(() => {
                    mainContent.classList.add('content-visible'); // Slide up content
                }, 400);
            }, 500);
        }
    }, 150);
});

// UPLOAD LOGIC
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const status = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) return alert("Please select a file!");

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    progressContainer.style.display = 'block';
    status.innerText = 'Uploading...';

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        if (response.ok) {
            progressBar.style.width = '100%';
            status.innerHTML = '<span style="color:green">Success!</span>';
        } else {
            status.innerText = 'Upload failed.';
        }
    } catch (err) {
        status.innerText = 'Server error.';
    }
}

// DOWNLOAD LOGIC
async function checkPassword() {
    const password = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');

    if (!password) return alert("Enter password!");

    status.innerText = 'Checking...';
    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(password));
        const data = await response.json();

        if (data.found) {
            status.innerHTML = `<a href="${data.url}" target="_blank">Download: ${data.name}</a>`;
        } else {
            status.innerText = 'Wrong password.';
        }
    } catch (err) {
        status.innerText = 'Error connecting.';
    }
}
