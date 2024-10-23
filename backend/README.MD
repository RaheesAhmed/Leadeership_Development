# Leadership Development AI Backend

## Project Overview

This backend system is designed to support a Leadership Development AI application. It provides various endpoints for user assessment, chat functionality, and personalized development plan generation.

## Project Structure

```backend/
├── controller/
│ ├── about_controller.js
│ ├── chat_controller.js
│ ├── classify_controller.js
│ ├── devplan_controller.js
│ ├── questions_controller.js
│ └── training_controller.js
├── lib/
│ ├── routerLib.js
│ └── supabaseClient.js
├── routes/
│ ├── about_route.js
│ ├── chat_route.js
│ ├── classify_route.js
│ ├── devplan_route.js
│ ├── questions_route.js
│ └── training_route.js
├── utils/
│ ├── classification.js
│ ├── conduct_assesment.js
│ ├── dataLoader.js
│ ├── errorHandler.js
│ ├── get_all_question.js
│ ├── rag.js
│ └── validationSchemas.js
└── README.MD
```

## Key Components

### Controllers

1. **about_controller.js**: Handles requests related to "about" information and level two questions.
2. **chat_controller.js**: Manages the chat functionality using a RAG (Retrieval-Augmented Generation) system.
3. **classify_controller.js**: Classifies users' responsibility levels based on demographic information.
4. **devplan_controller.js**: Generates personalized development plans for users.
5. **questions_controller.js**: Retrieves assessment questions for different levels.
6. **training_controller.js**: Handles the upload and processing of training files.

### Libraries

1. **routerLib.js**: Provides utility functions for creating Express routers with error handling.
2. **supabaseClient.js**: Initializes and exports the Supabase client for database operations.

### Routes

Corresponding route files for each controller, defining the API endpoints and connecting them to the appropriate controller functions.

### Utilities

1. **classification.js**: Contains logic for classifying responsibility levels.
2. **conduct_assesment.js**: Implements the core functionality for generating development plans.
3. **dataLoader.js**: Loads and processes various data files required for the application.
4. **errorHandler.js**: Defines custom error classes for API error handling.
5. **get_all_question.js**: Retrieves and processes assessment questions.
6. **rag.js**: Implements the RAG system for intelligent chat responses and document processing.
7. **validationSchemas.js**: Defines Joi schemas for input validation.

## Key Features

1. **Responsibility Level Classification**: Classifies users based on their demographic information and job details.
2. **Personalized Development Plans**: Generates tailored development plans using AI and user assessment data.
3. **Intelligent Chat System**: Utilizes a RAG system for context-aware responses in the chat functionality.
4. **Assessment Questions**: Provides multi-level assessment questions for user evaluation.
5. **File Processing**: Allows uploading and processing of training files to enhance the knowledge base.

## Technologies Used

- Node.js
- Express.js
- Supabase (for database and vector store)
- OpenAI's GPT models
- Langchain (for document processing and RAG implementation)
- Joi (for input validation)
- Multer (for file upload handling)

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY)
4. Run the server: `npm start`

## API Endpoints

The backend provides the following API endpoints:

1.  **Demographic Data API**

    - Endpoint: `GET /api/assessment/demographic`
    - Description: Retrieve demographic questions for the assessment.
    - Example Response:
      ```json
      {
        "demographicQuestions": [
          {
            "id": "name",
            "question": "Please enter what name you'd like to use in your report.",
            "type": "text",
            "placeholder": "Short Answer"
          }
          // ... more questions
        ]
      }
      ```

2.  **Classification API**

    - Endpoint: `POST /api/classify`
    - Description: Classify the user's responsibility level based on provided information.
    - Example Request Body:
      ```json
      {
        "name": "John Doe",
        "industry": "Healthcare",
        "companySize": 500,
        "department": "Finance",
        "jobTitle": "Financial Analyst",
        "directReports": 3,
        "decisionLevel": "Strategic",
        "typicalProject": "I develop IT security policies...",
        "levelsToCEO": 3,
        "managesBudget": true
      }
      ```
    - Example Response:
      ```json
      {
        "responsibilityLevel": {
          "role": "Senior Director / Vice President",
          "level": 6,
          "description": "Leads multiple departments or significant projects...",
          "versionInfo": {
            "v1.0": "Signify a higher level of leadership...",
            "v2.0": "Provides leadership at a high level..."
          }
        }
      }
      ```

3.  **Assessment About API**

    - Endpoint: `GET /api/assessment/about/level`
    - Description: Get information about the assessment process for a specific level.
    - Example: `GET /api/assessment/about/5`
    - Example Response:
      ```json
      {
        "levelTwoQuestions": [
          {
            "Lvl": 5,
            "Role Name": "Senior Manager / Associate Director",
            "Description": "Manages significant projects or key functions..."
            // ... more fields
          }
        ]
      }
      ```

4.  **Assessment Questions API**

    - Endpoint: `GET /api/assessment/questions`
    - Description: Retrieve all assessment questions.
    - Example Response:
      ```json
      {
        "assessmentQuestions": [
          {
            "capability": "Building a Team",
            "Lvl": 10,
            "Role Name": "Chief Officer (e.g., CEO, COO, CFO)",
            "question": "How effectively do you establish..."
            // ... more fields
          }
          // ... more questions
        ]
      }
      ```

5.  **Level-Specific Assessment Questions API**

    - Endpoint: `POST /api/assessment/questions/level`
    - Description: Retrieve assessment questions for a specific level.
    - Example: `POST /api/assessment/questions/5`
    - Example Response:
      ```json
      {
        "levelOneQuestions": [
          {
            "area": "Building a Team",
            "questions": [
              {
                "question": "How effectively do you identify...",
                "ratingQuestion": "How effectively do you identify...",
                "reflection": "How confident do you feel..."
              }
            ]
          }
          // ... more areas
        ]
      }
      ```

6.  **Development Plan Generation API**

    - Endpoint: `POST /api/assistant/generate-development-plan`
    - Description: Generate a personalized development plan for the user.
    - Example Request Body:
      ```json
      {
        "userInfo": {
          "name": "John Doe",
          "industry": "Healthcare"
          // ... more user info
        },
        "responsibilityLevel": {
          "role": "Senior Director / Vice President",
          "level": 6
          // ... more responsibility level info
        }
      }
      ```
    - Example Response:
      ```json
      {
        "development plan": "..."
      }
      ```

7.  **User Registration API**

        - Endpoint: `POST /api/auth/register`
        - Description: Register a new user
        - Example Request Body: `json

    {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "manager",
    "department": "IT"
    } `    - Example Response:`json
    {
    "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "department": "IT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    } `

8.  **User Login API**

        - Endpoint: `POST /api/auth/login`
        - Description: Authenticate a user and receive a JWT token
        - Example Request Body: `json

    {
    "email": "john@example.com",
    "password": "securepassword123"
    } `    - Example Response:`json
    {
    "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "department": "IT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    } `

9.  **User Profile API**

        - Endpoint: `GET /api/auth/protected/profile`
        - Description: Retrieve the user's profile information
        - Authentication: Requires a valid JWT token in the Authorization header
        - Example Request: `GET /api/auth/protected/profile

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... `    - Example Response:`json
    {
    "message": "This is your profile",
    "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "department": "IT"
    }
    } `

10. **Update User Profile API**

        - Endpoint: `PUT /api/auth/protected/profile`
        - Description: Update the user's profile information
        - Authentication: Requires a valid JWT token in the Authorization header
        - Example Request: ```
          PUT /api/auth/protected/profile
          Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          Content-Type: application/json

          {
          "name": "John Updated Doe",
          "role": "senior manager",
          "department": "Finance"
          } ```

        - Example Response: `json

    {
    "message": "Profile updated successfully",
    "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Updated Doe",
    "email": "john@example.com",
    "role": "senior manager",
    "department": "Finance"
    }
    } `

11. **User Logout API**

        - Endpoint: `POST /api/auth/protected/logout`
        - Description: Log out the user (invalidate the token on the server-side)
        - Authentication: Requires a valid JWT token in the Authorization header
        - Example Request: `POST /api/auth/protected/logout

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... `    - Example Response:`json
    {
    "message": "Logged out successfully"
    } `

12. **Admin-Only Route API** - Endpoint: `GET /api/auth/protected/admin-only` - Description: Access an admin-only route (example of role-based access control) - Authentication: Requires a valid JWT token in the Authorization header - Authorization: User must have the "admin" role - Example Request: `GET /api/auth/protected/admin-only
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     ` - Example Response (for admin users): `json
{
  "message": "This is an admin-only route"
}      ` - Example Response (for non-admin users): `json
{
  "error": "Access denied"
}      `

13. **Chat API**

    - Endpoint: `POST /api/chat`
    - Description: Send a message to the AI chat system and receive a response.
    - Authentication: Requires a valid JWT token in the Authorization header
    - Example Request Body:
      ```json
      {
        "message": "What are some effective leadership strategies?"
      }
      ```
    - Example Response:
      ```json
      {
        "reply": "Some effective leadership strategies include..."
      }
      ```

14. **Upload Training Data API**

    - Endpoint: `POST /api/upload-training`
    - Description: Upload training data to enhance the AI's knowledge base.
    - Authentication: Requires a valid JWT token in the Authorization header (admin only)
    - Request: Multipart form data with file upload
    - Example Response:
      ```json
      {
        "message": "Training data uploaded successfully"
      }
      ```

15. **Multi-Rater Assessment API**

    - Endpoint: `POST /api/multi-rater`
    - Description: Submit a multi-rater assessment for a user
    - Authentication: Requires a valid JWT token in the Authorization header
    - Example Request Body:
      ```json
      {
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "raterType": "peer",
        "assessmentData": {
          "leadership": 4,
          "communication": 5,
          "teamwork": 3
          // ... other assessment criteria
        }
      }
      ```
    - Example Response:
      ```json
      {
        "message": "Multi-rater assessment submitted successfully",
        "assessmentId": "789e0123-a45b-67c8-d901-234567890abc"
      }
      ```

16. **Dashboard Data API**

    - Endpoint: `GET /api/dashboard`
    - Description: Retrieve dashboard data for the authenticated user
    - Authentication: Requires a valid JWT token in the Authorization header
    - Example Response:
      ```json
      {
        "userInfo": {
          "name": "John Doe",
          "role": "Senior Manager",
          "department": "IT"
        },
        "assessmentSummary": {
          "selfAssessment": {
            "leadership": 4.2,
            "communication": 3.8,
            "teamwork": 4.5
            // ... other assessment criteria
          },
          "multiRaterAverage": {
            "leadership": 4.0,
            "communication": 4.1,
            "teamwork": 4.3
            // ... other assessment criteria
          }
        },
        "developmentPlanProgress": 65,
        "upcomingTasks": [
          {
            "id": "task-001",
            "title": "Complete leadership course",
            "dueDate": "2023-12-31"
          }
          // ... other tasks
        ]
      }
      ```

17. **Assistant API**
    - Endpoint: `POST /api/assistant`
    - Description: Interact with an AI assistant for various tasks
    - Authentication: Requires a valid JWT token in the Authorization header
    - Example Request Body:
      ```json
      {
        "task": "summarize_development_plan",
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      }
      ```
    - Example Response:
      ```json
      {
        "summary": "Your development plan focuses on improving leadership skills..."
      }
      ```

## Integration Notes for Frontend Developers

1. **Authentication**:

   - All protected routes require a JWT token in the Authorization header.
   - After successful login, store the token securely (e.g., in HttpOnly cookies) and include it in subsequent requests.

2. **Error Handling**:

   - Implement global error handling to catch and display error messages from the API.
   - Pay attention to HTTP status codes for different types of errors (e.g., 400 for bad requests, 401 for unauthorized, 403 for forbidden).

3. **Real-time Updates**:

   - Consider implementing WebSocket connections for real-time features like chat or live updates to the dashboard.

4. **File Uploads**:

   - Use multipart/form-data for file uploads in the training data API.
   - Implement proper file type and size validation on the frontend before sending to the API.

5. **Data Caching**:

   - Implement client-side caching for frequently accessed data (e.g., user profile, dashboard summary) to reduce API calls.

6. **Responsive Design**:

   - Ensure that your frontend application is responsive and can handle various data formats and sizes returned by the API.

7. **Cross-Origin Resource Sharing (CORS)**:

   - The backend has CORS enabled, but make sure your frontend's domain is allowed if you're hosting it separately.

8. **Rate Limiting**:

   - Be aware of rate limits on the API and implement appropriate handling (e.g., exponential backoff for retries).

9. **Versioning**:

   - The API might introduce versioning in the future. Be prepared to update your API calls when new versions are released.

10. **Testing**:
    - Implement comprehensive testing on the frontend, including unit tests for API integration and end-to-end tests for critical user flows.

## Error Handling

The application uses custom error handling middleware to catch and respond to errors consistently across all routes.

## Data Management

The application uses JSON files and Supabase for data storage and retrieval. The `dataLoader.js` utility manages the loading and preprocessing of various data sets used throughout the application.

## Security Considerations

- Input validation is implemented using Joi schemas
- Environment variables are used for sensitive information
- Error messages are sanitized to prevent information leakage

## Future Improvements

- Implement user authentication and authorization
- Add more comprehensive logging and monitoring
- Enhance the RAG system with more advanced NLP techniques
- Implement caching mechanisms for frequently accessed data
- Add unit and integration tests for improved reliability

## Authentication

To access protected routes, include the JWT token in the Authorization header of your requests:

```
Authorization:
```
