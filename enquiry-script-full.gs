/**
 * SEHR Academy — Admission Enquiry Form Handler
 * ─────────────────────────────────────────────
 * Also handles the "Update My Details" profile update staging flow.
 * Profile updates are written to a separate "ProfileUpdateRequests" tab
 * in THIS spreadsheet for admin review — the live students sheet is
 * never touched by this script.
 *
 * Student data for the update form is fetched client-side directly from
 * the Attendance API (ATT_API) — this script only receives and stores
 * the submitted updates.
 *
 * DEPLOYMENT (do once, or after any change):
 *   Deploy → Manage Deployments → edit → New version → Deploy
 *   (keeps the same URL used in enquire.html as SHEETS_URL)
 */

const SHEET_ID   = '16QHTB--vee9R9epWrr3yhD9XDo7GpF7nsKol9A4XWco';
const SHEET_NAME = 'Enquiries';
const NOTIFY_EMAIL = '';   // optional: your email for new-enquiry alerts

/* ─── Enquiry columns ─── */
const COLUMNS = [
  { header: 'Timestamp',        key: 'timestamp',    width: 160 },
  { header: 'Student Name',     key: 'student_name', width: 160 },
  { header: 'Date of Birth',    key: 'dob',          width: 110 },
  { header: 'Class',            key: 'class',        width: 100 },
  { header: 'Syllabus',         key: 'syllabus',     width: 150 },
  { header: 'Subjects',         key: 'subjects',     width: 260 },
  { header: 'Session Type',     key: 'session_type', width: 130 },
  { header: 'Parent Name',      key: 'parent_name',  width: 160 },
  { header: 'WhatsApp',         key: 'whatsapp',     width: 120 },
  { header: 'School',           key: 'school',       width: 200 },
  { header: 'House / Building', key: 'house',        width: 180 },
  { header: 'Street / Area',    key: 'street',       width: 180 },
  { header: 'District',         key: 'district',     width: 130 },
  { header: 'PIN Code',         key: 'pin',          width: 90  },
  { header: 'Full Address',     key: 'address',      width: 280 },
  { header: 'Source',           key: 'source',       width: 160 },
  { header: 'Message',          key: 'message',      width: 280 },
  { header: 'Status',           key: '_status',      width: 120 },
];

const NUM_COLS = COLUMNS.length;

/* ─── Profile update staging columns ─── */
const PROFILE_UPDATE_SHEET   = 'ProfileUpdateRequests';
const PROFILE_UPDATE_HEADERS = [
  'Timestamp', 'Student ID', 'Admission No', 'Full Name', 'Gender',
  'Syllabus', 'Birthday', 'School Name', 'Parent Name', 'Contact',
  'Photo URL', 'Status',
];
const PROFILE_UPDATE_KEYS = [
  'timestamp', 'student_id', 'admission_no', 'full_name', 'gender',
  'syllabus', 'birthday', 'school_name', 'parent_name', 'contact',
  'photo', 'status',
];
const PROFILE_UPDATE_WIDTHS = [160, 100, 120, 180, 90, 150, 110, 200, 160, 130, 240, 140];

/* ═══════════════════════════════════════════════
   ROUTING
═══════════════════════════════════════════════ */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'submitProfileUpdate') {
      return submitProfileUpdate(data);
    }

    // Default: new admission enquiry
    appendEnquiryRow(data);
    if (NOTIFY_EMAIL) sendEmailAlert(data);
    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function doGet() {
  return jsonOut({ status: 'SEHR Academy Enquiry API is running' });
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ═══════════════════════════════════════════════
   ADMISSION ENQUIRY
═══════════════════════════════════════════════ */

function appendEnquiryRow(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    createEnquiryHeaderRow(sheet);
  } else {
    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (existingHeaders[0] === 'Timestamp' && existingHeaders.length !== NUM_COLS) {
      Logger.log('Header count mismatch (' + existingHeaders.length + ' vs ' + NUM_COLS + ').');
    }
  }

  const timestamp = data.timestamp
    || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const rowValues = COLUMNS.map(function(col) {
    if (col.key === '_status')   return 'New';
    if (col.key === 'timestamp') return timestamp;
    return data[col.key] || '';
  });

  sheet.appendRow(rowValues);

  const lastRow  = sheet.getLastRow();
  const rowRange = sheet.getRange(lastRow, 1, 1, NUM_COLS);
  rowRange.setBackground(lastRow % 2 === 0 ? '#f5f2eb' : '#fdfcfa');
  rowRange.setVerticalAlignment('middle');

  const statusCol  = COLUMNS.findIndex(function(c) { return c.key === '_status'; }) + 1;
  const statusCell = sheet.getRange(lastRow, statusCol);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Contacted', 'Enrolled', 'Not interested'], true)
    .build();
  statusCell.setDataValidation(rule);
  styleStatusCell(statusCell, 'New');

  const sessionCol = COLUMNS.findIndex(function(c) { return c.key === 'session_type'; }) + 1;
  if (sessionCol > 0) {
    const sessionCell = sheet.getRange(lastRow, sessionCol);
    const sessionVal  = data.session_type || '';
    if (sessionVal === 'Individual Session') {
      sessionCell.setBackground('#e8f0fb').setFontColor('#1a56db').setFontWeight('bold');
    } else if (sessionVal === 'Group Session') {
      sessionCell.setBackground('#f0f7e3').setFontColor('#3b6d11').setFontWeight('bold');
    }
  }
}

function createEnquiryHeaderRow(sheet) {
  const headers = COLUMNS.map(function(c) { return c.header; });
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, NUM_COLS);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a1a18');
  headerRange.setFontColor('#8BC53F');
  headerRange.setFontSize(11);
  sheet.setFrozenRows(1);
  COLUMNS.forEach(function(col, i) {
    sheet.setColumnWidth(i + 1, col.width);
  });
}

function styleStatusCell(cell, value) {
  const styles = {
    'New':            { bg: '#f0f7e3', fg: '#3b6d11' },
    'Contacted':      { bg: '#fff7e6', fg: '#92400e' },
    'Enrolled':       { bg: '#e8f9ee', fg: '#065f46' },
    'Not interested': { bg: '#fef2f2', fg: '#991b1b' },
  };
  const s = styles[value] || styles['New'];
  cell.setBackground(s.bg).setFontColor(s.fg).setFontWeight('bold');
}

function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  const statusCol = COLUMNS.findIndex(function(c) { return c.key === '_status'; }) + 1;
  if (e.range.getColumn() !== statusCol || e.range.getRow() < 2) return;
  styleStatusCell(e.range, e.range.getValue());
}

/* ═══════════════════════════════════════════════
   PROFILE UPDATE (staging — no live sheet writes)
═══════════════════════════════════════════════ */

function submitProfileUpdate(data) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(PROFILE_UPDATE_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(PROFILE_UPDATE_SHEET);
    const hdr = sheet.getRange(1, 1, 1, PROFILE_UPDATE_HEADERS.length);
    hdr.setNumberFormat('@STRING@');
    hdr.setValues([PROFILE_UPDATE_HEADERS]);
    hdr.setFontWeight('bold');
    hdr.setBackground('#1a1a18');
    hdr.setFontColor('#8BC53F');
    hdr.setFontSize(11);
    sheet.setFrozenRows(1);
    PROFILE_UPDATE_WIDTHS.forEach(function(w, i) {
      sheet.setColumnWidth(i + 1, w);
    });
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const rowValues = [[
    timestamp,
    data.student_id   || '',
    data.admission_no || '',
    data.full_name    || '',
    data.gender       || '',
    data.syllabus     || '',
    data.birthday     || '',
    data.school_name  || '',
    data.parent_name  || '',
    data.contact      || '',
    data.photo        || '',
    'PENDING REVIEW',
  ]];

  const newRow = sheet.getLastRow() + 1;
  const range  = sheet.getRange(newRow, 1, 1, PROFILE_UPDATE_HEADERS.length);
  range.setNumberFormat('@STRING@');
  range.setValues(rowValues);
  range.setBackground(newRow % 2 === 0 ? '#f5f2eb' : '#fdfcfa');
  range.setVerticalAlignment('middle');

  const statusCol  = PROFILE_UPDATE_KEYS.indexOf('status') + 1;
  const statusCell = sheet.getRange(newRow, statusCol);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['PENDING REVIEW', 'REVIEWED', 'APPLIED', 'REJECTED'], true)
    .build();
  statusCell.setDataValidation(rule);
  statusCell.setBackground('#fff7e6').setFontColor('#92400e').setFontWeight('bold');

  return jsonOut({ success: true });
}

/* ═══════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════ */

function initSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    createEnquiryHeaderRow(sheet);
    SpreadsheetApp.getUi().alert('Header row created on "' + SHEET_NAME + '".');
  } else {
    SpreadsheetApp.getUi().alert('Sheet already has content — headers were NOT overwritten.');
  }
}

function sendEmailAlert(data) {
  if (!NOTIFY_EMAIL) return;
  const subject = 'New Enquiry — ' + (data.student_name || 'Unknown') + ' | SEHR Academy';
  const body =
    'New admission enquiry received:\n\n' +
    'Student:       ' + (data.student_name || '') + '\n' +
    'Date of Birth: ' + (data.dob          || '') + '\n' +
    'Class:         ' + (data.class        || '') + ' (' + (data.syllabus || '') + ')\n' +
    'Subjects:      ' + (data.subjects     || '') + '\n' +
    'Session Type:  ' + (data.session_type || '') + '\n' +
    'Parent:        ' + (data.parent_name  || '') + '\n' +
    'WhatsApp:      ' + (data.whatsapp     || '') + '\n' +
    'School:        ' + (data.school       || '') + '\n' +
    'Address:       ' + (data.address      || '') + '\n' +
    'Source:        ' + (data.source       || '') + '\n' +
    'Message:       ' + (data.message      || '') + '\n' +
    '\nView all enquiries: https://docs.google.com/spreadsheets/d/' + SHEET_ID;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
