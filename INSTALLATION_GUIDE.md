# Chrome Extension Installation & Testing Guide

## Quick Start: Load the Extension

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome
2. Click the menu icon (⋮) in the top-right corner
3. Go to **More Tools** → **Extensions**
4. Or paste this in the address bar: `chrome://extensions/`

### Step 2: Enable Developer Mode
- Toggle the **Developer mode** switch in the top-right corner
- You should see new buttons appear: "Load unpacked", "Pack extension", "Update"

### Step 3: Load the Extension
1. Click the **Load unpacked** button
2. Navigate to: `/home/ubuntu/chrome-extension-onboarding/dist/public/`
3. Select this folder and click **Open**
4. The extension should now appear in your extensions list!

### Step 4: Pin the Extension
1. Click the Extensions icon (puzzle piece) in the Chrome toolbar
2. Find "Profile AutoFill" in the list
3. Click the pin icon to add it to your toolbar for easy access

## Testing the Extension

### Test 1: Open the Onboarding Wizard
1. Click the "Profile AutoFill" extension icon in your toolbar
2. The onboarding popup should open
3. You should see the first step: "PERSONAL PROFILE"
4. Verify the neo-brutalist design:
   - Heavy IBM Plex Mono typography
   - Thick 3px borders on all inputs
   - Electric blue accent color (#0066ff)
   - Sharp corners (no border-radius)

### Test 2: Fill Out Profile Data
1. Complete all 6 steps of the wizard:
   - **Step 1**: Personal Profile (name, address)
   - **Step 2**: Contact Information (email, phone)
   - **Step 3**: Work Experience (job history)
   - **Step 4**: Education & Languages
   - **Step 5**: Resume & Skills (file upload + skill tags)
   - **Step 6**: Websites & Eligibility (GitHub, LinkedIn, etc.)
2. Click **NEXT** to navigate between steps
3. Click **BACK** to revisit previous steps
4. On the final step, click **SUBMIT** to save your profile

### Test 3: Verify Data Persistence
1. Close the extension popup
2. Click the extension icon again
3. Your data should still be there (check one of the earlier steps)
4. This confirms data is being saved to Chrome storage

### Test 4: Test Autofill on a Form Website
1. Open a website with a form (e.g., a job application form)
2. Click the extension icon
3. You should see an "Autofill Form" button (in future versions)
4. Click it to autofill compatible fields
5. The extension will:
   - Match form fields to your profile data
   - Fill in name, email, phone, address, etc.
   - Show a notification: "Autofilled X fields"

### Test 5: Resume Upload
1. Go to Step 5 (Resume & Skills)
2. Click the upload area
3. Select a PDF or DOCX file from your computer
4. The file should be converted to Base64 automatically
5. You should see the filename displayed
6. Submit the form to save

### Test 6: Skill Management
1. Go to Step 5 (Resume & Skills)
2. Type a skill in the input field (e.g., "React")
3. Click "ADD" or press Enter
4. The skill should appear as a tag below
5. Click the ✕ button to remove a skill
6. Add multiple skills and verify they all save

## Troubleshooting

### Extension doesn't appear after loading
- Refresh the extensions page (F5)
- Check that you selected the correct folder: `/dist/public/`
- Ensure all files are present: manifest.json, background.js, content.js, index.html

### Popup is blank or shows errors
1. Right-click the extension icon
2. Select "Inspect popup"
3. Check the Console tab for error messages
4. Common issues:
   - Missing CSS files (check Network tab)
   - JavaScript errors (check Console tab)
   - Path issues in manifest.json

### Data not saving
1. Open DevTools (F12)
2. Go to Application → Storage → Chrome Storage
3. Check if "onboardingData" key exists
4. If not, check Console for errors

### Autofill not working
1. Ensure you've completed the onboarding wizard
2. Check that form field names match common patterns:
   - `name`, `firstName`, `first_name`, `fname`
   - `email`, `mail`, `email_address`
   - `phone`, `tel`, `phone_number`
   - `address`, `street`, `address1`, `addr1`
   - `city`, `town`, `locality`
   - `state`, `province`, `region`
   - `zip`, `postal`, `postcode`, `zipcode`

### Resume file not uploading
- Ensure file is PDF or DOCX format
- File size should be under 10MB
- Try a different file if the first one fails

## Browser DevTools

### Inspect the Extension
1. Right-click the extension icon
2. Select "Inspect popup" to debug the UI
3. Check Console, Network, and Storage tabs

### View Stored Data
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Storage** → **Chrome Storage**
4. Look for "onboardingData" key
5. Click to view the full JSON data

### Monitor Messages
1. Open DevTools
2. Go to **Console** tab
3. Messages from background script and content script will appear here

## Building for Distribution

### Create a ZIP for Chrome Web Store
```bash
# After building with pnpm build
cd dist/public
zip -r profile-autofill.zip .
```

Then upload to Chrome Web Store:
1. Go to https://chrome.google.com/webstore/devconsole/
2. Create a new item
3. Upload the ZIP file
4. Fill in description, screenshots, etc.
5. Submit for review

### Icon Requirements
For Chrome Web Store, you'll need icons:
- 128x128 px (required)
- 48x48 px (optional)
- 16x16 px (optional)

Place these in `client/public/images/` as:
- `icon-128.png`
- `icon-48.png`
- `icon-16.png`

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Onboarding wizard displays correctly
- [ ] All 6 steps are accessible
- [ ] Form inputs have proper styling (thick borders, blue focus)
- [ ] Data persists after closing and reopening
- [ ] Resume file uploads and converts to Base64
- [ ] Skills can be added and removed
- [ ] All fields can be filled and saved
- [ ] Progress indicator updates correctly
- [ ] Navigation buttons work (Next, Back, Submit)
- [ ] No console errors or warnings

## Next Steps

1. **Add Icons**: Create 128x128, 48x48, and 16x16 PNG icons
2. **Test on Multiple Sites**: Try autofill on job sites, forms, etc.
3. **Customize**: Modify colors, fonts, or layout in `client/src/index.css`
4. **Deploy**: Submit to Chrome Web Store for distribution
5. **Iterate**: Gather user feedback and improve features

## Support

For issues or questions:
- Check the Console tab in DevTools
- Review the EXTENSION_README.md for detailed documentation
- Check manifest.json for permission issues
- Verify all files are present in the dist/public/ folder

Happy testing! 🚀
