# Maintenance App API Integration Guide

This guide outlines the standard workflow for onboarding a business and reporting faults. All requests should be sent with `Content-Type: application/json` unless specified otherwise.

## Authentication Overview

* **BASE URL:** https://da-maintenance-core.onrender.com/api/v1
* **OTP Based:** No passwords required.
* **JWT Tokens:** Once verified, include the token in the header of all protected routes:
`Authorization: Bearer <your_jwt_token>`


---

## The Onboarding & Reporting Workflow

### 1. Create a Business (Setup Phase)

Before users can exist, a business entity must be created.

* **Route:** `POST /api/businesses`
* **Auth:** Required (`super_admin` only)
* **Body:**
```json
{
  "name": "Ghana Gas",
  "address": "Independence Avenue, Accra",
  "contact_person": "Kofi Mensah-Bonsu",
  "phone": "233557878909",
  "email": "kmensah@ghanagas.com"
}

```



### 2. Register Personnel

Add employees to the business. These phone numbers will be used for login.

* **Route:** `POST /api/users`
* **Auth:** Required (`super_admin` or `business_admin`)
* **Body:**
```json
{ 
  "full_name": "John Doe", 
  "phone_number": "+233500000000", 
  "role": "reporter", 
  "business_id": "BUSINESS_ID_HERE" 
}

```



### 3. Request OTP

Initiate the login process.

* **Route:** `POST /api/auth/request-otp`
* **Auth:** None
* **Body:** `{ "phone_number": "233500000000" }`

### 4. Verify OTP

Exchange the 6-digit code for a JWT session token.

* **Route:** `POST /api/auth/verify-otp`
* **Auth:** None
* **Body:** `{ "phone_number": "233500000000", "otp": "123456" }`
* **Response:** Returns `token` and basic user info.

### 5. Fetch Profile Information

Retrieve full details of the logged-in user to hydrate the app state.

* **Route:** `GET /api/auth/me`
* **Auth:** Required
* **Usage:** Use this on app launch to verify if the token is still valid.

### 6. Retrieve Service Categories

Get the list of fault types (Plumbing, Electrical, etc.) for the report dropdown.

* **Route:** `GET /api/services`
* **Auth:** Required

### 7. View Fault History

Fetch previously reported faults. The API automatically filters data based on the user's role (SuperAdmin sees all, Reporter sees their own).

* **Route:** `GET /api/fault-reports`
* **Auth:** Required

### 8. Report a Fault

Submit a new maintenance issue with images.

* **Route:** `POST /api/fault-reports`
* **Auth:** Required
* **Content-Type:** `multipart/form-data`
* **Payload:**
| Key | Type | Description |
| :--- | :--- | :--- |
| `service_id` | String | ID of the selected service category |
| `description` | String | Detailed text of the issue |
| `location_detail` | String | Specific room or area |
| `images` | File[] | Array of images (Max 5) |

---

## 🚦 Status Codes

* **200/201:** Success
* **401:** Unauthorized (Token missing or expired)
* **403:** Forbidden (You don't have the required Role)
* **404:** Resource not found
* **500:** Server Error
