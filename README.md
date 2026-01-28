# 🚚 Shams Express - Delivery App

A complete delivery application built with **React Native + Expo** for mobile and **Laravel** for backend with separate Admin and Driver dashboards.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

---

## ✨ Features

### Mobile App (React Native + Expo)
- 📱 Works on Android & iOS via Expo Go
- 🔐 User Authentication (Login/Register)
- 🏠 Dashboard with statistics
- 📦 Create delivery orders
- 📋 View order history
- 🔍 Order details with status tracking
- 👤 User profile management
- 🎨 Modern UI with brand colors (#FF6B35, #004E89, #F7931E)

### Backend (Laravel)
- 🔒 RESTful API with Sanctum authentication
- 👥 User management (Admin, Driver, Customer roles)
- 📦 Delivery order management
- 📊 Order status tracking
- 📈 Statistics and reports

### Admin Dashboard
- 📊 Overview dashboard with statistics
- 👥 User management (Create, Edit, Delete)
- 🚚 Driver management
- 📦 Order management
- 📋 Detailed order tracking

### Driver Dashboard
- 📊 Driver statistics
- 📋 Available orders
- ✅ Accept orders
- 🔄 Update order status (Picked Up → In Transit → Delivered)
- 📦 View delivery details

---

## 🛠 Tech Stack

### Mobile App
- React Native
- Expo SDK
- React Navigation
- Axios
- AsyncStorage

### Backend
- Laravel 11
- Laravel Sanctum (API Authentication)
- SQLite Database
- Blade Templates (Dashboards)

---

## 📁 Project Structure

```
ShamsExpress/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/       # API Controllers
│   │   │   │   └── Web/       # Dashboard Controllers
│   │   │   └── Middleware/    # Custom Middleware
│   │   └── Models/            # Eloquent Models
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── resources/
│   │   └── views/             # Blade Templates
│   └── routes/
│       ├── api.php            # API Routes
│       └── web.php            # Web Routes
│
└── mobile/                     # React Native App
    ├── src/
    │   ├── components/        # Reusable Components
    │   ├── config/            # Configuration Files
    │   ├── context/           # React Context
    │   ├── navigation/        # Navigation Setup
    │   ├── screens/           # App Screens
    │   └── services/          # API Services
    └── App.js                 # Main App Component
```

---

## 🚀 Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run migrations and seeders:
```bash
php artisan migrate --seed
```

6. Start the Laravel server:
```bash
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start Expo:
```bash
npm start
```

4. Scan the QR code with Expo Go app on your mobile device

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env`:

```env
APP_NAME="Shams Express"
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
```

### Mobile App Configuration

Edit `mobile/src/config/api.js`:

```javascript
// For Android Emulator
const API_URL = 'http://10.0.2.2:8000/api';

// For iOS Simulator
const API_URL = 'http://localhost:8000/api';

// For Physical Device (replace with your computer's IP)
const API_URL = 'http://192.168.1.X:8000/api';
```

---

## 🎮 Running the Application

### Start Backend
```bash
cd backend
php artisan serve
```

### Start Mobile App
```bash
cd mobile
npm start
```

Then scan the QR code with Expo Go app.

### Access Dashboards

**Admin Dashboard:**
- URL: `http://localhost:8000/login`
- Email: `admin@shamsexpress.com`
- Password: `password`

**Driver Dashboard:**
- URL: `http://localhost:8000/login`
- Email: `driver@shamsexpress.com`
- Password: `password`

---

## 🔑 Default Credentials

### Admin Account
- Email: `admin@shamsexpress.com`
- Password: `password`

### Driver Account
- Email: `driver@shamsexpress.com`
- Password: `password`

### Customer Account
- Email: `customer@shamsexpress.com`
- Password: `password`

---

## 📡 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password",
  "phone": "+201234567890"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

### Order Endpoints

#### Get Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "pickup_address": "123 Main St",
  "pickup_latitude": 30.0444,
  "pickup_longitude": 31.2357,
  "delivery_address": "456 Oak Ave",
  "delivery_latitude": 30.0626,
  "delivery_longitude": 31.2497,
  "recipient_name": "Jane Doe",
  "recipient_phone": "+201234567891",
  "package_description": "Documents",
  "delivery_fee": 50,
  "notes": "Handle with care"
}
```

#### Get Order Details
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

#### Update Order Status
```http
PUT /api/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "picked_up",
  "notes": "Package picked up"
}
```

#### Cancel Order
```http
POST /api/orders/{id}/cancel
Authorization: Bearer {token}
```

#### Get Statistics
```http
GET /api/statistics
Authorization: Bearer {token}
```

---

## 🎨 Design & Colors

The app uses a modern, clean design with the following brand colors:

- **Primary:** `#FF6B35` (Orange)
- **Secondary:** `#004E89` (Blue)
- **Accent:** `#F7931E` (Yellow-Orange)
- **Success:** `#2ECC71` (Green)
- **Danger:** `#E74C3C` (Red)

---

## 📱 Mobile App Screens

1. **Login Screen** - User authentication
2. **Register Screen** - New user registration
3. **Home Screen** - Dashboard with statistics and recent orders
4. **Create Order Screen** - Form to create new delivery orders
5. **Orders Screen** - List of all orders with filters
6. **Order Details Screen** - Detailed order information
7. **Profile Screen** - User profile and settings

---

## 🌐 Web Dashboards

### Admin Dashboard Features
- View all orders, users, and drivers
- Create and manage users
- Monitor delivery statistics
- Track order status history

### Driver Dashboard Features
- View available orders
- Accept delivery orders
- Update order status
- Track personal delivery statistics

---

## 🔄 Order Status Flow

1. **Pending** - Order created, waiting for driver
2. **Accepted** - Driver accepted the order
3. **Picked Up** - Package picked up from sender
4. **In Transit** - Package is being delivered
5. **Delivered** - Package delivered successfully
6. **Cancelled** - Order cancelled

---

## 🛡️ Security Features

- Laravel Sanctum API authentication
- Password hashing with bcrypt
- Role-based access control (Admin, Driver, Customer)
- Protected routes with middleware
- CSRF protection on web routes

---

## 📝 License

This project is open-source and available for educational purposes.

---

## 👨‍💻 Development

### Database Schema

**Users Table:**
- id, name, email, password, phone, role, avatar, is_active

**Delivery Orders Table:**
- id, customer_id, driver_id, pickup/delivery addresses, coordinates, package details, status, fees

**Order Status Histories Table:**
- id, order_id, status, changed_by, notes, timestamps

### Adding New Features

1. Backend: Add routes in `routes/api.php` or `routes/web.php`
2. Create controllers in `app/Http/Controllers`
3. Mobile: Add screens in `mobile/src/screens`
4. Update navigation in `mobile/src/navigation/AppNavigator.js`

---

## 🐛 Troubleshooting

### Backend Issues

**Database not found:**
```bash
touch database/database.sqlite
php artisan migrate --seed
```

**Permission denied:**
```bash
chmod -R 775 storage bootstrap/cache
```

### Mobile App Issues

**Cannot connect to API:**
- Check API_URL in `mobile/src/config/api.js`
- Ensure backend server is running
- Use correct IP address for physical devices

**Expo Go not loading:**
```bash
npm start --clear
```

---

## 📞 Support

For issues and questions, please create an issue in the repository.

---

## 🎯 Future Enhancements

- [ ] Real-time order tracking with maps
- [ ] Push notifications
- [ ] Payment integration
- [ ] Rating and reviews system
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export reports (PDF/Excel)

---

**Built with ❤️ using React Native, Expo, and Laravel**
