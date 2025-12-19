/**
 * Chrome Extension Background Service Worker
 * Handles job application detection, storage, and communication
 */

// Application storage structure
const STORAGE_KEYS = {
  ONBOARDING_DATA: "onboardingData",
  APPLICATIONS: "applications",
  DETECTED_JOB: "detectedJob",
};

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: "index.html" });
  }
});

/**
 * Listen for messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Profile data requests
  if (request.action === "getProfileData") {
    chrome.storage.local.get(STORAGE_KEYS.ONBOARDING_DATA, result => {
      sendResponse({ data: result[STORAGE_KEYS.ONBOARDING_DATA] || null });
    });
    return true;
  }

  if (request.action === "saveProfileData") {
    chrome.storage.local.set(
      {
        [STORAGE_KEYS.ONBOARDING_DATA]: request.data,
      },
      () => {
        sendResponse({ success: true });
      }
    );
    return true;
  }

  if (request.action === "autofillForm") {
    chrome.storage.local.get(STORAGE_KEYS.ONBOARDING_DATA, result => {
      const data = result[STORAGE_KEYS.ONBOARDING_DATA];
      if (data && sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "fillForm",
          data: data,
        });
      }
      sendResponse({ success: true });
    });
    return true;
  }

  // Job application detection
  if (request.action === "jobApplicationDetected") {
    handleJobApplicationDetected(request, sender, sendResponse);
    return true;
  }

  if (request.action === "saveApplication") {
    saveApplication(request.data, sender, sendResponse);
    return true;
  }

  if (request.action === "getApplications") {
    getApplications(sendResponse);
    return true;
  }

  if (request.action === "getDetectedJob") {
    chrome.storage.local.get(STORAGE_KEYS.DETECTED_JOB, result => {
      sendResponse({
        detectedJob: result[STORAGE_KEYS.DETECTED_JOB] || null,
      });
    });
    return true;
  }

  if (request.action === "clearDetectedJob") {
    chrome.storage.local.remove(STORAGE_KEYS.DETECTED_JOB, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

/**
 * Handle detected job application
 */
function handleJobApplicationDetected(request, sender, sendResponse) {
  const { detection, jobDetails, formData } = request;

  // Only store if confidence is high enough
  if (detection.confidence >= 3 || detection.isKnownATS) {
    const detectedJob = {
      ...detection,
      ...jobDetails,
      tabId: sender.tab?.id,
      capturedAt: new Date().toISOString(),
      formData,
    };

    // Store as detected job
    chrome.storage.local.set(
      { [STORAGE_KEYS.DETECTED_JOB]: detectedJob },
      () => {
        sendResponse({ acknowledged: true });
      }
    );

    // Notify popup if it's open
    chrome.runtime
      .sendMessage({
        action: "jobDetected",
        job: detectedJob,
      })
      .catch(() => {
        // Popup not open, that's okay
      });
  } else {
    sendResponse({ acknowledged: false });
  }
}

/**
 * Save application to history
 */
function saveApplication(applicationData, sender, sendResponse) {
  chrome.storage.local.get(STORAGE_KEYS.APPLICATIONS, result => {
    const applications = result[STORAGE_KEYS.APPLICATIONS] || [];

    // Add timestamp and tabId if not present
    const newApplication = {
      ...applicationData,
      id: `app_${Date.now()}`,
      timestamp: applicationData.timestamp || new Date().toISOString(),
      tabId: sender.tab?.id,
      status: "Applied", // Default status
    };

    applications.push(newApplication);

    // Keep only last 100 applications
    if (applications.length > 100) {
      applications.shift();
    }

    chrome.storage.local.set(
      { [STORAGE_KEYS.APPLICATIONS]: applications },
      () => {
        sendResponse({ success: true, application: newApplication });
      }
    );
  });
}

/**
 * Get all stored applications
 */
function getApplications(sendResponse) {
  chrome.storage.local.get(STORAGE_KEYS.APPLICATIONS, result => {
    const applications = result[STORAGE_KEYS.APPLICATIONS] || [];
    sendResponse({ applications });
  });
}

/**
 * Listen for tab updates
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Content script will be auto-injected via manifest
  }
});

/**
 * Clean up storage when tab closes
 */
chrome.tabs.onRemoved.addListener(tabId => {
  // Could clean up tab-specific data here if needed
});
