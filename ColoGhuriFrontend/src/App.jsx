import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const CheckEmail = React.lazy(() => import('./pages/CheckEmail'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const GuideGroupRegister = React.lazy(() => import('./pages/GuideGroupRegister'));
const GuideSetupPassword = React.lazy(() => import('./pages/guide/SetupPassword'));
const Destinations = React.lazy(() => import('./pages/Destinations'));
const DestinationDetail = React.lazy(() => import('./pages/DestinationDetail'));
const Tours = React.lazy(() => import('./pages/Tours'));
const TourDetail = React.lazy(() => import('./pages/TourDetail'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));
const MyTrips = React.lazy(() => import('./pages/MyTrips'));
const TripDetail = React.lazy(() => import('./pages/TripDetail'));
const Profile = React.lazy(() => import('./pages/Profile'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Guide Pages
const GuideDashboard = React.lazy(() => import('./pages/guide/Dashboard'));
const GuideManageTours = React.lazy(() => import('./pages/guide/ManageTours'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminDestinations = React.lazy(() => import('./pages/admin/Destinations'));
const AdminTours = React.lazy(() => import('./pages/admin/Tours'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const AdminGuideGroups = React.lazy(() => import('./pages/admin/GuideGroups'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
          <Navbar />
          <main className="flex-grow pt-16">
            <React.Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/check-email" element={<CheckEmail />} />
                <Route path="/verify-email/:token?" element={<VerifyEmail />} />
                <Route path="/guide-group-register" element={<GuideGroupRegister />} />
                <Route path="/guide/setup-password/:token/" element={<GuideSetupPassword />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id" element={<DestinationDetail />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tours/:id" element={<TourDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes - Traveller */}
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/my-trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
                <Route path="/my-trips/:id" element={<PrivateRoute><TripDetail /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                
                {/* Guide Routes - Only for verified guides */}
                <Route path="/guide/dashboard" element={<PrivateRoute guideOnly><GuideDashboard /></PrivateRoute>} />
                <Route path="/guide/tours" element={<PrivateRoute guideOnly><GuideManageTours /></PrivateRoute>} />
                
                {/* Admin Routes - Only for admin users */}
                <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/destinations" element={<PrivateRoute adminOnly><AdminDestinations /></PrivateRoute>} />
                <Route path="/admin/tours" element={<PrivateRoute adminOnly><AdminTours /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
                <Route path="/admin/guide-groups" element={<PrivateRoute adminOnly><AdminGuideGroups /></PrivateRoute>} />
                <Route path="/admin/settings" element={<PrivateRoute adminOnly><AdminSettings /></PrivateRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                duration: 3000,
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                duration: 4000,
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;