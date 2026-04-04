function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// EXACT LOADING LOGIC FROM VIDEO
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
                    // SPUSTÍ ANIMÁCIU LEN PRE BOX
                    mainBox.classList.add('show');
                }, 600);
            }, 400);
        }
        fill.style.width = prog + '%';
    }, 120);
});

// FILE UI
document.getElementById('fileInput').addEventListener('change', function() {
    document.getElementById('fileName').innerText = this.files[0] ? this.files[0].name : "No file chosen";
});

// UPLOAD
async function uploadFile() {
    const file = document.getElementById('fileInput').files[0];
    const pass = document.getElementById('passwordInput').value;
    if (!file) return alert("Please select a file!");

    const fd = new FormData();
    fd.append('file', file);
    fd.append('password', pass);

    document.getElementById('progressContainer').style.display = 'block';
    try {
        const res = await fetch('/upload', { method: 'POST', body: fd });
        if (res.ok) {
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('uploadStatus').innerHTML = '<b style="color:green">Uploaded!</b>';
        }
    } catch (e) { console.error(e); }
}

// DOWNLOAD
async function checkPassword() {
    const pass = document.getElementById('downloadPassword').value;
    const res = await fetch('/check-password?password=' + encodeURIComponent(pass));
    const data = await res.json();
    if (data.found) {
        document.getElementById('downloadStatus').innerHTML = `<a href="${data.url}" target="_blank">Download File</a>`;
    } else {
        alert("Wrong password!");
    }
}
