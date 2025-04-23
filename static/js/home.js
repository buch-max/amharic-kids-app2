document.addEventListener('DOMContentLoaded', function() {
    // Generate stars for the night sky
    generateStars();
    
    // Initialize background music
    initBackgroundMusic();
    
    // Add interactive elements and animations for the home page
    const startButton = document.querySelector('.start-button');
    const animals = document.querySelectorAll('.animal');
    
    // Add hover effect to animals
    animals.forEach(animal => {
        animal.addEventListener('mouseover', function() {
            // Speed up tail wagging on hover
            const tail = this.querySelector('.animal-tail');
            tail.style.animationDuration = '0.5s';
            
            // Increase bounce animation speed
            this.style.animationDuration = '1.5s';
        });
        
        animal.addEventListener('mouseout', function() {
            // Return to normal animation speeds
            const tail = this.querySelector('.animal-tail');
            
            // Reset to original duration based on animal type
            if (this.classList.contains('fox')) {
                tail.style.animationDuration = '1s';
            } else if (this.classList.contains('dog')) {
                tail.style.animationDuration = '0.8s';
            } else if (this.classList.contains('bear')) {
                tail.style.animationDuration = '1.2s';
            }
            
            // Reset bounce animation
            this.style.animationDuration = '2s';
        });
        
        // Make animals clickable for fun
        animal.addEventListener('click', function() {
            // Add a quick spin animation on click
            this.classList.add('spin-once');
            
            // Remove the class after animation completes
            setTimeout(() => {
                this.classList.remove('spin-once');
            }, 500);
        });
    });
    
    // Setup for stages popup
    const stagesPopup = document.getElementById('stages-popup');
    const closeStagesBtn = document.getElementById('close-stages');
    const disabledStages = document.querySelectorAll('.stage-button.disabled');
    
    // Create and preload the button click sound
    const buttonClickSound = new Audio('static/audio/ui/click.mp3');
    buttonClickSound.volume = 1.0; // Full volume for the click sound
    buttonClickSound.preload = 'auto';
    
    // Function to play the button click sound
    function playButtonClickSound() {
        // Always reset the sound to the beginning before playing
        buttonClickSound.currentTime = 0;
        
        // Play the sound with a promise to catch any errors
        const playPromise = buttonClickSound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Error playing button click sound:', error);
            });
        }
    }
    
    // Show stages popup when start button is clicked
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            // Play the click sound
            playButtonClickSound();
            
            // Add a click animation
            this.style.transform = 'scale(0.95)';
            
            // Small delay to show the animation before showing popup
            setTimeout(() => {
                stagesPopup.classList.add('show');
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Close popup when the X button is clicked
    if (closeStagesBtn) {
        closeStagesBtn.addEventListener('click', function() {
            stagesPopup.classList.remove('show');
        });
    }
    
    // Close popup when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === stagesPopup) {
            stagesPopup.classList.remove('show');
        }
    });
    
    // For disabled stages, show a message
    disabledStages.forEach(stage => {
        stage.addEventListener('click', function() {
            alert('This stage is coming soon!');
        });
    })
    
    // Function to generate random stars in the sky
    function generateStars() {
        const starsContainer = document.getElementById('stars');
        const starCount = 50;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 3 + 1;
            
            // Random opacity
            const opacity = Math.random() * 0.5 + 0.3;
            
            // Random animation delay
            const delay = Math.random() * 5;
            
            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.opacity = opacity;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }

    // Function to initialize background music
    function initBackgroundMusic() {
        const musicToggle = document.getElementById('music-toggle');
        const backgroundMusic = document.getElementById('background-music');
        const musicIcon = document.querySelector('.music-icon');
        
        console.log('Initializing background music');
        
        // Make sure the audio element is correctly loaded
        backgroundMusic.load();
        
        // Check if user previously set music preference (default to not muted)
        const musicMuted = localStorage.getItem('musicMuted') === 'true';
        console.log('Music muted state from localStorage:', musicMuted);
        
        // Try to autoplay the music when the page loads
        if (!musicMuted) {
            console.log('Attempting to autoplay music');
            
            // Set up music controls in anticipation of successful playback
            musicToggle.classList.remove('muted');
            musicIcon.textContent = '🔊';
            
            // Try to play the music automatically
            const playPromise = backgroundMusic.play();
            
            // Handle the Promise returned by play()
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Music autoplay successful');
                    // Keep the music playing and update the icon
                    musicToggle.classList.remove('muted');
                    musicIcon.textContent = '🔊';
                }).catch(error => {
                    console.log('Music autoplay blocked by browser:', error);
                    // Browsers typically block autoplay; fall back to showing the user they need to click
                    musicToggle.classList.add('muted');
                    musicIcon.textContent = '🔇';
                    backgroundMusic.pause();
                    
                    // Pulse animation to draw attention to the music button
                    musicToggle.classList.add('pulse-animation');
                    setTimeout(() => {
                        musicToggle.classList.remove('pulse-animation');
                    }, 5000); // Pulse for 5 seconds to really draw attention
                });
            }
        } else {
            // User previously muted music, respect their choice
            musicToggle.classList.add('muted');
            musicIcon.textContent = '🔇';
            backgroundMusic.pause();
        }
        
        // Add click event listener to toggle music
        musicToggle.addEventListener('click', function() {
            console.log('Music button clicked');
            
            if (backgroundMusic.paused) {
                console.log('Attempting to play music');
                // Play music
                const playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Music started playing successfully');
                        musicToggle.classList.remove('muted');
                        musicIcon.textContent = '🔊';
                        localStorage.setItem('musicMuted', 'false');
                    }).catch(error => {
                        console.error('Error playing music:', error);
                        // Still show muted if play fails
                        musicToggle.classList.add('muted');
                        musicIcon.textContent = '🔇';
                        localStorage.setItem('musicMuted', 'true');
                        
                        // Try one more time when user clicks again
                        alert('Click again to play music. Some browsers require multiple interactions before playing audio.');
                    });
                }
            } else {
                console.log('Pausing music');
                // Pause music
                backgroundMusic.pause();
                musicToggle.classList.add('muted');
                musicIcon.textContent = '🔇';
                localStorage.setItem('musicMuted', 'true');
            }
        });
    }
});
