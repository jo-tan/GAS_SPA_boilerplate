const ALLOWED_EMAILS = [
  'sometest@gmail.com',
  'anothertest@gmail.com',
];

const ALLOWED_DOMAINS = [
  'test.domain',
];

function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  
  // Check access account
  if (!isUserAllowed(userEmail)) {
    return HtmlService.createHtmlOutput('<h1>Access denied</h1><p>You don't have the right to access this page. Please use a valid account to access</p>');
  }

  // Load the page
  return HtmlService.createTemplateFromFile('web_app')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle('Data Input tool');
}

/**
 * Check if access account is in allowed user
 * @param {string} email
 * @returns {boolean} - return True if is in allowed list
 */
function isUserAllowed(email) {
  // email list check
  if (ALLOWED_EMAILS.includes(email)) {
    return true;
  }
  
  // domain list check
  const domain = email.split('@')[1];
  if (ALLOWED_DOMAINS.includes(domain)) {
    return true;
  }
  
  return false;
}