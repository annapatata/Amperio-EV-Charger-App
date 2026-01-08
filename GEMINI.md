# Amperio - Full-Stack EV Charging Application

## Project Overview

This repository contains the source code for Amperio, a full-stack web application for finding and managing electric vehicle (EV) charging stations.

*   **Frontend:** The frontend is a single-page application built with **React** and **Vite**. It provides an interactive map (using **Leaflet**) for users to locate charging stations, manage their profiles, and handle charging sessions. Key libraries include `react-router-dom` for navigation and `axios` for communicating with the backend. The UI features a modern, responsive design with components for searching, filtering, and viewing station details.

*   **Backend:** The backend is a **Node.js** server using the **Express.js** framework. It exposes a RESTful API to handle business logic and data persistence. It uses a **MySQL** database (`mysql2` driver) to store information about users, stations, chargers, reservations, and sessions. Authentication is handled using `bcrypt` for password hashing and JSON Web Tokens (`jsonwebtoken`). The backend also includes an endpoint to fetch real-time electricity prices from ENTSO-E.

*   **Database:** The database schema is defined in `back-end/database/Amperio_schema.sql`. It includes tables for users, charging stations, individual chargers, reservations, and charging sessions. It also includes views to provide aggregated data for the frontend, and triggers for logging charger status changes.

## Key Features

### Frontend

*   **Interactive Map:** Displays charging stations with real-time status indicators (available, charging, reserved, offline).
*   **Search and Filtering:** Users can search for stations by address and filter by power, connector type, and availability.
*   **Station Details:** A slide-in panel shows detailed information about a selected station, including its chargers.
*   **User Authentication:** Users can sign up, log in, and manage their profiles.
*   **User Profile:** A dedicated profile page with tabs for an overview of charging stats (total sessions, energy consumed), detailed charts, and settings.
*   **Protected Routes:** Separate routes for authenticated users and administrators.

### Backend

*   **RESTful API:** A comprehensive set of API endpoints for managing users, stations, chargers, sessions, and reservations.
*   **User Management:** Handles user registration, login, and profile data retrieval.
*   **Station and Charger Management:** Provides endpoints for searching, filtering, and retrieving detailed information about stations and chargers.
*   **Reservations:** Allows users to reserve a charging point.
*   **Session Tracking:** Records charging session data.
*   **External API Integration:** Connects to the ENTSO-E API to fetch electricity pricing data.
*   **Error Handling:** Custom middleware for centralized error handling and logging.
*   **Response Formatting:** Middleware to format API responses in either JSON or CSV.

## Building and Running

### Backend Server

The backend server is located in `back-end/server`.

1.  **Navigate to the backend directory:**
    ```bash
    cd back-end/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `back-end/server` directory and add the following variables:
    ```
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=amperio
    JWT_SECRET=your_jwt_secret
    ENTSOE_TOKEN=your_entsoe_token
    ```

4.  **Run the development server:**
    The server uses `nodemon` to automatically restart on file changes.
    ```bash
    npm start
    ```
    The API server will be running on `http://localhost:9876` by default.

### Frontend Client

The frontend client is located in `front-end/client`.

1.  **Navigate to the frontend directory:**
    ```bash
    cd front-end/client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173` (or another port specified by Vite).

## Development Conventions

*   **API Routes:** Backend API routes are prefixed with `/api`. For example, user-related endpoints are under `/api/users`.
*   **State Management:** The frontend uses React Context (`AuthContext.jsx`) for managing user authentication state globally. Component-level state is used for local UI management.
*   **Styling:** The project uses a mix of global CSS (`index.css`, `App.css`) and component-specific or feature-specific CSS files (e.g., `navbar.css`, `Profile.css`).
*   **API Client:** A custom `axios` instance is configured in `axiosConfig.jsx` to automatically attach the JWT token to the headers of all outgoing requests.
*   **Database Migrations:** The database schema is managed through SQL script files in `back-end/database`. There is no automated migration tool configured.
*   **Linting:** The frontend uses ESLint for code linting. Run `npm run lint` in `front-end/client` to check for issues.
