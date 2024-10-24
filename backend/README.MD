# Leadership Development AI Backend

## Project Overview

This backend system supports a Leadership Development AI application, providing endpoints for user assessment, chat functionality, and personalized development plan generation.

## Key Features

1. User Authentication and Authorization
2. Responsibility Level Classification
3. Personalized Development Plans
4. Intelligent Chat System
5. Multi-level Assessment Questions
6. File Processing for Training Data
7. Multi-Rater Assessments
8. Dashboard and Analytics
9. Subscription Management
10. Consultant Management for White-Label Services
11. Report Generation
12. Feedback Management
13. Notifications System

## Technologies Used

- Node.js and Express.js
- Supabase for database and vector store
- OpenAI's GPT models
- Langchain for document processing and RAG implementation
- Joi for input validation
- Multer for file upload handling
- JSON Web Tokens (JWT) for authentication

## Setup for Frontend Developers

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the server: `npm start`

## API Endpoints Overview

### Authentication

- `POST /api/auth/register`: User registration

  ```json
  // Request Body
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "manager",
    "department": "IT"
  }
  // Response
  {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "manager",
      "department": "IT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- `POST /api/auth/login`: User login

  ```json
  // Request Body
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  // Response
  {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "manager",
      "department": "IT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- `POST /api/auth/protected/logout`: User logout
  ```json
  // Response
  {
    "message": "Logged out successfully"
  }
  ```

### User Profile

- `GET /api/auth/protected/profile`: Get user profile

  ```json
  // Response
  {
    "message": "This is your profile",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "manager",
      "department": "IT"
    }
  }
  ```

- `PUT /api/auth/protected/profile`: Update user profile
  ```json
  // Request Body
  {
    "name": "John Updated Doe",
    "role": "senior manager",
    "department": "Finance"
  }
  // Response
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Updated Doe",
      "email": "john@example.com",
      "role": "senior manager",
      "department": "Finance"
    }
  }
  ```

### Assessment

- `GET /api/assessment/demographic`: Get demographic questions

  ```json
  // Response
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

- `POST /api/classify`: Classify user's responsibility level

  ```json
  // Request Body
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
  // Response
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

- `GET /api/assessment/about/level`: Get level-specific assessment info

  ```json
  // Response for GET /api/assessment/about/5
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

- `GET /api/assessment/questions`: Get all assessment questions

  ```json
  // Response
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

- `POST /api/assessment/questions/level`: Get level-specific questions

  ```json
  // Response for POST /api/assessment/questions/5
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

- `GET /api/assessment/progress/:userId`: Track assessment progress
  ```json
  // Response
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "completedSections": ["demographic", "self-assessment"],
    "pendingSections": ["peer-review", "development-plan"],
    "progressPercentage": 50,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
  ```

### Development Plan

- `POST /api/assistant/generate-development-plan`: Generate development plan
  ```json
  // Request Body
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
  // Response
  {
    "development plan": "..."
  }
  ```

### Chat

- `POST /api/chat`: Interact with AI chat system
  ```json
  // Request Body
  {
    "message": "What are some effective leadership strategies?"
  }
  // Response
  {
    "reply": "Some effective leadership strategies include..."
  }
  ```

### Training Data

- `POST /api/upload-training`: Upload training data (admin only)
  ```json
  // Response
  {
    "message": "Training data uploaded successfully"
  }
  ```

### Multi-Rater Assessment

- `POST /api/multi-rater`: Submit multi-rater assessment
  ```json
  // Request Body
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
  // Response
  {
    "message": "Multi-rater assessment submitted successfully",
    "assessmentId": "789e0123-a45b-67c8-d901-234567890abc"
  }
  ```

### Dashboard

- `GET /api/dashboard`: Get user dashboard data
  ```json
  // Response
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

### Assistant

- `POST /api/assistant`: Interact with AI assistant for various tasks
  ```json
  // Request Body
  {
    "task": "summarize_development_plan",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  // Response
  {
    "summary": "Your development plan focuses on improving leadership skills..."
  }
  ```

### Subscriptions

- `POST /api/subscriptions`: Create subscription

  ```json
  // Request Body
  {
    "planType": "premium",
    "endDate": "2024-12-31T23:59:59Z"
  }
  // Response
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "789e0123-a45b-67c8-d901-234567890abc",
    "plan_type": "premium",
    "start_date": "2023-12-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "status": "active"
  }
  ```

- `GET /api/subscriptions/status`: Check subscription status
  ```json
  // Response
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "plan_type": "premium",
    "status": "active",
    "end_date": "2024-12-31T23:59:59Z"
  }
  ```

### Consultants (White-Label Services)

- `POST /api/consultants/profile`: Create consultant profile

  ```json
  // Request Body
  {
    "company_name": "Leadership Consulting LLC",
    "website": "https://example.com",
    "white_label_enabled": true,
    "revenue_share_percentage": 15.0
  }
  // Response
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "company_name": "Leadership Consulting LLC",
    "website": "https://example.com",
    "white_label_enabled": true,
    "revenue_share_percentage": 15.0,
    "created_at": "2023-12-01T00:00:00Z"
  }
  ```

- `POST /api/consultants/api-key`: Generate API key
  ```json
  // Response
  {
    "apiKey": "lc_123456789abcdef0123456789abcdef0"
  }
  ```

### Reports

- `POST /api/reports/generate`: Generate assessment reports
  ```json
  // Request Body
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "reportType": "comprehensive",
    "includeComparisons": true,
    "format": "pdf"
  }
  // Response
  {
    "reportId": "report-789xyz",
    "downloadUrl": "https://api.example.com/reports/download/report-789xyz",
    "expiresAt": "2024-01-16T10:30:00Z",
    "metadata": {
      "pageCount": 15,
      "generatedAt": "2024-01-15T10:30:00Z"
    }
  }
  ```

### Feedback

- `POST /api/feedback`: Submit feedback

  ```json
  // Request Body
  {
    "targetId": "assessment-123",
    "targetType": "assessment",
    "rating": 4,
    "comment": "Very insightful assessment questions",
    "suggestions": "Could include more industry-specific scenarios"
  }
  // Response
  {
    "id": "feedback-456",
    "status": "received",
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```

- `GET /api/feedback/summary/:targetId`: Get feedback summary (admin only)
  ```json
  // Response
  {
    "targetId": "assessment-123",
    "averageRating": 4.2,
    "totalResponses": 50,
    "ratingDistribution": {
      "5": 20,
      "4": 15,
      "3": 10,
      "2": 3,
      "1": 2
    },
    "commonThemes": [
      {
        "theme": "Question Clarity",
        "frequency": 15
      }
    ]
  }
  ```

### Analytics

- `GET /api/analytics/user/:userId`: Get user analytics
  ```json
  // Response
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "assessmentMetrics": {
      "completionRate": 85,
      "averageScore": 4.2,
      "timeSpent": "2h 30m",
      "strengthAreas": ["Strategic Thinking", "Team Building"],
      "developmentAreas": ["Conflict Resolution"]
    },
    "developmentPlanMetrics": {
      "tasksCompleted": 12,
      "tasksInProgress": 5,
      "upcomingMilestones": [
        {
          "title": "Leadership Workshop",
          "dueDate": "2024-02-01"
        }
      ]
    },
    "engagementMetrics": {
      "loginFrequency": "3 times/week",
      "averageSessionDuration": "45m",
      "lastActive": "2024-01-15T09:30:00Z"
    }
  }
  ```

### Notifications

- `GET /api/notifications`: Get user notifications

  ```json
  // Response
  {
    "notifications": [
      {
        "id": "notif-123",
        "type": "assessment_reminder",
        "message": "Complete your pending self-assessment",
        "priority": "high",
        "createdAt": "2024-01-15T08:00:00Z",
        "read": false
      }
    ],
    "unreadCount": 1
  }
  ```

- `PATCH /api/notifications/:notificationId`: Update notification status
  ```json
  // Request Body
  {
    "read": true
  }
  // Response
  {
    "id": "notif-123",
    "status": "updated",
    "read": true,
    "updatedAt": "2024-01-15T10:35:00Z"
  }
  ```
