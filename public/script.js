// ... (začiatok uploadFile a checkPassword zostáva rovnaký, pridávame len na koniec)

async function uploadFile() {
    // ... tvoj pôvodný kód ...
}

async function checkPassword() {
    // ... tvoj pôvodný kód ...
}


// !!! --- NOVO PRIDANÁ LOGIKA PRE LOADING SCREEN & VYSUNUTIE OBSAHU --- !!!

// Počkáme, kým sa načíta celá stránka (obrázky, štýly)
window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const loadFill = document.querySelector('.load-bar-fill');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    
    // !!! SIMULÁCIA PLNENIA BARU (cca 1.5 sekundy) !!!
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 20; // Náhodné plnenie, aby to vyzeralo reálne
        
        if (progress > 100) progress = 100;
        
        loadFill.style.width = progress + '%';
        
        // Keď je bar plný (100%)
        if (progress === 100) {
            clearInterval(loadingInterval); // Zastavíme simuláciu
            
            // !!! FÁZA 1: Schováme Loader plynule !!!
            setTimeout(() => {
                loader.classList.add('loader-hidden'); // Loader zmizne (fade out)
            }, 500); // Krátka pauza, kým si používateľ užije 100%

            // !!! FÁZA 2: VYTIAHNEME OBSAH ZDOLA !!!
            setTimeout(() => {
                mainContent.classList.add('content-visible'); // Vytiahne box hore a ukáže ho (smooth vysunutie)
            }, 1000); // Spustí sa 1 sekundu po tom, čo loader začne miznúť
        }
    }, 150); // Rýchlosť simulácie
});
