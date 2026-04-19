import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCog, Users, ArrowRight, ShieldCheck, Globe, BookOpen } from 'lucide-react';
import { Button, Card } from '../../components/ui/index.jsx';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-gray-900 flex flex-col font-sans selection:bg-[#4B2676] selection:text-white">
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4B2676] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#2D1457] tracking-tighter italic">SVPCET</h1>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="text-sm font-semibold text-gray-600 hover:text-[#4B2676] transition-colors">About</a>
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-[#4B2676] transition-colors">Features</a>
            <Button 
              onClick={() => navigate('/student/login')} 
              variant="primary" 
              className="bg-[#4B2676] px-8 py-2.5 rounded-full text-white font-bold hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex-1 flex items-center pt-24 min-h-[85vh] overflow-hidden">
        {/* Faint background image - KEPT ORIGINAL */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/p/AF1QipMPnj3QLUu36S3YEIXUvoBJUpP_Rvu3oPu4FiTD=s1360-w1360-h1020-rw"
            alt="SVPCET Campus"
            className="w-full h-full object-cover opacity-15"
            style={{ filter: 'grayscale(30%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFF]/80 via-transparent to-[#FDFDFF]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[#4B2676] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
              <ShieldCheck className="w-4 h-4" /> Official Learning Management System
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#1E1B4B] mb-8 leading-[1.1] tracking-tight">
              Empowering the <span className="text-[#4B2676] relative">Next Generation
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#4B2676]/10 -z-10"></span>
              </span> of Engineers
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
              A comprehensive, high-performance learning ecosystem designed for SVPCET students, faculty, and administrators. Excellence in education, delivered digitally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/student/login')} 
                className="bg-[#4B2676] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4 px-6 text-gray-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+40}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="User" />
                  ))}
                </div>
                <span className="text-sm font-medium">Join 2k+ Students & Faculty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-1/4 right-[-5%] w-96 h-96 bg-[#4B2676]/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/4 left-[-5%] w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
      </div>

      {/* Portal Cards Section */}
      <div id="features" className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-[#1E1B4B] mb-4">Choose Your Portal</h3>
          <p className="text-gray-500 max-w-xl mx-auto">Select the appropriate gateway to access your personalized dashboard and academic resources.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card glass className="group p-8 bg-white border-gray-100 hover:border-[#4B2676]/30 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 rounded-[2rem]">
            <div className="w-16 h-16 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <GraduationCap className="w-8 h-8 text-[#4B2676]" />
            </div>
            <h4 className="text-2xl font-bold text-[#1E1B4B] mb-3">Student Portal</h4>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Access your digital classroom, submit assignments, track grades, and engage with peers.
            </p>
            <Button 
              onClick={() => navigate('/student/login')} 
              className="w-full bg-[#4B2676] text-white py-4 rounded-xl font-bold group-hover:gap-4 transition-all flex items-center justify-center gap-2"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card glass className="group p-8 bg-white border-gray-100 hover:border-[#4B2676]/30 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 rounded-[2rem]">
            <div className="w-16 h-16 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-8 h-8 text-[#4B2676]" />
            </div>
            <h4 className="text-2xl font-bold text-[#1E1B4B] mb-3">Faculty Portal</h4>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Manage curricula, grade submissions, coordinate with faculty, and mentor your students.
            </p>
            <Button 
              onClick={() => navigate('/teacher/login')} 
              className="w-full bg-[#4B2676] text-white py-4 rounded-xl font-bold group-hover:gap-4 transition-all flex items-center justify-center gap-2"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card glass className="group p-8 bg-white border-gray-100 hover:border-[#4B2676]/30 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 rounded-[2rem]">
            <div className="w-16 h-16 bg-[#1E1B4B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-[#1E1B4B] mb-3">Admin Panel</h4>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Maintain institutional integrity, manage system settings, and oversee platform analytics.
            </p>
            <Button 
              onClick={() => navigate('/admin/login')} 
              className="w-full bg-[#1E1B4B] text-white py-4 rounded-xl font-bold group-hover:gap-4 transition-all flex items-center justify-center gap-2"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-xl font-bold text-gray-400 italic">SVPCET</span>
            </div>
            
            <div className="flex gap-10 text-sm font-semibold text-gray-400">
              <a href="#" className="hover:text-[#4B2676] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#4B2676] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#4B2676] transition-colors">Support</a>
            </div>

            <p className="text-sm text-gray-400 font-medium">
              © 2024 SVPCET Institutional Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
