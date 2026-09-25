import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    // customers cannot access admin/technician APIs/pages
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-white border border-red-200 rounded-2xl p-8 shadow">
          <div className="text-4xl">🔒</div>
          <h2 className="mt-3 text-xl font-black text-[#0a1e40]">Access Denied</h2>
          <p className="mt-2 text-sm text-slate-600">Your role <span className="font-bold">{user.role}</span> cannot access this page. Required: {roles.join(', ')}</p>
          <a href="/" className="mt-4 inline-flex px-5 py-2 bg-[#0a1e40] text-white rounded-full font-bold">Go Home</a>
        </div>
      </div>
    );
  }
  return children;
}
