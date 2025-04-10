document.addEventListener('DOMContentLoaded', function() {
    // Generate stars for the night sky
    generateStars();
    
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
    
    // Show stages popup when start button is clicked
    if (startButton) {
        startButton.addEventListener('click', function(e) {
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
        const numberOfStars = 100; // Adjust for more or fewer stars
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random position
            const xPos = Math.random() * 100;
            const yPos = Math.random() * 100;
            
            // Random size (1-3px)
            const size = Math.random() * 2 + 1;
            
            // Random twinkle duration (2-5s)
            const twinkleDuration = (Math.random() * 3 + 2) + 's';
            
            // Random delay for twinkling
            const delay = Math.random() * 5 + 's';
            
            // Apply styles
            star.style.left = xPos + '%';
            star.style.top = yPos + '%';
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.animationDuration = twinkleDuration;
            star.style.animationDelay = delay;
            
            // Add to container
            starsContainer.appendChild(star);
        }
    }
});
