# Online Medication & Prescription Tracker

## Phase 1: Environment Setup & Authentication

This project consists of a **Spring Boot** backend and a **React** frontend.

### Prerequisites
To run this project, you need to install the following tools:
1.  **Java JDK 17+**: [Download Here](https://www.oracle.com/java/technologies/downloads/)
2.  **Apache Maven**: [Download Here](https://maven.apache.org/download.cgi)
3.  **Node.js (LTS)**: [Download Here](https://nodejs.org/)
4.  **MySQL Server**: [Download Here](https://dev.mysql.com/downloads/installer/)

### Database Setup
1.  Open your MySQL Client (Workbench or Command Line).
2.  Run the script located in `database/schema.sql` to create the database and tables.
    ```sql
    source database/schema.sql;
    ```
3.  Check `backend/src/main/resources/application.properties` and update `spring.datasource.username` and `spring.datasource.password` if your MySQL credentials differ from `root`/`password`.

### Backend Setup (Spring Boot)
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies and build:
    ```bash
    mvn clean install
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### Frontend Setup (React)
1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The frontend will open at `http://localhost:3000`.

### Features Implemented (Phase 1)
- **Database**: Users table with Role-Based Access Control (RBAC).
- **Backend**:
  - JWT Authentication (Login/Register).
  - Password Encryption (BCrypt).
  - Role Management (Patient, Doctor, Pharmacist, Admin).
- **Frontend**:
  - Login Page.
  - Registration Page.
  - Profile Page (Protected).
