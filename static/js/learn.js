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
            loadSection(section);
        });
    });

    // Load alphabet section by default
    loadSection('alphabet');
});

// Import all functions from script.js
// This file just serves as a wrapper to ensure content is only loaded on learn page
