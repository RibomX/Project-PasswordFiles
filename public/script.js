function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

// LOGIKA LOUDOVANIA
window.addEventListener('load', () => {
    const progress = document.querySelector('.loader-progress');
    const loader = document.getElementById('loader-wrapper');
    const content = document.getElementById('pageContent');
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 30;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    content.classList.add('visible'); // Spustí animáciu príchodu stránky
                }, 500);
            }, 300);
        }
        progress.style.width = width + '%';
    }, 150);
});

// Update file name text
document.getElementById('fileInput').addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : "No file chosen";
    document.getElementById('fileName').innerText = fileName;
});
