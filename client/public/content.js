/**
 * Chrome Extension Content Script
 * Runs on every page and handles form autofilling with profile data
 */

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    autofillForm(request.data);
    sendResponse({ success: true });
  }
});

/**
 * Autofill form fields with profile data
 * Intelligently matches form fields to profile data based on field names and types
 */
function autofillForm(profileData) {
  const inputs = document.querySelectorAll('input, textarea, select');
  let filledCount = 0;

  inputs.forEach((input) => {
    const name = input.name?.toLowerCase() || '';
    const id = input.id?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    const label = getAssociatedLabel(input)?.toLowerCase() || '';
    const fieldIdentifier = `${name} ${id} ${placeholder} ${label}`;

    // Map profile fields to form fields
    if (matchesField(fieldIdentifier, ['first', 'name', 'fname'])) {
      setInputValue(input, profileData.firstName);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['last', 'surname', 'lname'])) {
      setInputValue(input, profileData.lastName);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['email', 'mail'])) {
      setInputValue(input, profileData.email);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['phone', 'tel', 'mobile'])) {
      setInputValue(input, profileData.phoneNumber);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['address', 'street', 'address1', 'addr'])) {
      setInputValue(input, profileData.addressLine1);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['address2', 'apt', 'suite'])) {
      setInputValue(input, profileData.addressLine2);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['city', 'town'])) {
      setInputValue(input, profileData.city);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['state', 'province', 'region'])) {
      setInputValue(input, profileData.state);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['zip', 'postal', 'postcode'])) {
      setInputValue(input, profileData.postalCode);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['country', 'nation'])) {
      setInputValue(input, profileData.country);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['github', 'github url'])) {
      setInputValue(input, profileData.githubUrl);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['linkedin', 'linkedin url'])) {
      setInputValue(input, profileData.linkedinUrl);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['portfolio', 'website', 'personal'])) {
      setInputValue(input, profileData.portfolioUrl);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['age'])) {
      setInputValue(input, profileData.age);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ['gender'])) {
      setInputValue(input, profileData.gender);
      filledCount++;
    }
  });

  // Notify user of autofill completion
  if (filledCount > 0) {
    showNotification(`Autofilled ${filledCount} field${filledCount > 1 ? 's' : ''}`);
  }
}

/**
 * Set input value and trigger change events
 */
function setInputValue(input, value) {
  if (!value) return;

  if (input.tagName === 'SELECT') {
    // For select dropdowns, find matching option
    const options = input.querySelectorAll('option');
    for (let option of options) {
      if (option.textContent.toLowerCase().includes(value.toLowerCase()) ||
          option.value.toLowerCase().includes(value.toLowerCase())) {
        input.value = option.value;
        break;
      }
    }
  } else {
    input.value = value;
  }

  // Trigger change events for form libraries
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

/**
 * Get associated label for form field
 */
function getAssociatedLabel(input) {
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent;
  }

  // Check parent label
  let parent = input.parentElement;
  while (parent) {
    if (parent.tagName === 'LABEL') {
      return parent.textContent;
    }
    parent = parent.parentElement;
  }

  return '';
}

/**
 * Check if field identifier matches keywords
 */
function matchesField(fieldIdentifier, keywords) {
  return keywords.some(keyword => fieldIdentifier.includes(keyword));
}

/**
 * Show notification to user
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #0066ff;
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add context menu option for autofill
chrome.runtime.sendMessage({ action: 'getProfileData' }, (response) => {
  if (response.data) {
    // Profile data exists, extension is ready
    console.log('Profile AutoFill extension loaded');
  }
});
