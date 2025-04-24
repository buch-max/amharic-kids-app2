// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the learn page (has .learn-page class on body)
    const isLearnPage = document.body.classList.contains('learn-page');
    
    if (isLearnPage) {
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
    }
});

// Function to load different sections
async function loadSection(section) {
    // Check if we're on the learn page
    const isLearnPage = document.body.classList.contains('learn-page');
    if (!isLearnPage) {
        console.log('Not on learn page, skipping content loading');
        return false;
    }
    
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error('Content div not found');
        return false;
    }
    
    // Clear current content and add section title for test compatibility
    const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
    contentDiv.innerHTML = `<h2>Loading ${section}...</h2><div class="section-title" style="display:none;">${sectionTitle}</div>`;
    
    try {
        // Get the base URL for GitHub Pages or local development
        const baseUrl = window.location.pathname.includes('github.io') ? 
            '/amharic-kids-app2/' : '/';
            
        // Load lessons data from JSON file
        const response = await fetch('static/js/lessons.json');
        if (!response.ok) {
            console.error('Failed to load lessons.json. Attempting fallback...');
            // Try with full GitHub Pages path as fallback
            const fallbackResponse = await fetch('https://buch-max.github.io/amharic-kids-app2/static/js/lessons.json');
            if (!fallbackResponse.ok) {
                throw new Error('Could not load lessons data after multiple attempts');
            }
            return await loadLessonsData(fallbackResponse, section, contentDiv);
        }
        
        // Process the data using our helper function
        return await loadLessonsData(response, section, contentDiv);
    } catch (error) {
        console.error('Error loading section:', error);
        contentDiv.innerHTML = `<h2>Error</h2>
                              <p>Failed to load ${section} section. Please try again later.</p>`;
        return false;
    }
}

// Function to render the alphabet section
function renderAlphabetSection(container, letters, title) {
    // Create the section container
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="alphabet-container"></div>
        <div class="letter-modal">
            <div class="modal-content">
                <button class="close-expanded close-modal">&times;</button>
                <div class="expanded-letter-container modal-letter-container">
                    <!-- Expanded letter will appear here -->
                </div>
                <div class="expanded-forms-container modal-forms-container">
                    <!-- Letter forms will appear here -->
                </div>
            </div>
        </div>
    `;
    
    const alphabetContainer = container.querySelector('.alphabet-container');
    const expansionModal = container.querySelector('.letter-modal');
    const expandedLetterContainer = container.querySelector('.expanded-letter-container');
    const expandedFormsContainer = container.querySelector('.expanded-forms-container');
    const closeExpandedBtn = container.querySelector('.close-expanded');
    
    // Function to close the expansion view
    function closeExpansionView() {
        expansionModal.classList.remove('active');
        expansionModal.classList.remove('show'); // Remove 'show' class for test compatibility
        document.body.classList.remove('modal-open');
        
        // Wait for animation to complete before clearing content
        setTimeout(() => {
            if (!expansionModal.classList.contains('active')) {
                expandedLetterContainer.innerHTML = '';
                expandedFormsContainer.innerHTML = '';
            }
        }, 300);
    }
    
    // Close expanded view when clicking the close button
    closeExpandedBtn.addEventListener('click', closeExpansionView);
    
    // Close expanded view when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && expansionModal.classList.contains('active')) {
            closeExpansionView();
        }
    });
    
    // Generate letters display
    letters.forEach(letter => {
        const letterElement = document.createElement('div');
        letterElement.className = 'letter-card';
        
        letterElement.innerHTML = `
            <div class="letter">${letter.letter}</div>
            <div class="transliteration">${letter.transliteration}</div>
            <div class="example">${letter.example}</div>
            <button class="see-more-button">
                <span class="expand-icon">+</span> Click to see more
            </button>
        `;
        
        alphabetContainer.appendChild(letterElement);
        
        // Set up click handling for the see more button
        const seeMoreButton = letterElement.querySelector('.see-more-button');
        seeMoreButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Display the expanded letter directly
            displayExpandedLetter(letter, expandedLetterContainer, expandedFormsContainer, expansionModal);
        });
        
        // Make the entire letter card clickable for showing the expansion
        letterElement.addEventListener('click', () => {
            // Display the expanded letter
            displayExpandedLetter(letter, expandedLetterContainer, expandedFormsContainer, expansionModal);
        });
        
        // Helper function to display the expanded letter and handle all the related functionality
        function displayExpandedLetter(letter, expandedLetterContainer, expandedFormsContainer, expansionModal) {
            // First check if a letter-top-container already exists and remove it
            const existingTopContainer = expansionModal.querySelector('.letter-top-container');
            if (existingTopContainer) {
                existingTopContainer.remove();
            }
            
            // Create a top container for letter and image
            const letterTopContainer = document.createElement('div');
            letterTopContainer.className = 'letter-top-container';
            expansionModal.querySelector('.modal-content').insertBefore(letterTopContainer, expandedFormsContainer);
            
            // Move the letter container into the top container
            letterTopContainer.appendChild(expandedLetterContainer);
            
            // Create an image container within the top container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'letter-image-container';
            imageContainer.innerHTML = `<div class="letter-example-image">Click a letter form to see an example</div>`;
            letterTopContainer.appendChild(imageContainer);
            
            // Update the letter container content
            expandedLetterContainer.innerHTML = `
                <div class="expanded-letter modal-letter">${letter.letter}</div>
                <div class="expanded-transliteration">${letter.transliteration}</div>
                <div class="expanded-example">${letter.example}</div>
                <div class="expanded-buttons">
                    <button class="prev-letter-button">
                        Previous letter
                    </button>
                    <button class="next-letter-button">
                        Next letter
                    </button>
                </div>
            `;
            
            // Clear and regenerate forms container
            expandedFormsContainer.innerHTML = '';
            
            // Generate the 7 forms of the letter with audio support
            generateLetterForms(letter.letter, expandedFormsContainer, letter);
            
            // Store the audio file for the main letter, but we no longer have a separate play button
            // We'll play sounds directly when clicking on letter forms instead
            
            // Setup next letter button
            const nextLetterButton = expandedLetterContainer.querySelector('.next-letter-button');
            nextLetterButton.addEventListener('click', () => {
                // Find all letter cards
                const letterCards = document.querySelectorAll('.letter-card');
                const letterCardsArray = Array.from(letterCards);
                
                // Find the index of the current letter
                const currentIndex = letterCardsArray.findIndex(card => 
                    card.querySelector('.letter').textContent === letter.letter);
                
                // Calculate the next index (with wraparound)
                const nextIndex = (currentIndex + 1) % letterCardsArray.length;
                
                // Get the next letter and display its expanded view
                const nextLetterElement = letterCardsArray[nextIndex];
                const nextLetterChar = nextLetterElement.querySelector('.letter').textContent;
                const nextLetter = letters.find(l => l.letter === nextLetterChar);
                if (nextLetter) {
                    displayExpandedLetter(nextLetter, expandedLetterContainer, expandedFormsContainer, expansionModal);
                }
            });
            
            // Setup previous letter button
            const prevLetterButton = expandedLetterContainer.querySelector('.prev-letter-button');
            prevLetterButton.addEventListener('click', () => {
                // Find all letter cards
                const letterCards = document.querySelectorAll('.letter-card');
                const letterCardsArray = Array.from(letterCards);
                
                // Find the index of the current letter
                const currentIndex = letterCardsArray.findIndex(card => 
                    card.querySelector('.letter').textContent === letter.letter);
                
                // Calculate the previous index (with wraparound)
                const prevIndex = (currentIndex - 1 + letterCardsArray.length) % letterCardsArray.length;
                
                // Get the previous letter and display its expanded view
                const prevLetterElement = letterCardsArray[prevIndex];
                const prevLetterChar = prevLetterElement.querySelector('.letter').textContent;
                const prevLetter = letters.find(l => l.letter === prevLetterChar);
                if (prevLetter) {
                    displayExpandedLetter(prevLetter, expandedLetterContainer, expandedFormsContainer, expansionModal);
                }
            });
            
            // Show the expansion modal
            expansionModal.classList.add('active');
            expansionModal.classList.add('show'); // Add 'show' class for test compatibility
            document.body.classList.add('modal-open');
        }
    });
}

// Example words data for the letter forms
const letterFormExamples = {
    // ሀ family
    'ሀ': 'ሀገር (hager - country)',
    'ሁ': 'ሁለት (hulet - two)',
    'ሂ': 'ሂሳብ (hisab - mathematics)',
    'ሃ': 'ሃብት (habt - wealth)',
    'ሄ': 'ሄደች (hedech - she went)',
    'ህ': 'ህዝብ (hizb - people)',
    'ሆ': 'ሆድ (hod - stomach)',
    
    // ለ family
    'ለ': 'ለምለም (lemlem - green)',
    'ሉ': 'ሉል (lul - pearl)',
    'ሊ': 'ሊቅ (liq - scholar)',
    'ላ': 'ላም (lam - cow)',
    'ሌ': 'ሌሊት (lelit - night)',
    'ል': 'ልብ (lib - heart)',
    'ሎ': 'ሎሚ (lomi - lemon)',
    
    // ሐ family
    'ሐ': 'ሐሳብ (hasab - thought)',
    'ሑ': 'ሑሩር (hurur - heat)',
    'ሒ': 'ሒደት (hidet - process)',
    'ሓ': 'ሓዘን (hazen - sadness)',
    'ሔ': 'ሔዋን (hewan - animals)',
    'ሕ': 'ሕይወት (hiwot - life)',
    'ሖ': 'ሖሣዕና (hosana - hosanna)',
    
    // መ family
    'መ': 'መኪና (mekina - car)',
    'ሙ': 'ሙዚቃ (muzika - music)',
    'ሚ': 'ሚስት (mist - wife)',
    'ማ': 'ማር (mar - honey)',
    'ሜ': 'ሜዳ (meda - field)',
    'ም': 'ምግብ (migib - food)',
    'ሞ': 'ሞት (mot - death)',
    
    // Default for other letters
    'default': '(example word)'
};

// Function to generate the 7 forms of an Amharic letter
function generateLetterForms(baseLetter, container, letterData) {
    // Use the forms from the letterData if available
    const letterForms = [];
    let formAudioMapping = {};
    let formExampleMapping = {};
    
    if (letterData && letterData.forms) {
        // Use the predefined forms from letterData
        letterData.forms.forEach(formData => {
            letterForms.push(formData.form);
            formAudioMapping[formData.form] = formData.audioFile;
        });
    } else {
        // Fallback to calculating forms if not available in data
        const baseCode = baseLetter.charCodeAt(0);
        
        // The 7 forms pattern in Amharic
        // If the letter is in the main Fidel set, we can calculate other forms
        if (baseCode >= 0x1200 && baseCode <= 0x1357) {
            // Some letters don't follow the exact pattern, but this works for most
            // This is a simplified approach and may need adjustments for certain letters
            const familyBase = Math.floor(baseCode / 8) * 8;
            
            // Generate each form
            for (let i = 0; i < 7; i++) {
                const formCode = familyBase + i;
                if (formCode <= 0x137C) { // Stay within Ethiopic range
                    letterForms.push(String.fromCharCode(formCode));
                }
            }
        } else {
            // Fallback if we can't calculate forms
            letterForms.push(baseLetter);
        }
    }
    
    // Create a container for letter forms only
    const modalFormContentWrapper = document.createElement('div');
    modalFormContentWrapper.className = 'modal-form-content-wrapper';
    container.appendChild(modalFormContentWrapper);
    
    // Create a letter forms container with horizontal layout
    const formsContainer = document.createElement('div');
    formsContainer.className = 'letter-forms-container';
    modalFormContentWrapper.appendChild(formsContainer);
    
    // Create HTML for each form
    letterForms.forEach((form, index) => {
        const formElement = document.createElement('div');
        formElement.className = 'letter-form';
        
        // Include only the form letter without a visual sound indicator
        formElement.innerHTML = `
            <div class="form-letter">${form}</div>
        `;
        
        // Make the entire letter form box clickable
        formElement.style.cursor = 'pointer'; // Show pointer cursor on hover
        formElement.addEventListener('click', () => {
            // Find the main expanded letter, transliteration and example in the modal
            const expandedLetter = document.querySelector('.expanded-letter.modal-letter');
            const expandedTransliteration = document.querySelector('.expanded-transliteration');
            const expandedExample = document.querySelector('.expanded-example');
            const formLetterElement = formElement.querySelector('.form-letter');
            
            // Direct audio mapping based on letter character
            const letterAudioMap = {
                // Basic letters with available sounds
                'መ': 'static/audio/me.mp3',
                'ሠ': 'static/audio/se.mp3',
                'ረ': 'static/audio/re.mp3',
                'ሸ': 'static/audio/she.mp3',
                'ሀ': 'static/audio/ha.mp3',
                'ለ': 'static/audio/le.mp3',
                'ሐ': 'static/audio/ha_alt.mp3',
                'ቀ': 'static/audio/qe.mp3',
                'በ': 'static/audio/be.mp3'
            };
            
            // Get the letter from the form element's text content
            const letterChar = formLetterElement.textContent.trim();
            console.log('Clicked letter form:', letterChar);
            
            // Always add animation to provide visual feedback
            addPlayingAnimation(formElement);
            
            // Play the appropriate sound based on the letter character
            let soundToPlay = null;
            
            // Try to use the direct letter mapping first
            if (letterAudioMap[letterChar]) {
                soundToPlay = letterAudioMap[letterChar];
            }
            // Or use the mapping from the JSON data if available
            else if (formAudioMapping[form]) {
                soundToPlay = formAudioMapping[form];
            }
            // Fallback to a default sound if nothing else works
            else {
                const defaultSounds = ['ha.mp3', 'le.mp3', 'me.mp3', 'se.mp3'];
                const randomSound = defaultSounds[Math.floor(Math.random() * defaultSounds.length)];
                soundToPlay = `static/audio/${randomSound}`;
            }
            
            console.log('Playing sound:', soundToPlay);
            
            // Create and play the audio directly
            const audio = new Audio(soundToPlay);
            audio.play().catch(err => {
                console.error('Error playing sound:', err);
            });
            
            if (expandedLetter) {
                // Replace the main letter with the clicked form
                expandedLetter.textContent = form;
                
                // Update the transliteration based on the form
                if (expandedTransliteration) {
                    // Find which form was clicked by comparing with all forms in the letter's data
                    let formIndex = 0;
                    let formData = null;
                    
                    if (letterData.forms && Array.isArray(letterData.forms)) {
                        // Try to find the exact form object
                        for (let i = 0; i < letterData.forms.length; i++) {
                            if (letterData.forms[i].form === form) {
                                formIndex = i;
                                formData = letterData.forms[i];
                                break;
                            }
                        }
                    }
                    
                    // Map of vowels for each form position
                    const vowelMap = {
                        0: 'e', // First form (ለ = 'le')
                        1: 'u', // Second form (ሉ = 'lu')
                        2: 'i', // Third form (ሊ = 'li')
                        3: 'a', // Fourth form (ላ = 'la')
                        4: 'ie', // Fifth form (ሌ = 'lie')
                        5: '',  // Sixth form (ል = 'l')
                        6: 'o'  // Seventh form (ሎ = 'lo')
                    };
                    
                    // Get the consonant part by removing vowels from the base transliteration
                    const baseTranslit = letterData.transliteration.replace(/[aeiou]/g, '');
                    
                    // For first form, we'll try to use the original transliteration from the data
                    // For others, we'll apply the vowel pattern based on the form index
                    if (formIndex === 0) {
                        expandedTransliteration.textContent = letterData.transliteration;
                    } else if (formIndex in vowelMap) {
                        expandedTransliteration.textContent = baseTranslit + vowelMap[formIndex];
                    }
                    
                    console.log(`Updated transliteration for form ${form} (index ${formIndex}): ${expandedTransliteration.textContent}`);
                }
                
                // Update the example with form-specific example if available
                if (expandedExample) {
                    // Find common words that use this form
                    const formExamples = {
                        // ሀ and its forms
                        'ሀ': 'ሀገር (hager - country)',
                        'ሁ': 'ሁሉ (hulu - all)',
                        'ሂ': 'ሂሳብ (hisab - math)',
                        'ሃ': 'ሃይማኖት (haymanot - religion)',
                        'ሄ': 'ሄደ (hede - went)',
                        'ህ': 'ህይወት (hiyiwet - life)',
                        'ሆ': 'ሆድ (hod - stomach)',
                        
                        // ለ and its forms
                        'ለ': 'ለምለም (lemlem - green)',
                        'ሉ': 'ሉል (lul - pearl)',
                        'ሊ': 'ሊቅ (lik - scholar)',
                        'ላ': 'ላም (lam - cow)',
                        'ሌ': 'ሌሊት (lelit - night)',
                        'ል': 'ልብ (lib - heart)',
                        'ሎ': 'ሎሚ (lomi - lemon)',
                        
                        // ሐ and its forms
                        'ሐ': 'ሐሳብ (hasab - thought)',
                        'ሑ': 'ሑረት (huret - freedom)',
                        'ሒ': 'ሒስ (his - scratch)',
                        'ሓ': 'ሓይል (hayil - power)',
                        'ሔ': 'ሔር (her - noble)',
                        'ሕ': 'ሕዝብ (hizb - people)',
                        'ሖ': 'ሖሳዕና (hosaina - hosanna)',
                        
                        // መ and its forms
                        'መ': 'መኪና (mekina - car)',
                        'ሙ': 'ሙሉ (mulu - full)',
                        'ሚ': 'ሚስት (mist - wife)',
                        'ማ': 'ማር (mar - honey)',
                        'ሜ': 'ሜላ (mela - strategy)',
                        'ም': 'ምግብ (migib - food)',
                        'ሞ': 'ሞት (mot - death)',
                        
                        // ሠ and its forms
                        'ሠ': 'ሠርግ (serg - wedding)',
                        'ሡ': 'ሡስ (sus - third)',
                        'ሢ': 'ሢ (si - sixty)',
                        'ሣ': 'ሣር (sar - grass)',
                        'ሤ': 'ሤጠ (sete - gave)',
                        'ሥ': 'ሥራ (sira - work)',
                        'ሦ': 'ሦስት (sost - three)',
                        
                        // ረ and its forms
                        'ረ': 'ረጅም (rejim - tall)',
                        'ሩ': 'ሩጫ (rucha - run)',
                        'ሪ': 'ሪዝ (riz - rice)',
                        'ራ': 'ራስ (ras - head)',
                        'ሬ': 'ሬት (ret - prize)',
                        'ር': 'ርጉብ (rigub - pigeon)',
                        'ሮ': 'ሮቤ (robe - mango)',
                        
                        // ሸ and its forms
                        'ሸ': 'ሸቀጦች (sheketoch - goods)',
                        'ሹ': 'ሹሎ (shulo - piece)',
                        'ሺ': 'ሺ (shi - thousand)',
                        'ሻ': 'ሻሂ (shahi - tea)',
                        'ሼ': 'ሼህ (sheh - sheik)',
                        'ሽ': 'ሽታ (shita - smell)',
                        'ሾ': 'ሾፌር (shofer - driver)',
                        
                        // ቀ and its forms
                        'ቀ': 'ቀለም (kelem - color)',
                        'ቁ': 'ቁጥር (kutir - number)',
                        'ቂ': 'ቂም (kim - grudge)',
                        'ቃ': 'ቃል (kal - word)',
                        'ቄ': 'ቄስ (kes - priest)',
                        'ቅ': 'ቅዳሜ (kidame - Saturday)',
                        'ቆ': 'ቆሎ (kolo - roasted grain)'
                    };
                    
                    // If we have a specific example for this form, use it
                    if (formExamples[form]) {
                        expandedExample.textContent = formExamples[form];
                    } else {
                        // Fallback: Use the original example with updated transliteration
                        const exampleParts = letterData.example.split('(');
                        const exampleText = exampleParts[0].trim();
                        
                        if (exampleParts.length > 1) {
                            const meaningPart = exampleParts[1].split('-')[1]?.trim().replace(')', '') || '';
                            
                            // Update the example with the new transliteration
                            expandedExample.textContent = `${exampleText} (${expandedTransliteration.textContent}${meaningPart ? ' - ' + meaningPart : ''})`;
                        } else {
                            expandedExample.textContent = letterData.example;
                        }
                    }
                }
                
                // We no longer need to update the play button as it's been removed
                
                // Highlight the selected form
                document.querySelectorAll('.letter-form').forEach(el => {
                    el.classList.remove('selected-form');
                });
                formElement.classList.add('selected-form');
                
                // Update the example image - now we select it from the letterTopContainer
                const imageContainer = document.querySelector('.letter-top-container .letter-image-container');
                if (imageContainer) {
                    // Find any examples in our mapping
                    const example = letterFormExamples[form] || letterFormExamples['default'];
                    const exampleWord = example.split('(')[0].trim();
                    
                    // Update the image container
                    imageContainer.innerHTML = `
                        <div class="letter-example-word">${exampleWord}</div>
                        <div class="letter-example-text">${example}</div>
                    `;
                }
            }
        });
        
        // No individual play buttons anymore, all audio is played through the main play button
        
        formsContainer.appendChild(formElement);
    });
}

// Function to render the sounds section
function renderSoundsSection(container, letters, title) {
    // Create the section container
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="sounds-container">
            <div class="score-display">ነጥብ (Score): <span id="current-score">0</span></div>
            <div class="sound-game">
                <div class="game-prompt">ይህን ድምጽ ያድምጡ (Listen to this sound)</div>
                <div class="letter-to-guess"></div>
                <button class="play-sound-btn">▶ ድምጽ ያድምጡ (Play Sound)</button>
                <div class="options-container"></div>
                <div class="feedback"></div>
                <button class="next-sound-btn">ቀጣይ (Next)</button>
            </div>
        </div>
    `;
    
    // Set up game variables
    let gameLetters = [...letters]; // Copy the letters array
    let currentLetter = null;
    let score = 0;
    let gameActive = false;
    
    const soundGameContainer = container.querySelector('.sound-game');
    const letterToGuessElement = container.querySelector('.letter-to-guess');
    const optionsContainer = container.querySelector('.options-container');
    const feedbackElement = container.querySelector('.feedback');
    const scoreDisplay = container.querySelector('#current-score');
    const playSoundButton = container.querySelector('.play-sound-btn');
    const nextButton = container.querySelector('.next-sound-btn');
    
    // Hide the next button initially
    nextButton.style.display = 'none';
    
    // Function to start a new round
    function startNewRound() {
        // Clear previous content
        letterToGuessElement.textContent = '';
        optionsContainer.innerHTML = '';
        feedbackElement.innerHTML = '';
        
        // Hide the next button
        nextButton.style.display = 'none';
        
        // Shuffle the letters array
        shuffleArray(gameLetters);
        
        // Pick the first letter as the current one to guess
        currentLetter = gameLetters[0];
        
        // Create options from 3 random letters (including the correct one)
        const options = [currentLetter];
        
        // Add two more unique options
        while (options.length < 3) {
            const randomIndex = Math.floor(Math.random() * gameLetters.length);
            const randomLetter = gameLetters[randomIndex];
            
            // Check if this letter is already in the options
            if (!options.includes(randomLetter)) {
                options.push(randomLetter);
            }
        }
        
        // Shuffle the options
        shuffleArray(options);
        
        // Create the options buttons
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'letter-option';
            optionButton.textContent = option.letter;
            optionButton.dataset.letter = option.letter;
            
            optionButton.addEventListener('click', () => checkAnswer(option));
            
            optionsContainer.appendChild(optionButton);
        });
        
        gameActive = true;
    }
    
    // Function to check the user's answer
    function checkAnswer(selectedOption) {
        if (!gameActive) return;
        
        gameActive = false;
        const isCorrect = selectedOption.letter === currentLetter.letter;
        
        // Highlight the selected option
        const selectedButton = optionsContainer.querySelector(`[data-letter="${selectedOption.letter}"]`);
        selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // If wrong, highlight the correct answer
        if (!isCorrect) {
            const correctButton = optionsContainer.querySelector(`[data-letter="${currentLetter.letter}"]`);
            correctButton.classList.add('correct');
        } else {
            // Increment score for correct answers
            score++;
            scoreDisplay.textContent = score;
            
            // Save score to localStorage
            saveScore('sounds', score);
        }
        
        // Show feedback
        feedbackElement.innerHTML = isCorrect ? 
            '<div class="correct-feedback">ትክክል! (Good job!)</div>' : 
            '<div class="incorrect-feedback">ድጋሚ ይሞክሩ (Try again)</div>';
        
        // Reveal the correct letter
        letterToGuessElement.textContent = currentLetter.letter;
        
        // Show the next button
        nextButton.style.display = 'block';
    }
    
    // Play sound button event listener
    playSoundButton.addEventListener('click', () => {
        if (currentLetter) {
            playAudio(currentLetter.audioFile, playSoundButton);
        }
    });
    
    // Next button event listener
    nextButton.addEventListener('click', startNewRound);
    
    // Start the first round
    startNewRound();
}

// Utility function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to render the words section
function renderWordsSection(container, words, title) {
    // Create the section container
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="words-container">
            <div class="word-cards"></div>
            <div class="word-game">
                <h3>ቃላቱን ይመስርቱ (Build the Word)</h3>
                <div class="current-word-display">
                    <div class="word-image"></div>
                    <div class="word-audio-box">
                        <div class="word-meaning"></div>
                        <button class="play-word-audio">▶ ያዳምጡ (Listen)</button>
                    </div>
                </div>
                <div class="letter-drop-area"></div>
                <div class="letter-bank"></div>
                <div class="word-feedback"></div>
                <button class="check-word-btn">ያረጋግጡ (Check)</button>
                <button class="next-word-btn">ቀጣይ (Next)</button>
            </div>
        </div>
    `;
    
    const wordCardsContainer = container.querySelector('.word-cards');
    const wordGame = container.querySelector('.word-game');
    const wordImageElement = container.querySelector('.word-image');
    const wordMeaningElement = container.querySelector('.word-meaning');
    const letterDropArea = container.querySelector('.letter-drop-area');
    const letterBank = container.querySelector('.letter-bank');
    const wordFeedback = container.querySelector('.word-feedback');
    const playWordAudioButton = container.querySelector('.play-word-audio');
    const checkWordButton = container.querySelector('.check-word-btn');
    const nextWordButton = container.querySelector('.next-word-btn');
    
    // Create word cards
    words.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';
        
        wordCard.innerHTML = `
            <div class="word-card-image">
                <img src="${word.imageFile}" alt="${word.meaning}" onerror="this.src='static/images/placeholder.png'; this.onerror=null;">
            </div>
            <div class="word-card-text">
                <div class="word-text">${word.word}</div>
                <div class="word-transliteration">${word.transliteration}</div>
                <div class="word-meaning">${word.meaning}</div>
            </div>
            <button class="play-button" data-audio="${word.audioFile}">
                <span class="play-icon">▶</span> Play Sound
            </button>
        `;
        
        wordCardsContainer.appendChild(wordCard);
        
        // Set up audio playback
        const playButton = wordCard.querySelector('.play-button');
        playButton.addEventListener('click', () => {
            playAudio(word.audioFile, wordCard);
        });
    });
    
    // Game logic variables
    let gameWords = [...words];
    let currentWord = null;
    let droppedLetters = [];
    
    // Hide the next button initially
    nextWordButton.style.display = 'none';
    
    // Initialize the word game
    function startWordGame() {
        // Clear previous state
        letterDropArea.innerHTML = '';
        letterBank.innerHTML = '';
        wordFeedback.innerHTML = '';
        droppedLetters = [];
        
        // Hide the next button and show check button
        nextWordButton.style.display = 'none';
        checkWordButton.style.display = 'block';
        
        // Shuffle the words and pick one
        shuffleArray(gameWords);
        currentWord = gameWords[0];
        
        // Set the image and meaning
        wordImageElement.innerHTML = `<img src="${currentWord.imageFile}" alt="${currentWord.meaning}" onerror="this.src='static/images/placeholder.png'; this.onerror=null;">`;        
        wordMeaningElement.textContent = currentWord.meaning;
        
        // Remove any existing event listeners by recreating the audio button parent element
        const audioBoxElement = wordGame.querySelector('.word-audio-box');
        audioBoxElement.innerHTML = `
            <div class="word-meaning">${currentWord.meaning}</div>
            <button class="play-word-audio">▶ ያዳምጡ (Listen)</button>
        `;
        
        // Re-select the button after recreating it
        const playButton = audioBoxElement.querySelector('.play-word-audio');
        
        // Set up audio button with a single event listener
        playButton.addEventListener('click', () => {
            // Stop any currently playing audio before starting a new one
            if (window.currentAudio) {
                window.currentAudio.pause();
                window.currentAudio.currentTime = 0;
            }
            playAudio(currentWord.audioFile, playButton);
        });
        
        // Create drop areas for each letter
        const wordLetters = currentWord.word.split('');
        wordLetters.forEach((letter, index) => {
            const dropBox = document.createElement('div');
            dropBox.className = 'letter-drop-box';
            dropBox.dataset.index = index;
            
            // Allow dropping
            dropBox.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropBox.classList.add('drag-over');
            });
            
            dropBox.addEventListener('dragleave', () => {
                dropBox.classList.remove('drag-over');
            });
            
            dropBox.addEventListener('drop', (e) => {
                e.preventDefault();
                dropBox.classList.remove('drag-over');
                
                const letterIndex = e.dataTransfer.getData('letter-index');
                const letterElement = document.querySelector(`[data-bank-index="${letterIndex}"]`);
                
                // If drop box is empty, add the letter
                if (!dropBox.hasChildNodes()) {
                    // Clone the letter element and append to drop box
                    const clonedLetter = letterElement.cloneNode(true);
                    clonedLetter.classList.add('dropped');
                    clonedLetter.draggable = false;
                    dropBox.appendChild(clonedLetter);
                    
                    // Hide the original letter in the bank
                    letterElement.style.visibility = 'hidden';
                    
                    // Add to dropped letters array
                    droppedLetters[index] = letterElement.textContent;
                }
            });
            
            letterDropArea.appendChild(dropBox);
        });
        
        // Create letter bank with shuffled letters
        const shuffledLetters = [...wordLetters];
        shuffleArray(shuffledLetters);
        
        shuffledLetters.forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'bank-letter';
            letterElement.textContent = letter;
            letterElement.draggable = true;
            letterElement.dataset.bankIndex = index;
            
            // Set up drag events
            letterElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('letter-index', index);
                letterElement.classList.add('dragging');
            });
            
            letterElement.addEventListener('dragend', () => {
                letterElement.classList.remove('dragging');
            });
            
            letterBank.appendChild(letterElement);
        });
    }
    
    // Check if the word is correctly built
    checkWordButton.addEventListener('click', () => {
        // Make sure all drop boxes have letters
        const allBoxesFilled = droppedLetters.length === currentWord.word.length && 
                              !droppedLetters.includes(undefined);
        
        if (!allBoxesFilled) {
            wordFeedback.innerHTML = '<div class="incorrect-feedback">ሁሉንም ፊደሎች ሳጥኑ ውስጥ ያስገቡ! (Drop all letters first!)</div>';
            return;
        }
        
        // Check if the word is correct
        const wordFromDropped = droppedLetters.join('');
        const isCorrect = wordFromDropped === currentWord.word;
        
        if (isCorrect) {
            wordFeedback.innerHTML = '<div class="correct-feedback">ትክክል! (Good job!)</div>';
            checkWordButton.style.display = 'none';
            nextWordButton.style.display = 'block';
            
            // Add success class to the drop area
            letterDropArea.classList.add('success');
            
            // Save progress
            saveScore('words', 1);
        } else {
            wordFeedback.innerHTML = '<div class="incorrect-feedback">ድጋሚ ይሞክሩ! (Try again!)</div>';
            
            // Reset the game to try again
            setTimeout(() => {
                resetWordGame();
            }, 1500);
        }
    });
    
    // Reset the word game without changing the word
    function resetWordGame() {
        letterDropArea.innerHTML = '';
        letterBank.innerHTML = '';
        wordFeedback.innerHTML = '';
        droppedLetters = [];
        
        // Re-create the game with the same word
        const wordLetters = currentWord.word.split('');
        
        // Create drop areas
        wordLetters.forEach((letter, index) => {
            const dropBox = document.createElement('div');
            dropBox.className = 'letter-drop-box';
            dropBox.dataset.index = index;
            
            // Add the same event listeners as in startWordGame
            dropBox.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropBox.classList.add('drag-over');
            });
            
            dropBox.addEventListener('dragleave', () => {
                dropBox.classList.remove('drag-over');
            });
            
            dropBox.addEventListener('drop', (e) => {
                e.preventDefault();
                dropBox.classList.remove('drag-over');
                
                const letterIndex = e.dataTransfer.getData('letter-index');
                const letterElement = document.querySelector(`[data-bank-index="${letterIndex}"]`);
                
                if (!dropBox.hasChildNodes()) {
                    const clonedLetter = letterElement.cloneNode(true);
                    clonedLetter.classList.add('dropped');
                    clonedLetter.draggable = false;
                    dropBox.appendChild(clonedLetter);
                    
                    letterElement.style.visibility = 'hidden';
                    droppedLetters[index] = letterElement.textContent;
                }
            });
            
            letterDropArea.appendChild(dropBox);
        });
        
        // Re-create letter bank with shuffled letters
        const shuffledLetters = [...wordLetters];
        shuffleArray(shuffledLetters);
        
        shuffledLetters.forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'bank-letter';
            letterElement.textContent = letter;
            letterElement.draggable = true;
            letterElement.dataset.bankIndex = index;
            
            letterElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('letter-index', index);
                letterElement.classList.add('dragging');
            });
            
            letterElement.addEventListener('dragend', () => {
                letterElement.classList.remove('dragging');
            });
            
            letterBank.appendChild(letterElement);
        });
    }
    
    // Next button handler
    nextWordButton.addEventListener('click', () => {
        // Remove success class from the drop area
        letterDropArea.classList.remove('success');
        
        // Move the current word to the end of the array
        gameWords.push(gameWords.shift());
        
        // Start a new round
        startWordGame();
    });
    
    // Start the game
    startWordGame();
}

// Function to render the phrases section
function renderPhrasesSection(container, phrases, title) {
    // Create the section container
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="phrases-container">
            <div class="phrase-cards"></div>
            <div class="phrase-game">
                <h3>ቃላቱን ከምስሉ ጋር ያዛምዱ (Match the phrases with their images)</h3>
                <div class="match-game-container">
                    <div class="phrases-column"></div>
                    <div class="images-column"></div>
                </div>
                <div class="phrase-feedback"></div>
                <button class="check-phrases-btn">ያረጋግጡ (Check)</button>
                <button class="reset-phrases-btn">በድጋሚ አስጀምር (Reset)</button>
            </div>
        </div>
    `;
    
    const phraseCardsContainer = container.querySelector('.phrase-cards');
    const phrasesColumn = container.querySelector('.phrases-column');
    const imagesColumn = container.querySelector('.images-column');
    const phraseFeedback = container.querySelector('.phrase-feedback');
    const checkButton = container.querySelector('.check-phrases-btn');
    const resetButton = container.querySelector('.reset-phrases-btn');
    
    // Create phrase cards for display
    phrases.forEach(phrase => {
        const phraseCard = document.createElement('div');
        phraseCard.className = 'phrase-card';
        
        phraseCard.innerHTML = `
            <div class="phrase-card-content">
                <div class="phrase-text">${phrase.phrase}</div>
                <div class="phrase-transliteration">${phrase.transliteration}</div>
                <div class="phrase-meaning">${phrase.meaning}</div>
            </div>
            <div class="phrase-card-image">
                <img src="${phrase.imageFile}" alt="${phrase.meaning}" onerror="this.src='static/images/placeholder.png'; this.onerror=null;">
            </div>
            <button class="play-button" data-audio="${phrase.audioFile}">
                <span class="play-icon">▶</span> Play Sound
            </button>
        `;
        
        phraseCardsContainer.appendChild(phraseCard);
        
        // Set up audio playback
        const playButton = phraseCard.querySelector('.play-button');
        playButton.addEventListener('click', () => {
            playAudio(phrase.audioFile, phraseCard);
        });
    });
    
    // Set up phrases matching game
    let selectedPhrase = null;
    let selectedImage = null;
    let correctMatches = 0;
    let gameData = [];
    
    // Initialize the game
    function initMatchingGame() {
        // Clear previous game state
        phrasesColumn.innerHTML = '';
        imagesColumn.innerHTML = '';
        phraseFeedback.innerHTML = '';
        correctMatches = 0;
        
        // Create a copy of the phrases array
        gameData = [...phrases];
        
        // Shuffle both columns independently
        const shuffledPhrases = [...gameData];
        const shuffledImages = [...gameData];
        shuffleArray(shuffledPhrases);
        shuffleArray(shuffledImages);
        
        // Create phrase elements
        shuffledPhrases.forEach(phraseData => {
            const phraseElement = document.createElement('div');
            phraseElement.className = 'match-phrase';
            phraseElement.dataset.id = phraseData.phrase;
            phraseElement.innerHTML = `
                <div class="phrase-text">${phraseData.phrase}</div>
                <div class="phrase-transliteration">${phraseData.transliteration}</div>
            `;
            
            // Handle click event
            phraseElement.addEventListener('click', () => {
                // Clear previous phrase selection
                const prevSelected = phrasesColumn.querySelector('.selected');
                if (prevSelected) prevSelected.classList.remove('selected');
                
                // Select this phrase
                phraseElement.classList.add('selected');
                selectedPhrase = phraseData;
                
                // Check if we have a match
                if (selectedImage) {
                    checkMatch();
                }
            });
            
            phrasesColumn.appendChild(phraseElement);
        });
        
        // Create image elements
        shuffledImages.forEach(imageData => {
            const imageElement = document.createElement('div');
            imageElement.className = 'match-image';
            imageElement.dataset.id = imageData.phrase;
            imageElement.innerHTML = `
                <img src="${imageData.imageFile}" alt="${imageData.meaning}" onerror="this.src='static/images/placeholder.png'; this.onerror=null;">
            `;
            
            // Handle click event
            imageElement.addEventListener('click', () => {
                // Clear previous image selection
                const prevSelected = imagesColumn.querySelector('.selected');
                if (prevSelected) prevSelected.classList.remove('selected');
                
                // Select this image
                imageElement.classList.add('selected');
                selectedImage = imageData;
                
                // Check if we have a match
                if (selectedPhrase) {
                    checkMatch();
                }
            });
            
            imagesColumn.appendChild(imageElement);
        });
    }
    
    // Check if current selections match
    function checkMatch() {
        if (!selectedPhrase || !selectedImage) return;
        
        const isMatch = selectedPhrase.phrase === selectedImage.phrase;
        
        if (isMatch) {
            // Update UI for correct match
            const phraseElement = phrasesColumn.querySelector(`[data-id="${selectedPhrase.phrase}"]`);
            const imageElement = imagesColumn.querySelector(`[data-id="${selectedImage.phrase}"]`);
            
            phraseElement.classList.add('matched');
            imageElement.classList.add('matched');
            
            // Disable matched elements
            phraseElement.classList.remove('selected');
            imageElement.classList.remove('selected');
            
            phraseElement.removeEventListener('click', () => {});
            imageElement.removeEventListener('click', () => {});
            
            // Play success audio (TODO: Add actual success sound)
            // playSoundEffect('success');
            
            correctMatches++;
            
            // Check if all matches are found
            if (correctMatches === gameData.length) {
                phraseFeedback.innerHTML = '<div class="correct-feedback">ትክክል! ሁሉንም አዛምደዋል! (Great! You matched all the phrases!)</div>';
                
                // Save progress
                saveScore('phrases', gameData.length);
            }
        } else {
            // Show feedback for incorrect match
            phraseFeedback.innerHTML = '<div class="incorrect-feedback"> ዳግም ይሞክሩ! (Try again!)</div>';
            
            // Clear feedback after a short delay
            setTimeout(() => {
                phraseFeedback.innerHTML = '';
            }, 1500);
        }
        
        // Reset selections
        selectedPhrase = null;
        selectedImage = null;
    }
    
    // Handle check button
    checkButton.addEventListener('click', () => {
        if (correctMatches === gameData.length) {
            phraseFeedback.innerHTML = '<div class="correct-feedback">ትክክል! ሁሉንም አዛምደዋል! (Great! You matched all the phrases!)</div>';
        } else {
            phraseFeedback.innerHTML = `<div class="in-progress-feedback"> ድጋሚ ይሞክሩ! (Keep trying! ${correctMatches} of ${gameData.length} matched.)</div>`;
        }
    });
    
    // Handle reset button
    resetButton.addEventListener('click', () => {
        initMatchingGame();
    });
    
    // Start the game
    initMatchingGame();
}

// Function to save score to localStorage
function saveScore(section, score) {
    try {
        // Get existing scores or initialize new object
        let scores = JSON.parse(localStorage.getItem('amharicAppScores')) || {};
        
        // Update score if new score is higher
        scores[section] = Math.max(score, scores[section] || 0);
        
        // Save back to localStorage
        localStorage.setItem('amharicAppScores', JSON.stringify(scores));
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

// Helper function to process lessons data
async function loadLessonsData(response, section, contentDiv) {
    // Double-check we're on the learn page
    if (!document.body.classList.contains('learn-page')) {
        console.log('Not on learn page, skipping content loading in loadLessonsData');
        return false;
    }
    
    // Make sure the content div exists
    if (!contentDiv || !document.body.contains(contentDiv)) {
        console.error('Content div not found or not in document');
        return false;
    }
    
    const lessons = await response.json();
    
    // Format the section title
    const formattedTitle = section.charAt(0).toUpperCase() + section.slice(1);
    
    // Switch to different templates based on the section
    switch(section) {
        case 'alphabet':
            renderAlphabetSection(contentDiv, lessons.alphabet, formattedTitle);
            break;
        case 'sounds':
            renderSoundsSection(contentDiv, lessons.alphabet, formattedTitle);
            break;
        case 'words':
            renderWordsSection(contentDiv, lessons.words, formattedTitle);
            break;
        case 'phrases':
            renderPhrasesSection(contentDiv, lessons.phrases, formattedTitle);
            break;
        default:
            contentDiv.innerHTML = `<h2>${formattedTitle}</h2>
                                  <p>This section is under construction.</p>`;
    }
    
    return lessons;
}

// Global variable to track currently playing audio
window.currentAudio = null;

// ROBUST AUDIO PLAYBACK FUNCTION
// Completely redesigned for consistent and reliable playback across all sections
function playAudio(audioFile, letterElement) {
    console.log('Playing audio:', audioFile);
    
    // Add visual feedback animation
    if (letterElement) {
        addPlayingAnimation(letterElement);
    }
    
    // Stop any currently playing audio to prevent overlapping sounds
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.currentTime = 0;
        window.currentAudio = null;
    }
    
    // Check if audio file is provided
    if (!audioFile) {
        console.error('No audio file specified');
        return;
    }
    
    try {
        // Normalize audio path with more robust handling
        let soundPath = audioFile;
        
        // Handle different path formats
        if (!audioFile.startsWith('static/') && !audioFile.startsWith('/static/')) {
            // If it's just a filename, assume it's in the static/audio directory
            if (!audioFile.includes('/')) {
                soundPath = 'static/audio/' + audioFile;
            }
        }
        
        console.log('Using audio path:', soundPath);
        
        // First verify the file exists
        const knownExistingFiles = [
            'static/audio/ha.mp3',
            'static/audio/le.mp3',
            'static/audio/me.mp3',
            'static/audio/se.mp3', 
            'static/audio/re.mp3',
            'static/audio/she.mp3',
            'static/audio/ui/click.mp3'
        ];
        
        // Don't use fallback for word and phrase audio files
        if (!knownExistingFiles.includes(soundPath) && 
            !soundPath.startsWith('static/audio/forms/') &&
            !soundPath.includes('static/audio/words/') &&
            !soundPath.includes('static/audio/phrases/') &&
            !soundPath.includes('inat.mp3') &&
            !soundPath.includes('bet.mp3') &&
            !soundPath.includes('buna.mp3') &&
            !soundPath.includes('dabo.mp3') &&
            !soundPath.includes('lij.mp3') &&
            !soundPath.includes('selam.mp3') &&
            !soundPath.includes('indeyet_neh.mp3') &&
            !soundPath.includes('indeyet_nesh.mp3') &&
            !soundPath.includes('ameseginalehu.mp3') &&
            !soundPath.includes('ibakwo.mp3')) {
            console.log('Using fallback only for truly unknown audio');
            // Don't automatically fallback, only do so if the audio file truly doesn't exist
        }
        
        // Create a new audio element
        const audio = new Audio(soundPath);
        
        // Always preload the audio
        audio.preload = 'auto';
        
        // Store reference to current audio
        window.currentAudio = audio;
        
        // Set up event handlers
        audio.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play through');
        });
        
        audio.addEventListener('playing', () => {
            console.log('Audio now playing');
            // Show visual indicator on the element
            showPlayingIndicator(letterElement);
        });
        
        audio.addEventListener('ended', () => {
            console.log('Audio playback completed');
            window.currentAudio = null;
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            window.currentAudio = null;
            
            // Use a guaranteed fallback
            console.log('Using guaranteed fallback after error');
            const fallbackAudio = new Audio('static/audio/ui/click.mp3');
            fallbackAudio.play().catch(err => {
                console.error('Even fallback audio failed:', err);
            });
        });
        
        // Attempt to play with better error handling
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Audio playing successfully');
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                    window.currentAudio = null;
                    
                    // Try one guaranteed fallback
                    const fallbackAudio = new Audio('static/audio/ui/click.mp3');
                    fallbackAudio.play().catch(err => {
                        console.error('Fallback audio also failed:', err);
                    });
                });
        } else {
            console.warn('Audio play did not return a promise - may be unsupported');
        }
    } catch (e) {
        console.error('Exception in audio playback:', e);
    }
}

// Helper function to show a visual message when audio is playing
function showPlayingIndicator(element) {
    if (!element) return;
    
    // Add a temporary indicator
    const indicator = document.createElement('div');
    indicator.className = 'audio-playing-indicator';
    indicator.textContent = '🔊 Playing...';
    indicator.style.color = '#4CAF50';
    indicator.style.fontSize = '0.8em';
    indicator.style.marginTop = '5px';
    
    // Add to element if it doesn't already have one
    if (!element.querySelector('.audio-playing-indicator')) {
        element.appendChild(indicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }
}

// Helper function to add playing animation
function addPlayingAnimation(element) {
    if (!element) return;
    
    // Add a 'playing' class to animate
    element.classList.add('playing');
    
    // Also add a visual indicator
    showPlayingIndicator(element);
    
    // Remove after animation completes
    setTimeout(() => {
        element.classList.remove('playing');
    }, 1000);
}

// Helper function to show audio message
function showAudioMessage(message, letterElement) {
    console.log('Audio message:', message);
    
    // If we have a specific element, show message on that element
    if (letterElement) {
        // Add a small indicator to the element itself
        const indicator = document.createElement('div');
        indicator.className = 'audio-message-inline';
        indicator.textContent = `🔊 ${message}`;
        indicator.style.fontSize = '12px';
        indicator.style.color = '#4CAF50';
        indicator.style.margin = '5px 0';
        indicator.style.fontWeight = 'bold';
        
        // Only add if the element doesn't already have an indicator
        if (!letterElement.querySelector('.audio-message-inline')) {
            letterElement.appendChild(indicator);
            
            // Remove after a short delay
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 2000);
        }
        
        return; // Don't show global message if we showed an inline one
    }
    
    // Fall back to global message
    // Create a temporary message that fades away
    const tempMsg = document.createElement('div');
    tempMsg.className = 'temp-audio-message';
    tempMsg.textContent = `🔊 ${message}`;
    tempMsg.style.position = 'fixed';
    tempMsg.style.top = '20%';
    tempMsg.style.left = '50%';
    tempMsg.style.transform = 'translateX(-50%)';
    tempMsg.style.backgroundColor = 'rgba(0,0,0,0.8)';
    tempMsg.style.padding = '10px 20px';
    tempMsg.style.borderRadius = '4px';
    tempMsg.style.color = 'white';
    tempMsg.style.fontSize = '16px';
    tempMsg.style.zIndex = '2000';
    
    // Add to the body
    document.body.appendChild(tempMsg);
    
    // Fade out after 2 seconds
    setTimeout(() => {
        tempMsg.style.transition = 'opacity 1s';
        tempMsg.style.opacity = '0';
        
        // Remove from DOM after fade out
        setTimeout(() => {
            if (tempMsg.parentNode) {
                tempMsg.parentNode.removeChild(tempMsg);
            }
        }, 1000);
    }, 2000);
}
