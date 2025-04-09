/**
 * Amharic Kids App Tester
 * This script adds testing capabilities to the main app
 * Run the test() function from your browser console to test the app
 */

// Add the tester to the window object when loaded
window.AmharicAppTester = (function() {
    
    // Test results storage
    const testResults = {
        navigation: false,
        alphabet: false,
        sounds: false,
        words: false,
        phrases: false,
        audio: false,
        storage: false,
        responsive: false
    };
    
    // Test counters
    let passedTests = 0;
    let failedTests = 0;
    
    // Test logger with color styling
    function logTest(message, status = 'info') {
        const styles = {
            pass: 'color: #28a745; font-weight: bold',
            fail: 'color: #dc3545; font-weight: bold',
            info: 'color: #17a2b8',
            warn: 'color: #ffc107',
            header: 'color: #6f42c1; font-weight: bold; font-size: 1.2em'
        };
        
        console.log('%c' + message, styles[status] || styles.info);
        
        if (status === 'pass') passedTests++;
        if (status === 'fail') failedTests++;
    }
    
    // Wait utility function
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Individual test functions
    async function testNavigation() {
        logTest('📌 TESTING NAVIGATION', 'header');
        
        const navItems = document.querySelectorAll('nav a');
        
        if (navItems.length === 4) {
            logTest('✅ Navigation menu contains all 4 sections', 'pass');
            
            // Test that clicking each nav item changes the content
            for (let item of navItems) {
                const section = item.getAttribute('data-section');
                item.click();
                await wait(300);
                
                const sectionHeading = document.querySelector('#content h2');
                if (sectionHeading && sectionHeading.textContent.toLowerCase().includes(section)) {
                    logTest(`✅ Navigation to ${section} section works correctly`, 'pass');
                } else {
                    logTest(`❌ Navigation to ${section} section failed`, 'fail');
                }
            }
            
            testResults.navigation = true;
            return true;
        } else {
            logTest(`❌ Expected 4 navigation items, found ${navItems.length}`, 'fail');
            return false;
        }
    }
    
    async function testAlphabetSection() {
        logTest('📌 TESTING ALPHABET SECTION', 'header');
        
        // Navigate to Alphabet section
        document.querySelector('nav a[data-section="alphabet"]').click();
        await wait(300);
        
        const letterCards = document.querySelectorAll('.letter-card');
        const audioButtons = document.querySelectorAll('.play-button');
        
        if (letterCards.length < 5) {
            logTest(`❌ Expected at least 5 letter cards, found ${letterCards.length}`, 'fail');
        } else {
            logTest(`✅ Alphabet section has ${letterCards.length} letter cards`, 'pass');
        }
        
        if (audioButtons.length < 5) {
            logTest(`❌ Expected at least 5 audio buttons, found ${audioButtons.length}`, 'fail');
        } else {
            logTest(`✅ Alphabet section has ${audioButtons.length} audio buttons`, 'pass');
        }
        
        // Test letter card structure
        const firstLetterCard = letterCards[0];
        if (firstLetterCard) {
            const letterElement = firstLetterCard.querySelector('.letter');
            const translitElement = firstLetterCard.querySelector('.transliteration');
            const exampleElement = firstLetterCard.querySelector('.example');
            
            if (letterElement && translitElement && exampleElement) {
                logTest('✅ Letter card structure is correct', 'pass');
            } else {
                logTest('❌ Letter card structure is missing elements', 'fail');
            }
        }
        
        testResults.alphabet = audioButtons.length >= 5 && letterCards.length >= 5;
        return testResults.alphabet;
    }
    
    async function testSoundsSection() {
        logTest('📌 TESTING SOUNDS SECTION', 'header');
        
        // Navigate to Sounds section
        document.querySelector('nav a[data-section="sounds"]').click();
        await wait(300);
        
        const soundGame = document.querySelector('.sound-game');
        if (!soundGame) {
            logTest('❌ Sound game not found', 'fail');
            return false;
        } else {
            logTest('✅ Sound game container found', 'pass');
        }
        
        const currentScore = document.querySelector('.current-score');
        if (!currentScore) {
            logTest('❌ Score display not found', 'fail');
        } else {
            logTest('✅ Score display found', 'pass');
        }
        
        const playButton = document.querySelector('.play-sound-btn');
        if (!playButton) {
            logTest('❌ Play sound button not found', 'fail');
        } else {
            logTest('✅ Play sound button found', 'pass');
        }
        
        const optionButtons = document.querySelectorAll('.letter-option');
        if (optionButtons.length < 3) {
            logTest(`❌ Expected at least 3 letter options, found ${optionButtons.length}`, 'fail');
        } else {
            logTest(`✅ Sound game has ${optionButtons.length} letter options`, 'pass');
        }
        
        testResults.sounds = soundGame && currentScore && playButton && optionButtons.length >= 3;
        return testResults.sounds;
    }
    
    async function testWordsSection() {
        logTest('📌 TESTING WORDS SECTION', 'header');
        
        // Navigate to Words section
        document.querySelector('nav a[data-section="words"]').click();
        await wait(300);
        
        const wordCards = document.querySelectorAll('.word-card');
        if (wordCards.length < 3) {
            logTest(`❌ Expected at least 3 word cards, found ${wordCards.length}`, 'fail');
        } else {
            logTest(`✅ Words section has ${wordCards.length} word cards`, 'pass');
        }
        
        const wordGame = document.querySelector('.word-game');
        if (!wordGame) {
            logTest('❌ Word game not found', 'fail');
            return false;
        } else {
            logTest('✅ Word game container found', 'pass');
        }
        
        const dropArea = document.querySelector('.letter-drop-area');
        const dropBoxes = document.querySelectorAll('.letter-drop-box');
        if (!dropArea || dropBoxes.length < 2) {
            logTest(`❌ Expected drop area with at least 2 boxes, found ${dropBoxes.length}`, 'fail');
        } else {
            logTest(`✅ Word game has drop area with ${dropBoxes.length} boxes`, 'pass');
        }
        
        const bankLetters = document.querySelectorAll('.bank-letter');
        if (bankLetters.length < 2) {
            logTest(`❌ Expected at least 2 bank letters, found ${bankLetters.length}`, 'fail');
        } else {
            logTest(`✅ Word game has ${bankLetters.length} bank letters`, 'pass');
        }
        
        testResults.words = wordCards.length >= 3 && wordGame && dropBoxes.length >= 2 && bankLetters.length >= 2;
        return testResults.words;
    }
    
    async function testPhrasesSection() {
        logTest('📌 TESTING PHRASES SECTION', 'header');
        
        // Navigate to Phrases section
        document.querySelector('nav a[data-section="phrases"]').click();
        await wait(300);
        
        const phraseCards = document.querySelectorAll('.phrase-card');
        if (phraseCards.length < 3) {
            logTest(`❌ Expected at least 3 phrase cards, found ${phraseCards.length}`, 'fail');
        } else {
            logTest(`✅ Phrases section has ${phraseCards.length} phrase cards`, 'pass');
        }
        
        const matchGame = document.querySelector('.phrase-game');
        if (!matchGame) {
            logTest('❌ Phrase matching game not found', 'fail');
            return false;
        } else {
            logTest('✅ Phrase matching game container found', 'pass');
        }
        
        const phrasesColumn = document.querySelector('.phrases-column');
        const imagesColumn = document.querySelector('.images-column');
        if (!phrasesColumn || !imagesColumn) {
            logTest('❌ Matching columns not found', 'fail');
        } else {
            logTest('✅ Matching columns found', 'pass');
        }
        
        const phraseElements = document.querySelectorAll('.match-phrase');
        if (phraseElements.length < 3) {
            logTest(`❌ Expected at least 3 phrases for matching, found ${phraseElements.length}`, 'fail');
        } else {
            logTest(`✅ Matching game has ${phraseElements.length} phrases`, 'pass');
        }
        
        testResults.phrases = phraseCards.length >= 3 && matchGame && phraseElements.length >= 3;
        return testResults.phrases;
    }
    
    async function testAudioPlayback() {
        logTest('📌 TESTING AUDIO PLAYBACK', 'header');
        
        // Navigate to Alphabet section
        document.querySelector('nav a[data-section="alphabet"]').click();
        await wait(300);
        
        const audioButton = document.querySelector('.play-button');
        if (!audioButton) {
            logTest('❌ Audio button not found', 'fail');
            return false;
        } else {
            logTest('✅ Audio button found', 'pass');
        }
        
        // Create a flag to track audio playback
        let audioPlayed = false;
        
        // Override the audio play method temporarily
        const originalPlay = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function() {
            audioPlayed = true;
            logTest('✅ Audio playback triggered successfully', 'pass');
            return Promise.resolve();
        };
        
        // Simulate a click on the audio button
        audioButton.click();
        await wait(300);
        
        // Restore original play method
        HTMLAudioElement.prototype.play = originalPlay;
        
        if (!audioPlayed) {
            logTest('❌ Audio playback was not triggered', 'fail');
        }
        
        testResults.audio = audioPlayed;
        return audioPlayed;
    }
    
    async function testLocalStorage() {
        logTest('📌 TESTING LOCAL STORAGE', 'header');
        
        try {
            // Check if localStorage is available
            if (typeof localStorage === 'undefined') {
                logTest('❌ localStorage is not available in this browser', 'fail');
                return false;
            }
            
            // Save test scores
            const testScores = { sounds: 5, words: 3, phrases: 4 };
            localStorage.setItem('amharicAppScores', JSON.stringify(testScores));
            
            // Retrieve scores
            const scores = JSON.parse(localStorage.getItem('amharicAppScores'));
            
            if (!scores || typeof scores !== 'object') {
                logTest('❌ Failed to retrieve scores from localStorage', 'fail');
                return false;
            }
            
            // Check if scores match
            const scoresMatch = scores.sounds === testScores.sounds && 
                              scores.words === testScores.words && 
                              scores.phrases === testScores.phrases;
            
            if (scoresMatch) {
                logTest('✅ localStorage is working correctly for storing scores', 'pass');
            } else {
                logTest('❌ localStorage data doesn\'t match expected values', 'fail');
            }
            
            testResults.storage = scoresMatch;
            return scoresMatch;
            
        } catch (error) {
            logTest(`❌ localStorage test failed: ${error.message}`, 'fail');
            return false;
        }
    }
    
    async function testResponsiveness() {
        logTest('📌 TESTING RESPONSIVE DESIGN', 'header');
        
        // Check if media queries are supported
        if (!window.matchMedia) {
            logTest('❌ Media queries not supported in this browser', 'fail');
            return false;
        }
        
        // Check for mobile-specific styles
        const mobileStyles = window.matchMedia('(max-width: 768px)');
        if (mobileStyles.matches) {
            logTest('Running in mobile view width', 'info');
        } else {
            logTest('Running in desktop view width', 'info');
        }
        
        // Check for responsive classes
        const responsiveElements = [
            '.letter-cards',
            '.word-cards',
            '.sound-game',
            '.word-game',
            '.phrase-cards',
            '.match-game-container'
        ];
        
        let responsiveElementsFound = 0;
        
        responsiveElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                responsiveElementsFound++;
                // Check computed style for flex or grid layout which indicates responsiveness
                const style = window.getComputedStyle(element);
                const display = style.getPropertyValue('display');
                if (display === 'flex' || display === 'grid') {
                    logTest(`✅ ${selector} uses responsive layout (${display})`, 'pass');
                }
            }
        });
        
        if (responsiveElementsFound < 3) {
            logTest('❌ Not enough responsive elements found', 'fail');
            testResults.responsive = false;
        } else {
            logTest('✅ Application has responsive design elements', 'pass');
            testResults.responsive = true;
        }
        
        return testResults.responsive;
    }
    
    // Main test runner
    async function runAllTests() {
        console.clear();
        logTest('🧪 AMHARIC KIDS APP TEST SUITE 🧪', 'header');
        logTest(`Test started at: ${new Date().toLocaleTimeString()}`, 'info');
        
        // Reset counters
        passedTests = 0;
        failedTests = 0;
        
        // Run all tests sequentially
        await testNavigation();
        await testAlphabetSection();
        await testSoundsSection();
        await testWordsSection();
        await testPhrasesSection();
        await testAudioPlayback();
        await testLocalStorage();
        await testResponsiveness();
        
        // Show test summary
        logTest('📊 TEST SUMMARY', 'header');
        
        const totalTests = passedTests + failedTests;
        const passRate = Math.round((passedTests / totalTests) * 100);
        
        logTest(`Total Tests: ${totalTests}`, 'info');
        logTest(`Passed: ${passedTests}`, passedTests > 0 ? 'pass' : 'info');
        logTest(`Failed: ${failedTests}`, failedTests > 0 ? 'fail' : 'info');
        logTest(`Pass Rate: ${passRate}%`, passRate > 80 ? 'pass' : passRate > 60 ? 'warn' : 'fail');
        
        // Show section results
        logTest('📋 SECTION RESULTS', 'header');
        Object.entries(testResults).forEach(([section, passed]) => {
            logTest(`${section}: ${passed ? '✅ PASS' : '❌ FAIL'}`, passed ? 'pass' : 'fail');
        });
        
        logTest(`Test completed at: ${new Date().toLocaleTimeString()}`, 'info');
        
        return testResults;
    }
    
    // Public API
    return {
        test: runAllTests,
        results: () => testResults
    };
})();

// Log instructions when script is loaded
console.log('%c🧪 Amharic Kids App Tester loaded! Run AmharicAppTester.test() to test the app.', 'color: #6f42c1; font-weight: bold;');
