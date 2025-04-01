# MediScanAI

<div align="center">
  <img src="frontend\src\assets\M-23-3-2025 (1).png" alt="MediScanAI Logo" width="200"/>
  <h3>MediScanAI</h3>
  

  [![React](https://img.shields.io/badge/React-v18.2.0-blue)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3.3.3-38B2AC)](https://tailwindcss.com/)
  [![Clerk](https://img.shields.io/badge/Clerk-Authentication-blueviolet)](https://clerk.dev/)
  [![Tesseract.js](https://img.shields.io/badge/Tesseract.js-OCR-orange)](https://tesseract.projectnaptha.com/)
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [FAQs](#faqs)

## 🔍 Overview

MediScanAI is a comprehensive web application designed to revolutionize how users manage their medications and reduce healthcare costs. Leveraging cutting-edge AI technology, the platform enables users to scan prescriptions, identify medications, and discover cost-effective alternatives. 

The application intuitively serves patients and healthcare providers, providing seamless access to medication information and significant savings opportunities through a data-driven approach.

**Key Goals:**
- Improve medication adherence
- Reduce out-of-pocket costs for patients
- Simplify prescription management
- Provide evidence-based alternatives
- Support healthcare providers with data-driven insights

## ✨ Features

### User Authentication & Management
- **Secure Sign-in/Sign-up**: Multi-factor authentication using Clerk
- **Account Recovery**: Secure account recovery process

### Dashboard & Analytics
- **Medication Overview**: Comprehensive view of current medications, dosages, and schedules
- **Savings Analytics**: Real-time metrics on cost savings through alternative medications
- **Usage Patterns**: Analysis of medication adherence and consumption patterns
- **Exportable Reports**: Generate and download detailed medication reports

### AI-Powered Prescription Scanner
- **Multi-Format Support**: Scan paper prescriptions or upload digital formats (JPG, PNG, PDF)
- **Real-time OCR**: Fast and accurate text extraction using Tesseract.js
- **Medication Recognition**: Intelligent identification of medications, dosages, and instructions
- **Error Correction**: Automatic correction of common OCR errors in medical terminology


### Smart Notifications
- **Customizable Reminders**: Set personalized schedules for medication intake
- **Doctor Appointment Reminders**: Integration with healthcare appointments

### Mobile Optimization
- **Responsive Design**: Seamless experience across devices (desktop, tablet, mobile)
- **Low Bandwidth Mode**: Optimized performance for slower connections
- **Native-like Experience**: Progressive Web App (PWA) implementation
- **Touch-Optimized UI**: Intuitive touch interactions for mobile users

## 🌐 Live Demo

- **[MediScanAI](https://mediscanai.vercel.app/)** (Live application)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.2.0
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Tailwind
- **HTTP Client**: Axios

### Backend
- **Authentication**: Clerk
- **OCR Processing**: Tesseract.js
- **API Layer**: REST API with Node.js/Express
- **Database**: MongoDB with Mongoose

The architecture follows a microservices pattern with clear separation of concerns. The system is designed to be horizontally scalable, with stateless services that can be deployed across multiple instances.

## 🚀 Installation

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- MongoDB (v5.0 or higher)

### Clone the Repository
```bash
git clone https://github.com/yourusername/mediscanai.git
cd mediscanai
```

### Install Dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Setup Development Environment
```bash
# Setup environment variables (see .env.example)
cp .env.example .env

# Run database migrations
npm run migrate

# Seed the database with initial data
npm run seed
```

### Start Development Servers
```bash
# Start the frontend development server
cd client
npm run dev

# In a separate terminal, start the backend server
cd server
npm run dev
```

The application should now be running at `http://localhost:3000` with the API server at `http://localhost:5000`.

## 🔐 Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

```
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Authentication (Clerk)
CLERK_API_KEY=your_clerk_api_key
CLERK_JWT_KEY=your_clerk_jwt_key

# Database
MONGODB_URI=mongodb://localhost:27017/mediscanai

```

## 📖 Usage

### User Registration
1. Navigate to the sign-up page
2. Enter your email address and create a password
3. Verify your email address through the confirmation link
4. Complete your profile with personal and health information

### Scanning a Prescription
1. From the dashboard, click "Scan Prescription"
2. Choose to use your camera or upload an image
3. Position the prescription within the scanning frame
4. Review the detected medication information
5. Save to your medication list

### Finding Alternative Medications
1. Select a medication from your dashboard
2. Click "View Alternatives"
3. Browse the list of alternatives with cost comparisons
4. Select an alternative to view detailed information
5. Save preferred alternatives for future reference


## 📱 Screenshots

<div align="center">

   
  ![image](https://github.com/user-attachments/assets/52618ab7-7d8a-45b2-8193-c507ae7d3e3b)
  <p><em>Landing Page</em></p>
  
  ![image](https://github.com/user-attachments/assets/23366fd4-f442-4a5d-a0ba-b884c914c841)
  <p><em>Main Dashboard showing medication overview</em></p>
  
  ![image](https://github.com/user-attachments/assets/b0571601-f331-44f6-8478-bbc6fe443e28)

  <p><em>Prescription scanning interface with real-time OCR</em></p>
  
 
</div>


## 🤝 Contributing

We welcome contributions to MediScanAI! Please follow these steps:

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** as described in the Installation section
3. **Make your changes** and add appropriate tests
4. **Run the test suite** to ensure nothing breaks
5. **Update documentation** to reflect any changes
6. **Submit a pull request** with a comprehensive description of changes

## ❓ FAQs

### General Questions
<details>
<summary><strong>What is MediScanAI?</strong></summary>
MediScanAI is an AI-powered medication management platform that helps users scan prescriptions, identify medications, and find cost-effective alternatives.
</details>

<details>
<summary><strong>Is MediScanAI available on mobile devices?</strong></summary>
Yes, MediScanAI is fully responsive and works on all devices. A dedicated mobile app is planned for Q2 2025.
</details>

<details>
<summary><strong>How accurate is the prescription scanning?</strong></summary>
Our OCR technology achieves over 95% accuracy for clear prescription images. The system continuously improves through machine learning.
</details>




---

<div align="center">
  <p>Made with ❤️ by the MediScanAI Team</p>
  <p>© 2025 MediScanAI. All rights reserved.</p>
</div>
