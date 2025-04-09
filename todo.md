# To-Do List: Building the Amharic Learning Web App

## Phase 1: Setup & Basics (2–3 Weeks)
- [ ] **Set Up Project Structure**
  - [ ] Create a new folder (e.g., `amharic-kids-app`).
  - [ ] Add basic files: `index.html`, `styles.css`, `script.js`.
  - [ ] Initialize a Git repository (`git init`) for version control.
  - [ ] Push to GitHub for free backup (optional: private repo).

- [ ] **Build Homepage Skeleton**
  - [ ] Write HTML: `<header>` with app title (e.g., አማርኛ ለልጆች), `<main>` for content, `<footer>` for credits.
  - [ ] Add CSS: Set Ethiopian colors (red, yellow, green), large font (Abyssinica SIL from Google Fonts).
  - [ ] Test in browser to ensure layout works on mobile and desktop.

- [ ] **Implement Alphabet Section (5–10 Letters)**
  - [ ] Hardcode 5–10 letters (e.g., ሀ, ለ, ሐ, መ, ሰ) in a JSON file (`lessons.json`).
  - [ ] Create a letter display: HTML divs with text and audio buttons.
  - [ ] Record audio for each letter (use phone or Audacity; save as .mp3).
  - [ ] Add JavaScript to play audio on click (HTML5 `<audio>`).
  - [ ] Add basic CSS animation (e.g., fade-in when clicked).

- [ ] **Test Initial Setup**
  - [ ] Open on mobile and desktop browsers.
  - [ ] Confirm audio plays and layout is tap/click-friendly.

## Phase 2: Core Modules (4–5 Weeks)
- [ ] **Add Sounds Section**
  - [ ] Reuse letters from Alphabet section.
  - [ ] Create a "Sounds" page with buttons for each sound (e.g., ለ /lä/).
  - [ ] Add JavaScript logic: Play sound, show 3 letter options, check answer.
  - [ ] Record feedback audio (e.g., መልካም! /melkam!/ for correct).

- [ ] **Build Words Section (5 Words)**
  - [ ] Add 5 words to `lessons.json` (e.g., እናት, ቤት, ቡና, ዳቦ, ልጅ).
  - [ ] Create a "Words" page: Show word, audio, and simple illustration.
  - [ ] Draw 5 basic images in Canva (e.g., stick-figure mom, house).
  - [ ] Add drag-and-drop: JavaScript to move letters into place (use `draggable` attribute).
  - [ ] Test word-building works on mobile (tap) and desktop (click).

- [ ] **Create Sound Safari Mini-Game**
  - [ ] Design game: Play a sound, show 3 letters, pick the right one.
  - [ ] Add a baboon image (free from Unsplash or draw in Canva).
  - [ ] Track score with stars (e.g., 3 correct = 3 stars).
  - [ ] Save score in `localStorage`.

- [ ] **Polish Core Modules**
  - [ ] Add navigation: Icon buttons (e.g., letter, sound, word icons) to switch sections.
  - [ ] Test all features on both devices; fix bugs.

## Phase 3: Phrases & Polish (3–4 Weeks)
- [ ] **Add Phrases Section (3–5 Phrases)**
  - [ ] Add 3–5 phrases to `lessons.json` (e.g., ሰላም, እንዴት ነህ?, አመሰግናለሁ).
  - [ ] Create a "Phrases" page: Audio, word breakdown, cartoon scene.
  - [ ] Draw scenes in Canva (e.g., kids waving for ሰላም).
  - [ ] Add matching activity: Drag phrase to image.

- [ ] **Implement Rewards System**
  - [ ] Add star counter: 1 star per correct answer, display total.
  - [ ] Use `localStorage` to save progress across sections.
  - [ ] Show stars on homepage (e.g., "ኮከቦችህ: 15").

- [ ] **Incorporate Cultural Elements**
  - [ ] Add background music: Free Ethiopian instrument clip (e.g., krar from Freesound.org).
  - [ ] Style guide character: Draw a kid in a shamma (Canva).
  - [ ] Include cultural words/phrases (e.g., ቡና, እንጀራ).

- [ ] **Refine UI**
  - [ ] Ensure large buttons and text for 4–7-year-olds.
  - [ ] Add subtle CSS animations (e.g., bounce on correct answers).

## Phase 4: Launch (1–2 Weeks)
- [ ] **Final Testing**
  - [ ] Test all sections (Alphabet, Sounds, Words, Phrases, Game) on mobile and desktop.
  - [ ] Borrow devices if possible or use browser dev tools (e.g., Chrome responsive mode).
  - [ ] Check audio quality and loading speed.

- [ ] **Optimize Assets**
  - [ ] Compress images with TinyPNG (free).
  - [ ] Reduce audio file sizes in Audacity (export as lower bitrate .mp3).

- [ ] **Deploy**
  - [ ] Upload to GitHub Pages or Netlify (free hosting).
  - [ ] Set up a free subdomain (e.g., `amharickids.netlify.app`).
  - [ ] Verify it loads online.

- [ ] **Gather Feedback**
  - [ ] Share link with friends/family with kids aged 4–7.
  - [ ] Note what works and what's confusing; plan fixes.

## Ongoing (Post-Launch)
- [ ] **Iterate**
  - [ ] Add more letters, words, or phrases based on feedback.
  - [ ] Fix bugs or improve features as needed.
- [ ] **Expand (Optional)**
  - [ ] Record higher-quality audio if budget allows.
  - [ ] Buy a cheap domain (e.g., $10/year) for a custom name.

---

## Notes
- **Start Small**: Focus on 10 letters, 5 words, 2 phrases for the first version.
- **DIY Tips**: Use your phone for audio, Canva for art, and free resources online.
- **Time Management**: Aim for 5–10 hours/week to hit the 10–14 week timeline.
