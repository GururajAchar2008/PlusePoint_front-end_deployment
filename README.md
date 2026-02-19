# PulsePoint Frontend

Frontend application for the PulsePoint healthcare platform.

## Frontend Name
`PulsePoint Frontend`

## Deployed Link
- Live Frontend URL: `https://YOUR-FRONTEND-DEPLOYMENT-URL`
- Frontend Repository: `https://github.com/GururajAchar2008/PlusePoint_front-end_deployment.git`

Replace the placeholder with your actual frontend deployment link.

## Features
- Responsive sidebar navigation
- Home dashboard with healthcare services
- Symptom checker
- Emergency information page
- Health record page
- Precision Medicine page (PharmaGuard)

## Main Pages
- `pages/Dashboard.jsx`
- `pages/SymptomChecker.jsx`
- `pages/HealthRecord.jsx`
- `pages/Emergency.jsx`
- `pages/PrecisionMedicine.jsx`

## Frontend Tech Stack
- React 19
- Vite
- Tailwind CSS
- Lucide React

## Folder Structure
```text
Front-end/
├── components/
│   └── Sidebar.jsx
├── pages/
├── services/
│   └── api.js
├── App.jsx
├── index.jsx
├── index.css
└── package.json
```

## Setup
### Prerequisites
- Node.js 18+
- npm

### Install
```bash
cd Front-end
npm install
```

### Run Dev Server
```bash
npm run dev
```
Runs on `http://localhost:3000`.

## Environment Variables
Use `Front-end/.env.example` as the template (or create `.env.local`):
```bash
VITE_API_BASE_URL=http://localhost:5000
```

## Build
```bash
npm run build
```
Build output: `dist/`

## Preview Production Build
```bash
npm run preview
```

## Deployment
### Vercel / Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND-DEPLOYMENT-URL`

## Precision Medicine UI Notes
In `pages/PrecisionMedicine.jsx`, users can:
- Upload VCF files (drag/drop or picker)
- Input single/multiple drug names
- Trigger analysis via backend
- View risk cards and detailed blocks
- Copy/download report JSON

## Troubleshooting
- If API calls fail, verify `VITE_API_BASE_URL`.
- If CORS error appears, ensure backend is running and accessible.
- If build fails, delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
