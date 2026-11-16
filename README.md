# 📋 Full-Stack Kanban Board Web Application

A production-grade, high-performance full-stack Kanban Board web application built with **React 19**, **Vite 6**, **Tailwind CSS v4**, **Node.js**, **Express 4.21**, and **MongoDB Atlas** with **Mongoose 8**.

Engineered for speed, developer ergonomics, and fluid user experience featuring glassmorphism design, touch-optimized drag-and-drop powered by **`@dnd-kit`**, snapshot-based **Undo / Redo** state architecture with background sync, and multi-tenant **JWT authentication**.

---

## 📑 Table of Contents

1. [Key Highlights & Features](#-key-highlights--features)
2. [System Architecture & Data Flow](#-system-architecture--data-flow)
3. [Deep-Dive Frontend Architecture](#-deep-dive-frontend-architecture)
4. [Deep-Dive Backend Architecture](#-deep-dive-backend-architecture)
5. [Database Models & Schemas](#-database-models--schemas)
6. [Comprehensive REST API Reference](#-comprehensive-rest-api-reference)
7. [State Management & Undo/Redo Engine](#-state-management--undoredo-engine)
8. [Touch, Mobile & Drag Interaction Strategy](#-touch-mobile--drag-interaction-strategy)
9. [Local Setup & Environment Configuration](#-local-setup--environment-configuration)
10. [Engineering Challenges & Design Decisions](#-engineering-challenges--design-decisions)
11. [License](#-license)

---

## 🚀 Key Highlights & Features

- **⚡ Hardware-Accelerated Drag-and-Drop (`@dnd-kit`)**:
  - Smooth 60 FPS card dragging across 4 workflow columns: `Backlog`, `To-Do`, `In Progress`, and `Complete`.
  - **Drag-to-Delete Burn Barrel**: Interactive drop zone that visually lights up on card hover and deletes cards optimistically.
  - Sensor-constrained activation delays (Touch & Pointer) preventing gesture conflicts on mobile screens.
- **⏪ Snapshot-Based Undo / Redo**:
  - Immutable action-history engine capturing state transitions (create, drag, reorder, edit, delete).
  - Global hotkeys (`Ctrl+Z`, `Ctrl+Y` / `Cmd+Shift+Z`) and responsive floating buttons.
  - Asynchronous background synchronization to persist restored states to MongoDB.
- **✏️ Fluid Inline Task Editing**:
  - Double-click (desktop) or tap (mobile) to edit task titles directly in place.
  - Auto-commit on `Enter` or `blur`, with event isolation preventing accidental card dragging while selecting text.
- **🔐 Secure Multi-Tenant Authentication**:
  - Stateless JSON Web Token (JWT) authentication delivered via `Authorization: Bearer <token>` headers.
  - Passwords hashed with `bcrypt` (10 salt rounds).
  - Strict user data isolation (`userId: req.user._id`) ensuring zero horizontal privilege escalation.
  - Automated password recovery flow using cryptographically random single-use tokens and **Nodemailer** SMTP delivery.
- **🎨 Glassmorphism & Adaptive Theming**:
  - Built with Tailwind CSS v4 using custom `backdrop-blur-xl` layers and translucent color borders.
  - Instant dark/light mode toggle synchronized with video background elements via `MutationObserver`.
  - Momentum page scrolling orchestrated with **Lenis**.

---

## 🏛️ System Architecture & Data Flow

```mermaid
graph TD
    subgraph Client ["Frontend (React 19 + Vite 6 + Tailwind CSS v4)"]
        UI["Glassmorphism UI / Theme Manager"]
        DND["@dnd-kit Engine (Sensors & Collision)"]
        History["Undo / Redo Snapshot Engine"]
        AxiosClient["HTTP Client (JWT Interceptor)"]
        RouteGuard["Auth Guard (PrivateRoute)"]
    end

    subgraph API ["Backend (Node.js + Express 4.21 REST API)"]
        AuthMW["ensureAuthenticated Middleware"]
        AuthCtrl["Auth Controller (Signup / Login / Reset)"]
        CardCtrl["Card Controller (CRUD / Column Reorder)"]
    end

    subgraph Persistence ["Database & External Services"]
        MongoAtlas[("MongoDB Atlas Database")]
        Mailer["SMTP Service (Nodemailer)"]
    end

    UI --> DND
    DND --> History
    History -->|Optimistic State Update| UI
    History -->|Async State Sync| AxiosClient
    RouteGuard --> AxiosClient
    AxiosClient -->|Bearer JWT Header| AuthMW
    AuthMW --> CardCtrl
    AuthMW --> AuthCtrl
    CardCtrl -->|Mongoose Queries (Scattered by userId)| MongoAtlas
    AuthCtrl -->|User Documents & Salted Hashes| MongoAtlas
    AuthCtrl -->|Password Reset Dispatch| Mailer
```

### Complete Request-Response Lifecycle

```text
1. User Action (Drag/Edit/Delete)
   ├──> 2. Immediate Local State Mutation (Optimistic UI render)
   ├──> 3. State Snapshot Pushed to History Stack (Undo/Redo recorded)
   └──> 4. Asynchronous Axios Request Sent with Authorization: Bearer <jwt>
          ├──> 5. Express Router matches endpoint
          ├──> 6. ensureAuthenticated extracts & verifies JWT token
          ├──> 7. Attaches decoded token payload to req.user._id
          ├──> 8. Controller executes scoped query: Card.findOneAndUpdate({ _id, userId })
          └──> 9. Database confirms; Client displays success / catches & rolls back on error
```

---

## 💻 Deep-Dive Frontend Architecture

The client is built on **React 19** and structured modularly for maintainability and scalability:

```text
frontend/src/
├── assets/                 # Background videos, SVG icons, and brand graphics
├── components/
│   ├── Navbar.jsx          # Dynamic glassmorphism top navigation with active route highlights
│   ├── ToggleButton.jsx    # Smooth light/dark theme switch with icon transition
│   └── SmoothScroll.jsx    # Lenis momentum-scrolling wrapper provider
├── pages/
│   ├── Login.jsx           # Unified Login / Registration portal with feature showcase
│   ├── TaskControl.jsx     # Master Kanban board featuring @dnd-kit drag-and-drop & Undo/Redo
│   ├── Dashboard.jsx       # User overview, quick metrics, and workspace navigation
│   └── ResetPassword.jsx   # Dedicated token-verified password resetting form
├── utils.js                # React-Toastify configuration helpers (success/error popups)
├── App.jsx                 # Client router, JWT authentication validation, and PrivateRoute guards
└── main.jsx                # Application root DOM mount and global stylesheets
```

### Key Technical Implementations

1. **`TaskControl.jsx` (Kanban Core)**:
   - Houses the `<DndContext>`, `<SortableContext>`, and column definitions.
   - Manages four core columns: `backlog` (Backlog), `todo` (To-Do), `doing` (In Progress), and `complete` (Complete).
   - Manages card drag transitions, position swapping with `arrayMove`, inline title editing, and deletion via drop onto the **BurnBarrel**.
2. **`SmoothScroll.jsx`**:
   - Integrates **Lenis** to provide hardware-accelerated inertia scrolling without interfering with drag coordinates.
3. **`App.jsx` Route Protection**:
   - Implements a `<PrivateRoute>` higher-order component checking `localStorage.getItem('token')`.
   - Prevents unauthorized access to `/board` and `/dashboard` while redirecting authenticated users away from `/login`.

---

## ⚙️ Deep-Dive Backend Architecture

The backend is built with **Node.js** and **Express 4.21**, adhering to standard REST API design patterns with strict layer separation:

```text
backend/
├── controllers/
│   ├── authController.js       # User signup, login, reset-password request, token validation
│   └── cardController.js       # Scoped card CRUD, column updates, bulk reordering
├── middlewares/
│   └── authMiddleware.js       # Bearer token parsing, jwt.verify, and request decoration
├── models/
│   ├── Card.js                 # Task schema (title, column, userId, timestamps)
│   └── User.js                 # Account credentials, bcrypt hash, password recovery fields
├── routes/
│   ├── authRouter.js           # Public authentication & recovery endpoints
│   └── cardRouter.js           # Private task endpoints guarded by authMiddleware
├── server.js                   # Application bootstrap, CORS config, MongoDB connection
└── package.json
```

### Security & Data Isolation Mechanics

- **JWT Validation**: Every card route passes through `authMiddleware.js`. If the `Authorization` header is missing or the token signature is invalid/expired, it returns `403 Forbidden` or `401 Unauthorized`.
- **Query Scoping**: Every database lookup, insertion, update, and deletion strictly injects `{ userId: req.user._id }`. Users can never read, modify, or delete tasks belonging to other accounts.

---

## 🗄️ Database Models & Schemas

### User Schema (`models/User.js`)

| Field | Type | Required | Constraints / Description |
| :--- | :--- | :---: | :--- |
| `name` | `String` | Yes | Display name of the user |
| `email` | `String` | Yes | Unique index, trimmed, lowercase validation |
| `password` | `String` | Yes | Bcrypt-hashed password string (min length: 6) |
| `resetPasswordToken` | `String` | No | Cryptographically random hex token for recovery |
| `resetPasswordExpires` | `Date` | No | Token expiration timestamp (1 hour TTL) |
| `createdAt` / `updatedAt` | `Date` | Auto | Managed by Mongoose `{ timestamps: true }` |

### Card Schema (`models/Card.js`)

| Field | Type | Required | Constraints / Description |
| :--- | :--- | :---: | :--- |
| `title` | `String` | Yes | Content/title of the task card |
| `column` | `String` | Yes | Enum: `['backlog', 'todo', 'doing', 'complete']` |
| `userId` | `ObjectId` | Yes | References `User._id` (enables multi-tenancy) |
| `createdAt` / `updatedAt` | `Date` | Auto | Managed by Mongoose `{ timestamps: true }` |

---

## 🌐 Comprehensive REST API Reference

### 1. Authentication Endpoints (`/auth`)

#### `POST /auth/signup`
Creates a new user profile.
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Responses**:
  - `201 Created`: `{ "message": "Signup successful", "success": true }`
  - `400 Bad Request`: `{ "message": "User already exists", "success": false }`

#### `POST /auth/login`
Authenticates user and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Login successful",
    "success": true,
    "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "alex@example.com",
    "name": "Alex Mercer"
  }
  ```

#### `POST /auth/forgot-password`
Initiates recovery process and emails reset link.
- **Request Body**: `{ "email": "alex@example.com" }`
- **Response `200 OK`**: `{ "message": "Password reset link sent to your email.", "success": true }`

#### `POST /auth/reset-password`
Applies a new password using the verified reset token.
- **Request Body**:
  ```json
  {
    "token": "d3f4a1c89012...",
    "newPassword": "NewStrongPassword456!"
  }
  ```
- **Response `200 OK`**: `{ "message": "Password updated successfully", "success": true }`

---

### 2. Card Endpoints (`/cards`)
*Requires header: `Authorization: <JWT_TOKEN>`*

#### `GET /cards`
Returns all cards belonging to the logged-in user.
- **Response `200 OK`**:
  ```json
  [
    {
      "_id": "673998b3c829e01f",
      "title": "Refactor Drag Sensors",
      "column": "doing",
      "userId": "673995f0c829e01a",
      "createdAt": "2026-11-17T02:14:00.000Z"
    }
  ]
  ```

#### `POST /cards`
Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Implement Webhooks",
    "column": "backlog"
  }
  ```
- **Response `201 Created`**: Returns the saved Card object.

#### `PUT /cards/:id`
Updates card text or relocates card to another column.
- **Request Body**:
  ```json
  {
    "_id": "673998b3c829e01f",
    "title": "Refactor Drag Sensors (Completed)",
    "column": "complete"
  }
  ```
- **Response `200 OK`**: Returns updated Card object.

#### `DELETE /cards/:id`
Deletes a card permanently.
- **Response `200 OK`**: `{ "message": "Card deleted successfully", "success": true }`

---

## ⏪ State Management & Undo/Redo Engine

The board uses a snapshot-based history algorithm to provide instant undo/redo capabilities:

```text
        [Undo Command]                     [Redo Command]
Past <────────────────── Present ──────────────────> Future
(Array of Snapshots)     (Active Board State)       (Array of Snapshots)
```

### Snapshot Engine Workflow
1. **Trigger Action**: When a user creates, edits, moves, or deletes a card, the active `cards` array is pushed into the `past` stack.
2. **Future Stack Invalidation**: Creating a new action automatically clears the `future` stack (standard branching history rule).
3. **Undo (`Ctrl+Z`)**:
   - Pops the most recent state from `past`.
   - Pushes current `present` state into `future`.
   - Replaces `present` with the retrieved state.
   - Synchronizes changes to MongoDB in the background.
4. **Redo (`Ctrl+Y` / `Cmd+Shift+Z`)**:
   - Pops the latest state from `future`.
   - Pushes current state into `past`.
   - Replaces `present` with the popped state.
   - Synchronizes state to the backend.

---

## 📱 Touch, Mobile & Drag Interaction Strategy

A common flaw in Kanban applications is the collision between mobile scrolling, text selection, and drag listeners. Here is how this project solves it:

1. **Sensor Customization**:
   ```javascript
   const sensors = useSensors(
     useSensor(PointerSensor, {
       activationConstraint: { distance: 5 }, // 5px movement required before drag begins
     }),
     useSensor(TouchSensor, {
       activationConstraint: {
         delay: 250,       // Must press and hold for 250ms to drag on mobile
         tolerance: 5,     // Finger jitter leeway
       },
     })
   );
   ```
2. **Textarea Focus Isolation**:
   - Clicking or tapping on a card title mounts an inline editing textarea.
   - Drag event listeners are conditionally disabled on the target card during edit mode, enabling effortless text selection and cursor positioning.
3. **Collision Detection**:
   - Employs `@dnd-kit/core`'s **`closestCorners`** algorithm, guaranteeing natural card drops between narrow columns.

---

## 🛠️ Local Setup & Environment Configuration

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** database cluster (or local MongoDB on port 27017)

### 1. Backend Installation
```bash
cd backend
npm install
```

Create `.env` inside `backend/`:
```env
PORT=5001
MONGO_CONN=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kanban?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the backend:
```bash
npm start
# Server runs on http://localhost:5001
```

### 2. Frontend Installation
```bash
cd ../frontend
npm install
```

Run Vite development server:
```bash
npm run dev
# App opens on http://localhost:5173
```

---

## 💡 Engineering Challenges & Design Decisions

### 1. Burn Barrel Drop Target Precision
- **Challenge**: Cards dragged near the trash can occasionally triggered collision events with adjacent columns instead of the trash zone.
- **Solution**: Configured the Burn Barrel as a dedicated `@dnd-kit` droppable with independent coordinate bounding. When active, collision weights favor the barrel over underlying column sorters.

### 2. High-Performance Screen Alignment for Floating Controls
- **Challenge**: Placing floating Undo/Redo controls using standard absolute coordinates broke column alignment on 4K ultra-wide screens.
- **Solution**: Implemented an outer boundary container (`max-w-[1312px] mx-auto`) with `pointer-events-none` spanning the entire board width, accompanied by `pointer-events-auto` on the control elements. This keeps buttons anchored to the rightmost column without blocking clicks on cards underneath.

### 3. Fault-Tolerant Optimistic Updates
- **Challenge**: Network hiccups could cause state divergence if an API update failed after the UI reordered cards.
- **Solution**: If a background API sync fails, the application catches the error, dispatches an error alert via `react-toastify`, and automatically resets the board to the previous verified state snapshot.

---

## 📄 License
This project is open-source and released under the [ISC License](LICENSE).
