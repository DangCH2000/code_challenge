# Resource API

A backend application built with Node.js, Express, TypeScript, and SQLite, providing CRUD operations for resource management.

## Configuration and How to Run the Application

### 1. Environment Setup

1. **Requirements:**
   - Node.js (>=14.x)
   - npm or yarn

2. **Install Dependencies:**
   ```bash
   npm install
### 2. Initialize Database
    sqlite3 database.sqlite
    run:
    CREATE TABLE resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
### 3. Run the Application
    npm run dev

    The server will run at: http://localhost:3000

### 4. API Endpoints
    - Create a Resource:
        Method: POST /api/resources
        Body:
            {
                "name": "Resource name",
                "description": "Resource description"
            }

    - Get All Resources:
        Method: GET /api/resources

    - Get Resource by ID:
        Method: GET /api/resources/:id

    - Update a Resource:
        Method: PUT /api/resources/:id
        Body:
            {
                "name": "Updated name",
                "description": "Updated description"
            }
    - Delete a Resource:
        Method: DELETE /api/resources/:id

### 5. Testing the Application

You can use tools like Postman or cURL to test the API. For example, to create a resource:

    curl -X POST http://localhost:3000/api/resources \
    -H "Content-Type: application/json" \
    -d '{"name": "Test Resource", "description": "This is a test"}'

### Notes:
Ensure all packages are properly installed.
If you encounter SQLite-related errors, delete the database.sqlite file and rerun the application.

### Technologies Used
Node.js
Express
SQLite
TypeScript



