/**
 * Chrome Extension Content Script
 * Detects job application pages and captures application data
 * Also handles form autofilling with profile data
 */

// Known ATS platforms for quick detection
const KNOWN_ATS_PLATFORMS = [
  "greenhouse.io",
  "lever.co",
  "workday.com",
  "ashby.com",
  "bamboohr.com",
  "taleo.net",
  "icims.com",
  "jobvite.com",
  "smartrecruiters.com",
  "careers.google.com",
  "careers.apple.com",
  "careers.microsoft.com",
  "jobs.netflix.com",
  "jobs.apple.com",
];

/**
 * Detect if current page is a job application page
 */
function detectJobApplicationPage() {
  const signals = [];

  // Signal 1: Check URL for job-related keywords
  const urlLower = window.location.href.toLowerCase();
  const urlSignals = [
    /\/apply/i.test(urlLower),
    /\/jobs\//i.test(urlLower),
    /\/careers/i.test(urlLower),
    /\/job-application/i.test(urlLower),
    /\/application/i.test(urlLower),
  ];
  signals.push(...urlSignals);

  // Signal 2: Check for known ATS platforms
  const isKnownATS = KNOWN_ATS_PLATFORMS.some(platform =>
    window.location.hostname.includes(platform)
  );
  if (isKnownATS) {
    signals.push(true, true); // High confidence signals
  }

  // Signal 3: Check page title and heading
  const pageTitle = document.title.toLowerCase();
  const titleSignals = [
    /apply\s+for/i.test(pageTitle),
    /job\s+application/i.test(pageTitle),
    /submit.*application/i.test(pageTitle),
  ];
  signals.push(...titleSignals);

  // Signal 4: Look for application-related buttons
  const buttons = document.querySelectorAll('button, input[type="submit"]');
  const hasApplyButton = Array.from(buttons).some(btn =>
    /apply|submit\s*application|next|continue/i.test(btn.textContent)
  );
  if (hasApplyButton) signals.push(true);

  // Signal 5: Check for form fields (email, resume, experience)
  const hasEmailField = !!document.querySelector('input[type="email"]');
  const hasResumeField = !!document.querySelector('input[type="file"]');
  const hasExperienceField = !!document.querySelector(
    'textarea, input[name*="experience"], textarea[name*="experience"]'
  );

  if (hasEmailField) signals.push(true);
  if (hasResumeField) signals.push(true);
  if (hasExperienceField) signals.push(true);

  // Signal 6: Check for common form field patterns
  const inputs = document.querySelectorAll(
    "input[name], textarea[name], select[name]"
  );
  const fieldPatterns = Array.from(inputs)
    .map(input => input.name?.toLowerCase() || "")
    .join(" ");

  const hasJobFields =
    [
      /first.?name|last.?name/.test(fieldPatterns),
      /email|phone/.test(fieldPatterns),
      /experience|skills/.test(fieldPatterns),
    ].filter(Boolean).length >= 2;

  if (hasJobFields) signals.push(true);

  // Calculate confidence
  const confidence = signals.filter(Boolean).length;
  const isJobPage = confidence >= 3;

  return {
    isJobPage,
    confidence,
    url: window.location.href,
    title: document.title,
    hostname: window.location.hostname,
    isKnownATS,
  };
}

/**
 * Capture form data from job application page
 */
function captureApplicationFormData() {
  const formData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    skills: [],
    workExperience: [],
    education: [],
    timestamp: new Date().toISOString(),
  };

  const inputs = document.querySelectorAll(
    "input[name], textarea[name], select[name]"
  );

  inputs.forEach(input => {
    const name = input.name?.toLowerCase() || "";
    const value = input.value?.trim() || "";
    const placeholder = input.placeholder?.toLowerCase() || "";
    const fieldIdentifier = `${name} ${placeholder}`;

    // Capture text inputs
    if (input.type === "email" || fieldIdentifier.includes("email")) {
      formData.email = value;
    } else if (
      name.includes("first") &&
      (name.includes("name") || placeholder.includes("first"))
    ) {
      formData.firstName = value;
    } else if (
      name.includes("last") &&
      (name.includes("name") || placeholder.includes("last"))
    ) {
      formData.lastName = value;
    } else if (
      input.type === "tel" ||
      fieldIdentifier.includes("phone") ||
      fieldIdentifier.includes("mobile")
    ) {
      formData.phoneNumber = value;
    }
  });

  return formData;
}

/**
 * Extract job details from page
 */
function extractJobDetails() {
  // Try to extract job title
  let jobTitle = "";
  const jobTitleSelectors = [
    "h1",
    '[data-testid="job-title"]',
    ".job-title",
    ".position-title",
  ];

  for (let selector of jobTitleSelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      jobTitle = element.textContent.trim();
      break;
    }
  }

  // Try to extract company name
  let companyName = "";
  const companySelectors = [
    '[data-testid="company"]',
    ".company-name",
    ".organization-name",
  ];

  for (let selector of companySelectors) {
    const element = document.querySelector(selector);
    if (element?.textContent) {
      companyName = element.textContent.trim();
      break;
    }
  }

  return {
    jobTitle: jobTitle || "Job Application",
    companyName: companyName || extractDomainName(window.location.hostname),
    url: window.location.href,
    date: new Date().toISOString().split("T")[0],
  };
}

/**
 * Extract company name from domain
 */
function extractDomainName(hostname) {
  const parts = hostname.split(".");
  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }
  return hostname;
}

/**
 * Send job detection to background script
 */
function reportJobDetection() {
  const detection = detectJobApplicationPage();

  if (detection.isJobPage) {
    const jobDetails = extractJobDetails();
    const formData = captureApplicationFormData();

    chrome.runtime.sendMessage(
      {
        action: "jobApplicationDetected",
        detection,
        jobDetails,
        formData,
      },
      response => {
        if (response?.acknowledged) {
          console.log("Job application detected and reported");
        }
      }
    );
  }
}

/**
 * Listen for messages from background script
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    autofillForm(request.data);
    sendResponse({ success: true });
  } else if (request.action === "detectJobPage") {
    const detection = detectJobApplicationPage();
    sendResponse(detection);
  } else if (request.action === "captureFormData") {
    const formData = captureApplicationFormData();
    const jobDetails = extractJobDetails();
    sendResponse({ formData, jobDetails });
  }
});

/**
 * Autofill form fields with profile data
 */
function autofillForm(profileData) {
  const inputs = document.querySelectorAll("input, textarea, select");
  let filledCount = 0;

  inputs.forEach(input => {
    const name = input.name?.toLowerCase() || "";
    const id = input.id?.toLowerCase() || "";
    const placeholder = input.placeholder?.toLowerCase() || "";
    const label = getAssociatedLabel(input)?.toLowerCase() || "";
    const fieldIdentifier = `${name} ${id} ${placeholder} ${label}`;

    // Map profile fields to form fields
    if (matchesField(fieldIdentifier, ["first", "name", "fname"])) {
      setInputValue(input, profileData.firstName);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["last", "surname", "lname"])) {
      setInputValue(input, profileData.lastName);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["email", "mail"])) {
      setInputValue(input, profileData.email);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["phone", "tel", "mobile"])) {
      setInputValue(input, profileData.phoneNumber);
      filledCount++;
    } else if (
      matchesField(fieldIdentifier, ["address", "street", "address1", "addr"])
    ) {
      setInputValue(input, profileData.addressLine1);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["address2", "apt", "suite"])) {
      setInputValue(input, profileData.addressLine2);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["city", "town"])) {
      setInputValue(input, profileData.city);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["state", "province", "region"])) {
      setInputValue(input, profileData.state);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["zip", "postal", "postcode"])) {
      setInputValue(input, profileData.postalCode);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["country", "nation"])) {
      setInputValue(input, profileData.country);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["github"])) {
      setInputValue(input, profileData.githubUrl);
      filledCount++;
    } else if (matchesField(fieldIdentifier, ["linkedin"])) {
      setInputValue(input, profileData.linkedinUrl);
      filledCount++;
    } else if (
      matchesField(fieldIdentifier, ["portfolio", "website", "personal"])
    ) {
      setInputValue(input, profileData.portfolioUrl);
      filledCount++;
    }
  });

  if (filledCount > 0) {
    showNotification(
      `✓ Autofilled ${filledCount} field${filledCount > 1 ? "s" : ""}`
    );
  }
}

/**
 * Set input value and trigger change events
 */
function setInputValue(input, value) {
  if (!value) return;

  if (input.tagName === "SELECT") {
    const options = input.querySelectorAll("option");
    for (let option of options) {
      if (
        option.textContent.toLowerCase().includes(value.toLowerCase()) ||
        option.value.toLowerCase().includes(value.toLowerCase())
      ) {
        input.value = option.value;
        break;
      }
    }
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
  input.dispatchEvent(new Event("blur", { bubbles: true }));
}

/**
 * Get associated label for form field
 */
function getAssociatedLabel(input) {
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.textContent;
  }

  let parent = input.parentElement;
  while (parent) {
    if (parent.tagName === "LABEL") {
      return parent.textContent;
    }
    parent = parent.parentElement;
  }

  return "";
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
  const notification = document.createElement("div");
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

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Initialize - detect job page on page load
 */
function initialize() {
  // Report job detection after page fully loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reportJobDetection);
  } else {
    reportJobDetection();
  }

  // Also check periodically (for dynamic content)
  setInterval(() => {
    reportJobDetection();
  }, 5000);
}

// Start initialization
initialize();
