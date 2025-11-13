const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; // Replace with your Spreadsheet ID
const SHEET_NAME = "YOUR_SHEET_NAME_HERE";     // Replace with your Sheet Name

/**
 * Where you point to your sheets. 
 * Change the name inside openById() and getSheetByName() to your file.
 */
function processData(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  let targetRange;
  const selectedTable = data.selectedTable;
  
  switch (selectedTable) {
    case 'formA':
      targetRange = 'A' + (sheet.getLastRow() + 1);
      sheet.getRange(targetRange).offset(0, 0).setValue(data.name);
      sheet.getRange(targetRange).offset(0, 1).setValue(data.email);
      break;
    case 'formB':
      targetRange = 'F' + (sheet.getLastRow() + 1);
      sheet.getRange(targetRange).offset(0, 0).setValue(data.projectName);
      sheet.getRange(targetRange).offset(0, 1).setValue(data.status);
      break;
    case 'formC':
      targetRange = 'K' + (sheet.getLastRow() + 1);
      sheet.getRange(targetRange).offset(0, 0).setValue(data.item);
      sheet.getRange(targetRange).offset(0, 1).setValue(data.amount);
      break;
    default:
      throw new Error('Invalid form');
  }

  return 'Data is update!';
}

/**
 * Generates a structured email object after processing form data.
 * @param {object} data - The form data object.
 * @returns {object} An object containing all necessary email components.
 */
function generateEmailObject(data) {
  // First, write the submitted data to the sheet as per the existing logic.
  processData(data);

  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const selectedTable = data.selectedTable;
  
  let recipient, cc, tableRange, subject;
  
  switch (selectedTable) {
    case 'formA':
      recipient = sheet.getRange('Z1').getValue();
      cc = sheet.getRange('Z2').getValue();
      tableRange = 'A3:D10';
      subject = 'About the formA - ' + new Date().toLocaleDateString();
      break;
    case 'formB':
      recipient = sheet.getRange('Z3').getValue();
      cc = sheet.getRange('Z4').getValue();
      tableRange = 'F3:I10';
      subject = 'About the formB - ' + new Date().toLocaleDateString();
      break;
    case 'formC':
      recipient = sheet.getRange('Z5').getValue();
      cc = sheet.getRange('Z6').getValue();
      tableRange = 'K3:N10';
      subject = 'About the formC - ' + new Date().toLocaleDateString();
      break;
    default:
      throw new Error('Invalid form selected');
  }
  
  const tableValues = sheet.getRange(tableRange).getValues();
  const emailBodyText = createTableText(tableValues, sheet.getRange(tableRange).getBackgrounds());
  
  const bodyForEmailHtml = `Hello,<br>Here is the content from the table:<br><br>${emailBodyText.replace(/\n/g, '<br>')}<br>Happy testing!<br>--<br>Auto email content, please don't reply`;

  const fullContentForDisplay = `收件人: ${recipient}\n副本 (CC): ${cc || 'None'}\n主旨: ${subject}\n\nHello,\nHere is the content from the table:\n\n${emailBodyText}\nHappy testing!\n--\nAuto email content, please don't reply`;

  return {
    recipient: recipient,
    cc: cc || '',
    subject: subject,
    body: bodyForEmailHtml,
    fullContentForDisplay: fullContentForDisplay
  };
}

/**
 * Sends an email using a pre-generated email object.
 * @param {object} emailObject - The email object from generateEmailObject.
 * @returns {string} A success message.
 */
function sendEmail(emailObject) {
  const options = {
    cc: emailObject.cc,
    htmlBody: emailObject.body,
  };
  
  try {
    MailApp.sendEmail(emailObject.recipient, emailObject.subject, '', options);
    return 'Email sent to: ' + emailObject.recipient + '！';
  } catch (e) {
    throw new Error('Email failed to send: ' + e.message);
  }
}

/**
 * Change array to a string
 * @param {Array<Array<any>>} values - array values
 * @param {Array<Array<string>>} backgrounds - background color
 * @returns {string}
 */
function createTableText(values, backgrounds) {
  let tableText = '';
  const maxColWidth = new Array(values[0].length).fill(0);
  
  values.forEach(row => {
    row.forEach((cell, i) => {
      const cellText = String(cell || '').trim();
      if (cellText.length > maxColWidth[i]) {
        maxColWidth[i] = cellText.length;
      }
    });
  });
  
  values.forEach((row, rowIndex) => {
    let rowText = '';
    const isHeader = (backgrounds[rowIndex] && backgrounds[rowIndex].every(bg => bg === '#b7b7b7'));
    
    row.forEach((cell, colIndex) => {
      let cellText = String(cell || '');
      cellText = cellText.padEnd(maxColWidth[colIndex] + 2);
      rowText += cellText;
    });
    
    if (isHeader) {
      tableText += rowText.trim() + '\n';
      tableText += '-'.repeat(rowText.length) + '\n';
    } else {
      tableText += rowText.trim() + '\n';
    }
  });
  
  return tableText;
}
/**
 * Get data from sheets and return as JSON format
 * @returns {Array<Array<any>>}
 */
function getDataFromSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  // pull data into a json
  return sheet.getDataRange().getValues();
}