import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserCog, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui.jsx';
import { useLogin } from '../../hooks/index.js';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data) => {
    login(data, {
      onSuccess: (response) => {
        if (response.data.user.role !== 'admin') {
          toast.error('This login is for admins only');
          return;
        }
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Login failed');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Visual Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#1E1B4B]">
        <img
          src="/Users/kevinfernandes/.gemini/antigravity/brain/15eb38d2-ce96-48fe-bd1d-9019d2a0dbae/university_campus_login_bg_1776602920347.png"
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SVPCET</h1>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            System Administration<br />Control Panel
          </h2>
          <p className="text-lg text-white/80 max-w-md mb-8">
            Manage institutional settings, user roles, and system-wide configurations.
          </p>
          <div className="flex items-center gap-4 py-6 border-t border-white/10">
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-[#1E1B4B] font-bold">
              ADM
            </div>
            <p className="text-sm text-white/60">Authorized access only for system administrators</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <UserCog className="w-8 h-8 text-[#1E1B4B]" />
            <h1 className="text-2xl font-bold text-[#1E1B4B]">SVPCET</h1>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h3>
            <p className="text-gray-500">Enter secure credentials to manage the platform</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@svpcet.edu"
              icon={Mail}
              {...register('email')}
              error={errors.email?.message}
              className="bg-white"
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Security Password</label>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                {...register('password')}
                error={errors.password?.message}
                className="bg-white"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 bg-[#1E1B4B] hover:bg-[#1A1841] shadow-lg shadow-blue-200"
              disabled={isPending}
            >
              {isPending ? 'Authenticating...' : (
                <span className="flex items-center justify-center gap-2">
                  Secure Login <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Role Switcher */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Return to Portals
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/student/login"
                className="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Student
              </Link>
              <Link
                to="/teacher/login"
                className="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Teacher
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-bold text-amber-900 mb-1">System Admin Account:</p>
            <p className="text-xs text-amber-700">Email: admin@acadify.com | Pass: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
