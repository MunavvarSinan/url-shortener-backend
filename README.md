# Node.js Backend with TypeScript, Express, PostgreSQL, and Docker

## 📌 Project Overview

This is a backend service built using **Node.js, TypeScript, Express.js, PostgreSQL, Drizzle ORM, and Docker Compose**. It follows a **clean architecture** pattern and includes **unit testing with Bun, Jest, and Supertest**. No integration tests have been implemented yet.

---

## 🏗️ Project Structure

```
application/
  ├── services/
  │   ├── auth.service.ts
  │   ├── url.service.ts
  ├── validations/
  │   ├── auth.validation.ts
  │   ├── url.validation.ts

domains/
  ├── entities/
  │   ├── url.entity.ts
  │   ├── user.entity.ts
  ├── repositories/
  │   ├── IUserRepository.ts
  │   ├── IUrlRepository.ts

infrastructure/
  ├── logger/ (Pino & Pino Pretty)
  ├── server/ (Server configuration)
  ├── middleware/
  │   ├── auth-handler.ts
  │   ├── error-handler.ts
  │   ├── not-found-handler.ts
  ├── database/
  │   ├── repositories/
  │   ├── schema/ (Drizzle schema)
  │   ├── index.ts (Database connection)

interfaces/
  ├── http/
  │   ├── routes/ (All routes)
  │   ├── controllers/ (All controllers)

shared/
  ├── config/
  ├── errors/

index.ts (Server entry point)
```

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**

```sh
git clone <repo-url>
cd <repo-folder>
```

### **2️⃣ Install Dependencies**

```sh
bun install # If using Bun
```

### **3️⃣ Setup Environment Variables**

Create a `.env` file in the root directory and configure your environment variables.

```env
PORT=5000
DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
```

### **4️⃣ Database Migration**

```sh
bun db:migrate
```

### **5️⃣ Run the Development Server**

```sh
bun dev
```

---

## 🐳 Running with Docker

### **Start the Containers**

```sh
bun docker:dev
```

### **Access PostgreSQL in Docker**

```sh
bun docker:psql
```

### **Generate and Run Migrations in Docker**

```sh
bun docker:db:generate
bun docker:db:migrate
```

---

## ✅ Running Tests

### **Run Unit Tests**

```sh
bun test
```

### **Run Tests with Coverage**

```sh
bun test --coverage
```

---

## 📜 Available Scripts

| Script           | Description                           |
| ---------------- | ------------------------------------- |
| `bun dev`        | Start the development server          |
| `bun build`      | Build the project with `tsup`         |
| `bun test`       | Run unit tests using Jest & Supertest |
| `bun lint`       | Lint files with ESLint                |
| `bun format`     | Format code with Prettier             |
| `bun db:push`    | Push database schema using Drizzle    |
| `bun db:migrate` | Apply database migrations             |
| `bun docker:dev` | Start the backend with Docker         |

---

## 🚀 API Endpoints

### **Auth Routes**

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| `POST` | `/api/auth/sign-up` | Register a new user |
| `POST` | `/api/auth/sign-in` | Login user          |

### **URL Shortener Routes**

| Method   | Endpoint               | Description                   |
| -------- | ---------------------- | ----------------------------- |
| `POST`   | `/api/url/`            | Shorten a URL (Authenticated) |
| `GET`    | `/api/url/`            | Get all URLs (Authenticated)  |
| `DELETE` | `/api/url/:id`         | Delete a URL (Authenticated)  |
| `GET`    | `/api/url/:short_code` | Redirect to the original URL  |

---

## 📂 Tech Stack

- **Node.js** + **TypeScript**
- **Express.js** (API framework)
- **Drizzle ORM** (Database ORM)
- **PostgreSQL** (Database)
- **Docker & Docker Compose** (Containerization)
- **Pino** (Logging)
- **Jest, Supertest, Bun Test** (Unit Testing)

---

## 📖 License

MIT License
