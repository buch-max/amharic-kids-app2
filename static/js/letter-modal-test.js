/**
 * Test script for the Amharic letter modal functionality
 * This will run automated checks to verify the feature is working as expected
 */
(function() {
    console.log('Starting letter modal testing...');
    
    // Helper to log test results
    function logTest(testName, passed, message) {
        if (passed) {
            console.log(`✅ PASS: ${testName}`);
        } else {
            console.error(`❌ FAIL: ${testName} - ${message}`);
        }
    }
    
    // Wait for the DOM to be ready
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(runTests, 1000); // Give a bit more time for everything to initialize
    });
    
    function runTests() {
        try {
            // Test 1: Verify we have the alphabet section loaded
            const alphabetContainer = document.querySelector('.alphabet-container');
            logTest('Alphabet container exists', !!alphabetContainer, 'Could not find alphabet-container');
            
            if (!alphabetContainer) return;
            
            // Test 2: Verify we have some letter cards
            const letterCards = document.querySelectorAll('.letter-card');
            logTest('Letter cards exist', letterCards.length > 0, 'No letter cards found');
            
            if (letterCards.length === 0) return;
            
            // Test 3: Verify the modal exists
            const modal = document.querySelector('.letter-modal');
            logTest('Modal exists', !!modal, 'Modal not found');
            
            if (!modal) return;
            
            console.log(`Found ${letterCards.length} letter cards to test`);
            
            // Test 4: Simulate a click on the first letter card
            console.log('Simulating click on first letter card...');
            letterCards[0].click();
            
            // Allow some time for the modal to open
            setTimeout(() => {
                // Test 5: Check if modal is visible after click
                const isModalVisible = modal.classList.contains('show');
                logTest('Modal opens on letter click', isModalVisible, 'Modal did not open when letter was clicked');
                
                if (!isModalVisible) {
                    // Something is wrong with the click handler or modal display
                    console.error('Modal did not appear! Checking event listeners...');
                    
                    // Try to debug why the modal isn't showing
                    const expandedLetter = document.querySelector('.modal-letter');
                    console.log('Expanded letter element exists:', !!expandedLetter);
                    
                    // Manually try to open the modal
                    console.log('Manually opening modal...');
                    modal.classList.add('show');
                    document.body.classList.add('modal-open');
                }
                
                // Test 6: Check if forms were generated
                const formsContainer = document.querySelector('.modal-forms-container');
                const letterForms = formsContainer ? formsContainer.querySelectorAll('.letter-form') : [];
                
                logTest('Letter forms generated', letterForms.length > 0, 
                       `No letter forms found in the modal. Count: ${letterForms.length}`);
                
                if (letterForms.length > 0) {
                    console.log(`Generated ${letterForms.length} letter forms`);
                    
                    // Test 7: Check if each form has play buttons
                    const playButtons = formsContainer.querySelectorAll('.form-play-button');
                    logTest('Form play buttons exist', playButtons.length === letterForms.length, 
                           `Play button count (${playButtons.length}) doesn't match form count (${letterForms.length})`);
                    
                    // Test 8: Verify backdrop blur is applied
                    const computedStyle = window.getComputedStyle(modal);
                    const hasBlur = computedStyle.backdropFilter.includes('blur');
                    logTest('Backdrop blur applied', hasBlur, 'Backdrop filter blur not applied');
                }
                
                // Test 9: Test closing the modal
                const closeButton = document.querySelector('.close-modal');
                if (closeButton) {
                    console.log('Testing close button...');
                    closeButton.click();
                    
                    // Check if modal closed
                    setTimeout(() => {
                        const modalClosed = !modal.classList.contains('show');
                        logTest('Modal closes when X is clicked', modalClosed, 'Modal did not close when X was clicked');
                        
                        console.log('Letter modal testing complete!');
                    }, 500);
                } else {
                    logTest('Close button exists', false, 'Close button not found');
                }
                
            }, 1000);
        } catch (error) {
            console.error('Error during testing:', error);
        }
    }
})();
