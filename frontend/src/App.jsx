import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickBooking from './components/QuickBooking';
import ServiceCards from './components/ServiceCards';
import PopularServices from './components/PopularServices';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import CCTVSection from './components/CCTVSection';
import ComputerSection from './components/ComputerSection';
import NetworkingSection from './components/NetworkingSection';
import AMCSection from './components/AMCSection';
import Reviews from './components/Reviews';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BookingWizard from './components/BookingWizard';
import FloatingActions from './components/FloatingActions';
import SEO from './components/SEO';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import BookingDetail from './pages/BookingDetail';
import ServicesPage from './pages/Services';
import CategorySilo from './pages/CategorySilo';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ProtectedRoute from './components/ProtectedRoute';
import { FAQS_LIST, SITE_CONFIG } from './data/servicesData';

function Home() {
  return (
    <>
      <SEO
        title="AMD IT SOLUTION | CCTV, Computer, Network & AMC Kolkata"
        description="Certified IT solutions in Kolkata. 24/7 CCTV surveillance, computer & laptop repair, networking & AMC contracts. Doorstep service in 2 hours. Call 9635006403."
        canonicalPath="/"
        keywords="IT services Kolkata, CCTV camera installation Kolkata, laptop repair doorstep, networking AMC Kolkata, ADM TECHNO SOLUTION"
        faqSchema={FAQS_LIST.slice(0, 6)}
      />
      <Hero />
      <QuickBooking />
      <ServiceCards />
      <PopularServices />
      <HowItWorks />
      <WhyChooseUs />
      <CCTVSection />
      <ComputerSection />
      <NetworkingSection />
      <AMCSection />
      <Reviews />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  );
}

function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <SEO
        title="Book IT & CCTV Service Online | AMD IT SOLUTION"
        description="Book verified technicians for CCTV, laptop repair, Wi-Fi setup & AMC in Kolkata. Doorstep service with genuine warranty."
        canonicalPath="/booking"
        noindex={true}
      />
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <a href="/" className="text-sm font-bold text-[#1e4a9a]">← Back to Home</a>
        <div className="mt-4">
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white antialiased">
          <Navbar />
          <main>
            <Routes>
              {/* Primary Public Routes & Silos */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:category" element={<CategorySilo />} />
              <Route path="/services/:category/:slug" element={<ServiceDetail />} />
              <Route path="/service/:slug" element={<ServiceDetail />} />

              {/* Informational & E-E-A-T Authority Hubs */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Transactional & Shielded Routes */}
              <Route
                path="/booking"
                element={
                  <ProtectedRoute roles={['customer', 'admin', 'technician']}>
                    <BookingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute roles={['customer', 'admin']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technician/bookings"
                element={
                  <ProtectedRoute roles={['technician', 'admin']}>
                    <TechnicianDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking/:id"
                element={
                  <ProtectedRoute roles={['customer', 'admin', 'technician']}>
                    <BookingDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingActions />
          <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-slate-200 px-3 py-2 flex gap-2">
            <a
              href={`tel:${SITE_CONFIG.displayPhone}`}
              className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-center text-sm text-[#0a1e40]"
            >
              📞 Call: {SITE_CONFIG.displayPhone}
            </a>
            <a
              href="/booking"
              className="flex-1 py-3 rounded-xl bg-[#0a1e40] text-yellow-400 font-black text-center text-sm shadow-md"
            >
              Book Service
            </a>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
