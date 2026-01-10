# Amperio Frontend Client

## Project Overview

This is the frontend client for **Amperio**, a full-stack web application for finding and managing electric vehicle (EV) charging stations. It is a single-page application (SPA) built with **React** and **Vite**, focusing on speed and a modern user experience.

*   **Framework:** React + Vite
*   **Routing:** React Router
*   **Maps:** Leaflet / React Leaflet
*   **State Management:** React Context API (AuthContext)
*   **HTTP Client:** Axios (with interceptors) & Fetch

## Building and Running

### Prerequisites
*   Node.js (LTS recommended)
*   Backend server running on `http://localhost:9876` (see project root `GEMINI.md` or backend documentation)

### Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    The application will typically launch at `http://localhost:5173`.

*   **Build for Production:**
    ```bash
    npm run build
    ```

*   **Lint Code:**
    ```bash
    npm run lint
    ```

## Project Structure

*   `src/App.jsx`: Main entry point handling routing configuration.
*   `src/axiosConfig.jsx`: Configured Axios instance. Automatically attaches the JWT `token` from localStorage to the `Authorization` header of every request.
*   `src/components/`: Reusable UI components.
    *   `admin/`: Components specific to the admin dashboard.
    *   `layout/`: Common layout elements like Navbar.
    *   `map/`: Map-related components (`MapView`, `StationDetails`, etc.).
    *   `profile/`: Components for the user profile page.
*   `src/context/`: React Context providers.
    *   `AuthContext.jsx`: Manages global user authentication state (`user`, `token`) and persistence.
*   `src/pages/`: Top-level page components (`Map`, `Login`, `Profile`, etc.) corresponding to routes.
*   `src/services/`: API service modules (e.g., `stationService.js`) to encapsulate backend data fetching.
*   `src/utils/`: Utility functions (e.g., `mapIcons.js` for handling map marker assets).

## Development Conventions

*   **Authentication:**
    *   Protected routes are wrapped in `<PrivateRoute />`.
    *   Admin-only routes are wrapped in `<AdminRoute />`.
    *   The `AuthContext` handles the login/logout logic and token storage in `localStorage`.

*   **API Calls:**
    *   Use the exported `api` instance from `src/axiosConfig.jsx` for authenticated requests to ensure the token is included.
    *   Backend API is expected at `http://localhost:9876/api`.

*   **Styling:**
    *   Standard CSS files are used, typically co-located with their components or in `src/styles`.
    *   Leaflet map styles are customized in `src/components/map/`.

*   **Map Integration:**
    *   `MapView.jsx` renders the map using `react-leaflet`.
    *   Station markers are color-coded based on status using helpers in `src/utils/mapIcons.js`.
