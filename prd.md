# Product Requirements Document (PRD): Amharic Learning Web App for Kids

## 1. Overview

### 1.1 Purpose
Develop a web app to teach children aged 4–7 the Amharic alphabet (Fidel), sounds, words, and basic phrases in a fun, interactive, and culturally enriched way.

### 1.2 Target Audience
- **Age Range**: 4–7 years old
- **Users**: Primarily native Amharic speakers or kids in Amharic-speaking households learning early literacy skills.

### 1.3 Goals
- Enable kids to recognize and pronounce Amharic letters, understand their sounds, and build basic vocabulary and phrases.
- Incorporate 50% Ethiopian cultural elements to enhance engagement and context.
- Deliver a simple, audio-driven experience with minimal budget constraints.

### 1.4 Constraints
- **Budget**: Minimal; built solo by a single developer.
- **Language**: Amharic-only instructions.
- **Devices**: Must work on both mobile and desktop.

---

## 2. Features

### 2.1 Learning Modules

#### 2.1.1 Alphabet Section
- **Description**: Teach the Amharic Fidel (e.g., ሀ, ለ, ሐ) and their variations (e.g., ሀ, ሁ, ሂ).
- **Requirements**:
  - Display each letter visually.
  - Include audio pronunciation for each variation.
  - Show a simple animation of stroke order (e.g., CSS or SVG-based).
- **Activity**: Tap/click to hear a sound, then select the matching letter from 3 options.

#### 2.1.2 Sounds/Phonetics Section
- **Description**: Teach individual letter sounds (e.g., ለ /lä/, ሉ /lu/).
- **Requirements**:
  - Audio playback for each sound.
  - Playful audio feedback (e.g., chime for correct answers).
- **Activity**: Hear a sound and tap the correct letter from a small set.

#### 2.1.3 Words Section
- **Description**: Introduce simple Amharic words (e.g., እናት /inat/ = mother, ቤት /bet/ = house).
- **Requirements**:
  - Show the word, audio pronunciation, and a basic illustration.
  - Break down the word into letters with individual sounds.
- **Activity**: Drag letters to form the word (e.g., ቤ + ት = ቤት).

#### 2.1.4 Phrases Section
- **Description**: Teach basic phrases (e.g., ሰላም /selam/ = hello, እንዴት ነህ? /indet neh?/ = how are you?).
- **Requirements**:
  - Audio of the full phrase.
  - Breakdown into words, then letters with sounds.
  - Simple cartoon scene (e.g., kids greeting for ሰላም).
- **Activity**: Match the phrase to a visual cue (e.g., ሰላም to a "hello" image).

### 2.2 Gamification
- **Progress Tracking**: Award stars or smiley faces (e.g., 3 stars per module).
- **Levels**: Unlock modules sequentially: letters → sounds → words → phrases.
- **Mini-Games**:
  - "Sound Safari": Match sounds to letters, guided by an Ethiopian animal (e.g., baboon).
  - "Word Puzzle": Arrange scrambled letters into words or phrases.

### 2.3 User Experience
- **Interface**: Bright, simple design with large, tap-friendly buttons and cartoonish visuals.
- **Instructions**: Amharic-only, short, and simple (e.g., መልካም! /melkam!/ = good job!).
- **Audio-Driven**: Primary guidance via audio (e.g., እሺ! /ishi!/ = okay! for feedback).
- **Cultural Elements (50%)**:
  - Colors: Ethiopian palette (red, yellow, green).
  - Imagery: Traditional items (e.g., coffee pot, injera) in backgrounds or rewards.
  - Guide: Character in Ethiopian attire (e.g., shamma).
  - Music: Subtle Ethiopian instrument sounds (e.g., krar).

---

## 3. Technical Requirements

### 3.1 Frontend
- **Technology**: Vanilla JavaScript, HTML, CSS (no frameworks to minimize complexity).
- **Styling**: Basic CSS with free Amharic font (e.g., "Abyssinica SIL").
- **Animations**: Simple CSS transitions or free SVG animations.
- **Audio**: HTML5 `<audio>` tags with preloaded .mp3 files (self-recorded or free sources).

### 3.2 Backend
- **Approach**: Static app; no server to reduce costs.
- **Data Storage**: Hardcode lessons in a JSON file (e.g., `lessons.json`); use `localStorage` for progress.
- **Content**: Letters, words, phrases, and audio files stored locally.

### 3.3 Deployment
- **Hosting**: Free static hosting (e.g., GitHub Pages, Netlify).
- **Domain**: Free subdomain (e.g., `amharickids.netlify.app`) or low-cost .com (~$10/year).
- **Optimization**: Compress images/audio for fast loading.

### 3.4 Tools
- **Development**: VS Code (free).
- **Graphics**: Canva or GIMP (free) for simple illustrations.
- **Audio**: Record with phone or Audacity; free effects from Freesound.org.

---

## 4. Design Specifications
- **Visuals**: Bold, rounded shapes; Ethiopian-inspired colors; minimal clutter.
- **Font**: "Abyssinica SIL" (large, legible Amharic text).
- **Navigation**: Icon-based (e.g., letter icon for alphabet, speech bubble for phrases).
- **Age Fit**: Large elements, minimal text, audio-driven for 4–7-year-olds.

---

## 5. Development Timeline
- **Phase 1: Setup & Basics (2–3 weeks)**  
  - Build HTML/CSS skeleton with homepage and menu.  
  - Implement 5–10 letters with audio and animations.
- **Phase 2: Core Modules (4–5 weeks)**  
  - Add sounds and words (5 words).  
  - Create one mini-game (e.g., sound matching).
- **Phase 3: Phrases & Polish (3–4 weeks)**  
  - Add 3–5 phrases with illustrations.  
  - Implement stars and local progress tracking.
- **Phase 4: Launch (1–2 weeks)**  
  - Test on mobile/desktop.  
  - Deploy to free hosting and gather feedback.

---

## 6. Success Criteria
- **Functional**: Kids can navigate, hear sounds, and complete activities independently.
- **Engagement**: Positive feedback from 4–7-year-olds and parents on usability and fun.
- **Cultural Fit**: 50% of content reflects Ethiopian elements, enhancing learning context.
- **Budget**: Built and deployed with minimal/no cost.

---

## 7. Assumptions & Risks
- **Assumptions**: 
  - Basic internet access available for target users.
  - Solo developer has time to record audio and create simple graphics.
- **Risks**: 
  - Audio quality may vary with DIY recording.
  - Limited features due to budget; may need expansion later.

---

## 8. Next Steps
- Start with a prototype: 10 letters, 5 words, 2 phrases.
- Use free tools for assets (Canva, Audacity).
- Test with a small group of kids and iterate based on feedback.
