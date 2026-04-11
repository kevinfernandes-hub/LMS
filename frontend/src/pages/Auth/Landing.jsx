import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, ClipboardList } from 'lucide-react';
import { Button } from '../../components/ui/index.jsx';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-white">Acadify</h1>
          </div>
          <Button onClick={() => navigate('/student/login')} variant="secondary">
            Sign in
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your classroom, reimagined.
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              A modern learning management system designed for students, teachers, and administrators. Connect, learn, and grow together.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={() => navigate('/student/login')}
                variant="primary"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                Join as Student
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/teacher/login')}
                variant="ghost"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                Join as Teacher
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl hover:bg-white/15 transition-colors">
              <Sparkles className="w-8 h-8 text-yellow-300 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Interface</h3>
              <p className="text-indigo-100">Inspired by Google Classroom but more polished and intuitive</p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl hover:bg-white/15 transition-colors">
              <ClipboardList className="w-8 h-8 text-blue-300 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Powerful Tools</h3>
              <p className="text-indigo-100">Assignments, announcements, materials, and more in one place</p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/20 p-6 rounded-xl hover:bg-white/15 transition-colors">
              <Users className="w-8 h-8 text-green-300 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">Role-Based Access</h3>
              <p className="text-indigo-100">Tailored dashboards for students, teachers, and administrators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-indigo-100">
          <p>© 2024 Acadify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
