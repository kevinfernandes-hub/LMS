import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses, useEnrollByCode, useNotifications, useAuthStore } from '../../hooks/index.js';
import { Button, Card, Input, Loading, Skeleton } from '../../components/ui.jsx';
import { Plus, Key, Bell, BookOpen, Clock, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const enrollSchema = z.object({
  code: z.string().min(1, 'Invite code is required'),
});

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: courses, isLoading } = useCourses();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  const { mutate: enrollByCode, isPending } = useEnrollByCode();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(enrollSchema),
  });

  const onEnroll = (data) => {
    enrollByCode(data, {
      onSuccess: () => {
        toast.success('Enrolled successfully!');
        reset();
        setShowEnrollModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Enrollment failed');
      },
    });
  };

  if (isLoading) return <Loading />;

  const recentNotifications = (notifications || []).slice(0, 4);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#4B2676] to-[#2D1457] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome back, <span className="text-indigo-200">{user?.first_name || 'Student'}</span>!
          </h1>
          <p className="text-indigo-100/80 text-lg mb-8 leading-relaxed">
            You have <span className="font-bold text-white">{courses?.length || 0}</span> active courses and <span className="font-bold text-white">{notifications?.filter(n => !n.is_read).length || 0}</span> unread notifications. Ready to continue your journey?
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowEnrollModal(true)}
              className="bg-white text-[#4B2676] hover:bg-indigo-50 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              Join New Class
            </Button>
          </div>
        </div>
        {/* Background Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <GraduationCap className="absolute bottom-[-10%] right-[-5%] w-64 h-64 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: My Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#4B2676]" /> My Classes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses?.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/student/course/${course.id}`)}
                className="group cursor-pointer"
              >
                <Card glass className="h-full border-gray-100 hover:border-[#4B2676]/30 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 rounded-[1.5rem] overflow-hidden flex flex-col">
                  <div 
                    className="h-3 w-full" 
                    style={{ backgroundColor: course.cover_color || '#4B2676' }}
                  />
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#4B2676]/10 group-hover:text-[#4B2676] transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {course.subject || 'CS'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1E1B4B] mb-2 line-clamp-1 group-hover:text-[#4B2676] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                        Instructor: {course.teacher_name || 'Faculty Member'}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Progress Simulation */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          <span>Progress</span>
                          <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-[#4B2676]" 
                            style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> 2 Units
                        </div>
                        <div className="flex items-center gap-1 text-[#4B2676] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {courses?.length === 0 && (
            <Card glass className="text-center py-20 rounded-[2rem] border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">No active classes</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't joined any classes for this semester yet. Use an invite code to get started.</p>
              <Button
                variant="primary"
                onClick={() => setShowEnrollModal(true)}
                className="bg-[#4B2676] text-white px-8 rounded-xl font-bold"
              >
                Join Your First Class
              </Button>
            </Card>
          )}
        </div>

        {/* Sidebar: Notifications */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#4B2676]" /> Notifications
          </h2>

          <Card glass className="p-6 rounded-[2rem] border-gray-100 shadow-xl">
            {notificationsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (n.related_type === 'assignment' && n.related_id) {
                        navigate(`/student/assignment/${n.related_id}`);
                      }
                    }}
                    className="w-full text-left group transition-all"
                  >
                    <div className="flex gap-4 p-3 rounded-2xl border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.is_read ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-[#4B2676]'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${n.is_read ? 'text-gray-600' : 'text-[#1E1B4B]'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{n.message}</p>
                      </div>
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-[#4B2676] mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
                <Button variant="ghost" className="w-full text-xs font-bold text-[#4B2676] uppercase tracking-widest hover:bg-indigo-50 py-4">
                  View All Notifications
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-[#1E1B4B]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <Card className="p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#4B2676]" />
              <h2 className="text-3xl font-black text-[#1E1B4B] mb-2">Join a Class</h2>
              <p className="text-gray-500 mb-8">Enter the 6-character code provided by your instructor to enroll.</p>
              
              <form onSubmit={handleSubmit(onEnroll)} className="space-y-6">
                <Input
                  label="Invite Code"
                  placeholder="e.g. ABC123"
                  className="rounded-xl border-gray-200 focus:border-[#4B2676] focus:ring-1 focus:ring-[#4B2676]"
                  {...register('code')}
                  error={errors.code?.message}
                />
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-[#4B2676] text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200"
                    disabled={isPending}
                  >
                    {isPending ? 'Joining...' : 'Join Class'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                    onClick={() => {
                      setShowEnrollModal(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
