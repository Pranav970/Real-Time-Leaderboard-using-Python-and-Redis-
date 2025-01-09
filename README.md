# FastAPI Backend with React Frontend 🚀 

This project is a full-stack application with a **Python-based backend** using **FastAPI** and a **React frontend**. The backend provides **JWT-based authentication**, uses an **SQLite** database for storage, and exposes RESTful API endpoints for managing user data and scores. The frontend communicates with the backend via an API client and integrates with existing React components.

## Key Features

### Backend (Python/FastAPI): 
 
- **User Authentication**: 
  - Uses **JWT** for secure user authentication.
- **SQLite Database**:
  - Stores user data and scores in a local SQLite database.
- **RESTful API Endpoints**:
  - **User registration/login**: Handles user sign-up and authentication.
  - **Score submission**: Allows users to submit their scores.
  - **Leaderboard retrieval**: Retrieves the global leaderboard of scores.
  - **User scores retrieval**: Allows users to view their specific scores.

### Frontend (React):

- **API Client**:
  - A new API client was created to communicate with the FastAPI backend.
- **React Components**:
  - Existing components were updated to use the new API.

### Key Differences from Previous Version:

- **Database**:
  - Replaced **Supabase** with a **local SQLite database** for storage.
- **Authentication**:
  - Replaced **Supabase Auth** with **JWT-based authentication** for user login and session management.
- **Storage**:
  - Using a **local database (SQLite)** instead of cloud-based Supabase storage.
- **API**:
  - A Python-based **FastAPI** backend replaces direct database access.

### Notes for Production:

For production environments, consider the following recommendations:
- **Password Hashing**: Use proper password hashing techniques (e.g., bcrypt) to securely store passwords.
- **Database**: Consider switching to a production-grade database like **PostgreSQL**.
- **Environment Variables**: Use environment variables for sensitive data, such as database credentials and JWT secrets.
- **Error Handling**: Implement proper error handling for all API endpoints.
- **Input Validation**: Ensure all user inputs are validated properly before processing.
- **CORS Configuration**: Set up appropriate CORS configuration to allow safe cross-origin requests.

## Running the Project 🧐

### Step 1: Start Redis using Docker

Ensure that you have **Docker** installed. Start Redis by running:

```bash
docker-compose up -d
```

### Step 2: Install Python dependencies: 

```bash
pip install -r requirements.txt
```

### Step 3: Start the Python backend:

  ```bash
python -m api.main
```

### Step 4: Start the React frontend:

```bash
npm run dev
```
   
### Key Changes:

![MakeItFastRachelSmithGIF](https://github.com/user-attachments/assets/9338068e-e1c5-4197-94b7-4694524f3ee9)




- The backend uses **FastAPI** and **SQLite** for user authentication and data storage.
- JWT-based authentication is implemented.
- Redis is used for leaderboard management and real-time score updates.
- The **React** frontend communicates with the backend through a newly created API client.


