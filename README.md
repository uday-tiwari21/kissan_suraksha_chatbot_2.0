# 🌾 KisaanSuraksha
### AI-Powered Crop Damage Assessment & Farmer Compensation System

KisaanSuraksha is a full-stack platform designed to simplify crop-damage assessment and farmer compensation workflows. It combines a web application, an AI-powered crop-damage detection system, and a WhatsApp-based agricultural assistant to make digital farming support more accessible.

The platform enables farmers to register, submit crop-related information, track claim status, and access reports. Administrators can analyze field or drone images using a U-Net deep-learning model to estimate crop damage and generate visual reports.

🚀 **Our Mission:** To support farmers through AI-driven crop assessment, digital compensation workflows, and accessible agricultural guidance.

---

## 📌 Table of Contents

- [🌱 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Repository Structure](#-repository-structure)
- [🤖 Machine Learning Model](#-machine-learning-model)
- [⚙️ Installation and Setup](#️-installation-and-setup)
- [🔐 Environment Configuration](#-environment-configuration)
- [▶️ Running the Application](#️-running-the-application)
- [🔌 API Reference](#-api-reference)
- [🔒 Security and Privacy](#-security-and-privacy)
- [🚀 Future Improvements](#-future-improvements)
- [📜 License](#-license)

---

## 🌱 Project Overview

Crop damage caused by pests, diseases, flooding, and adverse weather conditions can create significant challenges for farmers. Assessing the extent of damage and managing compensation claims can also involve time-consuming administrative processes.

**KisaanSuraksha** addresses these challenges by integrating digital farmer registration, image-based crop-damage estimation, report generation, and conversational agricultural assistance into a unified platform.

### 🔄 How It Works

1. 👨‍🌾 **Farmer Registration:** Farmers register through the web portal or WhatsApp.
2. 📸 **Image Submission:** Administrators upload field or drone images for crop-damage assessment.
3. 🤖 **AI-Based Analysis:** A trained U-Net model processes the image and predicts damaged crop regions.
4. 📊 **Damage Estimation:** The system calculates the percentage of pixels classified as damaged.
5. 📄 **Report Generation:** The backend generates a PDF report containing the available farmer information and image-analysis results.
6. 📱 **Farmer Assistance:** Farmers can check claim information and receive agricultural guidance through the available interfaces.

---

## ✨ Key Features

### 👨‍🌾 1. Farmer Web Portal

- Secure farmer registration and login.
- Authentication using Aadhaar number and date of birth.
- JWT-protected farmer dashboard.
- Farmer profile, land registration, and location information.
- Crop-image upload functionality.
- Compensation claim status tracking.
- Access to generated PDF reports.

### 🛡️ 2. Administrator Dashboard

- Administrator login.
- View registered farmers and aggregate statistics.
- Review pending and processed reports.
- Upload field and drone images for analysis.
- Run the crop-damage detection model.
- Generate damage masks and overlay visualizations.
- Associate generated reports with farmer records.

### 💬 3. WhatsApp Agricultural Assistant

Meet **KisaanSuraksha Mitra**, a conversational assistant designed to make agricultural support more accessible.

- 📝 Guided farmer registration through WhatsApp.
- 🌐 Language preferences for English, Hindi, and Telugu.
- 🤖 AI-powered agricultural assistance using Google Gemini.
- 🎙️ Voice-note transcription using Sarvam AI.
- 🌦️ Weather-related information through Visual Crossing.
- 📍 Location lookup using OpenStreetMap Nominatim.
- 🔄 Conversation reset commands such as `quit`, `exit`, and `restart`.

### 🧠 4. AI-Powered Crop-Damage Detection

- U-Net-based binary semantic segmentation.
- Pixel-level identification of potential crop-damage regions.
- Automated damage-percentage estimation.
- Binary mask generation.
- Red-overlay visualization of predicted damaged regions.
- Integration of machine-learning outputs with the backend API.
- PDF report generation using the analysis results.

---

## 🏗️ System Architecture

The application consists of three primary components: the React frontend, the Express backend, and the WhatsApp bot.

```text
                    👨‍🌾 FARMER / ADMIN
                           |
                           v
                  React + Vite Frontend
                       Port 5173
                           |
                      HTTP / JSON
                           |
                           v
                    Express REST API
                       Port 5000
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       MongoDB         Python ML         PDF Report
       Database        Pipeline          Generation
                           |             ReportLab
                           v
                    TensorFlow / Keras
                       U-Net Model
                           |
                           v
                  OpenCV Image Processing
                           |
                           v
                 Damage Mask + Red Overlay


                 📱 WHATSAPP FARMER
                           |
                           v
                    Twilio Webhook
                           |
                           v
                    Express Bot
                       Port 5002
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
     Google Gemini     Sarvam AI       Visual Crossing
     AI Assistance     Voice-to-Text   Weather Context
                           |
                           v
                   OpenStreetMap
                    Geocoding
```

### 🧩 Architecture Components

| Component | Responsibility |
|---|---|
| React + Vite | User interface and navigation |
| Express REST API | Authentication, business logic, and request handling |
| MongoDB Atlas | Farmer records and report metadata |
| Python + TensorFlow | Crop-damage model inference |
| OpenCV | Image preprocessing, masks, and overlays |
| ReportLab | PDF report generation |
| Twilio | WhatsApp messaging and webhooks |
| Google Gemini | Conversational agricultural assistance |
| Sarvam AI | Voice-note transcription |
| Visual Crossing | Weather-related information |
| OpenStreetMap Nominatim | Location geocoding |

---

## 🛠️ Technology Stack

### 💻 Frontend

- React 19
- Vite
- JavaScript and JSX
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- GSAP
- Lucide React and React Icons
- styled-components

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- Multer
- dotenv
- Node.js child processes

### 🤖 Machine Learning and Image Processing

- Python
- TensorFlow
- Keras
- U-Net
- NumPy
- OpenCV

### 📄 Report Generation

- ReportLab
- PDF generation using farmer information and image-analysis results

### 📱 External Integrations

- Twilio WhatsApp API
- Google Gemini API
- Sarvam AI Speech-to-Text
- Visual Crossing Weather API
- OpenStreetMap Nominatim
- ngrok for local webhook testing

---

## 📂 Repository Structure

```text
new_chatbo/
│
├── README.md
│
└── chatbot_new/
    └── hackpro/
        │
        ├── crop_damage_unet_model.keras
        │
        └── hacpro/
            │
            ├── backend/
            │   ├── config/
            │   │   └── db.js
            │   │
            │   ├── middleware/
            │   │   └── authMiddleware.js
            │   │
            │   ├── models/
            │   │   └── Farmer.js
            │   │
            │   ├── routes/
            │   │
            │   ├── ml_model.py
            │   ├── generate_pdf.py
            │   └── server.js
            │
            ├── farmer_compensation_website/
            │   └── React + Vite frontend
            │
            └── whatsapp-bot/
                └── WhatsApp bot service
```

*Note: The structure above highlights the main components; individual frontend and route files are omitted for readability.*

---

## 🤖 Machine Learning Model

### 🧠 Model Overview

KisaanSuraksha uses a trained **U-Net convolutional neural network** to perform binary semantic segmentation of crop-damage regions in field imagery.

Unlike image classification, which assigns a label to an entire image, semantic segmentation predicts a class for individual pixels. This allows the system to generate a visual representation of the regions identified as potentially damaged.

### ⚙️ Model Specifications

| Parameter | Configuration |
|---|---|
| Architecture | U-Net |
| Framework | TensorFlow / Keras |
| Input image size | 128 × 128 pixels |
| Input channels | 3 (RGB) |
| Output channels | 1 |
| Output activation | Sigmoid |
| Optimizer recorded in checkpoint | Adam |
| Learning rate recorded in checkpoint | 0.001 |
| Loss function recorded in checkpoint | Binary cross-entropy |
| Trainable parameters | 482,033 |

### 🔍 Model Workflow

1. 📥 Load the uploaded field image.
2. 🖼️ Convert the image from BGR to RGB.
3. 📐 Resize the image to 128 × 128 pixels.
4. 🔢 Normalize pixel values to the range `[0, 1]`.
5. 🧠 Pass the image through the trained U-Net model.
6. 🎯 Apply a probability threshold of `0.1` to generate a binary mask.
7. 📊 Calculate the percentage of pixels classified as damaged.
8. 🖌️ Resize the mask to the original image dimensions.
9. 🔴 Generate a red overlay highlighting predicted damage.
10. 📄 Return the results for API responses and PDF report generation.

### 📐 Damage Percentage Calculation

The damage percentage is calculated from the predicted binary segmentation mask:

```text
Damage Percentage =
(Number of Pixels Classified as Damaged
 / Total Number of Pixels in the Predicted Mask)
 × 100
```

The inference pipeline also applies a 1% area threshold, treating smaller predicted regions as zero damage.


---

## ⚙️ Installation and Setup

### 📋 Prerequisites

Make sure the following are installed or available:

- Node.js 18 or newer
- npm
- Python 3.8 or newer
- MongoDB Atlas or a local MongoDB instance
- Git
- The trained model file `crop_damage_unet_model.keras`

For WhatsApp functionality, you will also need the appropriate Twilio and third-party API credentials.

### 1️⃣ Clone the Repository


```bash
git clone https://github.com/uday-tiwari21/kissan_suraksha_chatbot_2.0
cd new_chatbo
```

### 2️⃣ Install Backend Dependencies

```bash
cd chatbot_new/hackpro/hacpro/backend
npm install
```

Install the Python dependencies:

```bash
pip install tensorflow opencv-python numpy pymongo reportlab
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../farmer_compensation_website
npm install
```

### 4️⃣ Install WhatsApp Bot Dependencies

This step is optional if you only want to run the web application.

```bash
cd ../whatsapp-bot
npm install
```

### 5️⃣ Verify the Model File

Ensure the trained model is available at:

```text
chatbot_new/hackpro/crop_damage_unet_model.keras
```

The backend inference script must be able to locate this file.

---

## 🔐 Environment Configuration

Create separate `.env` files for the backend, frontend, and WhatsApp bot.

**Never commit real credentials, API keys, or database passwords to GitHub.**

### 🔹 Backend Environment

File: `backend/.env`

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<long-random-string>
PORT=5000
```

### 🔹 Frontend Environment

File: `farmer_compensation_website/.env`

```env
VITE_API_URL=http://localhost:5000
```

⚠️ Only public configuration should be exposed through variables prefixed with `VITE_`. Never place database credentials or private API keys in frontend variables.

### 🔹 WhatsApp Bot Environment

File: `whatsapp-bot/.env`

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

SARVAM_API_KEY=
VISUAL_CROSSING_KEY=

PORT=5002
```

### 🌐 WhatsApp Webhook Configuration

Configure the Twilio WhatsApp webhook to use your publicly accessible bot endpoint:

```text
https://<public-host>/whatsapp
```

For local development, use ngrok to expose port `5002` and configure the generated public URL in Twilio.

---

## ▶️ Running the Application

Run the services in separate terminals.

### 🖥️ Terminal 1: Backend API

```bash
cd chatbot_new/hackpro/hacpro/backend
npm start
```

For development, if the script is available:

```bash
npm run dev
```

Backend URL:

`http://localhost:5000`

### 🌐 Terminal 2: Frontend

```bash
cd chatbot_new/hackpro/hacpro/farmer_compensation_website
npm run dev
```

Frontend URL:

`http://localhost:5173`

To create a production build:

```bash
npm run build
npm run preview
```

### 📱 Terminal 3: WhatsApp Bot (Optional)

```bash
cd chatbot_new/hackpro/hacpro/whatsapp-bot
npm start
```

To start the development tunnel, if configured:

```bash
npm run tunnel
```

The WhatsApp bot uses port `5002` by default. Ensure all required credentials and webhook settings are configured before testing.

### 🧪 Testing the ML Pipeline Independently

```bash
cd chatbot_new/hackpro/hacpro/backend
python ml_model.py path/to/field_image.jpg
```

Replace `path/to/field_image.jpg` with the path to a valid local image.

---

## 🔌 API Reference

**Base URL:** `http://localhost:5000`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a farmer |
| POST | `/auth/login` | Authenticate a farmer and obtain a JWT |
| POST | `/api/admin/login` | Administrator login |
| GET | `/dashboard/:aadhar` | Retrieve farmer dashboard information |
| POST | `/dashboard/upload` | Upload farmer images |
| POST | `/api/admin/run-ml` | Run crop-damage inference on an uploaded image |
| GET | `/api/admin/stats` | Retrieve administrator dashboard statistics |
| POST | `/api/admin/mark-pdf-generated` | Update report-generation status |
| POST | `http://localhost:5002/whatsapp` | Receive WhatsApp webhook requests |

### 📥 Important Request Details

**Farmer Registration — `POST /auth/register`**

Example fields:

```json
{
  "aadhar": "<farmer-aadhaar>",
  "dob": "YYYY-MM-DD",
  "name": "Farmer Name",
  "landReg": "LAND-001",
  "city": "Example City",
  "state": "Example State",
  "reason": "Crop damage"
}
```

**Crop-Damage Analysis — `POST /api/admin/run-ml`**

- Content type: `multipart/form-data`
- Image field: `image`

The documented response includes:

- `damage_percent`
- `mask_image`
- `overlay_image`

**Administrator Statistics — `GET /api/admin/stats`**

The documented response includes fields such as:

- `totalFarmers`
- `reportsProcessed`
- `pendingReviews`


---

## 🔒 Security and Privacy

Since KisaanSuraksha handles farmer information and claim-related records, responsible data handling is essential.

- 🔑 Keep API keys, database credentials, and JWT secrets private.
- 🚫 Do not commit `.env` files to version control.
- 🛡️ Apply appropriate authentication and authorization to administrative actions.
- 📁 Validate uploaded files and restrict upload sizes.
- 🔐 Use HTTPS in deployed environments.
- 👤 Restrict access to farmer records and generated reports.
- 🧪 Use synthetic or anonymized data in public demonstrations.
- 📜 Follow applicable privacy and data-retention requirements.

These are recommended safeguards; verify their implementation in the code before assuming they are all enforced.

---

## 🚀 Future Improvements

Potential enhancements include:

- 📊 Evaluate the model using IoU, Dice score, precision, and recall.
- 🌱 Expand testing across different crops, field conditions, and image qualities.
- 👨‍🔬 Add human verification before using estimates in compensation decisions.
- 🔔 Introduce notifications for claim-status changes.
- 🧾 Improve report templates and reporting workflows.
- 🛡️ Strengthen role-based access control and audit logging.
- 🧪 Add automated tests for authentication, APIs, uploads, and model inference.
- ☁️ Deploy the frontend, backend, and bot to suitable hosting platforms.
- 📈 Add monitoring and error handling for external services.

---
## video explaination and working 
https://drive.google.com/file/d/1sa0M2FLT4SgCCI6apJ0mRVjBOYcVJlZ3/view?usp=drive_link](https://drive.google.com/file/d/1sa0M2FLT4SgCCI6apJ0mRVjBOYcVJlZ3/view?usp=drive_link
---

## 🙌 Acknowledgements

This project builds on technologies and services including React, Node.js, Express.js, MongoDB, TensorFlow/Keras, OpenCV, ReportLab, Twilio, Google Gemini, Sarvam AI, Visual Crossing, and OpenStreetMap Nominatim.

---

### 🌾 KisaanSuraksha

**Empowering farmers through AI-driven crop assessment, digital compensation workflows, and accessible agricultural assistance.**
