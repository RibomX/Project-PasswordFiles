/**
 * SIDEBAR NAVIGATION CONTROL
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
}

/**
 * LOADING SYSTEM & BOX ENTRANCE ANIMATION
 */
window.addEventListener('load', function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const progressBarFill = document.querySelector('.load-bar-fill');
    const mainBox = document.getElementById('mainBox');
    
    let currentProgress = 0;
    
    // Simulate loading progress
    const loadingInterval = setInterval(function() {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(loadingInterval);
            
            // Finish loading
            setTimeout(function() {
                loaderWrapper.style.opacity = '0';
                
                setTimeout(function() {
                    loaderWrapper.style.display = 'none';
                    // TRIGGER THE BOTTOM-UP ANIMATION
                    mainBox.classList.add('show');
                }, 800);
            }, 500);
        }
        
        progressBarFill.style.width = currentProgress + '%';
    }, 120);
});

/**
 * FILE UPLOAD SYSTEM
 */
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const passwordInput = document.getElementById('passwordInput');
    const statusDisplay = document.getElementById('uploadStatus');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (!fileInput.files[0]) {
        alert("Please select a file to continue!");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('password', passwordInput.value);

    progressContainer.style.display = 'block';
    statusDisplay.innerText = 'Uploading to secure server...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            progressBar.style.width = '100%';
            statusDisplay.innerHTML = '<b style="color: #27ae60;">Upload Successful!</b>';
        } else {
            statusDisplay.innerText = 'Upload failed. Please check your connection.';
        }
    } catch (error) {
        console.error("Upload Error:", error);
        statusDisplay.innerText = 'Critical Server Error.';
    }
}

/**
 * FILE DOWNLOAD SYSTEM
 */
async function checkPassword() {
    const passwordField = document.getElementById('downloadPassword');
    const statusDisplay = document.getElementById('downloadStatus');
    
    const passwordValue = passwordField.value;

    if (!passwordValue) {
        alert("Password is required for decryption!");
        return;
    }

    statusDisplay.innerText = 'Searching for file...';

    try {
        const response = await fetch('/check-password?password=' + encodeURIComponent(passwordValue));
        const result = await response.json();

        if (result.found) {
            statusDisplay.innerHTML = `
                <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 10px;">
                    <p style="margin: 0; font-size: 0.9rem;">File Found: <b>${result.name}</b></p>
                    <a href="${result.url}" target="_blank" style="color: #3498db; font-weight: 900; text-decoration: none;">CLICK HERE TO DOWNLOAD</a>
                </div>
            `;
        } else {
            statusDisplay.innerText = 'Invalid password or file has expired.';
        }
    } catch (error) {
        console.error("Download Error:", error);
        statusDisplay.innerText = 'Connection to database failed.';
    }
}
