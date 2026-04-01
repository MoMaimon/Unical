# Unical (University Calendar)

**Unical** is a smart scheduling utility designed to assist university students in organizing their academic semesters. It features a hybrid scheduling engine that offers Manual and Fully Automated modes to generate the perfect timetable.

Built for **Al-Balqa Applied University**, this system parses official course offerings to help students avoid conflicts and optimize their time.

---

## Key Features

### Scheduling Modes
* **Manual Mode:** Select specific course sections visually and drag them to the grid. The system provides multiple filtering and sorting options
<!-- * **Semi-Automatic Mode:** Input your preferred courses and define constraints (e.g., "No classes on Sundays" or "Breaks must be > 30 mins"). The system calculates a **Fit Score** to give you the mathematically best schedule. -->
* **Automatic Mode:** "Quick Generate" valid schedules based on common patterns. You can **Pin** specific sections and rotate the rest.
    * It also come with advanced options that can provide the system an priority instructions and filtring rather than relying on common patterns.  

### Accessibility & Usability
* **Bilingual Interface:** Full support for **Arabic (RTL)** and **English (LTR)** with a global toggle.
* **Guest Mode:** Start building a schedule immediately without creating an account.
* **Conflict Detection:** Automatic detection of time overlaps.

### Export Options
* **Download as Image:** Save your weekly grid as a PNG/JPG.
* **Calendar Integration:** Export as an `.ics` file or sync directly with **Google Calendar**.

---

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React-based)
* **Language:** `TypeScript` / `JavaScript` (ES11+)
* **Data Parsing:** API fetching from [Jeridat Al-Mawad](https://app2.bau.edu.jo:7799/courses/index.jsp) (University Course Offerings)

---

## Getting Started

### Prerequisites
* `Node.js` (Latest LTS version recommended)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/unical.git](https://github.com/your-username/unical.git)
    cd unical
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## How It Works

1.  **Data Ingestion:** The system sync data from [Jeridat Al-Mawad](https://app2.bau.edu.jo:7799/courses/index.jsp) either **manually** by admins or on **interval times**.
2.  **Course Selection:** Users filter or search for courses using names or codes (supports Fuzzy Search for typos).
3.  **Generation:** The algorithm processes section combinations against user constraints (Time, Day, Instructor).
4.  **Visualization:** The schedule is rendered on an interactive weekly grid.

---

## Authors

This project was developed by the **Unical Project Team** (Software Engineering Department):

* **Mohammad Maimon**
* **Noor-Elrahman Taqatqa**
* **Ayham Bani-Diab**
---

## License

**© 2025 Unical Project Team.** All Rights Reserved.

This software is the intellectual property of the development team:
* **Mohammad Maimoun**
* **Noor-Elrahman Taqatqa**
* **Ayham Bani-Diab**

Unauthorized copying, distribution, or modification of this file, via any medium, is strictly prohibited without the express permission of the authors.