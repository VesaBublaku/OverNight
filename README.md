# Overnight

A full-stack hotel booking and management platform. Users browse and book hotel rooms, make payments through Stripe, view booking history, and manage their profile. Staff manage reservations and customers through a dedicated dashboard. Admins have full system control including user and staff management.

---


## Tech Stack 

| Layer | Technology                            |
|-------|---------------------------------------|
| Backend | Spring Boot 3 (Java 17)               |
| Frontend | Angular 20 + Tailwind CSS             |
| Relational DB | MySQL 8                               |
| Auth | JWT (access + refresh tokens), BCrypt |
| Payments | Stripe                                |
| API docs | springdoc OpenAPI (Swagger UI)        |

**Architecture** layered : **Controllers** (HTTP) → **Services** (business logic) → **Repositories**(data access)

**Frontend**: standalone components, route-based lazy loading

---

## Features

- Browse hotels and rooms with filters (location, price, hotel names)
- Room booking with real-time availability checks and date selection 
- Online payment via Stripe 
- User profiles with booking history and stays count 
- Role-based access: User, Staff, Admin 
- Staff dashboard to manage customers and reservations 
- Admin dashboard for full system management (users, staff , hotel chains , hotels , rooms)
- Customer management with stays tracking

### Additional Features

- Advanced Search — filter customers by name, email, city, or phone 
- Online Payment Integration — Stripe with booking confirmation 
- Admin Dashboard — complete user and staff management with CRUD operations 
- Stays Tracking — automatic count of completed stays per customer

---

## Prerequisites

Install and have running:

| Tool           | Version                   |
|----------------|---------------------------|
| Java JDK       | 17+                       |
| Node.js + npm  | 18+                       |
| MySQL          | MySQL 8 on localhost:3306 |
| Stripe account | Test keys for payment     |

---

## Quick Start

### 1. Clone and configure environment

From the **project root** (`Overnight/`):

**Linux / macOS:**
```bash
cp .env.example system/.env
```

**Windows (PowerShell):**
```powershell
copy .env.example system\.env
```

Edit `system/.env` and fill in real values:

| Variable | Description |
|----------|-------------|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Random string, **at least 32 characters** (required, no fallback) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |

> Secrets live in '/application.properties'.

---

### 2. Database setup

Create the database:

```sql
CREATE DATABASE overnight CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Start the backend once so Hibernate creates all tables, then stop it and continue to seeding

---

### 3. Run the backend

```bash
cd backend
```

**Linux / macOS:**
```bash
./mvnw spring-boot:run
```

**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

API base URL: **http://localhost:8082**

---

### 4. Seed data

After tables exist, load MySQL seed data :

```bash
mysql -u <DB_USERNAME> -p overnight < backend/seed.sql
```

#### Default test accounts

All staff and admin accounts use password **`admin123`**

All user accounts use password **`password123`**:

| Email                  | Role |
|------------------------|------|
| `admin@overnight.com`  | Admin |
| `reception1@overnight.com` | Staff |
| `john.doe@example.com`  | User |
| `jane.smith@email.com`  | User |

---

### 5. Run the frontend

```bash
cd frontend
npm install
npm start
```

App URL: **http://localhost:4300**

---

## API Documentation

With the backend running:

| Resource | URL |
|----------|-----|
| Swagger UI | http://localhost:8082/swagger-ui.html |
| OpenAPI JSON | http://localhost:8082/v3/api-docs |

**Try protected endpoints:**
1. `POST /api/users/login` with a seeded account
2. Copy `token` from the response
3. Click **Authorize** in Swagger → enter `Bearer <token>`

### Port


| Service      | Port |
|--------------|------|
| Backend API  | 8082 |
| Frontend App | 4300 |
| MySQL        | 3306 |

---

## Authentication

| Token         | Details |
|---------------|---------|
| **JWT token** | JWT (HS256), sent as `Authorization: Bearer <token>` |
| **Passwords** | BCrypt-hashed; never returned by the API |


---

## Databases

| Domain                 | Tables                                                                |
|------------------------|-----------------------------------------------------------------------|
| `Users & Staff`        | users , staff                                                         |
| `Location`             | cities                                                                |
| `Hotels`               | hotels , hotel_chains , hotel_amenities , hotel_hotel_amenities       |
| `Rooms`                | rooms, room_types, room_amenities, room_room_amenities, room_policies |
| `Reservations`         | reservations                                                          |
| `Payments`             | payments , receipts                                                   |
| `Reviews`              | reviews                                                               |
| `Services`             | services                                                              |
| `Audit`                | activity_logs                                                         |

---

## Project Structure

```
Overnight/
├── README.md
├── docs/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   ├── seed.sql
│   ├── .env                       # local secrets (gitignored)
│   └── src/main/java/com/overnight/OverNight/
│       ├── controller/            # REST endpoints
│       ├── application/           # business logic (services)
│       ├── infrastructure/        # repositories
│       ├── domain/                # entities, DTOs
│       └── config/                # security, OpenAPI
└── frontend/
    ├── package.json
    ├── angular.json
    └── src/app/
        ├── admin/                 # admin dashboard
        ├── staff/                 # staff dashboard  
        ├── booking/               # booking flow
        ├── services/              # API services
        └── shared/                # shared components
```

---



