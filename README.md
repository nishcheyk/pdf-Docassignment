# Documentation Modifier

## Project Description

Documentation Modifier is a MERN stack application that provides a seamless way to modify DOCX files using three different methods and extract tables from PDFs. The project includes a user authentication system with login and signup functionalities optimized to use a single function for handling both. The authentication is powered by JWT tokens and includes backend restrictions to prevent account creation with the same email.

For PDF processing, users can upload PDF files, which are then processed in the backend to extract tables using `pdf2table` and stored as JSON arrays in MongoDB. The extracted data is then displayed in a tabular format on the frontend.

For document editing, users can modify DOCX files using:

1. **HTML Tags Editor** - Provides a live preview while editing.
2. **Provides a user-friendly error page with a recommendation to navigate to a random routeReact Quill** - A basic text editor.
3. **TinyMCE** - An advanced text editor.

The system also supports downloading modified DOCX files.

Additionally, the frontend is designed with an intuitive and visually appealing UI, ensuring a seamless user experience with smooth interactions and responsive design.

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation & Running the Project

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd documentation-modifier
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```sh
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```
4. Start the frontend:
   ```sh
   npm start
   ```
5. Start the backend server:
   ```sh
   cd server
   npm install
   node server.js
   ```

## Features Implemented

- **User Authentication:**
  - Login, Signup, and Logout using JWT authentication
  - Optimized to use a single function for both login and signup
  - Backend restriction to prevent duplicate email registrations
- **PDF Table Extraction:**
  - Users can upload PDFs, and the system extracts tabular data
  - Data is stored in MongoDB as a JSON array and displayed in tabular form
- **DOCX Modification:**
  - HTML-based live editing
  - React Quill for basic editing
  - TinyMCE for advanced editing
  - Download functionality for edited DOCX files
- **Amazing Frontend Design:**
  - Modern, intuitive UI
  - Responsive layout for seamless user experience
  - Smooth interactions for better usability
- **Dark and Light Mode:**
  - Users can toggle between dark mode and light mode for better accessibility
- **Custom 404 Error Page:**
  - Provides a user-friendly error page 
- **Custom Scrollbar:**
  - Enhanced UI experience with a styled scrollbar
- **MUI Components:**
  - Implemented Material UI for a more polished and interactive user interface
- **Navigation Bar:**
  - Responsive navbar with seamless routing and improved accessibility
#Glims of project 
![image](https://github.com/user-attachments/assets/b74c0040-49ac-4fb3-9931-c5979b4a8c94)

## Technologies Used

- **Frontend:** React, React Quill, TinyMCE, Material UI (MUI), HTML, CSS, TailwindCSS
- **Backend:** Node.js, Express, Multer, pdf2table, Mongoose, JWT
- **Database:** MongoDB
- **Other Tools:** fs, path, dotenv
![image](https://github.com/user-attachments/assets/ef1bb5f5-1536-43d3-806b-e572ed946fa7)

## Challenges Faced and Solutions

- **Optimizing Authentication Logic:**
  - Solution: Used a single function to handle both login and signup, reducing redundancy.
- **Backend Restriction for Email Duplication:**
  - Solution: Implemented email uniqueness validation to prevent multiple accounts with the same email.
- **PDF Table Extraction Accuracy:**
  - Solution: Utilized `pdf2table` and ensured correct JSON formatting before storing in MongoDB.
- **Efficient DOCX Editing:**
  - Solution: Provided three different ways to edit DOCX files, giving users flexibility based on their needs.
- **Responsive Design Implementation:**
  - Solution: Used TailwindCSS and Material UI to ensure adaptability across devices.
    
![image](https://github.com/user-attachments/assets/6d682fab-4531-4e6c-9548-d165b1207c86)

## Assumptions Made

- PDF files contain well-structured tables that `pdf2table` can extract.
- Users prefer different levels of document editing, hence the three different editors.
- JWT-based authentication is sufficient for securing the application.
  ![image](https://github.com/user-attachments/assets/75fd2970-2fe5-4bdc-a00b-f953dd701690)


## Future Improvements

- Add support for more document formats (e.g., XLSX, PPTX)
- Enhance PDF extraction for more complex table structures
- Implement role-based authentication for document access control
- **Data Analysis Integration** to provide insights from extracted data
- **Email OTP Verification** using NodeMailer or Email.js for enhanced security
- **Further UI Enhancements** with animations and interactive components

