import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <Header />
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <AppLayout>
                  <HomePage />
                </AppLayout>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CreatePostPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

export default App;
