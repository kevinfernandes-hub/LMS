import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCog, Users } from 'lucide-react';
import { Button, Card } from '../../components/ui/index.jsx';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4B2676] tracking-wide">SVPCET</h1>
          <div className="hidden md:flex gap-8 text-base font-medium">
            <a href="#about" className="hover:text-[#4B2676] transition">About</a>
            <a href="#courses" className="hover:text-[#4B2676] transition">Courses</a>
            <a href="#resources" className="hover:text-[#4B2676] transition">Resources</a>
            <a href="#contact" className="hover:text-[#4B2676] transition">Contact</a>
          </div>
          <Button onClick={() => navigate('/student/login')} variant="primary" className="bg-[#4B2676] px-6 py-2 rounded-md text-white">Sign In</Button>
        </div>
      </nav>

      {/* Hero Section with faint background image */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-6 py-16 min-h-[420px]">
        {/* Faint background image */}
        <img
          src="https://lh3.googleusercontent.com/p/AF1QipMPnj3QLUu36S3YEIXUvoBJUpP_Rvu3oPu4FiTD=s1360-w1360-h1020-rw"
          alt="SVPCET Campus"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none z-0"
          style={{ filter: 'blur(1px)' }}
          aria-hidden="true"
        />
        {/* Hero text content */}
        <div className="relative z-10 flex-1 min-w-[320px] max-w-xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D1457] mb-6 leading-tight">
            Empowering the<br />Next Generation of<br />Engineers
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            A comprehensive learning platform designed for SVPCET students, faculty, and administrators. Access resources, connect, and excel.
          </p>
        </div>
      </div>

      {/* Portal Cards */}
      <div className="max-w-7xl mx-auto w-full px-6 pb-12 flex flex-col md:flex-row gap-8 justify-center">
        <Card className="flex-1 p-6 bg-[#F7F5FF] border-[#E0D7F7] shadow-md rounded-xl min-w-[260px]">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-7 h-7 text-[#4B2676]" />
            <span className="text-lg font-semibold text-[#4B2676]">Student Portal</span>
          </div>
          <p className="text-gray-700 mb-6">Access courses, assignments, grades, and collaborative tools for learning.</p>
          <Button onClick={() => navigate('/student/login')} variant="primary" className="bg-[#4B2676] w-full">Access Portal</Button>
        </Card>
        <Card className="flex-1 p-6 bg-[#F7F5FF] border-[#E0D7F7] shadow-md rounded-xl min-w-[260px]">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-7 h-7 text-[#4B2676]" />
            <span className="text-lg font-semibold text-[#4B2676]">Faculty Portal</span>
          </div>
          <p className="text-gray-700 mb-6">Manage courses, grade submissions, communicate with students, and utilize teaching resources.</p>
          <Button onClick={() => navigate('/teacher/login')} variant="primary" className="bg-[#4B2676] w-full">Access Portal</Button>
        </Card>
        <Card className="flex-1 p-6 bg-[#F7F5FF] border-[#E0D7F7] shadow-md rounded-xl min-w-[260px]">
          <div className="flex items-center gap-3 mb-3">
            <UserCog className="w-7 h-7 text-[#4B2676]" />
            <span className="text-lg font-semibold text-[#4B2676]">Administrator Access</span>
          </div>
          <p className="text-gray-700 mb-6">Oversee system operations, manage user accounts, reports, and institutional settings.</p>
          <Button onClick={() => navigate('/admin/login')} variant="primary" className="bg-[#4B2676] w-full">Access Portal</Button>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto bg-white">
        <div className="max-w-7xl mx-auto w-full px-6 py-6 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© 2024 SVPCET. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#privacy" className="hover:text-[#4B2676]">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#4B2676]">Terms of Service</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
