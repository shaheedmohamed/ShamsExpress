# Shams Express Mobile App

React Native + Expo mobile application for the Shams Express delivery service.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on device:
- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` for Android emulator
- Press `i` for iOS simulator

## 📱 Features

- User authentication (Login/Register)
- Create delivery orders
- Track order status
- View order history
- User profile management
- Real-time statistics

## 🎨 Brand Colors

- Primary: #FF6B35
- Secondary: #004E89
- Accent: #F7931E

## 📦 Dependencies

- expo: ~51.0.0
- react-native: 0.74.0
- @react-navigation/native: ^6.1.9
- axios: ^1.6.2
- @react-native-async-storage/async-storage: 1.23.0

## ⚙️ Configuration

Update API URL in `src/config/api.js`:

```javascript
// For Android Emulator
const API_URL = 'http://10.0.2.2:8000/api';

// For iOS Simulator  
const API_URL = 'http://localhost:8000/api';

// For Physical Device
const API_URL = 'http://YOUR_IP:8000/api';
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── config/         # App configuration
│   ├── context/        # React Context (Auth)
│   ├── navigation/     # Navigation setup
│   ├── screens/        # App screens
│   └── services/       # API services
├── App.js              # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🔧 Troubleshooting

**Cannot connect to backend:**
- Ensure Laravel server is running
- Check API_URL configuration
- For physical devices, use your computer's local IP

**App crashes on startup:**
```bash
npm start --clear
```

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web browser
