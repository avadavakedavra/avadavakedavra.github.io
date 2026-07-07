/**
 * SEHR Academy — Test Data Script
 * ─────────────────────────────────
 * Standalone Apps Script for student tests.
 * Separate deployment from attendance script.
 *
 * Sheet tabs required in THIS spreadsheet:
 *   Tests      — test definitions + questions
 *   Results    — submitted test results
 *   students   — synced from attendance sheet (or link to it)
 *
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * ATT_SHEET_ID below = your attendance spreadsheet ID
 * (same one that has the students tab)
 */

/* ── Config ── */
var SHEET_TESTS   = 'Tests';
var SHEET_RESULTS = 'Results';

/* ── Respond ── */
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Date helper ── */
function toYMD(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return val.getFullYear() + '-' +
      String(val.getMonth()+1).padStart(2,'0') + '-' +
      String(val.getDate()).padStart(2,'0');
  }
  return String(val).trim();
}

function nowIST() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy HH:mm:ss');
}

/* ══════════════════════════════════════
   doGet
══════════════════════════════════════ */
function doGet(e) {
  try {
    if (!e || !e.parameter) return respond({status:'ok',system:'SEHR Test'});

    var p      = e.parameter;
    var action = String(p.action || '').trim();

    if (action === 'getTests')      return respond(getTests(p));
    if (action === 'studentLogin')  return respond(studentLogin(p));
    if (action === 'checkAttempt')  return respond(checkAttempt(p));
    if (action === 'startTest')     return respond(startTest(p));
    if (action === 'submitTest')    return respond(submitTest(p));
    if (action === 'saveTest')      return respond(saveTest(p));
    if (action === 'getTestFull')   return respond(getTestFull(p));
    if (action === 'getResults')    return respond(getResults(p));
    if (action === 'getStudentNames') return respond(getStudentNames(p));

    return respond({success:false, error:'Unknown action: '+action});
  } catch(err) {
    return respond({success:false, error:'Server error: '+err.message});
  }
}

/* ══════════════════════════════════════
   doPost
   Apps Script populates e.parameter from a POST body the same way it
   does e.parameter from a GET query string, so this can just delegate
   straight to doGet. Needed because large questions_json payloads
   (Test Builder saves with lots of Unicode/math symbols) blow past
   the practical length limit of a GET query string — the frontend
   already falls back to POST for big saves, but that only helps once
   this handler exists.
══════════════════════════════════════ */
function doPost(e) {
  return doGet(e);
}

/* ══════════════════════════════════════
   GET TESTS
   Returns all active tests (optionally filtered)
   Tests sheet columns:
   A:test_id  B:test_name  C:class  D:syllabus  E:subject
   F:duration_mins  G:questions_json  H:created_at  I:active
══════════════════════════════════════ */
function getTests(p) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TESTS);
  if (!sheet) return {success:false, tests:[], error:'Tests sheet not found'};

  var rows = sheet.getDataRange().getValues();
  var tests = [];

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;                           // no id
    var isActive = String(r[8]||'').toLowerCase() === 'yes';
    if (!isActive && String(p.include_inactive||'').toLowerCase() !== 'yes') continue;

    // Parse questions to get count only (don't send answers to client)
    var qcount = 0;
    try {
      var qs = JSON.parse(String(r[6]||'[]'));
      qcount = qs.length;
    } catch(e) {}

    // Apply filters if provided
    if (p.class    && String(r[2]||'').trim() !== p.class)    continue;
    if (p.syllabus && String(r[3]||'').trim() !== p.syllabus) continue;
    if (p.subject  && String(r[4]||'').trim() !== p.subject)  continue;

    tests.push({
      test_id:        String(r[0]).trim(),
      test_name:      String(r[1]).trim(),
      class:          String(r[2]).trim(),
      syllabus:       String(r[3]).trim(),
      subject:        String(r[4]).trim(),
      duration_mins:  Number(r[5]) || 30,
      question_count: qcount,
      created_at:     String(r[7]||'').trim(),
      active:         String(r[8]||'').trim()
    });
  }

  // Sort by class then subject
  tests.sort(function(a,b){
    if (+a.class !== +b.class) return +a.class - +b.class;
    if (a.syllabus !== b.syllabus) return a.syllabus < b.syllabus ? -1 : 1;
    return a.subject.localeCompare(b.subject);
  });

  return {success:true, count:tests.length, tests:tests};
}

/* ══════════════════════════════════════
   STUDENT LOGIN
   Looks up student in the attendance sheet's
   students tab by student_id + dob match.
   DOB format accepted: DD/MM/YYYY or YYYY-MM-DD
══════════════════════════════════════ */
function studentLogin(p) {
  var sid  = String(p.student_id || '').trim().toUpperCase();
  var dob  = String(p.dob        || '').trim();
  var cls  = String(p.class      || '').trim();
  var syl  = String(p.syllabus   || '').trim();

  if (!sid || !dob) return {success:false, message:'Student ID and date of birth are required.'};

  // Normalise dob to DD/MM/YYYY for comparison
  var dobNorm = normDob(dob);

  try {
    // Use local synced students tab (populated by syncStudents())
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(LOCAL_STU_TAB);
    if (!sheet) return {success:false, message:'Student records not found. Run syncStudents() first.'};

    var rows    = sheet.getDataRange().getValues();
    var headers = rows[0];
    var idx     = {};
    headers.forEach(function(h,i){idx[String(h).trim()]=i;});

    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      var rowId = String(r[idx['id']]||'').trim().toUpperCase();
      if (rowId !== sid) continue;

      // Get raw DOB value from sheet (Date object or string)
      var rawDob = r[idx['birthday']||idx['dob']||idx['date_of_birth']||idx['DOB']||idx['Birthday']];

      // Compare dates properly regardless of format
      if (!dobsMatch(rawDob, dob)) {
        return {success:false, message:'Incorrect date of birth.'};
      }

      var status = String(r[idx['admission_status']]||'').trim().toLowerCase();
      if (status !== 'active') {
        return {success:false, message:'Your account is not active. Contact admin.'};
      }

      return {
        success: true,
        student: {
          id:         rowId,
          full_name:  String(r[idx['full_name']]||'').trim(),
          class:      String(r[idx['class']]||'').trim(),
          syllabus:   String(r[idx['syllabus']]||'').trim(),
          school:     String(r[idx['school_name']]||'').trim(),
          photo:      String(r[idx['photo']]||'').trim()
        }
      };
    }
    return {success:false, message:'Student ID not found.'};
  } catch(e) {
    return {success:false, message:'Login error: '+e.message};
  }
}

function normDob(dob) {
  // Normalises any date format → DD/MM/YYYY for comparison
  if (!dob) return '';
  dob = dob.trim();

  // YYYY-MM-DD  (HTML date input format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    var p = dob.split('-');
    return p[2]+'/'+p[1]+'/'+p[0];
  }
  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
    return dob.replace(/-/g,'/');
  }
  // M/D/YYYY or D/M/YYYY or MM/DD/YYYY — Google Sheets stores as M/D/YYYY
  // We receive from student as DD/MM/YYYY; sheet has M/D/YYYY
  // Strategy: parse both and compare as actual dates instead of strings
  return dob; // returned as-is; comparison handled below
}

function dobsMatch(sheetRaw, studentInput) {
  // sheetRaw    = Google Sheets cell: Date object OR string "M/D/YYYY" (e.g. "9/5/2008")
  // studentInput = sent from browser as "DD/MM/YYYY" (converted from HTML date input YYYY-MM-DD)

  var sheetDate, studentDate;

  // ── Parse SHEET value ──
  if (sheetRaw instanceof Date) {
    sheetDate = sheetRaw;
  } else {
    var s = String(sheetRaw||'').trim();
    // Google Sheets M/D/YYYY format → month first
    var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      sheetDate = new Date(+m[3], +m[1]-1, +m[2]); // new Date(year, month-1, day)
    } else {
      sheetDate = new Date(s);
    }
  }

  // ── Parse STUDENT input ──
  // Browser sends DD/MM/YYYY (converted from YYYY-MM-DD HTML input)
  var si = String(studentInput||'').trim();

  // DD/MM/YYYY → day first
  var m2 = si.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) {
    studentDate = new Date(+m2[3], +m2[2]-1, +m2[1]); // new Date(year, month-1, day)
  } else {
    // YYYY-MM-DD fallback
    var m3 = si.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m3) {
      studentDate = new Date(+m3[1], +m3[2]-1, +m3[3]);
    } else {
      studentDate = new Date(si);
    }
  }

  if (!sheetDate||!studentDate||isNaN(sheetDate)||isNaN(studentDate)) return false;

  Logger.log('DOB match: sheet='+sheetDate.toDateString()+' student='+studentDate.toDateString());

  return sheetDate.getFullYear()===studentDate.getFullYear() &&
         sheetDate.getMonth()===studentDate.getMonth() &&
         sheetDate.getDate()===studentDate.getDate();
}

/* ══════════════════════════════════════
   CHECK ATTEMPT
   Has this student already submitted this test?
   Results sheet col A = test_id, col B = student_id
══════════════════════════════════════ */
function checkAttempt(p) {
  var testId = String(p.test_id    ||'').trim();
  var stuId  = String(p.student_id ||'').trim().toUpperCase();

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_RESULTS);
  if (!sheet) return {attempted:false};

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim()===testId && String(data[i][1]).trim().toUpperCase()===stuId) {
      return {
        attempted: true,
        submitted_at: String(data[i][4]||'').trim(),
        score: data[i][8]  // col I = score (was incorrectly reading col K = percentage)
      };
    }
  }
  return {attempted:false};
}

/* ══════════════════════════════════════
   START TEST
   Returns questions WITHOUT correct answers, in the same order
   they're stored in (no question or option shuffling — see note
   below on why that shuffling was removed).
══════════════════════════════════════ */
function startTest(p) {
  var testId = String(p.test_id    ||'').trim();
  var stuId  = String(p.student_id ||'').trim().toUpperCase();

  if (!testId) return {success:false, message:'No test ID provided.'};

  // Double-check attempt
  var chk = checkAttempt({test_id:testId, student_id:stuId});
  if (chk.attempted) return {success:false, message:'You have already attempted this test.'};

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TESTS);
  if (!sheet) return {success:false, message:'Tests sheet not found.'};

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (String(r[0]).trim() !== testId) continue;

    var rawQ = String(r[6]||'[]');
    var allQ = [];
    try { allQ = JSON.parse(rawQ); } catch(e) {
      return {success:false, message:'Invalid question data in test.'};
    }
    if (!allQ.length) return {success:false, message:'This test has no questions.'};

    // No shuffling: questions and options go out in the exact order
    // they're stored in. (Shuffling previously called shuffleOptions()
    // twice per question — once to build the shown `options` order and
    // once to build the `opt_map` used later to translate the answer
    // back — which are two independent Math.random() shuffles, so the
    // map didn't actually describe the order shown. That mismatch is
    // what was silently corrupting grading.) q_ref is just each
    // question's own array position now, so submitTest() can compare
    // the student's answer directly with no translation step at all.
    var clientQ = allQ.map(function(q,idx){
      return {
        question:  q.question,
        options:   q.options,
        q_ref:     idx
      };
    });

    return {
      success:       true,
      test_id:       testId,
      test_name:     String(r[1]).trim(),
      duration_mins: Number(r[5])||30,
      questions:     clientQ
    };
  }
  return {success:false, message:'Test not found.'};
}

/* ══════════════════════════════════════
   SUBMIT TEST
   Scores the test, saves to Results sheet.
   Results columns:
   A:test_id  B:student_id  C:student_name  D:class
   E:submitted_at  F:start_time  G:end_time
   H:duration_secs  I:score  J:total  K:percentage
   L:correct  M:wrong  N:skipped  O:flagged
   P:violations  Q:auto_submitted  R:answers_summary
   S:full_answers_json (single cell)
══════════════════════════════════════ */
function submitTest(p) {
  var testId    = String(p.test_id     ||'').trim();
  var stuId     = String(p.student_id  ||'').trim().toUpperCase();
  var stuName   = String(p.student_name||'').trim();
  var ipAddr    = String(p.ip_address  ||'').trim();
  var cls       = String(p.class       ||'').trim();
  var syl       = String(p.syllabus    ||'').trim();
  var timeTaken = Number(p.time_taken_secs||0);
  var startTime = String(p.start_time  ||'').trim();
  var endTime   = String(p.end_time    ||'').trim();
  var autoSub   = String(p.auto_submitted||'NO').trim();
  var flagged   = String(p.flagged     ||'NO').trim();

  // Parse answers and violations
  var answers    = [];
  var violations = [];
  try { answers    = JSON.parse(p.answers    ||'[]'); } catch(e){}
  try { violations = JSON.parse(p.violations ||'[]'); } catch(e){}

  // Prevent duplicate submission
  var chk = checkAttempt({test_id:testId, student_id:stuId});
  if (chk.attempted) return {success:false, duplicate:true, message:'Already submitted.'};

  // Load test to score
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var tSheet = ss.getSheetByName(SHEET_TESTS);
  var testRow = null;
  if (tSheet) {
    var tRows = tSheet.getDataRange().getValues();
    for (var i = 1; i < tRows.length; i++) {
      if (String(tRows[i][0]).trim()===testId) { testRow=tRows[i]; break; }
    }
  }

  var score=0, total=0, correct=0, wrong=0, skipped=0;
  var answerSummary = [];

  if (testRow) {
    var allQ = [];
    try { allQ = JSON.parse(String(testRow[6]||'[]')); } catch(e){}
    total = allQ.length;

    answers.forEach(function(a){
      var origQ = allQ[a.q_ref];
      if (!origQ) return;

      // Prefer the exact text the client sent (question_no/question_text/
      // selected_text); fall back to looking it up from the stored test
      // if an older client build didn't send those fields yet.
      var qNo          = (a.question_no!=null) ? a.question_no : (a.q_ref+1);
      var questionText = a.question_text || origQ.question || '';
      var correctIdx   = Number(origQ.correct);
      var correctText  = (origQ.options && origQ.options[correctIdx]!==undefined) ? origQ.options[correctIdx] : '';

      if (a.skipped || a.selected === null || a.selected === undefined) {
        skipped++;
        answerSummary.push({
          q: qNo, question: questionText,
          selected: null, selected_text: '(skipped)',
          correct_text: correctText, correct: false
        });
        return;
      }

      // No option shuffling — the index the student clicked is the same
      // index the question was stored and served with, so it compares
      // directly against the stored correct index. No translation map
      // needed (and therefore nothing that can silently mismatch it).
      var selectedIdx  = Number(a.selected);
      var selectedText = a.selected_text || (origQ.options && origQ.options[selectedIdx]) || '';
      var isCorrect    = (selectedIdx === correctIdx);
      if (isCorrect) { correct++; score++; }
      else           { wrong++; }

      answerSummary.push({
        q: qNo, question: questionText,
        selected: selectedIdx, selected_text: selectedText,
        correct_text: correctText, correct: isCorrect
      });
    });
  }

  var pct = total>0 ? Math.round(score/total*100) : 0;

  // Build answers JSON for single-cell storage
  var fullJson = JSON.stringify({
    test_id:       testId,
    student_id:    stuId,
    answers:       answerSummary,
    violations:    violations,
    score:         score,
    total:         total,
    pct:           pct,
    time_secs:     timeTaken,
    submitted_at:  nowIST()
  });

  // Write to Results sheet
  var rSheet = ss.getSheetByName(SHEET_RESULTS);
  if (!rSheet) {
    rSheet = ss.insertSheet(SHEET_RESULTS);
    // Write headers
    rSheet.getRange(1,1,1,20).setValues([[
      'test_id','student_id','student_name','class_syllabus',
      'submitted_at','start_time','end_time','duration_secs',
      'score','total','percentage','correct','wrong','skipped',
      'flagged','violations_count','auto_submitted','ip_address',
      'answers_summary','full_json'
    ]]);
    rSheet.setFrozenRows(1);
    rSheet.getRange('A:A').setNumberFormat('@STRING@');
  }

  var ansSummaryStr = answerSummary.map(function(a){
    var mark    = a.correct?'✓':'✗';
    var ansPart = (a.selected===null) ? 'Skipped' : ('"'+a.selected_text+'"');
    return 'Q'+a.q+' '+mark+' — Your answer: '+ansPart+' | Correct answer: "'+a.correct_text+'"';
  }).join('\n');

  rSheet.appendRow([
    testId,
    stuId,
    stuName,
    cls+(syl?' · '+syl:''),
    nowIST(),
    startTime,
    endTime,
    timeTaken,
    score,
    total,
    pct,
    correct,
    wrong,
    skipped,
    flagged,
    violations.length,
    autoSub,
    ipAddr,
    ansSummaryStr,
    fullJson   // ← entire result in one cell
  ]);

  return {
    success: true,
    score:   score,
    total:   total,
    pct:     pct,
    correct: correct,
    wrong:   wrong,
    skipped: skipped,
    flagged: flagged
  };
}


/* ══════════════════════════════════════
   SYNC STUDENTS
   Copies the students tab from your main sheet
   into this sheet's own 'students' tab.

   SOURCE_SHEET_ID = the ID from your main sheet URL:
   docs.google.com/spreadsheets/d/THIS_PART/edit

   Run syncStudents() once manually to test,
   then run createSyncTrigger() once to automate.
══════════════════════════════════════ */

var SOURCE_SHEET_ID = '1qBWKVonfT6E-c95ZtVR92R3Od1JXj3_4WNnMaGdtAzo';
var SOURCE_TAB      = 'students';
var LOCAL_STU_TAB   = 'students';

function syncStudents() {
  try {
    var src    = SpreadsheetApp.openById(SOURCE_SHEET_ID);
    var srcTab = src.getSheetByName(SOURCE_TAB);
    if (!srcTab) throw new Error('Source tab "'+SOURCE_TAB+'" not found.');

    var data = srcTab.getDataRange().getValues();
    if (!data || data.length < 2) throw new Error('No student data in source sheet.');

    var dest    = SpreadsheetApp.getActiveSpreadsheet();
    var destTab = dest.getSheetByName(LOCAL_STU_TAB);
    if (!destTab) destTab = dest.insertSheet(LOCAL_STU_TAB);

    destTab.clearContents();
    destTab.getRange(1, 1, data.length, data[0].length).setValues(data);

    var now = nowIST();
    Logger.log('syncStudents: copied ' + (data.length-1) + ' students at ' + now);
    return { success:true, rows:data.length-1, synced_at:now };

  } catch(e) {
    Logger.log('syncStudents error: ' + e.message);
    return { success:false, message:e.message };
  }
}

function createSyncTrigger() {
  // Remove existing triggers for syncStudents
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (t.getHandlerFunction() === 'syncStudents') ScriptApp.deleteTrigger(t);
  });
  // Create hourly trigger
  ScriptApp.newTrigger('syncStudents').timeBased().everyHours(1).create();
  Logger.log('Hourly sync trigger created.');
}


/* ══════════════════════════════════════
   SAVE TEST (create or update)
   Called from the Test Builder admin page.
   Appkey required.
══════════════════════════════════════ */
function saveTest(p) {
  if (p.appkey !== 'sehr2026') return {success:false, error:'Unauthorized'};

  var testId   = String(p.test_id      ||'').trim();
  var testName = String(p.test_name    ||'').trim();
  var cls      = String(p.class        ||'').trim();
  var syl      = String(p.syllabus     ||'').trim();
  var subj     = String(p.subject      ||'').trim();
  var dur      = Number(p.duration_mins||30);
  var active   = String(p.active       ||'yes').trim();
  var qJson    = String(p.questions_json||'[]').trim();

  if (!testId||!testName) return {success:false, error:'Test ID and name are required.'};

  // Validate questions JSON
  try { JSON.parse(qJson); } catch(e) {
    return {success:false, error:'Invalid questions JSON: '+e.message};
  }

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TESTS);
  if (!sheet) { setupSheets(); sheet = ss.getSheetByName(SHEET_TESTS); }

  var rows = sheet.getDataRange().getValues();

  // Check if test exists — update if so
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === testId) {
      sheet.getRange(i+1, 1, 1, 9).setValues([[
        testId, testName, cls, syl, subj, dur, qJson, rows[i][7], active
      ]]);
      return {success:true, action:'updated', test_id:testId};
    }
  }

  // New test — append
  sheet.appendRow([testId, testName, cls, syl, subj, dur, qJson, nowIST(), active]);
  return {success:true, action:'created', test_id:testId};
}

/* ══════════════════════════════════════
   GET FULL TEST (with questions + correct answers)
   Admin-only — requires appkey
══════════════════════════════════════ */
function getTestFull(p) {
  if (p.appkey !== 'sehr2026') return {success:false, error:'Unauthorized'};

  var testId = String(p.test_id||'').trim();
  if (!testId) return {success:false, error:'test_id required'};

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TESTS);
  if (!sheet) return {success:false, error:'Tests sheet not found'};

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() !== testId) continue;
    var r = rows[i];
    var questions = [];
    try { questions = JSON.parse(String(r[6]||'[]')); } catch(e){}
    return {
      success: true,
      test: {
        test_id:       String(r[0]).trim(),
        test_name:     String(r[1]).trim(),
        class:         String(r[2]).trim(),
        syllabus:      String(r[3]).trim(),
        subject:       String(r[4]).trim(),
        duration_mins: Number(r[5])||30,
        questions:     questions,
        created_at:    String(r[7]||'').trim(),
        active:        String(r[8]||'').trim()
      }
    };
  }
  return {success:false, error:'Test not found'};
}

/* ══════════════════════════════════════
   GET RESULTS for a test
   Admin-only — requires appkey
══════════════════════════════════════ */
function getResults(p) {
  if (p.appkey !== 'sehr2026') return {success:false, error:'Unauthorized'};

  var testId = String(p.test_id||'').trim();
  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var sheet  = ss.getSheetByName(SHEET_RESULTS);
  if (!sheet) return {success:true, results:[]};

  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var idx = {};
  headers.forEach(function(h,i){idx[String(h).trim()]=i;});

  var results = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[0]) continue;
    if (testId && String(r[0]).trim() !== testId) continue;
    results.push({
      test_id:       String(r[idx['test_id']      ]||'').trim(),
      student_id:    String(r[idx['student_id']    ]||'').trim(),
      student_name:  String(r[idx['student_name']  ]||'').trim(),
      class_syllabus:String(r[idx['class_syllabus' ]]||'').trim(),
      submitted_at:  String(r[idx['submitted_at']  ]||'').trim(),
      duration_secs: Number(r[idx['duration_secs'] ]||0),
      score:         Number(r[idx['score']         ]||0),
      total:         Number(r[idx['total']         ]||0),
      percentage:    Number(r[idx['percentage']    ]||0),
      correct:       Number(r[idx['correct']       ]||0),
      wrong:         Number(r[idx['wrong']         ]||0),
      skipped:       Number(r[idx['skipped']       ]||0),
      flagged:       String(r[idx['flagged']       ]||'NO').trim(),
      violations:    Number(r[idx['violations_count']]||0),
      ip_address:    String(r[idx['ip_address']    ]||'').trim()
    });
  }

  // Sort newest first
  results.sort(function(a,b){return b.submitted_at.localeCompare(a.submitted_at);});

  // Attach student photos from students tab
  var stuSheet2 = ss.getSheetByName(LOCAL_STU_TAB);
  var photoMap2 = {};
  if (stuSheet2) {
    var stuRows2 = stuSheet2.getDataRange().getValues();
    var idIdx2   = stuRows2[0].indexOf('id');
    var phIdx2   = stuRows2[0].indexOf('photo');
    if (idIdx2>-1 && phIdx2>-1) {
      for (var k=1; k<stuRows2.length; k++) {
        var sid2 = String(stuRows2[k][idIdx2]||'').trim().toUpperCase();
        var ph2  = String(stuRows2[k][phIdx2] ||'').trim();
        if (sid2 && ph2) photoMap2[sid2] = ph2;
      }
    }
  }
  results.forEach(function(r){ r.photo = photoMap2[r.student_id.toUpperCase()]||''; });

  return {success:true, count:results.length, results:results};
}


/* ══════════════════════════════════════
   GET STUDENT NAMES
   Returns id + full_name list for a class
   so the test page can populate the dropdown.
   Appkey required (not public).
══════════════════════════════════════ */
function getStudentNames(p) {
  if (p.appkey !== 'sehr2026') return {success:false, error:'Unauthorized'};

  var cls = String(p.class    ||'').trim();
  var syl = String(p.syllabus ||'').trim();
  if (!cls) return {success:false, error:'class required'};

  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOCAL_STU_TAB);
  if (!sheet) return {success:false, students:[], error:'Run syncStudents() first'};

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var idx     = {};
  headers.forEach(function(h,i){idx[String(h).trim()]=i;});

  var students = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[idx['id']]) continue;
    if (String(r[idx['class']]||'').trim() !== cls) continue;
    if (syl && String(r[idx['syllabus']]||'').trim() !== syl) continue;
    students.push({
      id:        String(r[idx['id']]       ||'').trim(),
      full_name: String(r[idx['full_name']] ||'').trim()
    });
  }

  students.sort(function(a,b){return a.full_name.localeCompare(b.full_name);});
  return {success:true, count:students.length, students:students};
}

/* ══════════════════════════════════════
   SETUP SHEETS
   Run once to create sheet structure
══════════════════════════════════════ */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Tests sheet
  var ts = ss.getSheetByName(SHEET_TESTS);
  if (!ts) {
    ts = ss.insertSheet(SHEET_TESTS);
    ts.getRange(1,1,1,9).setValues([[
      'test_id','test_name','class','syllabus','subject',
      'duration_mins','questions_json','created_at','active'
    ]]);
    ts.setFrozenRows(1);
    ts.getRange('A:A').setNumberFormat('@STRING@');
    ts.getRange('G:G').setNumberFormat('@STRING@');
    // Sample test
    ts.appendRow([
      'TEST001',
      'Class 9 Physics - Chapter 1',
      '9',
      'CBSE',
      'Physics',
      30,
      JSON.stringify([
        {question:'What is the SI unit of force?',options:['Newton','Joule','Watt','Pascal'],correct:0},
        {question:'Which law states F = ma?',options:["Newton's First Law","Newton's Second Law","Newton's Third Law","Hooke's Law"],correct:1},
        {question:'What is the unit of work?',options:['Newton','Pascal','Joule','Watt'],correct:2}
      ]),
      nowIST(),
      'yes'
    ]);
    Logger.log('Tests sheet created with sample test.');
  }

  // Results sheet
  var rs = ss.getSheetByName(SHEET_RESULTS);
  if (!rs) {
    rs = ss.insertSheet(SHEET_RESULTS);
    rs.getRange(1,1,1,19).setValues([[
      'test_id','student_id','student_name','class_syllabus',
      'submitted_at','start_time','end_time','duration_secs',
      'score','total','percentage','correct','wrong','skipped',
      'flagged','violations_count','auto_submitted','ip_address',
      'answers_summary','full_json'
    ]]);
    rs.setFrozenRows(1);
    rs.getRange('A:A').setNumberFormat('@STRING@');
    rs.getRange('S:S').setWrap(false);
    Logger.log('Results sheet created.');
  }

  Logger.log('Setup complete.');
}

/* ══════════════════════════════════════
   ADD TEST HELPER
   Call this from the editor to add a test.
   questions = array of {question, options:[4], correct:0-3}
══════════════════════════════════════ */
function addTest(testId, testName, cls, syllabus, subject, durationMins, questions) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_TESTS);
  if (!sheet) { setupSheets(); sheet = ss.getSheetByName(SHEET_TESTS); }
  sheet.appendRow([
    testId, testName, cls, syllabus, subject,
    durationMins,
    JSON.stringify(questions),
    nowIST(),
    'yes'
  ]);
  Logger.log('Test added: '+testId);
}

/* ══════════════════════════════════════
   SAMPLE: add a test programmatically
   Uncomment and run once from editor
══════════════════════════════════════ */
/*
function addSampleTest() {
  addTest(
    'TEST_PHY_9_CBSE_01',
    'Physics Chapter 1 — Motion',
    '9', 'CBSE', 'Physics', 30,
    [
      {
        question: 'An object covers equal distances in equal intervals of time. Its motion is:',
        options: ['Non-uniform','Uniform','Accelerated','Decelerated'],
        correct: 1
      },
      {
        question: 'The slope of a distance-time graph gives:',
        options: ['Acceleration','Displacement','Speed','Force'],
        correct: 2
      }
    ]
  );
}
*/
