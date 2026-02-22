# SpectraLog AI - Frontend

Modern web interface for SpectraLog AI - AI-Powered, Explainable Forensic SIEM Platform.

## 🚀 Features

- **Real-time Dashboard** - Monitor alerts and system metrics
- **Logs Explorer** - Advanced filtering and search capabilities
- **Timeline Visualization** - Interactive attack timeline reconstruction
- **XAI Explainability** - AI-powered alert explanations with SHAP values
- **Event Correlation** - Visual relationship graphs between security events
- **Responsive Design** - Works on desktop and tablet devices

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **Ant Design** - Enterprise UI components
- **Apache ECharts** - Data visualization
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Navigation
- **Axios** - API communication

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:8000
```

## 🏗️ Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API integration
├── store/          # State management
├── types/          # TypeScript types
└── assets/         # Static assets
```

## 🔌 Backend Integration

This frontend connects to the SpectraLog AI backend API. Make sure the backend is running on `http://localhost:8000` (or update `VITE_API_URL`).

Required backend endpoints:
- `GET /api/v1/logs` - Fetch logs
- `GET /api/v1/alerts` - Fetch alerts
- `GET /api/v1/correlation/timeline` - Timeline data
- `GET /api/v1/xai/explain/:id` - XAI explanations
- `GET /api/v1/correlation/graph/:id` - Correlation graph

## 📄 License

MIT License - Educational and Research Use

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.