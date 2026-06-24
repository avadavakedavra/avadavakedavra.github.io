/**
 * SEHR Academy — Profile Update Handler
 * ──────────────────────────────────────
 * Add this to the existing Attendance Apps Script project.
 * SHEET_ID below is the students spreadsheet (Attendance project).
 *
 * WIRING:
 * In your existing doPost(e) — or doGet(e) if your script routes reads via GET —
 * parse the incoming JSON and add the dispatch line shown below.
 *
 * doPost example (add after your existing action checks):
 *
 *   function doPost(e) {
 *     try {
 *       const req = JSON.parse(e.postData.contents);
 *       if (req.action === 'submitProfileUpdate') return submitProfileUpdate(req);
 *       // ... rest of your existing routing ...
 *     } catch (err) { ... }
 *   }
 *
 * doGet example (if your script also dispatches writes via GET ?data=...):
 *
 *   function doGet(e) {
 *     const req = JSON.parse(decodeURIComponent(e.parameter.data || '{}'));
 *     if (req.action === 'submitProfileUpdate') return submitProfileUpdate(req);
 *     // ... rest of your existing routing ...
 *   }
 *
 * After pasting, Deploy → Manage Deployments → edit → New version → Deploy.
 */

const PROFILE_UPDATE_SHEET_ID   = '1qBWKVonfT6E-c95ZtVR92R3Od1JXj3_4WNnMaGdtAzo';
const PROFILE_UPDATE_SHEET_NAME = 'ProfileUpdateRequests';
const PROFILE_UPDATE_HEADERS    = [
  'timestamp', 'student_id', 'admission_no', 'full_name', 'gender',
  'syllabus', 'birthday', 'school_name', 'parent_name', 'contact',
  'photo', 'status',
];

function submitProfileUpdate(req) {
  try {
    const ss    = SpreadsheetApp.openById(PROFILE_UPDATE_SHEET_ID);
    let   sheet = ss.getSheetByName(PROFILE_UPDATE_SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(PROFILE_UPDATE_SHEET_NAME);
      const headerRange = sheet.getRange(1, 1, 1, PROFILE_UPDATE_HEADERS.length);
      headerRange.setNumberFormat('@STRING@');
      headerRange.setValues([PROFILE_UPDATE_HEADERS]);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a18');
      headerRange.setFontColor('#8BC53F');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
      PROFILE_UPDATE_HEADERS.forEach(function(h, i) {
        sheet.setColumnWidth(i + 1, h === 'timestamp' ? 160 : h === 'full_name' || h === 'school_name' ? 180 : 130);
      });
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowValues = [[
      timestamp,
      req.student_id   || '',
      req.admission_no || '',
      req.full_name    || '',
      req.gender       || '',
      req.syllabus     || '',
      req.birthday     || '',
      req.school_name  || '',
      req.parent_name  || '',
      req.contact      || '',
      req.photo        || '',
      'PENDING REVIEW',
    ]];

    const newRow = sheet.getLastRow() + 1;
    const range  = sheet.getRange(newRow, 1, 1, PROFILE_UPDATE_HEADERS.length);
    range.setNumberFormat('@STRING@');
    range.setValues(rowValues);
    range.setBackground(newRow % 2 === 0 ? '#f5f2eb' : '#fdfcfa');
    range.setVerticalAlignment('middle');

    const statusCol  = PROFILE_UPDATE_HEADERS.indexOf('status') + 1;
    const statusCell = sheet.getRange(newRow, statusCol);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['PENDING REVIEW', 'REVIEWED', 'APPLIED', 'REJECTED'], true)
      .build();
    statusCell.setDataValidation(rule);
    statusCell.setBackground('#fff7e6').setFontColor('#92400e').setFontWeight('bold');

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
