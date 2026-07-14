// ═══════════════════════════════════════════════════════════════
//  SEHR ACADEMY — Individual Classes Manager
//  Google Apps Script Web App
//  Deploy as: Execute as Me · Anyone can access
//  Used by: public/individual.html (aka individual.html)
//
//  SHEET STRUCTURE:
//  All sheets have rows 1-3 as title/subtitle/blank.
//  Row 4 = headers. Data starts at row 5.
// ═══════════════════════════════════════════════════════════════

var PASSWORD = 'sehr2026'; // ← change this to your actual password

// ── EXACT TAB NAMES (must match your sheet tabs exactly) ────────
var SHEET_STUDENTS         = 'Students';
var SHEET_SCHEDULE         = 'Schedule';
var SHEET_PAYMENTS         = 'Payments';
var SHEET_TEACHERS         = 'Teachers';
var SHEET_TEACHER_PAYMENTS = 'TeacherPayments';

// ── ENTRY POINT ─────────────────────────────────────────────────
function doGet(e) {
  var p = e.parameter;

  if (p.action !== 'ping' && p.password !== PASSWORD) {
    return json({ error: 'Unauthorized' });
  }

  try {
    switch (p.action) {

      case 'getData':
        return json({
          students:        readSheet(SHEET_STUDENTS),
          schedule:        readSheet(SHEET_SCHEDULE),
          payments:        readSheet(SHEET_PAYMENTS),
          teachers:        readSheet(SHEET_TEACHERS),
          teacherPayments: readSheet(SHEET_TEACHER_PAYMENTS)
        });

      case 'addStudent':     return json(addStudent(p));
      case 'updateStudent':  return json(updateRowByKey(SHEET_STUDENTS,  'Student ID',  p.id, studentFields(p)));

      case 'addSession':            return json(addSession(p));
      case 'updateSession':         return json(updateRowByKey(SHEET_SCHEDULE, 'Session ID',  p.id, sessionFields(p)));
      case 'updateSessionStatus':   return json(setField(SHEET_SCHEDULE, 'Session ID',  p.id, 'Status', p.status));
      case 'addSessionBatch':       return json(addSessionBatch(p));

      case 'addPayment':      return json(addPayment(p));
      case 'deletePayment':   return json(deleteRowByKey(SHEET_PAYMENTS, 'Payment ID', p.id));

      case 'addTeacher':     return json(addTeacher(p));
      case 'updateTeacher':  return json(updateRowByKey(SHEET_TEACHERS,  'Teacher ID',  p.id, teacherFields(p)));

      case 'addTeacherPayment':     return json(addTeacherPayment(p));
      case 'deleteTeacherPayment':  return json(deleteRowByKey(SHEET_TEACHER_PAYMENTS, 'TP ID', p.id));

      case 'ping': return json({ ok: true });

      default: return json({ error: 'Unknown action: ' + p.action });
    }
  } catch (err) {
    return json({ error: err.toString() });
  }
}

// ═══════════════════════════════════════════════════════════════
//  CORE SHEET HELPERS
// ═══════════════════════════════════════════════════════════════

function ss() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet(name) {
  var sheet = ss().getSheetByName(name);
  if (!sheet) throw new Error('Sheet tab "' + name + '" not found.');
  return sheet;
}

// Read sheet into array of objects.
// Skips the first 3 rows (title/subtitle/blank). Row 4 = headers. Row 5+ = data.
function readSheet(name) {
  var sheet;
  try { sheet = getSheet(name); } catch(e) { return []; }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 4 || lastCol < 1) return [];

  var headers = sheet.getRange(4, 1, 1, lastCol).getValues()[0].map(function(h) {
    return String(h).trim();
  });

  if (lastRow < 5) return [];

  var data = sheet.getRange(5, 1, lastRow - 4, lastCol).getValues();
  var rows = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (row.every(function(c) { return c === '' || c === null || c === undefined; })) continue;
    var obj = {};
    headers.forEach(function(h, idx) {
      var key = headerToKey(h);
      var val = row[idx];
      // If the cell is a Date object, always format as DD/MM/YYYY string
      if (val instanceof Date && !isNaN(val.getTime())) {
        var yr = val.getFullYear();
        if (yr >= 2000) {
          var dd = String(val.getDate()).padStart(2,'0');
          var mm = String(val.getMonth()+1).padStart(2,'0');
          obj[key] = dd + '/' + mm + '/' + yr;
        } else {
          // Epoch/time-only value (e.g. start times stored as dates)
          // Format as HH:MM AM/PM
          var hr = val.getHours(), mn = val.getMinutes();
          var sfx = hr >= 12 ? 'PM' : 'AM';
          hr = hr % 12; if (!hr) hr = 12;
          obj[key] = hr + ':' + (mn < 10 ? '0' : '') + mn + ' ' + sfx;
        }
      } else {
        obj[key] = (val !== undefined && val !== null) ? String(val) : '';
      }
    });
    rows.push(obj);
  }
  return rows;
}

// Maps your exact sheet header text → the JS key the HTML expects.
// If you rename a column, update the right side here.
var HEADER_KEY_MAP = {
  // Students sheet
  'Student ID':            'student_id',
  'Full Name':             'full_name',
  'Class':                 'class',
  'Syllabus':              'syllabus',
  'Subject(s)':            'subjects',       // plural — HTML uses s.subjects as array
  'School Name':           'school_name',
  'Mode':                  'mode',
  'Hourly Rate (Rs)':      'hourly_rate_rs', // HTML uses s.hourly_rate_rs
  'Contact (WhatsApp)':    'contact_whatsapp',
  'Parent Contact':        'parent_contact',
  'Joining Date':          'joining_date',
  'Status':                'status',
  'Notes':                 'notes',

  // Schedule sheet
  'Session ID':            'session_id',
  'Student Name (ref)':    'student_name',
  'Date (DD/MM/YYYY)':     'date_ddmmyyyy',  // HTML uses r.date_ddmmyyyy everywhere
  'Start Time':            'start_time',
  'Duration (hrs)':        'duration_hrs',   // HTML uses r.duration_hrs
  'Subject':               'subject',
  'Topic Covered':         'topic_covered',
  'Teacher':               'teacher',

  // Payments sheet
  'Payment ID':            'payment_id',
  'Amount Received (Rs)':  'amount_received_rs',
  'Month Covered':         'month_covered',

  // Teachers sheet
  'Teacher ID':            'teacher_id',

  // TeacherPayments sheet
  'TP ID':                 'tp_id',
  'Amount (Rs)':           'amount_rs',
};

function headerToKey(h) {
  var trimmed = h.trim();
  if (HEADER_KEY_MAP[trimmed] !== undefined) return HEADER_KEY_MAP[trimmed];
  // Fallback for any unmapped column: generic snake_case
  return trimmed
    .toLowerCase()
    .replace(/\s*\(.*?\)\s*/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Find the 1-based row number of a record by its key column value
// Searches from row 5 onwards
function findRowNum(sheet, keyHeader, keyValue) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 5) return -1;

  var headers = sheet.getRange(4, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h).trim(); });
  var keyCol = headers.indexOf(keyHeader); // 0-based
  if (keyCol === -1) throw new Error('Column "' + keyHeader + '" not found in ' + sheet.getName());

  var vals = sheet.getRange(5, keyCol + 1, lastRow - 4, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]) === String(keyValue)) return i + 5; // 1-based sheet row
  }
  return -1;
}

// Get 0-based column index for a header name in row 4
function getColIdx(sheet, headerName) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(4, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h).trim(); });
  var idx = headers.indexOf(headerName);
  if (idx === -1) throw new Error('Column "' + headerName + '" not found in ' + sheet.getName());
  return idx; // 0-based
}

// Update a single field
function setField(sheetName, keyHeader, keyValue, fieldHeader, fieldValue) {
  var sheet = getSheet(sheetName);
  var rowNum = findRowNum(sheet, keyHeader, keyValue);
  if (rowNum === -1) return { success: false, error: 'Row not found: ' + keyValue };
  var col = getColIdx(sheet, fieldHeader) + 1; // 1-based
  sheet.getRange(rowNum, col).setValue(fieldValue);
  return { success: true };
}

// Update an entire row by matching key. fields = { "Header Name": value, ... }
function updateRowByKey(sheetName, keyHeader, keyValue, fields) {
  var sheet = getSheet(sheetName);
  var rowNum = findRowNum(sheet, keyHeader, keyValue);
  if (rowNum === -1) return { success: false, error: 'Row not found: ' + keyValue };

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(4, 1, 1, lastCol).getValues()[0].map(function(h){ return String(h).trim(); });
  var currentRow = sheet.getRange(rowNum, 1, 1, lastCol).getValues()[0];

  headers.forEach(function(h, idx) {
    if (fields[h] !== undefined) {
      currentRow[idx] = fields[h];
    }
  });
  sheet.getRange(rowNum, 1, 1, lastCol).setValues([currentRow]);
  return { success: true };
}

// Delete a single row by matching key. Used to remove a payment/session/etc entirely.
function deleteRowByKey(sheetName, keyHeader, keyValue) {
  var sheet = getSheet(sheetName);
  var rowNum = findRowNum(sheet, keyHeader, keyValue);
  if (rowNum === -1) return { success: false, error: 'Row not found: ' + keyValue };
  sheet.deleteRow(rowNum);
  return { success: true };
}

// Generate next ID. Reads ALL rows in the ID column (skipping header rows).
function nextId(sheet, idHeader, prefix) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 5) return prefix + '001';
  var col = getColIdx(sheet, idHeader) + 1;
  var vals = sheet.getRange(5, col, lastRow - 4, 1).getValues();
  var max = 0;
  vals.forEach(function(r) {
    var n = parseInt(String(r[0]).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  return prefix + String(max + 1).padStart(3, '0');
}

// Look up student name by ID
function getStudentName(studentId) {
  try {
    var sheet = getSheet(SHEET_STUDENTS);
    var rowNum = findRowNum(sheet, 'Student ID', studentId);
    if (rowNum === -1) return '';
    var col = getColIdx(sheet, 'Full Name') + 1;
    return String(sheet.getRange(rowNum, col).getValue());
  } catch(e) { return ''; }
}

// ═══════════════════════════════════════════════════════════════
//  STUDENTS
//  Headers: Student ID | Full Name | Class | Syllabus | Subject(s) |
//           School Name | Mode | Hourly Rate (Rs) | Contact (WhatsApp) |
//           Parent Contact | Joining Date | Status | Notes
// ═══════════════════════════════════════════════════════════════

function addStudent(p) {
  var sheet = getSheet(SHEET_STUDENTS);
  var id = nextId(sheet, 'Student ID', 'IND-');
  sheet.appendRow([
    id,
    p.full_name      || '',
    p['class']       || '',
    p.syllabus       || '',
    p.subjects       || '',
    p.school_name    || '',
    p.mode           || 'Offline',
    p.hourly_rate    || '',
    p.contact        || '',
    p.parent_contact || '',
    p.joining_date   || '',
    p.status         || 'Active',
    p.notes          || ''
  ]);
  return { success: true, id: id };
}

function studentFields(p) {
  return {
    'Full Name':         p.full_name      || '',
    'Class':             p['class']       || '',
    'Syllabus':          p.syllabus       || '',
    'Subject(s)':        p.subjects       || '',
    'School Name':       p.school_name    || '',
    'Mode':              p.mode           || '',
    'Hourly Rate (Rs)':  p.hourly_rate    || '',
    'Contact (WhatsApp)': p.contact       || '',
    'Parent Contact':    p.parent_contact || '',
    'Joining Date':      p.joining_date   || '',
    'Status':            p.status         || 'Active',
    'Notes':             p.notes          || ''
  };
}

// ═══════════════════════════════════════════════════════════════
//  SCHEDULE (SESSIONS)
//  Headers: Session ID | Student ID | Student Name (ref) |
//           Date (DD/MM/YYYY) | Start Time | Duration (hrs) |
//           Subject | Topic Covered | Status | Teacher | Notes
// ═══════════════════════════════════════════════════════════════

function addSession(p) {
  var sheet = getSheet(SHEET_SCHEDULE);
  var id = nextId(sheet, 'Session ID', 'SES-');
  var stuName = getStudentName(p.student_id || '');

  // Force Date and Start Time columns to Plain Text before writing
  var headers = sheet.getRange(4, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h){ return String(h).trim(); });
  var newRow = sheet.getLastRow() + 1;
  var dateColIdx = headers.indexOf('Date (DD/MM/YYYY)');
  var timeColIdx = headers.indexOf('Start Time');
  if (dateColIdx >= 0) sheet.getRange(newRow, dateColIdx + 1).setNumberFormat('@STRING@');
  if (timeColIdx >= 0) sheet.getRange(newRow, timeColIdx + 1).setNumberFormat('@STRING@');

  sheet.appendRow([
    id,
    p.student_id  || '',
    stuName,
    p.date        || '',
    p.start_time  || '',
    p.duration    || '',
    p.subject     || '',
    p.topic       || '',
    p.status      || 'Scheduled',
    p.teacher     || '',
    p.teacher     || ''
  ]);
  return { success: true, id: id };
}

function sessionFields(p) {
  return {
    'Date (DD/MM/YYYY)': p.date       || '',
    'Start Time':        p.start_time || '',
    'Duration (hrs)':    p.duration   || '',
    'Subject':           p.subject    || '',
    'Topic Covered':     p.topic      || '',
    'Status':            p.status     || 'Scheduled',
    'Teacher':           p.teacher    || '',
    'Notes':             p.teacher    || ''
  };
}

function addSessionBatch(p) {
  var sheet = getSheet(SHEET_SCHEDULE);
  var sessions;
  try { sessions = JSON.parse(p.sessions); } catch(e) {
    return { success: false, error: 'Invalid sessions JSON' };
  }
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return { success: false, error: 'No sessions provided' };
  }

  // Get current max session number
  var lastRow = sheet.getLastRow();
  var max = 0;
  if (lastRow >= 5) {
    var col = getColIdx(sheet, 'Session ID') + 1;
    var vals = sheet.getRange(5, col, lastRow - 4, 1).getValues();
    vals.forEach(function(r) {
      var n = parseInt(String(r[0]).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
  }

  // Cache student name for first session's student (they're all the same student)
  var stuName = sessions.length > 0 ? getStudentName(sessions[0].student_id || '') : '';

  var rows = sessions.map(function(s, idx) {
    var id = 'SES-' + String(max + idx + 1).padStart(3, '0');
    return [
      id,
      s.student_id || '',
      stuName,
      s.date       || '',
      s.start_time || '',
      s.duration   || '',
      s.subject    || '',
      '',
      s.status     || 'Scheduled',
      s.teacher    || '',
      s.teacher    || ''
    ];
  });

  if (rows.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    var numCols = rows[0].length;
    var range = sheet.getRange(startRow, 1, rows.length, numCols);

    // Force Date and Start Time columns to Plain Text BEFORE writing
    // so Sheets doesn't auto-convert the values
    var headers = sheet.getRange(4, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(function(h){ return String(h).trim(); });
    var dateColIdx  = headers.indexOf('Date (DD/MM/YYYY)');
    var timeColIdx  = headers.indexOf('Start Time');
    if (dateColIdx >= 0) {
      sheet.getRange(startRow, dateColIdx + 1, rows.length, 1).setNumberFormat('@STRING@');
    }
    if (timeColIdx >= 0) {
      sheet.getRange(startRow, timeColIdx + 1, rows.length, 1).setNumberFormat('@STRING@');
    }

    range.setValues(rows);
  }
  return { success: true, count: rows.length, message: rows.length + ' sessions scheduled' };
}

// ═══════════════════════════════════════════════════════════════
//  STUDENT PAYMENTS
//  Headers: Payment ID | Student ID | Student Name (ref) |
//           Date (DD/MM/YYYY) | Amount Received (Rs) |
//           Month Covered | Mode | Notes
// ═══════════════════════════════════════════════════════════════

function addPayment(p) {
  var sheet = getSheet(SHEET_PAYMENTS);
  var id = nextId(sheet, 'Payment ID', 'PAY-');
  var stuName = getStudentName(p.student_id || '');
  var headers = sheet.getRange(4, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h){ return String(h).trim(); });
  var newRow = sheet.getLastRow() + 1;
  var dateColIdx = headers.indexOf('Date (DD/MM/YYYY)');
  if (dateColIdx >= 0) sheet.getRange(newRow, dateColIdx + 1).setNumberFormat('@STRING@');
  sheet.appendRow([
    id,
    p.student_id    || '',
    stuName,
    p.date          || '',
    p.amount        || '',
    p.month_covered || '',
    p.mode          || '',
    p.notes         || ''
  ]);
  return { success: true, id: id };
}

// ═══════════════════════════════════════════════════════════════
//  TEACHERS  (new sheet you create)
//  Headers: Teacher ID | Full Name | Hourly Rate (Rs) | Subject(s) |
//           Contact (WhatsApp) | Joining Date | Status | Notes
// ═══════════════════════════════════════════════════════════════

function addTeacher(p) {
  var sheet = getSheet(SHEET_TEACHERS);
  var id = nextId(sheet, 'Teacher ID', 'TCH-');
  sheet.appendRow([
    id,
    p.full_name    || '',
    p.hourly_rate  || '',
    p.subjects     || '',
    p.contact      || '',
    p.joining_date || '',
    p.status       || 'Active',
    p.notes        || ''
  ]);
  return { success: true, id: id };
}

function teacherFields(p) {
  return {
    'Full Name':          p.full_name    || '',
    'Hourly Rate (Rs)':   p.hourly_rate  || '',
    'Subject(s)':         p.subjects     || '',
    'Contact (WhatsApp)': p.contact      || '',
    'Joining Date':       p.joining_date || '',
    'Status':             p.status       || 'Active',
    'Notes':              p.notes        || ''
  };
}

// ═══════════════════════════════════════════════════════════════
//  TEACHER PAYMENTS  (new sheet you create)
//  Headers: TP ID | Teacher ID | Date (DD/MM/YYYY) | Amount (Rs) |
//           Mode | Month Covered | Notes
// ═══════════════════════════════════════════════════════════════

function addTeacherPayment(p) {
  var sheet = getSheet(SHEET_TEACHER_PAYMENTS);
  var id = nextId(sheet, 'TP ID', 'TP-');
  var headers = sheet.getRange(4, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h){ return String(h).trim(); });
  var newRow = sheet.getLastRow() + 1;
  var dateColIdx = headers.indexOf('Date (DD/MM/YYYY)');
  if (dateColIdx >= 0) sheet.getRange(newRow, dateColIdx + 1).setNumberFormat('@STRING@');
  sheet.appendRow([
    id,
    p.teacher_id    || '',
    p.date          || '',
    p.amount        || '',
    p.mode          || '',
    p.month_covered || '',
    p.notes         || ''
  ]);
  return { success: true, id: id };
}

// ═══════════════════════════════════════════════════════════════
//  JSON RESPONSE
// ═══════════════════════════════════════════════════════════════

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
