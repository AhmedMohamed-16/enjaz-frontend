# Enjaz Frontend 🌐

[![Angular](https://img.shields.io/badge/Angular-18.2.0-red.svg)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://typescriptlang.org/)
[![SCSS](https://img.shields.io/badge/SCSS-orange.svg)](https://sass-lang.com/)

## 📖 Overview

**Enjaz Frontend** is a modern, responsive Single Page Application (SPA) built with Angular 18+ for the Enjaz task management system. It provides an intuitive UI for user authentication, task dashboard, task creation/editing, and real-time task management.

Paired with the [Enjaz Backend API](https://github.com/yourusername/enjaz/tree/main/backend).

## ✨ Features

- 👤 **Authentication**: Login/Register with JWT auth guards
- 📊 **Task Dashboard**: Overview of user's tasks
- ➕ **Task CRUD**: Create, read, update, delete tasks
- 🛡️ **Guards**: Route protection (auth/guest)
- 🔄 **Interceptors**: HTTP auth & error handling
- 🎨 **Modern UI**: Component-based architecture with SCSS styling
- 📱 **Responsive**: Mobile-first design
- ⚡ **Lazy Loading**: Feature module routing

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Angular 18.2+ |
| **Language** | TypeScript 5.5+ |
| **Styling** | SCSS + Design Tokens |
| **State** | RxJS 7.8+ |
| **HTTP** | Angular HttpClient + Interceptors |
| **Forms** | Reactive Forms |
| **Routing** | Angular Router + Guards |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Angular CLI 18+

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run development server
```bash
npm start
```
App runs at `http://localhost:4200`

### 3. Backend Setup (Required)
Follow [backend README](https://github.com/yourusername/enjaz/tree/main/backend) to start API at `http://localhost:5000`

### 4. Environment Configuration
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1'
};
```

## 🏗 Project Structure

```
frontend/src/app/
├── core/                    # Core services, models, guards, interceptors
│   ├── guards/             # Route guards
│   ├── interceptors/       # HTTP interceptors
│   ├── models/             # TypeScript interfaces
│   └── services/           # App-wide services
├── features/               # Feature modules (lazy loaded)
│   ├── auth/              # Auth pages & routing
│   └── tasks/             # Tasks dashboard & components
├── shared/                 # Reusable components/utils
└── app.component.ts       # Root component
```

## 📱 Pages & Components

| Route | Component | Description | Guard |
|-------|-----------|-------------|-------|
| `/tasks` | Dashboard | Task overview | Auth |
| `/tasks/:id` | TaskForm/Card | Task details/edit | Auth |
| `/auth/login` | Login | User login | Guest |
| `/auth/register` | Register | User registration | Guest |

## 🔧 Development Commands

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Generate component
ng generate component features/tasks/new-task
```

## 🌐 API Integration

Connects to Enjaz Backend API:

- **Base URL**: `http://localhost:5000/api/v1`
- **Auth**: JWT tokens in HTTP-only cookies
- **Endpoints**: Auth, Tasks CRUD

## 🎨 Styling

- **SCSS** with design tokens in `src/styles/tokens.scss`
- **Component-scoped** styles
- **Mobile-first** responsive design

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests (add cypress/jest)
npm run e2e
```

## 🚀 Deployment

### Build & Deploy
```bash
npm run build -- --configuration production
```

**Hosting Options**:
- **Netlify/Vercel**: Drag `dist/frontend` folder
- **Firebase Hosting**
- **Angular Universal** (SSR): Add `@nguniversal/express-engine`

## 🤝 Contributing

1. Fork & clone
2. `npm install`
3. `npm start`
4. Create feature branch
5. Submit PR

## 🔗 Related Projects

- [Enjaz Backend API](https://github.com/yourusername/enjaz/tree/main/backend)
- [Backend README](../backend/README.md)

## 📄 License

MIT License - see [LICENSE](../LICENSE) file.

---

**⭐ Love task management? Star the repo!**
