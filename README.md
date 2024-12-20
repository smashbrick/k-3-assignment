# Quiz Application

## Description

This app allows administrators to manage and create quiz questions with various features such as adding, editing, and deleting questions. The intuitive admin interface ensures seamless navigation through different sections, including managing multiple-choice questions, setting correct answers, and assigning marks. With support for user authentication, only authorized admins can access and manage the quiz content. The app also includes visual feedback through screenshots of different sections for a smooth user experience.

## Issues Faced

### Vite Build Error

Encountered an issue while building with Vite. For more details, visit the following link:

- [Vite Build Error Issue](https://github.com/vitejs/vite/issues/19018)

## Screenshots

### 1. First Login Page

![First Login Page](/frontend/public/login.png)

### 2. Admin Page

![Admin Page](/frontend/public/admin.png)

## Accessing Admin Page

To access the admin page, visit the following URL (replace `your_port` with the actual port number where your frontend is running):  
`http://localhost:your_port/admin`

Users can access the questions page normally by default, accessible through:  
`http://localhost:your_port/`

## Setup Instructions

### Frontend (React + Vite)

1. Clone the repository:  
   `git clone <repository_url>`

2. Navigate to the frontend directory:  
   `cd frontend`

3. Install dependencies:  
   `npm install` or `yarn install`

4. Start the frontend development server:  
   `npm run dev` or `yarn dev`

### Backend (Flask)

1. Navigate to the backend directory:  
   `cd backend`

2. Set up virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
