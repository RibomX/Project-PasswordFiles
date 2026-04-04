function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainBox = document.getElementById('mainBox');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        loadFill.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // TOTO SPUSTÍ TU ANIMÁCIU ZDOLA
                    mainBox.classList.add('show');
                }, 500);
            }, 400);
        }
    }, 120);
});

// Pôvodné funkcie uploadFile a checkPassword s anglickými textami...
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('uploadStatus');
    if (!fileInput.files[0]) return alert("Select a file!");
    status.innerText = "Uploading...";
    // ... zvyšok tvojej logiky
}
