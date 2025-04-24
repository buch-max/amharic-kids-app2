// Learn page specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Only run this code on learn page
    if (!document.body.classList.contains('learn-page')) {
        return;
    }
    
    console.log('Learn page initialized');
    
    // Set up menu button listeners
    const menuButtons = document.querySelectorAll('.menu-item');
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Update button states
            updateMenuButtonStates(button);
            
            // Load the selected section content
            loadSection(section);
        });
    });

    // Function to update menu button active/inactive states
    function updateMenuButtonStates(activeButton) {
        // Remove active class from all buttons and add inactive
        menuButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('inactive');
        });
        
        // Add active class to the clicked button and remove inactive
        activeButton.classList.add('active');
        activeButton.classList.remove('inactive');
    }

    // Load alphabet section by default and set its button as active
    const defaultButton = document.querySelector('.menu-item[data-section="alphabet"]');
    if (defaultButton) {
        updateMenuButtonStates(defaultButton);
        loadSection('alphabet');
    }
});

// Import all functions from script.js
// This file just serves as a wrapper to ensure content is only loaded on learn page
