# Project Guidelines

This document outlines the development and documentation standards for this project. All team members are expected to follow these guidelines.

## 1. Directory Structure

To maintain a clean and organized codebase, please place your code in the appropriate directories:

-   **`/frontend`**: All frontend code (e.g., React, Vue, Angular, HTML, CSS, JavaScript) goes here.
-   **`/backend`**: All backend code (e.g., Node.js, Python, Java, API logic) goes here.
-   **`/database`**: Database schemas, migration scripts, and seed files belong in this directory.
-   **`/docs`**: All project documentation, including your personal work logs, should be placed here.

## 2. Git Workflow

To ensure code quality and collaboration, please follow this Git workflow:

-   **Create a Branch**: For each new feature or task, create a separate branch from the main development branch.
-   **Push Your Code**: Commit and push your changes to your branch on GitHub.
-   **Create a Pull Request**: Once your work is ready for review, open a pull request. Your code will be evaluated before being merged.

## 3. Documentation and Work Logs

Each team member is required to maintain a personal work log to track their contributions and progress.

-   **Create a Markdown File**: In the `/docs` directory, create a new markdown file named `your-name.md` (e.g., `jane-doe.md`).
-   **Log Your Work**: For each work session, add a new entry to your file.
-   **Content**: Each entry should include:
    -   The date.
    -   A summary of the tasks you completed.
    -   Any challenges you encountered and how you resolved them.
    -   Any questions or blockers that need attention.

### Example Log Entry

```markdown
## 2023-10-27

### What I Did
- Implemented the user authentication flow on the frontend.
- Created the login and registration components.
- Connected the frontend forms to the backend API endpoints.

### Challenges
- Ran into a CORS issue when making API requests from `localhost:3000` to `localhost:5000`.
- **Solution**: Enabled CORS on the backend server for the development environment.

### Next Steps
- Implement profile page for authenticated users.
```