/**
 * Chrome Extension Background Service Worker
 * Handles extension lifecycle and communication between content scripts and popup
 */

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open onboarding page on first install
    chrome.tabs.create({ url: 'index.html' });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProfileData') {
    // Retrieve stored profile data
    chrome.storage.local.get('onboardingData', (result) => {
      sendResponse({ data: result.onboardingData || null });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'saveProfileData') {
    // Save profile data to storage
    chrome.storage.local.set({ onboardingData: request.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'autofillForm') {
    // Send autofill data to content script
    chrome.storage.local.get('onboardingData', (result) => {
      const data = result.onboardingData;
      if (data) {
        // Send to content script in active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'fillForm',
              data: data
            });
          }
        });
      }
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Content script will be injected via manifest
  }
});
