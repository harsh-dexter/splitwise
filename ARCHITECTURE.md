# Splitwise Application Architecture Documentation

This document provides a detailed breakdown of the Splitwise application's architecture, data flow, key components, and core functionalities.

## 1. Overall Application Structure

The Splitwise application follows a client-server architecture, consisting of a React-based frontend and a Node.js/Express backend, with MongoDB as the database.

-   **Frontend (Client):**
    -   **Framework:** React.js
    -   **Styling:** Tailwind CSS
    -   **Routing:** React Router DOM
    -   **API Interaction:** Axios for HTTP requests
    -   **State Management:** React Hooks (`useState`, `useEffect`)
    -   **Location:** `client/` directory

-   **Backend (Server):**
    -   **Framework:** Node.js with Express.js
    -   **Database:** MongoDB
    -   **ODM:** Mongoose
    -   **Authentication:** JWT (JSON Web Tokens)
    -   **Location:** `server/` directory

## 2. Data Flow

Data flows between the frontend and backend primarily through RESTful API calls.

### Authentication Flow:
1.  **User Registration/Login:**
    -   Frontend sends user credentials (email, password) to `/api/auth/register` or `/api/auth/login`.
    -   Backend authenticates/registers the user, generates a JWT, and sends it back to the frontend.
    -   Frontend stores the JWT (e.g., in local storage) and includes it in subsequent API requests for authorization.

### Group Management Flow:
1.  **Create Group:**
    -   Frontend (`CreateGroupModal.jsx`) sends group details to `/api/groups`.
    -   Backend (`groupController.js`) creates the group, adds the creator as a member, and stores it in MongoDB.
2.  **View Groups:**
    -   Frontend (`GroupDashboardPage.jsx`) fetches user's groups from `/api/groups`.
    -   Backend (`groupController.js`) retrieves groups associated with the authenticated user, including their expenses, and sends them to the frontend.
3.  **View Group Details:**
    -   Frontend (`GroupDetailPage.jsx`) fetches a specific group's details from `/api/groups/:id`.
    -   Backend (`groupController.js`) retrieves the group and its associated expenses, balances, and settlements.
4.  **Join Group:**
    -   Frontend (`JoinPage.jsx`) uses an invite link to send a request to `/api/groups/join/:inviteCode`.
    -   Backend (`groupController.js`) validates the invite code and adds the user to the group's members.

### Expense Management Flow:
1.  **Add Expense:**
    -   Frontend (`AddExpenseForm.jsx`) sends expense details (description, amount, payer, participants) to `/api/expenses`.
    -   Backend (`expenseController.js`) creates the expense, associates it with the group, and updates group balances.
2.  **View Expenses:**
    -   Frontend (`ExpenseList.jsx` within `GroupDetailPage.jsx`) fetches expenses for a specific group from `/api/expenses/group/:groupId`.
    -   Backend (`expenseController.js`) retrieves and sends the expenses.

## 3. Key Components and Controllers

### Frontend Components:

-   **`App.jsx`:**
    -   Main application component.
    -   Handles client-side routing using React Router DOM.
    -   Manages global state related to authentication, groups, and expenses.
    -   Orchestrates API calls for adding groups and expenses.
-   **`LandingPage.jsx`:**
    -   Entry point for unauthenticated users.
    -   Contains `LoginForm.jsx` and `RegisterForm.jsx` for user authentication.
-   **`GroupDashboardPage.jsx`:**
    -   Displays a list of groups the user is a member of.
    -   Provides functionality to create new groups (`CreateGroupModal.jsx`).
-   **`GroupDetailPage.jsx`:**
    -   Shows detailed information for a selected group.
    -   Includes `ExpenseList.jsx`, `BalanceSummary.jsx`, and `SettlementList.jsx`.
    -   Allows adding new expenses (`AddExpenseForm.jsx`).
-   **`AddExpenseForm.jsx`:**
    -   Form for users to input and submit new expense details.
-   **`CreateGroupModal.jsx`:**
    -   Modal component for creating a new group.
-   **`EditGroupModal.jsx`:**
    -   Modal component for editing existing group details.
-   **`ExpenseList.jsx`:**
    -   Displays a formatted list of expenses within a group.

### Backend Controllers:

-   **`authController.js`:**
    -   Handles user registration and login.
    -   Generates and verifies JWTs.
-   **`groupController.js`:**
    -   Manages all group-related operations:
        -   `createGroup`: Creates a new group, ensuring the creator is added as a member.
        -   `getGroups`: Retrieves all groups for an authenticated user, including associated expenses.
        -   `getGroupById`: Fetches a specific group's details, performing membership checks.
        -   `updateGroup`: Modifies group details, with membership verification.
        -   `generateInviteLink`: Creates a unique invite link for a group.
        -   `joinGroup`: Adds a user to a group via an invite link.
-   **`expenseController.js`:**
    -   Handles expense-related operations:
        -   `createExpense`: Adds a new expense to a group, including membership checks.
        -   `getExpensesByGroup`: Retrieves all expenses for a given group, with membership checks.
-   **`summaryController.js`:**
    -   Calculates and provides a summary of balances within a group, with membership checks.
-   **`settlementController.js`:**
    -   Determines and suggests optimal settlements to clear balances within a group, with membership checks.

## 4. Membership Logic

Group membership is a core aspect of the application, ensuring that only authorized users can view or modify group-related data.

-   **Storage:** Group members are stored as an array of strings (`members: [String]`) in the `Group` Mongoose schema (`server/src/models/Group.js`). These strings represent the `name` or `email` (referred to as `identifier`) of the user.
-   **Verification:**
    -   All critical backend operations (`createGroup`, `getGroups`, `getGroupById`, `updateGroup`, `createExpense`, `getExpensesByGroup`, `getSummary`, `getSettlements`) include robust membership checks.
    -   The `identifier` (user's `name` or `email`) extracted from the authenticated user's JWT is consistently used to verify if the user is present in the `members` array of the target group.
    -   This standardization prevents unauthorized access and resolves issues like `404 Group not found or user is not a member` and `500 Internal Server Error` previously encountered due to inconsistent membership checks.
-   **Automatic Inclusion:** When a group is created, the `createGroup` controller automatically adds the creating user's `identifier` to the `members` array.

## 5. API Endpoints Summary

### Authentication Routes (`/api/auth`)
-   `POST /register`: Register a new user.
-   `POST /login`: Authenticate a user and receive a JWT.

### Group Routes (`/api/groups`)
-   `POST /`: Create a new group.
-   `GET /`: Get all groups for the authenticated user.
-   `GET /:id`: Get details for a specific group.
-   `PUT /:id`: Update details for a specific group.
-   `POST /:id/invite`: Generate an invite link for a group.
-   `GET /join/:inviteCode`: Join a group using an invite code.

### Expense Routes (`/api/expenses`)
-   `POST /`: Add a new expense to a group.
-   `GET /group/:groupId`: Get all expenses for a specific group.

### Summary Routes (`/api/summary`)
-   `GET /group/:groupId`: Get balance summary for a specific group.

### Settlement Routes (`/api/settlements`)
-   `GET /group/:groupId`: Get suggested settlements for a specific group.
