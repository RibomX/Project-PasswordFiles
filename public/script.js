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
        progress += Math.random() * 25;
        if (progress > 100) progress = 100;
        loadFill.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // TRIGGERS THE BOTTOM-UP ANIMATION
                    mainBox.classList.add('show');
                }, 500);
            }, 400);
        }
    }, 150);
});

// Zvyšok funkcií uploadFile a checkPassword s anglickými hláseniami...
