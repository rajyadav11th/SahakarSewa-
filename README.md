# SahakarSewa 🤝

An Express-MVC based **Cooperative Gig Services Platform for Household & Community Services**. this platform empowers Labour Cooperative Federations to securely onboard workers, manage verified digital marketplace bookings, and handle secure payments under a cooperative framework.

---

## 🏗️ Project Architecture & File Structure

This repository follows a strict **Model-View-Controller (MVC)** design pattern:

```text
├── 📂 config                   # Third-party service integrations & DB initialisation
│   ├── cloudinary.js          # Cloud-based image storage configuration (KYC/Profiles)
│   ├── db.js                  # MongoDB database connection setup via Mongoose
│   ├── multer.js              # Multi-part form data middleware for file uploads
│   └── razorpay.js            # Razorpay payment gateway integration config
├── 📂 controllers              # Core business logic processing
│   ├── adminController.js     # Admin verification dashboards & user management
│   ├── authController.js      # Worker, User, and Admin authentication logic
│   ├── bookingController.js   # Matchmaking, service scheduling, and booking updates
│   ├── kycController.js       # Processing and updating worker KYC profiles
│   ├── paymentController.js   # Escrow payments, direct transfers, and invoicing
│   ├── subscriptionController.js # Cooperative membership / premium worker tier subscriptions
│   └── workerController.js    # Worker availability profile updates
├── 📂 models                   # Database schemas definition (MongoDB)
│   ├── Admin.js               # Admin authentication and privileges schema
│   ├── Booking.js             # Service booking details, status, and geo-data schema
│   ├── Kyc.js                 # Worker government ID verification data schema
│   ├── Subscription.js        # Cooperative member subscription schemas
│   └── User.js                # Shared profile schema for both Customers and Workers
├── 📂 public                   # Static client-side assets
│   ├── 📂 css
│   │   └── style.css          # Main stylesheet
│   └── 📂 js
│       └── app.js             # Client-side validation, maps, and dynamic DOM operations
├── 📂 routes                   # Express routing layers dividing API entry points
├── 📂 uploads                  # Local media fallback buffer (e.g., 1788224199741-26818874.jpeg)
├── 📂 views                    # Dynamic front-end templates (EJS Engine)
│   ├── 📂 partials             # Reusable UI fragments (Navbar, Footer, Sidebar)
│   ├── admin-kyc-detail.ejs   # Admin view to deeply inspect worker documents
│   ├── admin-kyc-list.ejs     # Admin workspace listing pending KYC actions
│   ├── admin-login.ejs        # Secure entrance panel for cooperative admins
│   ├── dashboard.ejs          # Master operations hub
│   ├── home.ejs               # Public platform landing page
│   ├── kyc.ejs                # Document uploading gate for Gig workers
│   ├── my-bookings.ejs        # Consumer history log & live job status
│   ├── pay.ejs                # General payment execution screen
│   ├── profile.ejs            # User information edit pane
│   ├── request.ejs            # Customer posting screen to demand a local service
│   ├── signin.ejs             # Consumer/Worker login portal
│   ├── signup.ejs             # Registration portal
│   ├── subscription-pay.ejs   # Payment workflow endpoint for membership plans
│   ├── subscription.ejs       # Available premium plans window
│   ├── worker-profile.ejs     # Public-facing portfolio page for workers
│   ├── worker-requests.ejs    # Job feed page where workers accept local gig requests
│   └── workers.ejs            # Discoverable directory view of local cooperative workers
├── .gitignore                 # Excluded environments and modules tracking list
├── README.md                  # System operating manual
├── createAdmin.js             # CLI utility script to initialize database seeds
├── package-lock.json          # Strict package dependencies lock version tree
├── package.json               # System modules declaration script
└── server.js                  # Operational pipeline gateway initialization script
```

---

## 🛠️ Technology Stack

* **Back-End System:** Node.js, Express.js
* **Database Management:** MongoDB, Mongoose ODM
* **UI/UX View Engine:** EJS (Embedded JavaScript Templates)
* **Payment Processing:** Razorpay API
* **Cloud Asset Management:** Cloudinary SDK
* **File Upload Pipeline:** Multer Middleware

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local environment:
* [Node.js](https://nodejs.org) (v16.x or higher)
* [MongoDB](https://mongodb.com) (Local server setup or an active Atlas Cluster URL string)

### 2. Installation
Clone the repository and install all node packages:
```bash
git clone https://github.com
cd your-repo-name
npm install
```

### 3. Environment Variables Configuration
Create a `.env` file in the root workspace folder and configure your system variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_express_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Seed Platform Administrator
Run the built-in seed utility script to establish your first system superuser setup:
```bash
node createAdmin.js
```

### 5. Launch the Application
Run the local environment runtime:
```bash
# To run in standard mode:
npm start

# To run in developmental hot-reloading mode (if nodemon is configured):
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser to interact with the workspace instance.

---

## 📄 License
This system tool repository architecture is prepared exclusively as an open submission delivery pipeline for **Smart India Hackathon 2026**. All engineering solutions remain bound under the project team's developmental rights frameworks.
