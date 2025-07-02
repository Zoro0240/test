# 💰 Expense Tracker Pro - Enhanced React Native App

A beautifully designed, feature-rich expense tracking application built with React Native (Expo) and enhanced with AI-powered insights, WhatsApp notifications, and cloud synchronization.

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, minimalistic design with smooth animations
- Dark/Light mode support with auto-detection
- Intuitive navigation with tab-based layout
- Responsive design for phones and tablets
- Premium visual feedback and micro-interactions

### 📊 **Core Expense Management**
- Add, edit, and delete expenses with ease
- Smart category system with custom icons and colors
- Tag-based organization for better tracking
- Advanced filtering and search capabilities
- Monthly, weekly, and yearly views
- Interactive charts and analytics

### 🤖 **AI-Powered Features**
- Smart expense categorization suggestions
- Spending pattern analysis and insights
- Personalized budget recommendations
- Intelligent expense predictions

### 📱 **WhatsApp Integration**
- Daily/Weekly spending summaries via WhatsApp
- Budget alerts and notifications
- Bill payment reminders
- Custom notification scheduling

### ☁️ **Cloud Sync & Backup**
- Secure user authentication
- Real-time data synchronization across devices
- MongoDB Atlas cloud storage
- Automatic backup and restore

### 🔄 **Automation Features**
- Recurring transaction setup
- Automated bill reminders
- Smart notification scheduling
- Background data processing

### 📈 **Advanced Analytics**
- Interactive pie charts and trend graphs
- Category-wise spending analysis
- Monthly comparison reports
- Spending heatmaps
- Export to PDF/CSV formats

### 🔐 **Security & Performance**
- JWT-based authentication
- Encrypted data storage
- Rate limiting and security headers
- Optimized for smooth performance

## 🛠️ Tech Stack

### **Frontend (React Native)**
- **Framework**: Expo SDK 53
- **Navigation**: Expo Router with tab-based layout
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide React Native icons
- **Charts**: React Native Chart Kit & Victory Native
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for local data

### **Backend (Node.js)**
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt
- **Security**: Helmet, CORS, Rate limiting
- **Notifications**: WhatsApp API integration
- **Scheduling**: Node-cron for automated tasks

### **External APIs**
- **Currency Exchange**: ExchangeRate API
- **WhatsApp**: UltraMsg API for notifications
- **Cloud Storage**: MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MongoDB Atlas account
- WhatsApp API credentials (UltraMsg or similar)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker-pro
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   WHATSAPP_API_URL=https://api.ultramsg.com/instance_id
   WHATSAPP_API_TOKEN=your-whatsapp-api-token
   PORT=3000
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the Expo development server**
   ```bash
   npm run dev
   ```

## 📱 App Structure

```
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard
│   │   ├── add.tsx        # Add Expense
│   │   ├── analytics.tsx  # Analytics & Charts
│   │   ├── timeline.tsx   # Transaction History
│   │   ├── budgets.tsx    # Budget Management
│   │   └── settings.tsx   # Settings & Profile
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── services/             # API and external services
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── server/              # Backend Node.js application
    ├── models/          # MongoDB schemas
    ├── routes/          # API endpoints
    ├── middleware/      # Authentication & validation
    └── cron/           # Scheduled tasks
```

## 🔧 Configuration

### WhatsApp Notifications Setup

1. **Get WhatsApp API credentials**
   - Sign up for UltraMsg or similar WhatsApp API service
   - Get your instance ID and API token

2. **Configure environment variables**
   ```env
   WHATSAPP_API_URL=https://api.ultramsg.com/your_instance_id
   WHATSAPP_API_TOKEN=your_api_token
   ```

3. **Enable notifications in app settings**
   - Login to your account
   - Add phone number in profile
   - Enable WhatsApp notifications

### MongoDB Atlas Setup

1. **Create MongoDB Atlas cluster**
2. **Get connection string**
3. **Add to environment variables**
4. **Configure network access and database user**

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Data Sync
- `POST /api/sync` - Sync user data
- `GET /api/sync` - Get user data

### Notifications
- `POST /api/notifications/whatsapp` - Schedule WhatsApp notification
- `GET /api/notifications/history` - Get notification history
- `POST /api/notifications/whatsapp/test` - Test WhatsApp connection

### Automation
- `POST /api/recurring-transactions` - Create recurring transaction
- `GET /api/recurring-transactions` - Get recurring transactions
- `POST /api/bill-reminders` - Create bill reminder
- `GET /api/bill-reminders` - Get bill reminders

## 🎯 Key Features Walkthrough

### 1. **Smart Dashboard**
- Real-time expense overview
- Quick stats and insights
- Recent transactions
- Budget alerts
- Monthly comparisons

### 2. **Intelligent Expense Entry**
- AI-powered category suggestions
- Quick-add floating action button
- Voice-to-text support
- Photo receipt capture

### 3. **Advanced Analytics**
- Interactive charts and graphs
- Spending trends analysis
- Category breakdowns
- Export capabilities

### 4. **WhatsApp Integration**
- Automated daily/weekly summaries
- Budget exceeded alerts
- Bill payment reminders
- Custom message scheduling

### 5. **Cloud Synchronization**
- Secure user authentication
- Real-time data sync
- Cross-device accessibility
- Automatic backups

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Secure environment variable handling

## 📈 Performance Optimizations

- Lazy loading of components
- Efficient state management with Zustand
- Optimized database queries
- Image optimization
- Background task scheduling
- Memory leak prevention

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run E2E tests
npm run test:e2e
```

## 📦 Building for Production

### Frontend (Expo)
```bash
# Build for web
npm run build:web

# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Backend Deployment
```bash
# Deploy to your preferred platform
# (Heroku, Vercel, AWS, etc.)
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing React Native framework
- MongoDB for reliable cloud database services
- UltraMsg for WhatsApp API integration
- Lucide for beautiful icons
- All open-source contributors

## 📞 Support

For support, email support@expensetracker.com or join our Slack channel.

---

**Made with ❤️ by the Expense Tracker Pro Team**