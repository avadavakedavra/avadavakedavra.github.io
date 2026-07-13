/**
 * SEHR Academy — Uniform Fee Tracker API
 * ─────────────────────────────────────────────
 * Deployed as a Web App (Execute as: Me, Who has access: Anyone).
 * Used by: financial/uniformtracker.html
 *
 * SETUP
 * 1. Create a new Google Sheet. Rename the first tab to "Orders".
 * 2. In row 1 of "Orders", add these headers (exact spelling, any order
 *    is fine as long as the names match — this script re-maps by header):
 *      id | timestamp | student_name | class | parent_name | contact |
 *      items | quantity | amount | amount_paid | payment_status |
 *      payment_date | delivery_status | delivery_date | notes
 * 3. Extensions → Apps Script, delete the placeholder code, paste this
 *    whole file in.
 * 4. Update SHEET_ID below with this new spreadsheet's ID (the long
 *    string in its URL between /d/ and /edit).
 * 5. Change PASSWORD below to whatever staff password you want.
 * 6. Deploy → New deployment → Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 * 7. Copy the /exec URL it gives you and paste it into the API constant
 *    near the top of the <script> block in uniformtracker.html.
 *
 * GET  ?action=list&password=...                        → array of orders
 * GET  ?action=addOrder&password=...&student_name=...    → {success:true}
 * GET  ?action=updatePayment&password=...&id=...         → {success:true}
 * GET  ?action=updateDelivery&password=...&id=...        → {success:true}
 * GET  ?action=deleteOrder&password=...&id=...           → {success:true}
 */

const SHEET_ID   = 'PASTE_YOUR_NEW_SHEET_ID_HERE';
const ORDERS_SHEET = 'Orders';
const PASSWORD   = 'sehr2026';

const ORDER_HEADERS = [
  'id', 'timestamp', 'student_name', 'class', 'parent_name', 'contact',
  'items', 'quantity', 'amount', 'amount_paid', 'payment_status',
  'payment_date', 'delivery_status', 'delivery_date', 'notes',
];

/* ═══════════════════════════════════════════════
   ROUTING
═══════════════════════════════════════════════ */

function doGet(e) {
  return route(e);
}

function doPost(e) {
  return route(e);
}

function route(e) {
  try {
    const p = (e && e.parameter) || {};
    const action = p.action || '';

    if (action !== 'list' && p.password !== PASSWORD) {
      return jsonOut({ success: false, error: 'Incorrect password.' });
    }
    if (action === 'list' && p.password !== PASSWORD) {
      return jsonOut({ error: 'Incorrect password.' });
    }

    if (action === 'list')           return jsonOut(listOrders());
    if (action === 'addOrder')       return addOrder(p);
    if (action === 'updatePayment')  return updatePayment(p);
    if (action === 'updateDelivery') return updateDelivery(p);
    if (action === 'deleteOrder')    return deleteOrder(p);

    return jsonOut({ status: 'SEHR Academy Uniform Tracker API is running' });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(ORDERS_SHEET);
  if (!sheet) throw new Error('Orders tab not found. Check ORDERS_SHEET name.');
  return sheet;
}

function headerIndex_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, '_'); });
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  return idx;
}

/* ═══════════════════════════════════════════════
   LIST
═══════════════════════════════════════════════ */

function listOrders() {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const idx = headerIndex_(sheet);
  const out = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[idx.id] && !row[idx.student_name]) continue;
    var obj = {};
    ORDER_HEADERS.forEach(function (h) {
      var v = idx[h] !== undefined ? row[idx[h]] : '';
      if (v instanceof Date) {
        v = Utilities.formatDate(v, 'Asia/Kolkata', 'dd/MM/yyyy');
      }
      obj[h] = v === undefined || v === null ? '' : v;
    });
    out.push(obj);
  }
  return out;
}

/* ═══════════════════════════════════════════════
   ADD ORDER
═══════════════════════════════════════════════ */

function addOrder(p) {
  const sheet = getSheet_();
  const id = 'UO' + new Date().getTime();
  const amount = Number(p.amount || 0);
  const amountPaid = Number(p.amount_paid || 0);
  const paymentStatus = amountPaid <= 0 ? 'PENDING' : (amountPaid >= amount ? 'PAID' : 'PARTIAL');
  const deliveryStatus = String(p.delivery_status || 'PENDING').toUpperCase() === 'DELIVERED' ? 'DELIVERED' : 'PENDING';
  const now = new Date();

  const row = ORDER_HEADERS.map(function (h) {
    switch (h) {
      case 'id': return id;
      case 'timestamp': return Utilities.formatDate(now, 'Asia/Kolkata', 'dd/MM/yyyy HH:mm');
      case 'student_name': return p.student_name || '';
      case 'class': return p.class || '';
      case 'parent_name': return p.parent_name || '';
      case 'contact': return p.contact || '';
      case 'items': return p.items || '';
      case 'quantity': return p.quantity || '';
      case 'amount': return amount;
      case 'amount_paid': return amountPaid;
      case 'payment_status': return paymentStatus;
      case 'payment_date': return amountPaid > 0 ? Utilities.formatDate(now, 'Asia/Kolkata', 'dd/MM/yyyy') : '';
      case 'delivery_status': return deliveryStatus;
      case 'delivery_date': return deliveryStatus === 'DELIVERED' ? Utilities.formatDate(now, 'Asia/Kolkata', 'dd/MM/yyyy') : '';
      case 'notes': return p.notes || '';
      default: return '';
    }
  });

  sheet.appendRow(row);
  return jsonOut({ success: true, id: id });
}

/* ═══════════════════════════════════════════════
   UPDATE PAYMENT / DELIVERY
═══════════════════════════════════════════════ */

function findRow_(sheet, idx, id) {
  const rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][idx.id]) === String(id)) return i + 1; // 1-based sheet row
  }
  return -1;
}

function updatePayment(p) {
  const sheet = getSheet_();
  const idx = headerIndex_(sheet);
  const r = findRow_(sheet, idx, p.id);
  if (r === -1) return jsonOut({ success: false, error: 'Order not found.' });

  const amount = Number(sheet.getRange(r, idx.amount + 1).getValue() || 0);
  const amountPaid = Number(p.amount_paid);
  const status = amountPaid <= 0 ? 'PENDING' : (amountPaid >= amount ? 'PAID' : 'PARTIAL');

  sheet.getRange(r, idx.amount_paid + 1).setValue(amountPaid);
  sheet.getRange(r, idx.payment_status + 1).setValue(status);
  sheet.getRange(r, idx.payment_date + 1).setValue(
    amountPaid > 0 ? Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy') : ''
  );
  return jsonOut({ success: true });
}

function updateDelivery(p) {
  const sheet = getSheet_();
  const idx = headerIndex_(sheet);
  const r = findRow_(sheet, idx, p.id);
  if (r === -1) return jsonOut({ success: false, error: 'Order not found.' });

  const status = String(p.delivery_status || '').toUpperCase() === 'DELIVERED' ? 'DELIVERED' : 'PENDING';
  sheet.getRange(r, idx.delivery_status + 1).setValue(status);
  sheet.getRange(r, idx.delivery_date + 1).setValue(
    status === 'DELIVERED' ? Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy') : ''
  );
  return jsonOut({ success: true });
}

function deleteOrder(p) {
  const sheet = getSheet_();
  const idx = headerIndex_(sheet);
  const r = findRow_(sheet, idx, p.id);
  if (r === -1) return jsonOut({ success: false, error: 'Order not found.' });
  sheet.deleteRow(r);
  return jsonOut({ success: true });
}
