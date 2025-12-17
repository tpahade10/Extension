# Profile AutoFill Chrome Extension

A powerful, neo-brutalist designed Chrome extension that streamlines form filling with intelligent profile data management. Built with React, Vite, and modern web technologies.

## Features

### 🎯 Smart Onboarding Flow
- **6-step wizard** guiding users through comprehensive profile setup
- **Intuitive form validation** with clear error messages
- **Progress tracking** with visual indicators and step navigation
- **Data persistence** using Chrome's local storage API

### 📋 Profile Management
The extension collects and securely stores:
- **Personal Information**: Name, address, contact details
- **Work Experience**: Job history with descriptions and dates
- **Education**: School, degree, field of study, GPA
- **Languages**: Language proficiency and fluency levels
- **Resume**: PDF/DOCX upload with automatic Base64 conversion
- **Skills**: Customizable skill tags (technical and soft skills)
- **Online Presence**: GitHub, LinkedIn, portfolio URLs
- **Eligibility**: Work authorization, sponsorship needs, demographic info

### 🤖 Intelligent Autofill
- **Smart field matching** using natural language processing
- **Automatic form detection** across websites
- **One-click autofill** via extension popup
- **Keyboard shortcuts** for quick access
- **Visual feedback** confirming successful autofill

### 🎨 Neo-Brutalist Design
- **Raw Grid Brutalism** aesthetic with heavy typography
- **IBM Plex Mono** for bold, intentional titles
- **Thick 3px borders** on all interactive elements
- **Electric blue (#0066ff)** accent color
- **Zero rounded corners** for sharp, industrial feel
- **Snappy 100ms transitions** for responsive interactions

## Installation

### For Development
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`
4. Build extension: `pnpm build`
5. Open Chrome and navigate to `chrome://extensions/`
6. Enable "Developer mode" (top right)
7. Click "Load unpacked" and select the `dist` folder

### For Users
- Download the extension from Chrome Web Store (coming soon)
- Or load unpacked from the `dist` folder after building

## Usage

### First Time Setup
1. Click the extension icon in Chrome toolbar
2. Complete the 6-step onboarding wizard
3. Upload your resume (PDF or DOCX)
4. Add your skills and online profiles
5. Click "Submit" to save your profile

### Autofilling Forms
1. Visit any website with a form
2. Click the extension icon
3. Click "Autofill Form" button
4. The extension will intelligently match and fill compatible fields
5. Review and submit the form

### Managing Your Profile
- Click the extension icon anytime to view/edit your profile
- All data is stored locally in your browser
- Data is never sent to external servers

## Technical Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS 4** for styling
- **shadcn/ui** for component primitives
- **Lucide React** for icons

### Extension APIs
- **Chrome Storage API** for persistent data storage
- **Chrome Messaging API** for background-content communication
- **Chrome Tabs API** for form detection and autofill
- **Content Scripts** for DOM manipulation

### File Structure
```
client/
├── public/
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Service worker
│   ├── content.js             # Content script for autofill
│   └── index.html             # Extension popup UI
├── src/
│   ├── components/
│   │   └── OnboardingWizard.tsx  # Main form wizard
│   ├── pages/
│   │   └── Home.tsx           # Popup entry point
│   ├── App.tsx                # Router and layout
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
└── package.json
```

## Data Storage

All user data is stored locally using Chrome's `chrome.storage.local` API:
- **Location**: User's Chrome profile directory
- **Encryption**: Handled by Chrome's storage system
- **Sync**: Not synced across devices (local only)
- **Backup**: Users can export data via browser settings

### Stored Data Structure
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "+1-555-123-4567",
  "addressLine1": "123 Main Street",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94105",
  "country": "United States",
  "workExperience": [
    {
      "jobTitle": "Software Engineer",
      "companyName": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01-15",
      "endDate": "2023-12-31",
      "currentlyWorking": false,
      "jobDescription": "..."
    }
  ],
  "education": [...],
  "languages": [...],
  "resumeFile": null,
  "resumeBase64": "data:application/pdf;base64,...",
  "skills": ["React", "Python", "Project Management"],
  "githubUrl": "https://github.com/johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "portfolioUrl": "https://johndoe.com",
  "workAuthorization": "US Work Authorization",
  "sponsorshipRequired": false,
  "disabilityStatus": "No",
  "veteranStatus": "No",
  "age": "28",
  "gender": "Male",
  "ethnicity": "Asian"
}
```

## Autofill Algorithm

The extension uses intelligent field matching to identify form fields:

1. **Field Identification**: Analyzes input name, id, placeholder, and associated label
2. **Keyword Matching**: Matches field identifiers against profile data keywords
3. **Value Mapping**: Maps profile data to matching form fields
4. **Event Triggering**: Dispatches input, change, and blur events for form library compatibility
5. **User Notification**: Shows confirmation of successful autofill

### Supported Field Types
- Text inputs (name, email, phone, address, etc.)
- Select dropdowns (country, state, gender, etc.)
- Textarea (job description, bio, etc.)
- Date inputs (start date, end date, etc.)
- Checkbox inputs (currently working, fluent, etc.)

## Privacy & Security

- **Local Storage Only**: All data stays on your device
- **No Cloud Sync**: Data is never uploaded to servers
- **No Tracking**: Extension doesn't track user behavior
- **Open Source**: Code is transparent and auditable
- **Permissions**: Only requests necessary Chrome APIs

## Permissions Explained

| Permission | Purpose |
|-----------|---------|
| `storage` | Store user profile data locally |
| `activeTab` | Access current tab for autofill |
| `scripting` | Inject content scripts for form filling |
| `<all_urls>` | Autofill forms on any website |

## Keyboard Shortcuts

(Coming in v1.1)
- `Ctrl+Shift+A` (Windows/Linux) / `Cmd+Shift+A` (Mac): Autofill current form
- `Ctrl+Shift+E` (Windows/Linux) / `Cmd+Shift+E` (Mac): Edit profile

## Troubleshooting

### Forms not autofilling?
- Ensure you've completed the onboarding wizard
- Check that form field names match common patterns
- Some forms use custom field naming that may not be recognized

### Resume not uploading?
- Ensure file is PDF or DOCX format
- File size should be under 10MB
- Check browser console for error messages

### Data not saving?
- Check Chrome storage permissions
- Ensure you're not in incognito mode
- Clear browser cache and reload extension

## Future Enhancements

- [ ] Cloud sync across devices
- [ ] Multiple profile templates
- [ ] Custom field mapping
- [ ] Form history and analytics
- [ ] Keyboard shortcuts
- [ ] Dark mode toggle
- [ ] Export/import profiles
- [ ] Password manager integration

## Development

### Build Commands
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm check      # TypeScript type checking
pnpm format     # Format code with Prettier
```

### Extension Build Output
After running `pnpm build`, the extension files are in:
- `dist/` - Main application bundle
- `dist/public/` - Static assets and extension scripts

### Testing
1. Load unpacked extension from `dist` folder
2. Open extension popup to test UI
3. Visit test websites to verify autofill
4. Check Chrome DevTools console for errors

## Browser Compatibility

- **Chrome**: 90+
- **Edge**: 90+ (Chromium-based)
- **Opera**: 76+
- **Brave**: Latest

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Contact: support@profileautofill.com
- Documentation: https://docs.profileautofill.com

## Changelog

### v1.0.0 (Initial Release)
- Complete onboarding wizard
- Intelligent autofill system
- Profile data management
- Neo-brutalist UI design
- Chrome storage integration
