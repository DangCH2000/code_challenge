# Scoreboard API Module

## Overview
This module is responsible for managing the scoreboard for a website. It includes functionality for updating user scores, retrieving the top 10 scores, and ensuring the scoreboard updates in real-time. The module also includes security measures to prevent unauthorized score manipulation.

---

## Features
1. **Retrieve Top 10 Scores**: API endpoint to fetch the top 10 scores from the database.
2. **Update Score**: API endpoint to securely update a user's score when they complete an action.
3. **Real-Time Updates**: Use WebSocket or a similar technology to push real-time updates to the scoreboard.
4. **Security**: Implement mechanisms to validate and authenticate score update requests.

---

## API Endpoints

### 1. Get Top 10 Scores
- **Endpoint**: `/api/scoreboard/top`
- **Method**: `GET`
- **Description**: Fetch the top 10 scores for the scoreboard.
- **Response**:
    ```json
    {
        "success": true,
        "data": [
            {"userId": 1, "username": "Alice", "score": 200},
            {"userId": 2, "username": "Bob", "score": 180},
            ...
        ]
    }
    ```

### 2. Update User Score
- **Endpoint**: `/api/scoreboard/update`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
        "userId": 1,
        "scoreIncrease": 10
    }
    ```
- **Description**: Update the user's score when they complete an action.
- **Security**: Requires a valid `Authorization` token in the request header.
- **Response**:
    ```json
    {
        "success": true,
        "message": "Score updated successfully."
    }
    ```

### 3. Real-Time Score Updates
- **Protocol**: WebSocket
- **Endpoint**: `/ws/scoreboard`
- **Description**: Establishes a WebSocket connection for broadcasting real-time scoreboard updates.

---

## Database Design

- **Users Table**:
    - `userId`: Unique identifier for the user.
    - `username`: User's display name.
    - `score`: User's current score.

- **Scoreboard Cache**:
    - Cached list of the top 10 scores for quick retrieval.

---

## Execution Flow
1. User completes an action on the website.
2. The frontend sends a `POST` request to `/api/scoreboard/update` with the user's ID and score increment.
3. The backend:
    - Validates the request with the `Authorization` token.
    - Updates the user's score in the database.
    - Recalculates the top 10 scores and updates the scoreboard cache.
    - Sends a real-time update via WebSocket to all connected clients.
4. The frontend scoreboard updates automatically.

---

## Security
1. **Authentication**: Use JWT or OAuth tokens to verify the user's identity.
2. **Rate Limiting**: Prevent users from spamming the score update endpoint.
3. **Input Validation**: Ensure the `scoreIncrease` value is within an acceptable range (e.g., 1–100).
4. **Server-Side Validation**: Cross-check the score increment with server-side business logic.

---

## Future Improvements
1. Add **leaderboard filtering** (e.g., by time period, region).
2. Implement **logging and monitoring** to track suspicious score updates.
3. Introduce **notifications** for users when they enter the top 10.



## Execution Flow Diagram

Frontend
   |
   |  (User completes action)
   V
API Call (POST /api/scoreboard/update)
   |
   |--> Authorization Check
   |--> Input Validation
   |
Backend
   |
   |--> Update Database (User Score)
   |--> Update Cache (Top 10 Scores)
   |
   |--> Push WebSocket Update
   |
   V
Frontend (Scoreboard Updates)


## Additional Improvements in Documentation

You can add the following improvements:

Add Information About Data to be Stored: For example, you need to store the scoreboard in a database. This table will store userId, score, and timestamp to support retrieving the top 10 scores.
Explain Scalability: If the system needs to handle a large number of users, you might consider using technologies like Redis to store the scoreboard in-memory and pub/sub for real-time updates.
Clarify Real-Time Updates: Explain the technologies you could use to provide real-time updates for the scoreboard, such as WebSockets, Server-Sent Events (SSE), or Polling.