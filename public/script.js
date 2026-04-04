function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// LOADING LOGIC
window.addEventListener('load', () => {
    const fill = document.getElementById('loader-fill');
    const loader = document.getElementById('loader-wrapper');
    const mainBox = document.getElementById('mainBox');
    
    let prog = 0;
    const inv = setInterval(() => {
        prog += Math.random() * 20;
        if (prog >= 100) {
            prog = 100;
            clearInterval(inv);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    mainBox.classList.add('show'); // START BOX ANIMATION
                }, 600);
            }, 400);
        }
        fill.style.width = prog + '%';
    }, 120);
});

// FILE SELECTION
document.getElementById('fileInput').addEventListener('change', function() {
    const name = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById('fileNameDisplay').innerText = name;
});

// FIXED UPLOAD LOGIC
async function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    const pass = document.getElementById('passwordInput').value;
    const status = document.getElementById('uploadStatus');
    const bar = document.getElementById('progressBar');

    if (!file) return alert("Select a file first!");

    const fd = new FormData();
    fd.append('file', file);
    fd.append('password', pass);

    document.getElementById('progressContainer').style.display = 'block';
    status.innerText = "Uploading...";

    try {
        const res = await fetch('/upload', { method: 'POST', body: fd });
        if (res.ok) {
            bar.style.width = '100%';
            status.innerHTML = '<b style="color:green">File Secured!</b>';
        } else {
            status.innerText = "Upload failed.";
        }
    } catch (e) {
        status.innerText = "Server Error.";
    }
}

async function checkPassword() {
    const pass = document.getElementById('downloadPassword').value;
    const status = document.getElementById('downloadStatus');
    if (!pass) return alert("Enter password!");

    try {
        const res = await fetch('/check-password?password=' + encodeURIComponent(pass));
        const data = await res.json();
        if (data.found) {
            status.innerHTML = `<a href="${data.url}" target="_blank" style="color:#3498db; font-weight:900; text-decoration:none;">DOWNLOAD: ${data.name}</a>`;
        } else {
            status.innerText = "Wrong password.";
        }
    } catch (e) {
        status.innerText = "Error.";
    }
}
