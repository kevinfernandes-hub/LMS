import { useState, useEffect } from 'react';
import { Card, Button, Loading, Badge } from '../../components/ui.jsx';
import { adminAPI } from '../../api/client.js';
import { Users, BookOpen, Shield, UserCheck, CreditCard, ChevronRight, LayoutGrid, Settings, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const statCards = [
    {
      title: 'Active Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: '+12%',
      color: 'bg-indigo-50 text-[#4B2676]',
    },
    {
      title: 'Course Catalog',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      trend: '+4',
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      title: 'Total Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: UserCheck,
      trend: '+28%',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#1E1B4B] p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/10 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
              System Administration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Nexus <span className="text-[#4B2676]">Command Center</span>
            </h1>
            <p className="text-indigo-100/60 font-medium max-w-lg text-lg">
              Oversee institutional operations, user access, and system integrity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
              <Shield className="w-8 h-8 text-[#4B2676]" />
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#4B2676]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl group hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">
                  {stat.trend}
                </Badge>
              </div>
              <h3 className="text-4xl font-black text-[#1E1B4B] mb-1">{stat.value}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3 px-2">
            <LayoutGrid className="w-6 h-6 text-[#4B2676]" />
            Core Management
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div 
              onClick={() => window.location.href = '/admin/users'}
              className="group cursor-pointer"
            >
              <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl group-hover:shadow-2xl transition-all flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-[#4B2676] flex items-center justify-center group-hover:bg-[#4B2676] group-hover:text-white transition-all">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E1B4B]">User Directory</h3>
                    <p className="text-gray-500 font-medium text-sm">Control access, roles, and permissions.</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#4B2676] group-hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </Card>
            </div>

            <div 
              onClick={() => window.location.href = '/admin/roll-numbers'}
              className="group cursor-pointer"
            >
              <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl group-hover:shadow-2xl transition-all flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E1B4B]">Enrollment Keys</h3>
                    <p className="text-gray-500 font-medium text-sm">Manage institutional roll numbers.</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* System Activity Placeholder */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3 px-2">
            <Activity className="w-6 h-6 text-[#4B2676]" />
            System Health
          </h2>
          <Card glass className="h-[310px] rounded-[3rem] border-gray-100 shadow-xl flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
              <Activity className="w-10 h-10 text-[#4B2676] opacity-30" />
            </div>
            <h3 className="text-xl font-black text-[#1E1B4B] mb-2">Live Logs Coming Soon</h3>
            <p className="text-gray-500 font-medium">Real-time monitoring of server performance and user traffic.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
