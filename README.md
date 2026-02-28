Microservices
ServicePortResponsibilityauth-service3001Registration, login, JWT tokenspatient-service3002Patient profilesappointment-service3003Booking and managing appointmentsdoctor-service3004Doctor profiles (created by admin)medrecord-service3005Medical records after consultationsbilling-service3006Invoices and paymentslab-service3007Lab test requests and resultspharmacy-service3008Medication orders from prescriptionsprescription-service3009Prescriptions written by doctors

Tech Stack

Runtime — Node.js
Framework — Express.js
Database — MongoDB (one DB per service)
ODM — Mongoose
Authentication — JWT (shared secret across services)
Inter-service Communication — HTTP REST (Axios)
Frontend — React.js + Tailwind CSS
Containerization — Docker + Docker Compose

Getting Started
Prerequisites

Node.js v18+
MongoDB running locally
npm

Run all services locally
Each service must be started in its own terminal:
bash# Auth Service
cd auth-service && npm run dev

# Patient Service

cd patient-service && npm run dev

# Doctor Service

cd doctor-service && npm run dev

# Appointment Service

cd appointment-service && npm run dev

# Billing Service

cd billing-service && npm run dev

# Med Record Service

cd medrecord-service && npm run dev

# Lab Service

cd lab-service && npm run dev

# Pharmacy Service

cd pharmacy-service && npm run dev

# Prescription Service

cd prescription-service && npm run dev

# Frontend

cd frontend && npm run dev
Or use Docker (recommended)
bashdocker-compose up --build

Environment Variables
Each service has its own .env file. Here is the template:
env# Common to all services
PORT=300X
MONGO_URI=mongodb://localhost:27017/service-name-db
JWT_SECRET=your_shared_jwt_secret

# Only for appointment-service

BILLING_SERVICE_URL=http://127.0.0.1:3006

# Only for doctor-service

AUTH_SERVICE_URL=http://127.0.0.1:3001

⚠️ All services must share the same JWT_SECRET so they can verify each other's tokens.

API Endpoints
Auth Service — port 3001
MethodEndpointDescriptionAccessPOST/auth/registerRegister a new patientPublicPOST/auth/loginLoginPublicPOST/auth/register-doctorCreate doctor credentialsAdmin
Patient Service — port 3002
MethodEndpointDescriptionAccessPOST/api/patient/createCreate patient profilePatientGET/api/patient/profileGet own profilePatientGET/api/patient/:userIdGet patient by IDDoctor, Admin
Doctor Service — port 3004
MethodEndpointDescriptionAccessPOST/api/doctors/createCreate doctor profileAdminGET/api/doctorsGet all doctorsAllGET/api/doctors/:idGet doctor by IDAllPUT/api/doctors/update/:idUpdate doctorAdminDELETE/api/doctors/delete/:idDelete doctorAdmin
Appointment Service — port 3003
MethodEndpointDescriptionAccessPOST/api/appointments/createBook appointment (auto-generates bill)PatientGET/api/appointmentsGet all appointmentsAdminGET/api/appointments/:idGet appointment by IDAll
Billing Service — port 3006
MethodEndpointDescriptionAccessPOST/api/billing/createCreate billDoctor, Admin, InternalGET/api/billing/allGet all billsAdminGET/api/billing/patient/:idGet patient billsPatient, Doctor, AdminPUT/api/billing/pay/:idPay a billPatient, AdminPUT/api/billing/cancel/:idCancel a billAdminDELETE/api/billing/delete/:idDelete billAdmin
Med Record Service — port 3005
MethodEndpointDescriptionAccessPOST/api/medrecords/createCreate medical recordDoctor, AdminGET/api/medrecords/patient/:idGet patient recordsDoctor, Patient, AdminGET/api/medrecords/:idGet record by IDDoctor, Patient, AdminPUT/api/medrecords/update/:idUpdate recordDoctor, AdminDELETE/api/medrecords/delete/:idDelete recordAdmin
Lab Service — port 3007
MethodEndpointDescriptionAccessPOST/api/lab/createRequest lab testDoctor, AdminGET/api/lab/patient/:idGet patient lab reportsDoctor, Patient, AdminGET/api/lab/:idGet report by IDDoctor, Patient, AdminPUT/api/lab/result/:idAdd test resultsDoctor, AdminDELETE/api/lab/delete/:idDelete reportAdmin
Pharmacy Service — port 3008
MethodEndpointDescriptionAccessPOST/api/pharmacy/createCreate pharmacy orderDoctor, AdminGET/api/pharmacy/allGet all ordersAdminGET/api/pharmacy/patient/:idGet patient ordersDoctor, Patient, AdminPUT/api/pharmacy/status/:idUpdate order statusAdminDELETE/api/pharmacy/delete/:idDelete orderAdmin

Service Communication
Services communicate via HTTP REST using Axios. They authenticate each other by passing the original JWT token from the client request.
