import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import QuickBooking from './components/QuickBooking'
import ServiceCards from './components/ServiceCards'
import PopularServices from './components/PopularServices'
import HowItWorks from './components/HowItWorks'
import WhyChooseUs from './components/WhyChooseUs'
import CCTVSection from './components/CCTVSection'
import ComputerSection from './components/ComputerSection'
import NetworkingSection from './components/NetworkingSection'
import AMCSection from './components/AMCSection'
import Reviews from './components/Reviews'
import Gallery from './components/Gallery'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BookingWizard from './components/BookingWizard'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import TechnicianDashboard from './pages/TechnicianDashboard'
import BookingDetail from './pages/BookingDetail'
import ProtectedRoute from './components/ProtectedRoute'

function Home() {
  return (
    <>
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
  )
}

function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <a href="/" className="text-sm font-bold text-[#1e4a9a]">← Back to Home</a>
        <div className="mt-4">
          <BookingWizard />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white antialiased">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/customer/bookings" element={<ProtectedRoute roles={['customer','admin']}><CustomerDashboard /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/technician/bookings" element={<ProtectedRoute roles={['technician','admin']}><TechnicianDashboard /></ProtectedRoute>} />
              <Route path="/booking/:id" element={<ProtectedRoute roles={['customer','admin','technician']}><BookingDetail /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-emerald-500 text-white grid place-items-center shadow-xl hover:scale-110 transition text-xl" aria-label="WhatsApp">✆</a>
            <a href="tel:+919999999999" className="hidden md:grid w-12 h-12 rounded-full bg-[#0a1e40] text-white place-items-center shadow-xl hover:scale-110 transition" aria-label="Call">☎</a>
          </div>
          <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-slate-200 px-3 py-2 flex gap-2">
            <a href="tel:+919999999999" className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-center">Call Now</a>
            <a href="/booking" className="flex-1 py-3 rounded-xl bg-[#0a1e40] text-white font-black text-center">Book Now</a>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
