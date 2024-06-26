# MERN YouTube Clone

A feature-rich YouTube clone built using the MERN stack, JWT for authentication,  This project aims to replicate the core functionalities of YouTube, allowing users to upload, view, like, comment, and interact with videos.

## Features

- User Authentication using JWT.
- User Registration and Login.
- Uploading and viewing videos.
- Create a channel and upload content.
- Like, comment, save, and share videos.
- Create playlists and share them with others.
- Video storage using Firebase Storage.
- YouTube studio to manage channel and content.
- Responsive design for mobile and desktop.
- And much more...

## Technologies Used

- MongoDB: Database for storing user data and video metadata.
- Express.js: Server framework for handling API requests.
- React.js: Frontend library for building the user interface.
- Node.js: JavaScript runtime for the server.
- JSON Web Tokens (JWT): For user authentication.
- React Icons & MUI: For icons.

## Configuration

1. Create a `.env` file in the root directory of your project.
2. Add necessary environment variables to the `.env` file, such as database connection URLs, API keys, or other sensitive data.
3. Add your own MongoDB Atlas URI in the `datbase` file inside the `backend` folder.

```dotenv
SECRET_KEY=your-secret-key
EMAIL=email-to-use-as-nodemailer-service
PASSWORD=google-app-password
## Running the Application

### Server

1. **Install server dependencies:**

    ```bash
    cd backend
    npm install
    ```

2. **Start the server:**

    ```bash
    npm start
    ```

### Client

1. **Install client dependencies:**

    ```bash
    cd frontend
    npm install
    ```

2. **Start the client application:**

    ```bash
    npm run dev
    ```

