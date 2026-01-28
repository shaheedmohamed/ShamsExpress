# Shams Express - Delivery App

A comprehensive delivery application built with React Native (Expo) and Laravel.

## 🎨 Brand Colors
- **Primary Navy**: #2C4A6B
- **Accent Gold**: #F5A623
- **White**: #FFFFFF

## 📁 Project Structure

```
ShamsExpress/
├── mobile/              # React Native (Expo) Mobile App
├── backend/             # Laravel Backend API
└── README.md
```

## 🚀 Features

### Mobile App (React Native + Expo)
- User authentication (Login/Register)
- Create delivery orders
- Track order status
- Order history
- User profile management
- Real-time location tracking

### Backend (Laravel)
- RESTful API
- Authentication with Sanctum
- Role-based access control (Admin, Driver, User)
- Order management
- User management

### Admin Dashboard
- Manage users
- Manage drivers
- View and manage all orders
- Statistics and reports

### Driver Dashboard
- View assigned orders
- Update order status
- View delivery details

## 🛠️ Tech Stack

### Mobile
- React Native
- Expo
- React Navigation
- Axios
- React Native Maps

### Backend
- Laravel 10
- MySQL
- Laravel Sanctum
- Laravel Breeze

## 📱 Installation

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Mobile Setup
```bash
cd mobile
npm install
npx expo start
```

## 👥 Default Users

After seeding:
- **Admin**: admin@shamsexpress.com / password
- **Driver**: driver@shamsexpress.com / password
- **User**: user@shamsexpress.com / password

## 📄 License
MIT
