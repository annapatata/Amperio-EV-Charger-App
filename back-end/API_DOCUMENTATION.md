# API Documentation

This document provides comprehensive documentation for all API endpoints in the Amperio charging station management system.

## Table of Contents
- [Admin Routes](#admin-routes)
- [Admin Stats Routes](#admin-stats-routes)
- [Authentication Routes](#authentication-routes)
- [Meta Routes](#meta-routes)
- [Station Routes](#station-routes)
- [Requested Routes](#requested-routes)
- [Reservations Routes](#reservations-routes)
- [User Routes](#user-routes)
- [User Stats Routes](#user-stats-routes)

---

## Admin Routes

**File:** [`back-end/server/routes/adminRoutes.js`](../back-end/server/routes/adminRoutes.js)

Base URL: `/api/admin`

### GET /healthcheck

Checks connection status of user to database.

**Endpoint:** `GET /api/admin/healthcheck`

**Request Parameters:** no parameters required

**Response (200 Success):**
```json
{ 
  "status":"OK",
  "dbconnection": [connection string],
  "n_charge_points": [number of charge points],
  "n_charge_points_online": [number of charge points online],
  "n_charge_points_offline": [number of charge points online]
}
```

**Error Responses:**
- `400 Bad Request`: Failure to connect to database or other error occured (returns error log object)

**Description:** 
Used to check the end-to-end connection of users to the database, also provides statistics for the number of charging points available in database.

---

### POST /resetpoints

Resets database with initial charging points.

**Endpoint:** `POST /api/admin/resetpoints`

**Request Parameters:** no parameters required

**Response (200 OK):**
```json
{
  "status": "OK",
  "message": "Data reset to initial state successfully."
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error (returns error log object)

**Description:**
Deletes all data regarding charging points from database (Station, Charger, Reservation, ChargerStatusHistory, Session). Only users and PricingHistory data remain. Then, it inserts data (stations and chargers) from a json file placed in [`reset_data.json`](../back-end/database/sample_data/reset_data.json), so database is initialized with the contents of `reset_data.json`.

---

### POST /addpoints

Add charging points to database from the uploaded file.

**Endpoint:** `POST /api/admin/addpoints`

**Request Parameters:** a file containing charging points is required. Only text/csv data type is supported. File must be uploaded as `content type: multipart/form-data`. File must have a specific format to be accepted successfully. Example of the file is in [`back-end/database/sample_data/add2points.csv`](database/sample_data/add2points.csv).

**File Format Example:** 

| Column                    | Value                       | Meaning                                        |
| ------------------------- | --------------------------- | ---------------------------------------------- |
| `access`                  | `1`                         | Access level |
| `address`                 | `Souri 1-3, Athens, Greece` | Physical location                              |
| `available_station_count` | `1`                         | Chargers currently available                   |
| `coming_soon`             | `False`                     | Whether station is live or not yet                                |
| `connector_types`         | `CCS1, CHAdeMO`             | Supported connectors   |
| `icon`                    | URL                         | Marker icon                                    |
| `icon_type`               | `Y`                         | Icon category                                  |
| `id`                      | `2000000`                   | Station ID                                     |
| `in_use_station_count`    | `1`                         | Chargers currently in use                      |
| `is_fast_charger`         | `True`                      | DC fast charger                                |
| `latitude`                | `37.9733926`                | GPS latitude                                   |
| `longitude`               | `23.7334342`                | GPS longitude                                  |
| `map_card_logo_url`       | URL                         | Network logo                                   |
| `name`                    | `Alpha Charge Point`        | Station name                                   |
| `station_count`           | `2`                         | Total chargers                                 |
| `under_repair`            | `False`                     | Not under maintenance                          |
| `url`                     | API URL                     | Link to station page                           |
| `thumbnail_url`           | *(empty)*                   | Optional image                                 |
| `outlet_connector`        | `13`                        | Connector type ID                              |
| `outlet_id`               | `4000000`                   | Outlet ID                                      |
| `outlet_kilowatts`        | `150.0`                     | Max power                                      |
| `outlet_power`            | `0`                         | Current draw / state                           |
| `outlet_status`           | `AVAILABLE`                 | Availability status                            |


**Response (200 OK):**
```json
{
            "status": "OK",
            "message": "Successfully imported <X> stations."
}
```

**Error Responses:**
All errors return error log objects
- `400 Internal Server Error`: No file uploaded or file is not of the correct type
- `500 Internal Server Error`: Server error

**Description:**
Used to add charging points and their respective stations to the database from the aforementioned uploaded file.

---

## Admin Stats Routes

**File:** [`back-end/server/routes/adminStatsRoutes.js`](../back-end/server/routes/adminStatsRoutes.js)

Base URL: `/api/adminStats`

### GET /charts

Retrieve all available statistical data for charts for admin statistics.

**Endpoint:** `GET /api/adminStats/charts`

**Query Parameters:** 
- range: Optional, brings the statistics for the last <range> months. Default is 12 if not specified.
- chargerID: Optional, used if data for a specific charger id requested, else it returns global statistics only.

**Response (200 OK):**
```json
{
  "status": "OK",
  "data":
  {
    monthlyFinance,
    stationRevenue,
    energyHeatmap,   
    powerEfficiency,
    chargerList,
    healthUptime,
    failureHistory,
    userGrowth,  
    returningUsers
  }
}
```

**Error Responses:**
All errors return error log objects
- `401 Unauthorized`: Invalid token, user does not exist
- `403 Forbidden`: User not an admin
- `500 Internal Server Error`: Server error (returns error log)

**Description:**
Returns all available statistics for the administrator. Administrator must be logged in with a valid administrator account. To be used only via the front-end, as the charts are visualized via the front-end.

---

## Authentication Routes

**File:** [`back-end/server/routes/authRoutes.js`](back-end/server/routes/authRoutes.js)

Base URL: `/api/auth`

### POST /signup

Register a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered and logged in",
  "token": "JWT_TOKEN",
  "user": {
    "user_id": 123,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400 Bad Request`: User already exists
- `500 Internal Server Error`: Server error

**Description:** 
Creates a new user account with hashed password. Returns JWT token for immediate login. Token expires in 1 hour.

---

### POST /login

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "identifier": "string (username or email)",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "user_id": 123,
    "name": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `500 Internal Server Error`: Server error

**Description:**
Authenticates user using email or username with password. Returns JWT token (1 hour expiration) for subsequent authenticated requests.

---

## Meta Routes

**File:** [`back-end/server/routes/metaRoutes.js`](back-end/server/routes/metaRoutes.js)

Base URL: `/api/meta`

### GET /filters

Retrieve available filter options for station search.

**Endpoint:** `GET /api/meta/filters`

**Request Parameters:** None

**Response (200 OK):**
```json
{
  "connectors": [
    "Type 2",
    "CCS1",
    "CCS2",
    "CHAdeMO"
  ],
  "powers": [
    11,
    22,
    50,
    120,
    180
  ],
  "facilities": ["facility1", "facility2", ...],
  "score": [1, 2, 3, 4, 5]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

**Description:**
Returns all available filter options for the station search functionality. Includes supported connector types, power levels, facilities, and rating scores. Use these values to populate search filters in the client application.

---

## Station Routes

**File:** [`back-end/server/routes/stationRoutes.js`](back-end/server/routes/stationRoutes.js)

Base URL: `/api/stations`

### GET /

Retrieve all stations.

**Endpoint:** `GET /api/stations`

**Request Parameters:** None

**Response (200 OK):**
```json
[
  {
    "station_id": 1,
    "address": "123 Main St, City",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "facilities": "WiFi,Cafe,Restroom",
    "score": 4.5,
    "station_status": "available",
    "available_chargers": 3,
    "total_chargers": 5
  },
  ...
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

**Description:**
Returns all charging stations in the system with their current status, available chargers, and amenities. No authentication required.

---

### GET /:id

Retrieve detailed information about a specific station.

**Endpoint:** `GET /api/stations/{id}`

**Request Parameters:**
- `id` (path parameter): Station ID

**Response (200 OK):**
```json
{
  "station_id": 1,
  "address": "123 Main St, City",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "facilities": "WiFi,Cafe,Restroom",
  "score": 4.5,
  "chargers": [
    {
      "charger_id": 101,
      "connector_type": "Type 2",
      "power": 22,
      "charger_status": "available"
    },
    ...
  ]
}
```

**Error Responses:**
- `404 Not Found`: Station not found
- `500 Internal Server Error`: Server error

**Description:**
Returns detailed information about a specific station, including all chargers with their specifications and current status. No authentication required. Used for StationDetails.jsx

---

### GET /search

Search and filter stations by various criteria.

**Endpoint:** `GET /api/stations/search`

**Request Parameters (Query String):**
- `q` (optional): Search query for address 
- `power` (optional): Comma-separated power levels (e.g., "11,22,50")
- `connector` (optional): Comma-separated connector types (e.g., "Type 2,CCS1")
- `available` (optional): Boolean string ("true"/"false") - show only stations with available chargers
- `facilities` (optional): Comma-separated facility names to filter by
- `score` (optional): Comma-separated minimum ratings (returns stations matching any specified rating)

**Example Requests:**
```
GET /api/stations/search?q=Ilioupoli
GET /api/stations/search?power=22,50&connector=Type 2
GET /api/stations/search?available=true&facilities=WiFi,Cafe
GET /api/stations/search?q=main&score=4,5&power=50
```

**Response (200 OK):**
```json
[
  {
    "station_id": 1,
    "address": "Ilioupoli, SunCity",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "facilities": "WiFi,Cafe,Restroom",
    "score": 4.5,
    "station_status": "available",
    "available_chargers": 3,
    "total_chargers": 5
  },
  ...
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

**Description:**
Advanced search endpoint with multiple filter options. Combines charger-level filters (power, connector) with station-level filters (facilities, score). Use INNER JOIN logic when charger filters are applied to exclude incompatible stations. Returns only stations with available chargers when `available=true`. No authentication required.

---

## Reservations Routes

**File:** [`back-end/server/routes/reservationsRoutes.js`](back-end/server/routes/reservationsRoutes.js)

Base URL: `/api/reservations`

**Authentication:** All endpoints require JWT token in Authorization header

### GET /upcoming

Retrieve upcoming reservations for the authenticated user.

**Endpoint:** `GET /api/reservations/upcoming`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
[
  {
    "reservation_id": 1,
    "station_id": 5,
    "charger_id": 42,
    "user_id": 123,
    "start_time": "2026-01-30T14:00:00Z",
    "end_time": "2026-01-30T16:00:00Z",
    "status": "active",
    "connector_type": "Type 2",
    "power": 22
  },
  ...
]
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `500 Internal Server Error`: Server error

**Description:**
Returns all upcoming reservations for the authenticated user. Requires valid JWT token in Authorization header. Token must be obtained from the login or signup endpoints.


## User Routes

**File:** [`back-end/server/routes/userRoutes.js`](back-end/server/routes/userRoutes.js)

Base URL: `/api/users`

**Authentication:** All endpoints require JWT token in Authorization header

### GET /profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /api/users/profile`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "user_id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "default_charger_power": 22,
  "default_connector_type": "Type 2"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**Description:**
Returns complete user profile information including user ID, username, email, role, and user preferences (default charger power and connector type).

---

### GET /userdata

Retrieve user data excluding sensitive profile information.

**Endpoint:** `GET /api/users/userdata`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "user_id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**Description:**
Returns user data without sensitive preference information. Excludes default_charger_power and default_connector_type.

---

### PUT /profile

Update the authenticated user's profile.

**Endpoint:** `PUT /api/users/profile`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "default_charger_power": "number or null (optional)",
  "default_connector_type": "string or null (optional)"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: No changes provided or invalid data
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**Description:**
Updates user profile information. Password is hashed before storage. At least one field must be provided for update. Preferences can be set to null to clear them.

---

## User Stats Routes

**File:** [`back-end/server/routes/userStatsRoutes.js`](back-end/server/routes/userStatsRoutes.js)

Base URL: `/api/stats`

**Authentication:** All endpoints require JWT token in Authorization header

### GET /kpis

Retrieve key performance indicators for the authenticated user.

**Endpoint:** `GET /api/stats/kpis`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "total_reservations": 45,
  "total_energy_charged": 1250.5,
  "average_charging_time": 87,
  "favorite_station": "Station Downtown",
  "most_used_connector": "Type 2"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: KPIs not found
- `500 Internal Server Error`: Server error

**Description:**
Returns key performance indicators summarizing user's charging statistics including total reservations, energy charged, average charging time, favorite station, and most used connector type.

---

### GET /charts

Retrieve chart data for the authenticated user.

**Endpoint:** `GET /api/stats/charts`

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "usage_by_month": [
    {
      "month": "January",
      "reservations": 8,
      "energy_kwh": 125.5
    },
    {
      "month": "February",
      "reservations": 12,
      "energy_kwh": 189.3
    }
  ],
  "usage_by_station": [
    {
      "station_name": "Downtown",
      "count": 15,
      "percentage": 33.3
    },
    {
      "station_name": "Airport",
      "count": 10,
      "percentage": 22.2
    }
  ],
  "usage_by_connector": [
    {
      "connector_type": "Type 2",
      "count": 30,
      "percentage": 66.7
    },
    {
      "connector_type": "CCS1",
      "count": 15,
      "percentage": 33.3
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Chart data not found
- `500 Internal Server Error`: Server error

**Description:**
Returns comprehensive chart data for visualizing user's charging statistics. Includes usage breakdown by month, by station, and by connector type. Useful for dashboard analytics and visualization components.

---

## Base URL

All endpoints are prefixed with `/api` on the server.

Example: `GET https://localhost:9876/api/stations`
