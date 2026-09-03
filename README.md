# TaskPulse - Full-Stack Task Management Application

## How to Run

TaskPulse consists of two parts:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express + MongoDB

You need to run the frontend and backend in **two separate terminals**.

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB

Check Node.js and npm:

    node --version
    npm --version

Make sure MongoDB is running before starting the application.

## 1. Backend Setup

Open a terminal and navigate to the `backend` folder:

    cd backend

Install the dependencies:

    npm install

Create a `.env` file inside the `backend` folder:

    PORT=5001
    MONGO_URI=mongodb://127.0.0.1:27017/taskpulse
    JWT_SECRET=your_jwt_secret_key_here

Start the backend:

    npm start

The backend will run at:

    http://localhost:5001

## 2. Frontend Setup

Open a **second terminal** and navigate to the `frontend` folder:

    cd frontend

Install the dependencies:

    npm install

Start the frontend:

    npm run dev

The frontend will run at:

    http://localhost:5173

Open the frontend URL in your browser.

## Quick Start

### Terminal 1 - Backend

    cd backend
    npm install
    npm start

### Terminal 2 - Frontend

    cd frontend
    npm install
    npm run dev

Then open:

    http://localhost:5173

## MongoDB

TaskPulse uses MongoDB with the following default local connection:

    mongodb://127.0.0.1:27017/taskpulse

Ensure that MongoDB is running before starting the backend server.

## Environment Variables

The backend `.env` file should contain:

    PORT=5001
    MONGO_URI=mongodb://127.0.0.1:27017/taskpulse
    JWT_SECRET=your_jwt_secret_key_here

Do not upload the `.env` file to GitHub.

Add the following to `.gitignore`:

    node_modules/
    .env

## API Testing

The backend API can be tested using Postman.

Example:

    GET http://localhost:5001/api/tasks

A successful request should return:

    200 OK

## Stopping the Application

To stop the frontend or backend server, press:

    Ctrl + C

in the corresponding terminal.
