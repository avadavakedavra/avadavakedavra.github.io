# Sehr Academy — Website

A static educational website for **Sehr Academy**, a personalised tutoring centre located at Vatanappally, Thrissur, Kerala. The site is hosted on GitHub Pages at [sehracademy.com](https://sehracademy.com).

## Overview

Sehr Academy offers focused, small-batch tuition for Class 10, 11, and 12 students — with specialised preparation for NEET and JEE Mains. This repository contains the complete source code for the public-facing website.

### Key Features
- Course pages for Class 10, 11, and 12 with curriculum details
- Student portal (login, live classes, schedule, syllabus)
- Academic calendar and study resources
- Fully responsive, mobile-first design
- SEO-optimised with schema.org structured data

---

## Running Locally

Since this is a pure static site (HTML/CSS/JS), no build step is needed. You can run it with any local web server.

### Using Python (built-in server)

```bash
# Python 3
python -m http.server 8080

# Then open http://localhost:8080 in your browser
```

### Using Node.js (npx serve)

```bash
npx serve .

# Then open http://localhost:3000 in your browser
```

### Using VS Code Live Server Extension

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

> **Note:** The navigation and footer are loaded dynamically via `fetch()` from `/partials/nav.html` and `/partials/footer.html`. These requests require a local server — simply opening `index.html` as a `file://` URL will not load the navigation correctly.

---

## Deployment

This site is deployed automatically via **GitHub Pages**.

### Automatic Deployment

Any push to the `main` branch is automatically deployed to [sehracademy.com](https://sehracademy.com) via GitHub Pages.

### Manual Deployment Steps

1. Push your changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. GitHub Pages will automatically build and deploy within 1–2 minutes.
3. Visit [sehracademy.com](https://sehracademy.com) to verify the changes.

### Custom Domain

The custom domain `sehracademy.com` is configured via the `CNAME` file in the repository root. DNS is managed externally and points to GitHub Pages.

---

## File Structure

```
avadavakedavra.github.io/
│
├── index.html              # Home page
├── about.html              # About Us page
├── class10.html            # Class 10 course page
├── class11.html            # Class 11 course page
├── class12.html            # Class 12 course page
├── faq.html                # Frequently Asked Questions
├── blog.html               # Study Resources / Blog
├── careers.html            # Careers page
│
├── syllabus.html           # Syllabus overview (Class 10/11)
├── syllabus12.html         # Class 12 specific syllabus
├── academiccalendar.html   # Academic calendar
├── schedule.html           # Class and test schedule
├── liveclasses.html        # Live classes portal
├── studyplan.html          # Personalised study plans
│
├── tuitionfees.html        # Tuition fee structure
├── sessionpricing.html     # Private session pricing
├── downloads.html          # Downloadable resources
│
├── studentlogin.html       # Student login portal
├── student.html            # Student dashboard
├── studentlist.html        # Enrolled student list (internal)
├── attendancelist.html     # Attendance tracking (internal)
├── sessionanalytics.html   # Session analytics (internal)
├── admissionconfirm.html   # Admission confirmation page
│
├── 404.html                # Custom 404 error page
├── CNAME                   # Custom domain configuration
├── sitemap.xml             # XML sitemap for SEO
├── robots.txt              # Robots crawl directives
├── logo.png                # Academy logo
│
├── partials/
│   ├── nav.html            # Shared navigation bar (loaded dynamically)
│   └── footer.html         # Shared footer (loaded dynamically)
│
├── assets/
│   ├── nav.js              # Script to inject nav.html into pages
│   └── footer.js           # Script to inject footer.html into pages
│
├── data/
│   ├── academic-2025-2026.json   # Academic calendar data
│   ├── schedule.json             # Class schedule data
│   ├── students.json             # Student records (internal)
│   └── syllabus.json             # Syllabus data
│
├── students/
│   ├── gayathri.json       # Individual student data
│   ├── fidha.json
│   └── devanandha.json
│
├── downloads/
│   └── free/
│       └── manifest.json   # Free download resources manifest
│
└── announcements.json      # Site-wide announcements data
```

---

## Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and content |
| CSS3 (inline) | Styling — all styles are inline per page |
| Vanilla JavaScript | Navigation injection, dynamic content |
| JSON | Data files (announcements, schedule, students) |
| Google Fonts | Montserrat font family |
| GitHub Pages | Hosting and deployment |

### Design System

- **Font:** [Montserrat](https://fonts.google.com/specimen/Montserrat) (weights 500, 600, 700, 800)
- **Primary colour:** `#8BC53F` (green)
- **Text colour:** `#0b0f10` (near-black)
- **Muted text:** `#6b7280` (gray)
- **Border:** `#e5e7eb`
- **Background:** `#ffffff`

---

## How the Navigation Works

The navigation bar (`partials/nav.html`) and footer (`partials/footer.html`) are shared across all pages. They are loaded dynamically using a `fetch()` call in `assets/nav.js` and `assets/footer.js`:

```html
<!-- In every HTML page -->
<header id="site-header"></header>
<script src="/assets/nav.js" defer></script>
```

The nav script fetches `/partials/nav.html`, injects it into `#site-header`, and re-executes inline scripts for dropdown functionality and active page highlighting.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test locally using a local server (see [Running Locally](#running-locally))
5. Commit and push: `git push origin feature/your-feature-name`
6. Open a Pull Request against `main`

### Coding Standards

- Maintain UTF-8 encoding on all HTML files
- Use the Montserrat font family consistently
- Follow the existing inline CSS pattern (no external stylesheets)
- Ensure all new pages include proper meta tags, Open Graph tags, and schema.org structured data
- Include breadcrumb navigation on all inner pages
- Test responsiveness at mobile (375px), tablet (768px), and desktop (1280px) breakpoints

---

## Contact

For questions about the website, contact the academy:

- **WhatsApp:** [+91 95394 09586](https://wa.me/919539409586)
- **Website:** [sehracademy.com](https://sehracademy.com)
- **Location:** Vatanappally, Thrissur, Kerala, India
