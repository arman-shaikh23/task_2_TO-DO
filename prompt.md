# Prompt History

This file collects the prompts used during the TaskFlow build and follow-up fixes so they can be reused later.

## 1. Initial Build Prompt

```text
Build a Modern Full-Stack Todo Application

Create a complete production-ready Todo Application using:

Frontend:

* React.js (Vite)
* React Router
* Axios
* Context API

Backend:

* Node.js
* Express.js

Database:

* MongoDB with Mongoose

Authentication:

* JWT Authentication
* Password Hashing using bcrypt

Styling:

* Modern CSS
* Glassmorphism Design
* Dark/Light Theme Toggle
* Fully Responsive Design

---

## Project Name

TaskFlow – Smart Todo & Productivity Manager

---

## Core Features

### Authentication

* User Registration
* User Login
* Logout
* JWT Authentication
* Protected Routes
* Remember Me Functionality
* Password Validation
* Error Handling

---

### Todo Management

* Create Todo
* Update Todo
* Delete Todo
* Mark Todo Complete
* Mark Todo Incomplete
* Search Todos
* Filter Todos
* Sort Todos
* Due Dates
* Priority Levels

Priority Options:

* High
* Medium
* Low

---

### Categories

Allow users to organize tasks by:

* Personal
* Work
* Study
* Health
* Shopping
* Other

Users can create custom categories.

---

### Dashboard

Display:

* Total Tasks
* Completed Tasks
* Pending Tasks
* High Priority Tasks
* Today's Tasks
* Upcoming Tasks

Show statistics using attractive cards.

---

### Task Details

Each task should contain:

* Title
* Description
* Category
* Due Date
* Priority
* Status
* Created Date

---

### Advanced Features

* Drag and Drop Task Reordering
* Task Completion Animation
* Toast Notifications
* Pagination
* Real-Time Search
* Skeleton Loading
* Empty State Illustrations
* Confirmation Modal Before Delete
* Auto Save
* Dark Mode Persistence

---

## UI Design Requirements

Create a premium SaaS-like interface.

### Theme

* Dark Theme Default
* Professional Gradient Background
* Glassmorphism Cards
* Soft Shadows
* Modern Typography

---

### Navigation

Top Navbar containing:

* Logo
* Dashboard
* Tasks
* Profile
* Theme Toggle
* Logout

Sticky navigation with blur effect.

---

### Dashboard Design

Create modern analytics cards:

* Total Tasks
* Completed Tasks
* Pending Tasks
* Productivity Percentage

Add hover animations.

---

### Todo Cards

Beautiful task cards with:

* Priority Color Indicators
* Completion Status Badge
* Category Badge
* Due Date
* Edit Button
* Delete Button

Add smooth hover animations.

---

### Animations

Implement:

* Smooth Page Transitions
* Fade In Animations
* Slide In Animations
* Card Hover Effects
* Button Ripple Effect
* Floating Background Shapes
* Animated Statistics Counter
* Loading Spinner
* Success Animation

---

## Backend Requirements

Create proper structure:

backend/
├── config
├── controllers
├── middleware
├── models
├── routes
├── utils
├── server.js

---

### API Endpoints

Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile

---

Todos

GET /api/todos

POST /api/todos

PUT /api/todos/:id

DELETE /api/todos/:id

PATCH /api/todos/:id/status

---

### Security

Implement:

* JWT Authentication
* bcrypt Password Hashing
* Input Validation
* Error Handling Middleware
* Environment Variables
* CORS Configuration

---

## Frontend Structure

frontend/
├── components
├── pages
├── context
├── services
├── hooks
├── assets
├── styles
├── App.jsx

---

## Profile Section

Display:

* User Name
* Email
* Total Tasks
* Completed Tasks
* Productivity Score

Allow profile update.

---

## Extra Premium Features

* Motivational Quotes
* Productivity Tracker
* Daily Progress Bar
* Weekly Progress Analytics
* Task Completion Percentage
* Confetti Animation on Task Completion
* Responsive Mobile Layout
* PWA Ready Structure

---

## Technical Requirements

Generate complete code for:

* Frontend
* Backend
* MongoDB Models
* JWT Middleware
* Controllers
* Routes
* CSS Styling

The application should look like a modern productivity platform used by software engineers and students.

Code should be:

* Clean
* Scalable
* Responsive
* Professional
* Industry Standard
* Production Ready
* Beginner Friendly

Provide:

1. Folder Structure
2. Backend Code
3. Frontend Code
4. Database Schema
5. Installation Steps
6. Environment Variables
7. Deployment Guide
8. README.md

Build the UI with premium animations and a polished user experience that stands out in a portfolio and impresses recruiters.
```

## 2. Follow-Up Prompts Used

```text
can you see issue please solve it this issue in priority section color is not shown properly please see and solve it
```

```text
in weekly moment have temp data or based on my task releted please explain if temp data then make beased on my task
```

```text
why in this dahbord is start with tue insted of sunday please start first day with sunday and show in graph first day sunday then monday and so on
```

```text
whater ver chnage i done can you add in to readme.md and also make me file for me named prompt.md whihc can shows all prompt which i can give you so please also make and add all prompt whihc i give you
```

## 3. Optional Reusable Prompts

You can reuse prompts like these later:

```text
Update the README to include all latest feature changes and bug fixes.
```

```text
Create a prompt.md file that stores all prompts used for this project in one place.
```

```text
Convert any demo dashboard data into real data from my database and explain the logic clearly.
```
