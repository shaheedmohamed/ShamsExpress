# 📖 Shams Express - Complete Setup Guide

This guide will walk you through setting up the complete Shams Express delivery application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP** 8.2 or higher
- **Composer** (PHP package manager)
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go** app on your mobile device (Download from App Store/Play Store)

## 🔧 Step-by-Step Setup

### Part 1: Backend Setup (Laravel)

#### 1. Navigate to Backend Directory
```bash
cd backend
```

#### 2. Install PHP Dependencies
```bash
composer install
```

This will install all Laravel dependencies including:
- Laravel Framework
- Laravel Sanctum (for API authentication)
- Other required packages

#### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file and update these values:
```env
APP_NAME="Shams Express"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
```

#### 4. Generate Application Key
```bash
php artisan key:generate
```

#### 5. Create SQLite Database
```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File

# Linux/Mac
touch database/database.sqlite
```

#### 6. Run Database Migrations
```bash
php artisan migrate
```

This creates all necessary tables:
- users
- delivery_orders
- order_status_histories
- sessions
- cache
- jobs

#### 7. Seed Database with Sample Data
```bash
php artisan db:seed
```

This creates:
- Admin user (admin@shamsexpress.com)
- Driver user (driver@shamsexpress.com)
- Customer user (customer@shamsexpress.com)

#### 8. Start Laravel Development Server
```bash
php artisan serve
```

The backend will be available at: `http://localhost:8000`

#### 9. Test the Backend
Open your browser and navigate to:
- **Admin Dashboard:** `http://localhost:8000/login`
- **API Health Check:** `http://localhost:8000/up`

---

### Part 2: Mobile App Setup (React Native + Expo)

#### 1. Navigate to Mobile Directory
```bash
cd mobile
```

#### 2. Install Node Dependencies
```bash
npm install
```

This installs:
- React Native
- Expo SDK
- React Navigation
- Axios
- AsyncStorage
- Other dependencies

#### 3. Configure API Connection

Edit `mobile/src/config/api.js`:

**For Android Emulator:**
```javascript
const API_URL = 'http://10.0.2.2:8000/api';
```

**For iOS Simulator:**
```javascript
const API_URL = 'http://localhost:8000/api';
```

**For Physical Device:**
```javascript
// Replace with your computer's local IP address
const API_URL = 'http://192.168.1.100:8000/api';
```

To find your IP address:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr`

#### 4. Start Expo Development Server
```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code in the terminal
- Open Expo DevTools in your browser

#### 5. Run on Your Device

**Option A: Physical Device (Recommended)**
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Open Expo Go app
3. Scan the QR code displayed in terminal
4. Wait for the app to load

**Option B: Android Emulator**
1. Ensure Android Studio is installed with an emulator
2. Press `a` in the terminal

**Option C: iOS Simulator (Mac only)**
1. Ensure Xcode is installed
2. Press `i` in the terminal

---

## 🎯 Testing the Application

### Test Backend Dashboards

#### Admin Dashboard
1. Navigate to `http://localhost:8000/login`
2. Login with:
   - Email: `admin@shamsexpress.com`
   - Password: `password`
3. You should see the admin dashboard with statistics

#### Driver Dashboard
1. Navigate to `http://localhost:8000/login`
2. Login with:
   - Email: `driver@shamsexpress.com`
   - Password: `password`
3. You should see the driver dashboard

### Test Mobile App

#### Register New User
1. Open the app on your device
2. Tap "Register"
3. Fill in the form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: +201234567890
   - Password: password
   - Confirm Password: password
4. Tap "Register"

#### Login Existing User
1. Use customer credentials:
   - Email: `customer@shamsexpress.com`
   - Password: `password`
2. Tap "Login"

#### Create Delivery Order
1. From home screen, tap "Create New Delivery Order"
2. Fill in the form:
   - Pickup Address: "123 Main Street, Cairo"
   - Delivery Address: "456 Oak Avenue, Giza"
   - Recipient Name: "John Doe"
   - Recipient Phone: "+201234567891"
   - Package Description: "Documents"
   - Delivery Fee: "50"
3. Tap "Create Order"

#### Track Order
1. Go to "Orders" tab
2. Tap on any order to view details
3. See status updates and history

---

## 🔍 Verification Checklist

### Backend ✅
- [ ] Laravel server running on `http://localhost:8000`
- [ ] Can access login page
- [ ] Can login as admin
- [ ] Can login as driver
- [ ] Database has sample data
- [ ] API endpoints responding

### Mobile App ✅
- [ ] Expo server running
- [ ] App loads on device/emulator
- [ ] Can register new user
- [ ] Can login
- [ ] Can create order
- [ ] Can view orders
- [ ] Can view profile

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue: "Class 'PDO' not found"**
```bash
# Enable SQLite extension in php.ini
# Uncomment: extension=pdo_sqlite
```

**Issue: "Permission denied" on storage**
```bash
# Windows (PowerShell as Admin)
icacls storage /grant Users:F /T
icacls bootstrap/cache /grant Users:F /T

# Linux/Mac
chmod -R 775 storage bootstrap/cache
```

**Issue: "Database not found"**
```bash
# Recreate database
rm database/database.sqlite
touch database/database.sqlite
php artisan migrate --seed
```

### Mobile App Issues

**Issue: "Network request failed"**
- Check if Laravel server is running
- Verify API_URL in `mobile/src/config/api.js`
- For physical devices, ensure phone and computer are on same WiFi
- Check firewall settings

**Issue: "Unable to resolve module"**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

**Issue: QR code not scanning**
- Ensure Expo Go app is updated
- Try manual connection: Enter URL manually in Expo Go

**Issue: "Expo Go app crashes"**
```bash
# Clear Expo cache
expo start -c
```

---

## 📱 Running on Physical Device

### Android Device
1. Enable Developer Mode on your phone
2. Connect to same WiFi as your computer
3. Open Expo Go app
4. Scan QR code from terminal

### iOS Device
1. Install Expo Go from App Store
2. Connect to same WiFi as your computer
3. Open Expo Go app
4. Scan QR code from terminal

---

## 🚀 Production Deployment

### Backend Deployment
1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Use MySQL/PostgreSQL instead of SQLite
4. Configure proper domain in `APP_URL`
5. Run `php artisan config:cache`
6. Run `php artisan route:cache`

### Mobile App Deployment
1. Build for Android: `expo build:android`
2. Build for iOS: `expo build:ios`
3. Submit to Play Store/App Store
4. Update API_URL to production backend

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Check that both backend and mobile servers are running
5. Verify network connectivity

---

## 🎉 Success!

If everything is working:
- ✅ Backend running on `http://localhost:8000`
- ✅ Admin dashboard accessible
- ✅ Driver dashboard accessible
- ✅ Mobile app running on your device
- ✅ Can create and track orders

**You're ready to start developing!**

---

**Happy Coding! 🚀**
