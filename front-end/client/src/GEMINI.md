# Amperio (SoftEng 25-19) - Project Context

## Project Overview

Amperio is a full-stack web application designed for finding and managing electric vehicle (EV) charging stations. It allows users to locate stations on an interactive map, view detailed information, reserve charging points, and track their charging history.

### Tech Stack
*   **Frontend:** React (Vite), React Router, Leaflet (Map), CSS Modules.
*   **Backend:** Node.js, Express.js.
*   **Database:** MySQL.
*   **External APIs:** ENTSO-E (Electricity pricing).

## Architecture & Codebase Structure

### Frontend (`front-end/client/src`)

The frontend is a React Single Page Application (SPA) structured as follows:

*   **Entry Point:** `main.jsx` mounts `App.jsx`.
*   **Routing (`App.jsx`):**
    *   Uses `react-router-dom`.
    *   **Public Routes:** `/map` (Home), `/login`, `/signup`.
    *   **Private Routes:** `/profile` (Protected by `PrivateRoutes` wrapper).
    *   **Auth:** `AuthContext.jsx` manages global user state and JWT tokens.
*   **API Layer (`axiosConfig.jsx`):**
    *   Base URL: `http://localhost:9876/api`
    *   **Interceptors:** Automatically attaches the JWT token from `localStorage` to the `Authorization` header (`Bearer <token>`) for authenticated requests.
*   **Map Integration (`pages/Map.jsx` & `components/map/`):**
    *   **Library:** `react-leaflet` with OpenStreetMap tiles.
    *   **Center:** Athens, Greece (`[37.9838, 23.7275]`).
    *   **Components:**
        *   `MapView`: Renders the map and station markers using custom icons based on station status.
        *   `FloatingSearch`: UI for filtering stations (power, connector type, facilities, etc.).
        *   `StationDetails`: A slide-in panel displaying detailed station info.
    *   **Data Flow:** `Map.jsx` fetches station data (`/api/station` or `/api/station/search`) and passes it to `MapView`.

### Backend (`back-end/server`)

*Based on project context:*
*   **Framework:** Express.js REST API.
*   **Database:** MySQL with `mysql2` driver.
*   **Auth:** `bcrypt` for hashing, `jsonwebtoken` (JWT) for sessions.
*   **Key Endpoints:**
    *   `/api/users`: Auth & Profile management.
    *   `/api/station`: Station search and details.
    *   `/api/sessions`: Charging session records.

## Key Features & workflows

1.  **User Authentication:**
    *   Users sign up/login via standard forms.
    *   On success, a JWT is stored in `localStorage`.
    *   `AuthContext` verifies the token on app load via `/users/userdata`.

2.  **Station Search & Filtering:**
    *   Users can filter by query string (`q`), power, connector type, availability, and facilities.
    *   The frontend serializes these into a query string (e.g., `?q=Tesla&power=50&facilities=wifi,food`) for the backend.

3.  **Interactive Map:**
    *   Markers are color-coded/styled based on status (Available, Occupied, etc.).
    *   Clicking a marker opens the `StationDetails` overlay with specific charger info.

## Development Setup

### Prerequisites
*   Node.js & npm
*   MySQL Server

### Running the Frontend
Navigate to `front-end/client`:
```bash
npm install
npm run dev
```
*App runs at `http://localhost:5173` (default).*

### Running the Backend
Navigate to `back-end/server`:
1.  Create `.env` with DB and JWT config.
2.  Install dependencies and start:
```bash
npm install
npm start
```
*Server runs at `http://localhost:9876`.*

## coding Conventions (Frontend)

*   **Imports:** Grouped by type (Libraries -> Context -> Components -> Pages).
*   **Styling:** Mixed approach using global `App.css`/`index.css` and component-specific CSS (e.g., `Profile.css`, `StationDetails.css`).
*   **State Management:**
    *   **Global:** `AuthContext` for user sessions.
    *   **Local:** `useState` for UI state (modals, form inputs, map filters).
*   **API:** Prefer using the configured `api` instance from `axiosConfig.jsx` over raw `fetch` for authenticated calls, though some raw `fetch` calls exist in `Map.jsx`.
