import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/index.js';
import { Button, Card, Loading, Badge } from '../../components/ui.jsx';
import { Plus, BookOpen, Users, GraduationCap, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { CreateCourseModal } from '../../components/course/index.js';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#4B2676] p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
              Instructor Control Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Manage your <span className="text-indigo-200">Knowledge Hub</span>
            </h1>
            <p className="text-indigo-100 font-medium max-w-lg text-lg opacity-80">
              Create, organize, and monitor your courses. Your teaching impact starts here.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="h-16 px-8 rounded-2xl bg-white text-[#4B2676] font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create New Class
          </Button>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-[#1E1B4B] tracking-tight flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#4B2676]" /> 
            Active Courses
          </h2>
          <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
            <button className="p-2 rounded-lg bg-white shadow-sm text-[#4B2676]"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600"><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/teacher/course/${course.id}`)}
              className="cursor-pointer group"
            >
              <Card glass className="relative h-full flex flex-col p-8 rounded-[2.5rem] border-gray-100 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                {/* Visual Accent */}
                <div 
                  className="absolute top-0 left-0 w-full h-2 group-hover:h-3 transition-all duration-300"
                  style={{ backgroundColor: course.cover_color || '#4B2676' }}
                />
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4B2676] group-hover:bg-[#4B2676] group-hover:text-white transition-colors duration-300">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <Badge className="bg-gray-50 text-gray-400 border-none font-bold text-[10px] uppercase tracking-widest">
                      {course.section || 'General'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#1E1B4B] group-hover:text-[#4B2676] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mt-1">
                      {course.subject || 'Academic Course'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {course.student_count || 0} Students</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#4B2676] group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {courses?.length === 0 && (
          <Card glass className="text-center py-20 rounded-[3rem] border-gray-100">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-[#4B2676] opacity-30" />
            </div>
            <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">No active classes</h3>
            <p className="text-gray-500 font-medium mb-8">Ready to start teaching? Create your first course today.</p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="px-10 py-4 rounded-2xl font-black bg-[#4B2676] text-white shadow-xl shadow-indigo-100"
            >
              Initialize First Course
            </Button>
          </Card>
        )}
      </div>

      {/* Create Modal */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
