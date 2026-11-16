# 📋 Full-Stack Kanban Board Web Application

A high-performance, modern full-stack Kanban Board web application built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js**, **Express**, and **MongoDB Atlas**.

Designed with clean architecture, responsive glassmorphism UI, touch-friendly drag-and-drop powered by **`@dnd-kit`**, snapshot-based **Undo / Redo** state management, and stateless **JWT multi-tenant authentication**.

---

## 🚀 Key Highlights & Features

- **⚡ Modern Drag-and-Drop (`@dnd-kit`)**:
  - Smooth 60 FPS card dragging across 4 workflow stages (`Backlog`, `To-Do`, `In Progress`, `Complete`).
  - **Drag-to-Delete Burn Barrel**: Interactive drop zone to delete cards optimistically.
  - Fine-tuned sensor constraints (Pointer + Touch delay) to prevent accidental drags on mobile screens.
- **⏪ Action-History Undo / Redo**:
  - Snapshot-based state engine with floating UI controls and global keyboard shortcuts (`Ctrl+Z` / `Ctrl+Y`).
  - Asynchronous background synchronization to persist restored states to MongoDB.
- **✏️ Inline Task Editing**:
  - Double-click on desktop or tap on mobile to edit card titles directly with auto-save on blur or enter.
  - Event isolation so text selection inside inputs never triggers card drag listeners.
- **🔐 Secure Authentication & Multi-Tenancy**:
  - Stateless JWT-based authentication with bcrypt password hashing (10 salt rounds).
  - Strict user data isolation (`userId: req.user._id`) preventing horizontal privilege escalation.
  - Password recovery system utilizing secure crypto tokens and Nodemailer email integration.
- **🎨 Glassmorphism & Theme Syncing**:
  - Crafted with Tailwind CSS v4, custom glass effect blurs (`backdrop-blur-xl`), and dark/light mode toggle.
  - Dynamic `MutationObserver` syncing background hero video loops and theme assets.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend (React 19 + Vite + Tailwind CSS)"]
        UI[Glassmorphism UI & Navbar]
        DND["@dnd-kit Drag & Drop Engine"]
        UndoRedo[Snapshot Undo / Redo Stack]
        AuthCtx[JWT Auth & Route Guards]
    end

    subgraph Server ["Backend (Node.js + Express REST API)"]
        AuthMW[ensureAuthenticated Middleware]
        AuthCtrl[Auth Controller (Signup / Login / Reset)]
        CardCtrl[Card Controller (CRUD & Reorder)]
    end

    subgraph Database ["Database & Cloud Services"]
        MongoDB[(MongoDB Atlas)]
        SMTP[Nodemailer / SMTP Service]
    end

    UI --> DND
    DND --> UndoRedo
    UndoRedo -->|Optimistic Updates & Sync| CardCtrl
    AuthCtx -->|Bearer JWT Header| AuthMW
    AuthMW --> CardCtrl
    AuthMW --> AuthCtrl
    CardCtrl -->|Mongoose Queries| MongoDB
    AuthCtrl -->|User Documents| MongoDB
    AuthCtrl -->|Reset Link Emails| SMTP
```

---

## 🛠️ Tech Stack & Architecture Rationale

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend** | **React 19** + **Vite 6** | Ultra-fast build times, low bundle size, and optimized rendering pipelines. |
| **Drag & Drop** | **`@dnd-kit`** | Accessible, modular library with precise touch/pointer sensors, custom collision detection, and zero reliance on deprecated APIs. |
| **Styling** | **Tailwind CSS v4** | Modern utility-first styling with hardware-accelerated backdrop blur and custom theme classes. |
| **State & UX** | **Framer Motion**, **React-Toastify**, **Lenis** | Smooth layout animations, toast notifications for immediate user feedback, and smooth momentum scrolling. |
| **Backend** | **Node.js** + **Express 4.21** | Lightweight, non-blocking asynchronous REST API with modular controllers and middlewares. |
| **Database** | **MongoDB Atlas** + **Mongoose 8** | Flexible document-oriented JSON model matching Kanban cards and user schemas with built-in validations. |
| **Auth & Security**| **JWT**, **Bcrypt**, **Crypto** | Stateless token auth (`Authorization: <jwt>`), salted password hashing, and single-use time-limited password reset tokens. |

---

## 📂 Project Structure

```text
kanban-board/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Signup, login, forgot/reset password
│   │   └── cardController.js       # Task CRUD, column transitions & reordering
│   ├── middlewares/
│   │   └── authMiddleware.js       # JWT extraction & route verification
│   ├── models/
│   │   ├── Card.js                 # Task schema (title, column, userId)
│   │   └── User.js                 # User schema (credentials, reset tokens)
│   ├── routes/
│   │   ├── authRouter.js           # Auth routes
│   │   └── cardRouter.js           # Protected card routes
│   ├── server.js                   # Express application entry & DB connection
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/                 # Icons, fonts, animations, and video loops
    │   ├── components/
    │   │   ├── Navbar.jsx          # Dynamic auto-hiding navigation bar
    │   │   ├── ToggleButton.jsx    # Dark/light mode theme switch
    │   │   └── SmoothScroll.jsx    # Lenis smooth scroll provider
    │   ├── pages/
    │   │   ├── Login.jsx           # Auth portal & interactive product carousel
    │   │   ├── TaskControl.jsx     # Kanban Board & @dnd-kit drag-and-drop workspace
    │   │   ├── Dashboard.jsx       # User overview & quick navigation
    │   │   └── ResetPassword.jsx   # Token-verified password reset page
    │   ├── utils.js                # Custom toast notification helpers
    │   ├── App.jsx                 # Route definitions & PrivateRoute guards
    │   └── main.jsx
    └── package.json
```

---

## 🌐 REST API Specification

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/signup` | Registers new user account with hashed password | ❌ |
| `POST` | `/auth/login` | Authenticates credentials; returns JWT token | ❌ |
| `POST` | `/auth/forgot-password` | Generates 1-hour crypto token & sends email link | ❌ |
| `POST` | `/auth/reset-password` | Verifies reset token & updates password hash | ❌ |

### Task Management (`/cards`)
*Requires `Authorization: <JWT_TOKEN>` header.*
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/cards` | Retrieves all cards for authenticated user | None |
| `POST` | `/cards` | Creates a new task card | `{ title: string, column: string }` |
| `PUT` | `/cards/:id` | Updates card title or moves column | `{ _id: string, title: string, column: string }` |
| `DELETE`| `/cards/:id` | Deletes card from the board | `id` parameter |

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB Atlas** connection URI (or local MongoDB daemon)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5001
MONGO_CONN=mongodb+srv://<username>:<password>@cluster.mongodb.net/kanban?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```
Run the backend server:
```bash
npm start
# or node server.js
```

### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 💡 Engineering Challenges & Solutions

### 1. Resolving Drag vs Touch-to-Edit Conflicts
- **Challenge**: On mobile devices, tapping a card to edit would inadvertently trigger drag-and-drop listeners, preventing the textarea from opening.
- **Solution**: Implemented `@dnd-kit`'s `TouchSensor` with a 250ms activation delay and 5px distance tolerance. Regular clicks/taps open inline editing without initiating a drag, and drag listeners are bypassed while editing is active.

### 2. Optimistic UI Updates with Fault-Tolerant Sync
- **Challenge**: Network roundtrips when dropping tasks or burning cards in the trash barrel introduced visible latency.
- **Solution**: Local state updates immediately within the event cycle using `arrayMove` and instant array filtering. API requests execute asynchronously in the background with toast notifications confirming status.

### 3. Responsive Floating Control Alignment
- **Challenge**: Fixed action controls (Undo/Redo) anchored to the screen edge looked disconnected from the board on ultra-wide desktop monitors where the columns are centered.
- **Solution**: Engineered a responsive constraint layer (`max-w-[1312px] mx-auto flex justify-end`) with `pointer-events-none` on the full-width wrapper and `pointer-events-auto` on the button itself. This perfectly aligns the controls with the rightmost column on wide screens while passing all clicks through to the underlying board.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
