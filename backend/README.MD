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

- `/about`: Retrieve "about" information and level two questions
- `/chat`: Chat functionality using the RAG system
- `/classify`: Classify user's responsibility level
- `/devplan`: Generate personalized development plans
- `/questions`: Retrieve assessment questions
- `/training/upload`: Upload and process training files

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

