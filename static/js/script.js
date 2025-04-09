// Main application logic
document.addEventListener('DOMContentLoaded', () => {
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

// Function to load different sections
async function loadSection(section) {
    const contentDiv = document.getElementById('content');
    
    // Clear current content
    contentDiv.innerHTML = `<h2>Loading ${section}...</h2>`;
    
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
    }
}

// Function to render the alphabet section
function renderAlphabetSection(container, letters, title) {
    // Create the section container
    container.innerHTML = `
        <h2>${title}</h2>
        <div class="alphabet-container"></div>
    `;
    
    const alphabetContainer = container.querySelector('.alphabet-container');
    
    // Generate letters display
    letters.forEach(letter => {
        const letterElement = document.createElement('div');
        letterElement.className = 'letter-card';
        
        letterElement.innerHTML = `
            <div class="letter">${letter.letter}</div>
            <div class="transliteration">${letter.transliteration}</div>
            <div class="example">${letter.example}</div>
            <button class="play-button" data-audio="${letter.audioFile}">
                <span class="play-icon">▶</span> Play Sound
            </button>
        `;
        
        alphabetContainer.appendChild(letterElement);
        
        // Set up audio playback
        const playButton = letterElement.querySelector('.play-button');
        playButton.addEventListener('click', () => {
            playAudio(letter.audioFile, letterElement);
        });
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
            '<div class="correct-feedback">መልካም! (Good job!)</div>' : 
            '<div class="incorrect-feedback">ዳግም ሞክር (Try again)</div>';
        
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
                <h3>ቀራቱን ይመስርቱ (Build the Word)</h3>
                <div class="current-word-display">
                    <div class="word-image"></div>
                    <div class="word-audio-box">
                        <div class="word-meaning"></div>
                        <button class="play-word-audio">▶ ይደምሱ (Listen)</button>
                    </div>
                </div>
                <div class="letter-drop-area"></div>
                <div class="letter-bank"></div>
                <div class="word-feedback"></div>
                <button class="check-word-btn">ይከታተሉ (Check)</button>
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
        
        // Set up audio button
        playWordAudioButton.addEventListener('click', () => {
            playAudio(currentWord.audioFile, playWordAudioButton);
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
            wordFeedback.innerHTML = '<div class="incorrect-feedback">ደግሞ ሠምር! (Drop all letters first!)</div>';
            return;
        }
        
        // Check if the word is correct
        const wordFromDropped = droppedLetters.join('');
        const isCorrect = wordFromDropped === currentWord.word;
        
        if (isCorrect) {
            wordFeedback.innerHTML = '<div class="correct-feedback">መልካም! (Good job!)</div>';
            checkWordButton.style.display = 'none';
            nextWordButton.style.display = 'block';
            
            // Add success class to the drop area
            letterDropArea.classList.add('success');
            
            // Save progress
            saveScore('words', 1);
        } else {
            wordFeedback.innerHTML = '<div class="incorrect-feedback">ዳግም ሞክር! (Try again!)</div>';
            
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
                <h3>ዝምች የሚመጡበትን ቃላት ያገናኝቡ (Match the phrases with their images)</h3>
                <div class="match-game-container">
                    <div class="phrases-column"></div>
                    <div class="images-column"></div>
                </div>
                <div class="phrase-feedback"></div>
                <button class="check-phrases-btn">ይከታተሉ (Check)</button>
                <button class="reset-phrases-btn">ዳግም ሀያውት (Reset)</button>
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
                phraseFeedback.innerHTML = '<div class="correct-feedback">መልካም! ሁሉም ሥራ አጠናቀወት! (Great! You matched all the phrases!)</div>';
                
                // Save progress
                saveScore('phrases', gameData.length);
            }
        } else {
            // Show feedback for incorrect match
            phraseFeedback.innerHTML = '<div class="incorrect-feedback">ይሞክሩ! ይመጥን ዳግም! (Try again!)</div>';
            
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
            phraseFeedback.innerHTML = '<div class="correct-feedback">መልካም! ሁሉም ሥራ አጠናቀወት! (Great! You matched all the phrases!)</div>';
        } else {
            phraseFeedback.innerHTML = `<div class="in-progress-feedback">ለሠረቱት ዳግም ይሞክሩ! (Keep trying! ${correctMatches} of ${gameData.length} matched.)</div>`;
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

// Function to play audio and add animation to the letter card
function playAudio(audioFile, letterElement) {
    // Create audio element if it doesn't exist
    let audio = document.querySelector(`audio[data-src="${audioFile}"]`);
    
    if (!audio) {
        // Handle GitHub Pages paths
        let audioPath = audioFile;
        
        // Check if we're on GitHub Pages and the audio fails to load
        if (window.location.hostname.includes('github.io')) {
            // Make sure the full GitHub Pages URL is used
            if (!audioFile.startsWith('http')) {
                audioPath = `https://buch-max.github.io/amharic-kids-app2/${audioFile}`;
            }
        }
        
        audio = new Audio(audioPath);
        audio.dataset.src = audioFile;
        document.body.appendChild(audio);
    }
    
    // Play the audio
    audio.currentTime = 0;
    audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        // Show a message that audio files need to be added
        alert('Audio file not found. Please add audio recordings for the letters.');
    });
    
    // Add animation class to the letter
    letterElement.classList.add('playing');
    
    // Remove animation class after animation ends
    setTimeout(() => {
        letterElement.classList.remove('playing');
    }, 1000);
}
