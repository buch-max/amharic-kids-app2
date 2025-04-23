// Test suite for the Amharic Kids App
// This script tests critical app functions, especially audio playback

// Tests to run when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Running app test suite...');
    
    // Global test results
    const testResults = {
        audioSupport: false,
        allSections: {
            alphabet: false,
            sounds: false, 
            words: false,
            phrases: false
        },
        navigation: false,
        interactions: false
    };

    // Test 1: Check audio capabilities
    testAudioSupport()
        .then(supported => {
            testResults.audioSupport = supported;
            console.log(`Audio support test: ${supported ? 'PASSED' : 'FAILED'}`);
            
            // Continue with other tests
            return testNavigation();
        })
        .then(navWorks => {
            testResults.navigation = navWorks;
            console.log(`Navigation test: ${navWorks ? 'PASSED' : 'FAILED'}`);
            
            // Test each section
            return testAllSections();
        })
        .then(sectionResults => {
            testResults.allSections = sectionResults;
            Object.entries(sectionResults).forEach(([section, passed]) => {
                console.log(`${section} section test: ${passed ? 'PASSED' : 'FAILED'}`);
            });
            
            // Test interactions
            return testInteractions();
        })
        .then(interactionsWork => {
            testResults.interactions = interactionsWork;
            console.log(`Interactions test: ${interactionsWork ? 'PASSED' : 'FAILED'}`);
            
            // Show final results
            displayFinalResults(testResults);
        })
        .catch(error => {
            console.error('Test suite error:', error);
            displayError('Test suite failed to complete. Check console for details.');
        });
});

// Test audio support
function testAudioSupport() {
    return new Promise(resolve => {
        try {
            // Create a test audio element
            const audio = new Audio();
            
            // Set event listeners
            audio.addEventListener('canplaythrough', () => {
                console.log('Audio can play through - browser supports audio');
                resolve(true);
            });
            
            audio.addEventListener('error', () => {
                console.warn('Audio test failed - possible browser limitations');
                resolve(false);
            });
            
            // Try to load a test sound
            audio.src = 'static/audio/ui/click.mp3';
            
            // Set a timeout in case the events don't fire
            setTimeout(() => {
                if (audio.readyState >= 2) {
                    resolve(true);
                } else {
                    console.warn('Audio load timeout - uncertain support status');
                    resolve(false);
                }
            }, 2000);
        } catch (e) {
            console.error('Audio API error:', e);
            resolve(false);
        }
    });
}

// Test navigation between sections
function testNavigation() {
    return new Promise(resolve => {
        try {
            // Make sure we're on the learn page
            if (!document.body.classList.contains('learn-page')) {
                console.log('Not on learn page, navigation test skipped');
                resolve(false);
                return;
            }
            
            // Get the menu buttons
            const menuButtons = document.querySelectorAll('.menu-item');
            if (menuButtons.length !== 4) {
                console.warn('Expected 4 menu buttons, found', menuButtons.length);
                resolve(false);
                return;
            }
            
            // Try clicking the buttons in sequence
            let navWorks = true;
            const testClick = (index) => {
                if (index >= menuButtons.length) {
                    resolve(navWorks);
                    return;
                }
                
                const button = menuButtons[index];
                const section = button.dataset.section;
                console.log(`Testing navigation to ${section} section...`);
                
                button.click();
                
                // Wait for content to update
                setTimeout(() => {
                    const sectionTitle = document.querySelector('.section-title');
                    if (!sectionTitle) {
                        console.warn(`No section title found after clicking ${section}`);
                        navWorks = false;
                    } else {
                        const titleText = sectionTitle.textContent.trim().toLowerCase();
                        const expectedTitle = section.charAt(0).toUpperCase() + section.slice(1);
                        if (titleText !== expectedTitle.toLowerCase()) {
                            console.warn(`Expected section title "${expectedTitle}", found "${titleText}"`);
                            navWorks = false;
                        }
                    }
                    
                    // Test next button
                    testClick(index + 1);
                }, 1000);
            };
            
            // Start testing with the first button
            testClick(0);
        } catch (e) {
            console.error('Navigation test error:', e);
            resolve(false);
        }
    });
}

// Test each section
function testAllSections() {
    return new Promise(resolve => {
        const results = {
            alphabet: false,
            sounds: false,
            words: false,
            phrases: false
        };
        
        // Test each section in sequence
        testSection('alphabet')
            .then(passed => {
                results.alphabet = passed;
                return testSection('sounds');
            })
            .then(passed => {
                results.sounds = passed;
                return testSection('words');
            })
            .then(passed => {
                results.words = passed;
                return testSection('phrases');
            })
            .then(passed => {
                results.phrases = passed;
                resolve(results);
            })
            .catch(error => {
                console.error('Section tests error:', error);
                resolve(results);
            });
    });
}

// Test a specific section
function testSection(section) {
    return new Promise(resolve => {
        console.log(`Testing ${section} section...`);
        
        // Navigate to the section
        const button = document.querySelector(`.menu-item[data-section="${section}"]`);
        if (!button) {
            console.warn(`No button found for ${section} section`);
            resolve(false);
            return;
        }
        
        button.click();
        
        // Wait for content to load
        setTimeout(() => {
            const contentDiv = document.getElementById('content');
            if (!contentDiv) {
                console.warn('No content div found');
                resolve(false);
                return;
            }
            
            // Check if content loaded
            if (contentDiv.textContent.includes('Error') || 
                contentDiv.textContent.includes('failed') ||
                contentDiv.textContent.includes('try again later')) {
                console.warn(`${section} section failed to load properly`);
                resolve(false);
                return;
            }
            
            // Test audio playback for this section
            testSectionAudio(section)
                .then(audioWorks => {
                    console.log(`${section} audio test: ${audioWorks ? 'PASSED' : 'FAILED'}`);
                    resolve(audioWorks);
                })
                .catch(error => {
                    console.error(`${section} audio test error:`, error);
                    resolve(false);
                });
        }, 1500);
    });
}

// Test audio playback in a specific section
function testSectionAudio(section) {
    return new Promise(resolve => {
        const content = document.getElementById('content');
        let audioButton = null;
        
        // Find the appropriate audio button based on section
        switch (section) {
            case 'alphabet':
                // Try to find a letter card
                const letterCard = content.querySelector('.letter-card');
                if (letterCard) {
                    audioButton = letterCard;
                }
                break;
                
            case 'sounds':
                // Try to find the play sound button
                audioButton = content.querySelector('.play-sound-btn');
                break;
                
            case 'words':
                // Try to find a word card play button
                audioButton = content.querySelector('.play-button');
                if (!audioButton) {
                    // Or try the Build the Word game's audio button
                    audioButton = content.querySelector('.play-word-audio');
                }
                break;
                
            case 'phrases':
                // Try to find a phrase card play button
                audioButton = content.querySelector('.play-button');
                break;
        }
        
        if (!audioButton) {
            console.warn(`No audio button found in ${section} section`);
            resolve(false);
            return;
        }
        
        // Set up audio event tracker
        window.audioTestPassed = false;
        
        // Override audio play to detect if it was called
        const originalAudioPlay = Audio.prototype.play;
        Audio.prototype.play = function() {
            console.log(`Audio.play called in ${section} section`);
            window.audioTestPassed = true;
            return originalAudioPlay.apply(this);
        };
        
        // Click the audio button
        console.log(`Clicking audio button in ${section} section`);
        audioButton.click();
        
        // Wait and check if audio was attempted
        setTimeout(() => {
            // Restore original audio play
            Audio.prototype.play = originalAudioPlay;
            
            resolve(window.audioTestPassed);
            delete window.audioTestPassed;
        }, 2000);
    });
}

// Test interactions like expanding letters, etc.
function testInteractions() {
    return new Promise(resolve => {
        // Navigate to alphabet section
        const alphabetButton = document.querySelector('.menu-item[data-section="alphabet"]');
        if (!alphabetButton) {
            console.warn('No alphabet button found for interaction test');
            resolve(false);
            return;
        }
        
        alphabetButton.click();
        
        // Wait for content to load
        setTimeout(() => {
            const letterCard = document.querySelector('.letter-card');
            if (!letterCard) {
                console.warn('No letter card found for interaction test');
                resolve(false);
                return;
            }
            
            // Click the letter card to expand it
            console.log('Testing letter expansion interaction...');
            letterCard.click();
            
            // Wait for modal to appear
            setTimeout(() => {
                const modal = document.querySelector('.letter-modal.active, .letter-modal.show');
                if (!modal) {
                    console.warn('Letter expansion failed - no active modal found');
                    resolve(false);
                    return;
                }
                
                console.log('Letter expansion successful');
                
                // Try to close the modal
                const closeButton = modal.querySelector('.close-modal');
                if (closeButton) {
                    closeButton.click();
                    
                    // Wait for modal to close
                    setTimeout(() => {
                        const closedModal = document.querySelector('.letter-modal.active, .letter-modal.show');
                        const modalClosed = !closedModal;
                        console.log(`Modal close test: ${modalClosed ? 'PASSED' : 'FAILED'}`);
                        resolve(modalClosed);
                    }, 500);
                } else {
                    console.warn('No close button found in modal');
                    resolve(false);
                }
            }, 1000);
        }, 1500);
    });
}

// Display final results
function displayFinalResults(results) {
    console.log('FINAL TEST RESULTS:', results);
    
    // Create a results container
    const container = document.createElement('div');
    container.className = 'test-results';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = '#fff';
    container.style.border = '2px solid #333';
    container.style.borderRadius = '5px';
    container.style.padding = '15px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    container.style.maxHeight = '80vh';
    container.style.overflow = 'auto';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    
    // Add a header
    const header = document.createElement('h3');
    header.textContent = 'App Test Results';
    header.style.margin = '0 0 10px 0';
    header.style.borderBottom = '1px solid #333';
    header.style.paddingBottom = '5px';
    container.appendChild(header);
    
    // Add results
    addResultItem(container, 'Audio Support', results.audioSupport);
    
    // Add section results
    const sectionsList = document.createElement('div');
    sectionsList.innerHTML = '<strong>Sections:</strong>';
    container.appendChild(sectionsList);
    
    Object.entries(results.allSections).forEach(([section, passed]) => {
        addResultItem(sectionsList, section, passed, true);
    });
    
    addResultItem(container, 'Navigation', results.navigation);
    addResultItem(container, 'Interactions', results.interactions);
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = '#f0f0f0';
    closeButton.style.border = '1px solid #ccc';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(container);
    });
    container.appendChild(closeButton);
    
    // Add to body
    document.body.appendChild(container);
}

// Helper to add result items
function addResultItem(parent, label, passed, indent = false) {
    const item = document.createElement('div');
    item.style.margin = '5px 0';
    if (indent) {
        item.style.marginLeft = '15px';
    }
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? '#4CAF50' : '#F44336';
    
    item.innerHTML = `<span style="color:${color};font-weight:bold;">${status}</span> ${label}`;
    parent.appendChild(item);
}

// Display an error message
function displayError(message) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = '#ffebee';
    container.style.color = '#b71c1c';
    container.style.padding = '15px';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    container.style.zIndex = '9999';
    container.textContent = message;
    
    document.body.appendChild(container);
    
    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 10000);
}
