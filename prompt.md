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
(in this i give you image) for color is not visible in priotiy section  can you see issue please solve it this issue in priority section color is not shown properly please see and solve it
```

```text 
(Graph show temp data so that i updated it )
in weekly moment have temp data or based on my task releted please explain if temp data then make beased on my task
```

```text
why in this dahabord is start with tue insted of sunday please start first day with sunday and show in graph first day sunday then monday and so on
```

```text
please add express session based authentication with mongo-compass and also in this some ui bugs like in login page and sign up page margin and padding  and in task page or in other page whihc show all task in this make it like drop and done task like if task in panding and i drop in complee then task is complete and also if date is gone and still task is not done then make category for this like task is not done like that in dahabord page also have ui bugs like all also chnage padding and marging in all text and   also in dahsbord page all section in not in same frame like make navabr and dashboard section in same line so both show same way
```

```text
please make me update readme.md and also update prompt.md and also in task section if next page is not then next is not show and not previourse show if user go for next page then previous show and if next page is exits then next page option  show and make navbar to lock and make small becuse it is too big and make use evry space and make it better
```

```text
please see bugs in when i add task at that time task page is undert navabr so that create task some parts is cut and also in close section why you make it close please make distance in between
```

```text
when 3 to 4 task added in any col named pending overdue or completed then one ui bugs come like one shred line come why this bugs come please solve it 
```
