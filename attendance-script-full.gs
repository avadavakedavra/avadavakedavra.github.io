/**
 * SEHR Academy — Attendance & Student Data API
 * ─────────────────────────────────────────────
 * Deployed as a Web App (Execute as: Me, Who has access: Anyone).
 * Used by: academicdashboard.html, markattendance.html, leaderboard.html,
 *          enquire.html (Update My Details flow).
 *
 * GET  ?data={"action":"getStudents"}         → array of student objects
 * GET  ?data={"action":"getAttendance",...}   → attendance data
 * POST body {"action":"submitProfileUpdate",...} → staging row, returns {success:true}
 *
 * SHEET_ID is the students / attendance spreadsheet.
 */

const SHEET_ID        = '1qBWKVonfT6E-c95ZtVR92R3Od1JXj3_4WNnMaGdtAzo';
const STUDENTS_SHEET  = 'students';           // tab with the live student records
const ATTENDANCE_SHEET = 'attendance';        // tab with daily attendance marks
const PROFILE_UPDATE_SHEET = 'ProfileUpdateRequests'; // staging tab (created auto)

/* ─── Column headers expected in the "students" tab ─── */
const STUDENT_FIELDS = [
  'id', 'admission_no', 'full_name', 'gender', 'class', 'syllabus',
  'school_name', 'parent_name', 'contact', 'joining_date', 'birthday', 'photo',
];

/* ─── Staging tab headers ─── */
const PROFILE_UPDATE_HEADERS = [
  'timestamp', 'student_id', 'admission_no', 'full_name', 'gender',
  'syllabus', 'birthday', 'school_name', 'parent_name', 'contact',
  'photo', 'status',
];

/* ═══════════════════════════════════════════════
   ROUTING
═══════════════════════════════════════════════ */

function doGet(e) {
  try {
    const req = JSON.parse(decodeURIComponent((e.parameter && e.parameter.data) || '{}'));
    const action = req.action || '';

    if (action === 'getStudents')    return jsonOut(getStudents(req));
    if (action === 'getAttendance')  return jsonOut(getAttendance(req));
    if (action === 'submitProfileUpdate') return submitProfileUpdate(req);

    return jsonOut({ status: 'SEHR Academy Attendance API is running' });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const action = req.action || '';

    if (action === 'submitProfileUpdate') return submitProfileUpdate(req);
    if (action === 'markAttendance')      return markAttendance(req);

    return jsonOut({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ═══════════════════════════════════════════════
   GET STUDENTS
   Returns every row from the "students" tab as an
   array of plain objects keyed by STUDENT_FIELDS.
   Filters out fee / payment / admission_amount cols.
═══════════════════════════════════════════════ */

function getStudents(req) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(STUDENTS_SHEET);
  if (!sheet) return [];

  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0].map(function(h) { return String(h).trim().toLowerCase().replace(/\s+/g, '_'); });
  const data    = [];

  const blocked = ['fee', 'fees', 'payment', 'admission_amount', 'amount_paid', 'balance'];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0] && !row[1] && !row[2]) continue; // skip blank rows
    var obj = {};
    headers.forEach(function(h, idx) {
      if (blocked.some(function(b) { return h.indexOf(b) !== -1; })) return;
      var val = row[idx];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Kolkata', 'yyyy-MM-dd');
      }
      obj[h] = val !== undefined && val !== null ? String(val) : '';
    });
    // Always expose the safe canonical fields even if header name differs
    if (!obj.id)           obj.id           = obj.student_id || obj.sl_no || String(i);
    if (!obj.full_name)    obj.full_name     = obj.name       || obj.student_name || '';
    if (!obj.school_name)  obj.school_name   = obj.school     || '';
    if (!obj.contact)      obj.contact       = obj.phone      || obj.whatsapp || obj.mobile || '';
    data.push(obj);
  }
  return data;
}

/* ═══════════════════════════════════════════════
   GET ATTENDANCE
   Returns attendance rows, optionally filtered by
   req.class or req.date.
═══════════════════════════════════════════════ */

function getAttendance(req) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(ATTENDANCE_SHEET);
  if (!sheet) return [];

  const rows    = sheet.getDataRange().getValues();
  const headers = rows[0].map(function(h) { return String(h).trim().toLowerCase().replace(/\s+/g, '_'); });
  const data    = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var obj = {};
    headers.forEach(function(h, idx) {
      var val = row[idx];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Kolkata', 'yyyy-MM-dd');
      }
      obj[h] = val !== undefined && val !== null ? String(val) : '';
    });
    if (req.class && String(obj.class) !== String(req.class)) continue;
    if (req.date  && obj.date !== req.date) continue;
    data.push(obj);
  }
  return data;
}

/* ═══════════════════════════════════════════════
   MARK ATTENDANCE
   Appends or updates an attendance record.
═══════════════════════════════════════════════ */

function markAttendance(req) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(ATTENDANCE_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(ATTENDANCE_SHEET);
    sheet.appendRow(['date', 'student_id', 'admission_no', 'full_name', 'class', 'status', 'marked_by', 'timestamp']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1a1a18').setFontColor('#8BC53F');
    sheet.setFrozenRows(1);
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const rowValues = [[
    req.date         || Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd'),
    req.student_id   || '',
    req.admission_no || '',
    req.full_name    || '',
    req.class        || '',
    req.status       || 'Present',
    req.marked_by    || '',
    timestamp,
  ]];

  const newRow = sheet.getLastRow() + 1;
  const range  = sheet.getRange(newRow, 1, 1, 8);
  range.setNumberFormat('@STRING@');
  range.setValues(rowValues);

  return { success: true };
}

/* ═══════════════════════════════════════════════
   SUBMIT PROFILE UPDATE  (staging only)
   Appends to "ProfileUpdateRequests" tab.
   Never touches the live "students" tab.
═══════════════════════════════════════════════ */

function submitProfileUpdate(req) {
  try {
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
      var widths = { timestamp: 160, full_name: 180, school_name: 180, photo: 220, status: 140 };
      PROFILE_UPDATE_HEADERS.forEach(function(h, i) {
        sheet.setColumnWidth(i + 1, widths[h] || 130);
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

    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

/* ═══════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════ */

/**
 * Call once from the Apps Script editor (Run → initStudentsSheet)
 * to create / verify the students tab header row.
 */
function initStudentsSheet() {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(STUDENTS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(STUDENTS_SHEET);
  }
  if (sheet.getLastRow() === 0) {
    const allFields = STUDENT_FIELDS.concat(['joining_date']);
    sheet.appendRow(allFields);
    sheet.getRange(1, 1, 1, allFields.length)
      .setFontWeight('bold').setBackground('#1a1a18').setFontColor('#8BC53F');
    sheet.setFrozenRows(1);
    SpreadsheetApp.getUi().alert('Header row created on "' + STUDENTS_SHEET + '".');
  } else {
    SpreadsheetApp.getUi().alert('Sheet already has content — headers were NOT overwritten.');
  }
}
