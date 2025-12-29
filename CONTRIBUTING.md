# Contributing to Unical

Thank you for your interest in contributing to **Unical**! As a team project, we adhere to specific engineering standards to ensure maintainability, reliability, and code quality.

Please review the following guidelines before submitting a Pull Request (PR).

## 🛠️ Development Setup

1.  **Framework:** We use **Next.js** for the frontend and server-side logic.
2.  **Node Version:** Ensure you are using a stable LTS version of Node.js.
3.  **Installation:**
    ```bash
    npm install
    ```

## 📐 Coding Standards

To maintain code quality and readability, we follow these rules:

* **Modular Design:** Code must be modular. Avoid monolithic functions. Core algorithms (like the scheduling engine and conflict detection) should be reusable components.
* **Inline Documentation:** All complex logic and critical functions must include inline documentation using **JSDoc** standards.
    * *Example:*
        ```javascript
        /**
         * Calculates the fit score for a schedule based on user constraints.
         * @param {Schedule} schedule - The generated schedule.
         * @param {Preferences} prefs - User preferences.
         * @returns {number} The calculated fit score (0-100).
         */
        ```
* **Variable Naming:** Use clear, descriptive variable names (e.g., `courseSection` instead of `cs`).
* **No Internal Dependencies:** Do not write code that attempts to access internal university databases or private APIs. We strictly use public data (Jeridat Al-Mawad).

## 📝 Commit Message Guidelines

To keep our history clean and readable, we follow the **Conventional Commits** specification.

**Format:** `<type>(<scope>): <subject>`

### Allowed Types:
* **feat**: A new feature (e.g., adding the Guest Mode logic or the Bilingual Toggle).
* **fix**: A bug fix (e.g., fixing the Fit Score calculation).
* **docs**: Documentation only changes (README, comments).
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons).
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **perf**: A code change that improves performance (e.g., optimization for <3s generation).
* **test**: Adding missing tests or correcting existing tests.
* **chore**: Changes to the build process or auxiliary tools (e.g., updating .gitignore or package.json).

### Examples:
* `feat(auth): implement guest mode via local storage`
* `fix(parser): resolve crash on missing course section tags`
* `docs(readme): add installation instructions`
* `style(ui): fix alignment in RTL layout`
* `test(engine): add unit tests for conflict detection`

### Rules:
1.  **Use the imperative mood** in the subject line ("add" not "added", "fix" not "fixed").
2.  **No period** at the end of the subject line.
3.  **Scope is optional** but recommended to indicate which part of the app you touched (e.g., `ui`, `api`, `parser`).

## 🧪 Testing Guidelines

We prioritize stability, especially for the scheduling engine.

* **Test Coverage:** Critical modules (specifically the Scheduling Engine and Conflict Detection) must maintain **at least 80% code coverage**.
* **Automated Testing:** Ensure your components are designed to be easily testable.
* **Performance:** Code changes should not degrade the response time. Schedule generation must remain under **3 seconds**.

## 🐛 Bug Reporting

If you find a bug (e.g., the parser fails on a specific HTML structure), please open an issue including:
1.  The specific course or section causing the error.
2.  Steps to reproduce the crash.
3.  Current behavior vs. expected behavior.

## 🚀 Pull Request Process

1.  Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
2.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3.  Push to the branch (`git push origin feature/AmazingFeature`).
4.  Open a Pull Request.

---
**Note:** All data handling must ensure transaction integrity. If a user action (like adding a course) fails, the state must roll back completely.