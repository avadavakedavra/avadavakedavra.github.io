# 📘 Student Profile Data — Documentation

This document explains how to **edit student details** and **update their records** for Sehr Academy’s student profile system.

---

## 1. Where student data is stored
- Each student has a **JSON file** in the `/students/` folder.
- File name matches the student’s **id** (e.g. `fidha.json`, `gayathri.json`, `devanandha.json`).
- The HTML page `student.html` loads the correct JSON using:

```

[https://sehracademy.com/student.html?id=fidha](https://sehracademy.com/student.html?id=fidha)

````

→ loads `/students/fidha.json`

---

## 2. JSON File Structure

Each JSON file has the following sections:

```json
{
  "lock": { "sha256": "…" },
  "meta": { … },
  "termRanges": { "first": "…", "second": "…" },
  "internals": { "first": [ … ], "second": [ … ] },
  "externals": { "first": { "sehr": {…}, "school": {…} }, "second": { … } },
  "achievements": [ … ],
  "remarks": [ … ],
  "assignments": [ … ]
}
````

---

### 🔒 `lock`

* Controls **student-specific password**.
* Value is a **SHA-256 hash** of the actual password.
* To change:

  1. Generate a hash in browser console:

     ```js
     (async p=>{
       const h = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(p)))]
         .map(b=>b.toString(16).padStart(2,"0")).join("");
       console.log(h);
     })("newPassword123");
     ```
  2. Replace the old hash in `"sha256"`.

---

### 👤 `meta`

Basic student details:

```json
"meta": {
  "name": "Fidha",
  "className": "Plus One Science / Class 11",
  "joinDate": "2025-05-26",
  "birthday": "5 September",
  "avatar": "https://…/avatar.png"
}
```

* **avatar** is a direct image URL (PNG/JPG).
* Updating these values changes the **profile card**.

---

### 📅 `termRanges`

Labels for exam terms:

```json
"termRanges": {
  "first": "May – Sep 2025",
  "second": "Sep – Dec 2025"
}
```

---

### 📝 `internals`

List of **internal exam results**:

```json
"internals": {
  "first": [
    {"label":"QP01","subject":"Physics","pct":51},
    {"label":"QP02","subject":"Maths","pct":63}
  ],
  "second": [
    {"label":"QP09","subject":"Physics","pct":null},
    {"label":"QP10","subject":"Maths","pct":null}
  ]
}
```

* **label** → Exam code
* **subject** → Subject name
* **pct** → Marks in percentage (`null` if pending)

---

### 🎓 `externals`

Stores **Sehr exam** and **School exam** marks:

```json
"externals": {
  "first": {
    "sehr":   { "Physics": 65, "Maths": 70, "Chemistry": 82, "Biology": 60 },
    "school": { "Physics": 68, "Maths": 66, "Chemistry": 80, "Biology": 55 }
  },
  "second": {
    "sehr":   { "Physics": null, "Maths": null, "Chemistry": null, "Biology": null },
    "school": { "Physics": null, "Maths": null, "Chemistry": null, "Biology": null }
  }
}
```

* Use **null** if marks are pending.

---

### 🏅 `achievements`

Array of strings:

```json
"achievements": [
  "Event Coordinator",
  "100% Attendance : July"
]
```

---

### 💬 `remarks`

List of remarks (strings or objects):

```json
"remarks": [
  "Shows steady improvement in Chemistry numericals.",
  "Needs to practice derivations in Physics."
]
```

---

### 📚 `assignments`

Assignments, notes, or tasks:

```json
"assignments": [
  {
    "id": "seminar-on-plantkingdom",
    "title": "Seminar on Kingdom Plantae",
    "note": "Prepare and present the topic Kingdom Plantae.",
    "subject": "Botany",
    "issuedDate": "2025-08-31",
    "dueDate": "2025-09-25",
    "priority": "normal",
    "status": "assigned",
    "faculty": "Mr. Shan",
    "attachments": [
      { "label": "Reference Notes", "url": "https://…" }
    ],
    "checklist": [
      { "text": "Kingdom Plantae", "done": false }
    ]
  }
]
```

* **priority**: `low | normal | high | critical`
* **status**: `assigned | submitted | completed | graded`
* **attachments**: List of files/links.
* **checklist**: Small tasks with `"done": true/false`.

---

## 3. How to Update a Student

1. Open the student’s JSON file in `/students/`.
2. Change values in any section:

   * Update marks
   * Add achievements
   * Write new remarks
   * Insert new assignment
3. Save the file.
4. Reload the profile page:

```
https://sehracademy.com/student.html?id=studentid
```

---

## 4. Adding a New Student

1. Copy any existing JSON file.
2. Rename it with the new student’s id (e.g. `ananya.json`).
3. Update:

   * `"lock.sha256"` with new password hash
   * `"meta"` with student info
   * Clear or reset marks, achievements, assignments
4. Profile will be available at:

```
https://sehracademy.com/student.html?id=ananya
```


✅ With this system, **all details are controlled by JSON only**.
No need to edit HTML files when updating students.

```
