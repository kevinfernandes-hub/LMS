import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui.jsx';
import { useLogin } from '../../hooks/index.js';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function StudentLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data) => {
    login(data, {
      onSuccess: (response) => {
        toast.success('Login successful!');
        navigate('/student/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Login failed');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Visual Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#2D1457]">
        <img
          src="/Users/kevinfernandes/.gemini/antigravity/brain/15eb38d2-ce96-48fe-bd1d-9019d2a0dbae/university_campus_login_bg_1776602920347.png"
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">SVPCET</h1>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Welcome to the<br />Student Portal
          </h2>
          <p className="text-lg text-white/80 max-w-md mb-8">
            Access your course materials, assignments, and grades in one centralized location.
          </p>
          <div className="flex items-center gap-4 py-6 border-t border-white/10">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#2D1457] bg-gray-400 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm text-white/60">Joined by 1,000+ students this semester</p>
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
            <GraduationCap className="w-8 h-8 text-[#2D1457]" />
            <h1 className="text-2xl font-bold text-[#2D1457]">SVPCET</h1>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Student Sign In</h3>
            <p className="text-gray-500">Please enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@student.svpcet.edu"
              icon={Mail}
              {...register('email')}
              error={errors.email?.message}
              className="bg-white"
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="#" className="text-xs font-semibold text-[#4B2676] hover:underline">
                  Forgot password?
                </Link>
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
              className="w-full py-3 bg-[#4B2676] hover:bg-[#3D1E60] shadow-lg shadow-indigo-200"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/student/signup" className="text-[#4B2676] font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Role Switcher */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Sign in as another role
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/teacher/login"
                className="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Teacher
              </Link>
              <Link
                to="/admin/login"
                className="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs font-bold text-indigo-900 mb-1">Demo Student Account:</p>
            <p className="text-xs text-indigo-700">Email: student1@acadify.com | Pass: student123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
