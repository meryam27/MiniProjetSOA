# DESCRIPTION OF THE APP :

A production-ready microservices architecture for managing hospital operations: patients, doctors, appointments, medical records, prescriptions, lab reports, pharmacy orders, and billing.

| Microservice         | Port | Responsibility                       |
| -------------------- | ---- | ------------------------------------ |
| auth-service         | 3001 | Registration, login, JWT tokens      |
| patient-service      | 3002 | Patient profiles                     |
| appointment-service  | 3003 | Booking and managing appointments    |
| doctor-service       | 3004 | Doctor profiles (created by admin)   |
| medrecord-service    | 3005 | Medical records after consultations  |
| billing-service      | 3006 | Invoices and payments                |
| lab-service          | 3007 | Lab test requests and results        |
| pharmacy-service     | 3008 | Medication orders from prescriptions |
| prescription-service | 3009 | Prescriptions written by doctors     |
