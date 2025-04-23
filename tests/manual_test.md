# Manual Test Script for Amharic Kids App

## Basic Functionality Tests
- [x] Server starts successfully
- [x] Home page loads correctly
- [x] Navigation to Learn page works

## Learn Page Features

### Letter Display Tests
- [ ] All alphabet letters display correctly
- [ ] Letter cards show proper translations and examples
- [ ] Clicking a letter opens the expanded view modal

### Letter Form Interaction Tests
- [ ] Letter forms display correctly in the expanded view
- [ ] Clicking a letter form updates the main letter display
- [ ] Animation plays when a letter form is clicked
- [ ] Some audio plays when letter forms are clicked
- [ ] The black-bordered example container appears correctly
- [ ] Example word updates when different letter forms are clicked

### Navigation Tests
- [ ] Previous/Next letter buttons navigate through the alphabet
- [ ] Modal can be closed via close button
- [ ] Modal can be closed via Escape key

### Audio Fallbacks
- [ ] If a specific letter form audio isn't available, a fallback plays
- [ ] Animation still works even when audio isn't available
- [ ] No error messages appear in the UI during audio playback

### Responsive Tests
- [ ] Layout adjusts appropriately on smaller screens
- [ ] Forms and example container stack vertically on mobile

## Instructions for Testing

1. Open the browser preview for the app
2. Navigate to the Learn page if not already there
3. Click on one of the alphabet letters (e.g., "ሀ")
4. Verify the letter expands into a modal
5. Check that letter forms appear on the left side
6. Verify the black-bordered example container appears on the right
7. Click on different letter forms and verify:
   - Animation plays
   - Audio attempts to play
   - The example in the black-bordered container updates
8. Test navigation by clicking Previous/Next letter buttons
9. Close the modal and try with a different letter
10. Test responsive behavior by resizing the browser window
