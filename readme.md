# 💰 MoneyMate - Personal Finance Management App

**MoneyMate** is a modern, full-stack personal finance management application built with Next.js, featuring customer management and expense splitting capabilities. Track your finances and split expenses with friends seamlessly.


## ✨ Features

### 🏠 Core Features
- **Modern Dashboard** - Clean, intuitive interface with real-time financial insights
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates** - Live data synchronization across all components

### 👥 Customer Management
- **Customer Tracking** - Add, edit, and manage customer's entries
- **Entry Management** - Track "You Gave" and "You Get" transactions
- **Balance Calculation** - Automatic calculation of outstanding balances
- **Transaction History** - Complete history of all customer interactions

### 🎯 Split Expenses
- **Room Creation** - Create expense-sharing rooms with friends/family
- **Real-time Collaboration** - Multiple users can add expenses simultaneously
- **Smart Splitting** - Automatic expense division among participants
- **Balance Tracking** - Track who owes what to whom
- **Detailed Summaries** - Comprehensive expense reports and analytics

### 🔐 Authentication & Security
- **Secure Authentication** - JWT-based authentication system
- **Email Verification** - Account verification via email codes
- **Password Reset** - Secure password recovery with email codes
- **Profile Management** - Update profile information and upload pictures

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework with App Router
- **React** - Latest React features with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service integration
- **Cloudinary** - Image upload and management


## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm**
- **MongoDB** database
- **Cloudinary** account (for image uploads)
- **Email service** (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MILANBHADARKA/MoneyMate
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URL=your-MongoDB-connection-string

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
RESEND_API_KEY=your-resend-api-key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App Configuration
NEXT_PUBLIC_API_BASE_URL=Api_URL

NODE_ENV=development/production

```

4. **Database Setup**
Make sure MongoDB is running on your system or use a cloud provider like MongoDB Atlas.

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
moneymate/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── customer/      # Customer management
│   │   │   ├── entry/         # Entry management
│   │   │   ├── split-room/    # Split room endpoints
│   │   │   └── split-expense/ # Expense splitting
│   │   ├── customers/         # Customer pages
│   │   ├── split-rooms/       # Split room pages
│   │   ├── profile/           # Profile management
│   │   ├── sign-in/           # Authentication pages
│   │   └── ...
│   ├── components/            # Reusable components
│   │   ├── header/           # Navigation header
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── context/              # React context providers
│   │   ├── ThemeContext.jsx  # Theme management
│   │   └── UserContext.jsx   # User state management
│   ├── lib/                  # Utility libraries
│   │   ├── dbConnect.js      # Database connection
│   │   ├── jwt.js            # JWT utilities
│   │   └── cloudinary.js     # Image upload config
│   ├── model/                # MongoDB schemas
│   │   ├── user.js
│   │   ├── customer.js
│   │   ├── entry.js
│   │   ├── splitRoom.js
│   │   └── splitExpenses.js
│   └── schemas/              # Validation schemas
├── public/                   # Static assets
└── ...config files
```


## 🎨 Design Features

### Theme System
- **Dark Mode** - Modern dark theme with blue/purple accents
- **Light Mode** - Clean light theme with subtle gradients
- **System Preference** - Automatic theme detection
- **Smooth Transitions** - Animated theme switching

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for passwords
- **Input Validation** - Zod schema validation on all endpoints
- **Protected Routes** - Route-level authentication checks
- **CORS Protection** - Cross-origin request security
- **XSS Protection** - Input sanitization


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Your Name**
- GitHub: [@milanbhadarka](https://github.com/milanbhadarka)
- Email: work.bhadarka@gmail.com


## 📊 Project Status

🚧 **Active Development** - This project is actively maintained and updated with new features.

### Recent Updates
- ✅ Complete authentication system
- ✅ Customer management with entries
- ✅ Split room functionality
- ✅ Profile management with image upload
- ✅ Dark/Light theme system
- ✅ Responsive design
- ✅ Real-time balance calculations

### Upcoming Features
- 📊 Advanced analytics and charts
- 🔔 Push notifications
- 📧 Email reminders
- 📤 Data export functionality
- 💳Will introduce some subscription plans

---

**MoneyMate** - Making personal finance management simple and collaborative! 💰✨
