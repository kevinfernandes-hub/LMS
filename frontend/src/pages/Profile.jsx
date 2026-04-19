import { useEffect } from 'react';
import { useMe, useUpdateProfile } from '../hooks/index.js';
import { Card, Input, Button, Loading, Textarea, Badge } from '../components/ui.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Hash, Shield, Camera, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().optional().default(''),
  avatarUrl: z.string().optional().default(''),
});

export default function Profile() {
  const { data: user, isLoading } = useMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio || '',
        avatarUrl: user.avatar_url || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update profile');
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1E1B4B] tracking-tight mb-2">Profile Settings</h1>
          <p className="text-gray-500 font-medium">Update your personal information and public profile.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4B2676] text-sm font-bold capitalize">
          <Shield className="w-4 h-4" /> {user?.role} Account
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar & Identity */}
        <div className="lg:col-span-1 space-y-6">
          <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-indigo-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg shadow-indigo-100">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-[#4B2676]" />
                )}
              </div>
              <div className="absolute inset-0 bg-[#4B2676]/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-[#1E1B4B] mb-1">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{user?.role}</p>
            
            <div className="w-full space-y-3 text-left">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4B2676]" />
                <span className="text-xs font-bold text-gray-600 truncate">{user?.email}</span>
              </div>
              {user?.roll_number && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <Hash className="w-4 h-4 text-[#4B2676]" />
                  <span className="text-xs font-bold text-gray-600">{user.roll_number}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card glass className="p-8 md:p-10 rounded-[2.5rem] border-gray-100 shadow-xl space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4B2676]" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    className="rounded-xl border-gray-100"
                  />
                  <Input
                    label="Last Name"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    className="rounded-xl border-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-50">
                <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#4B2676]" /> Profile Customization
                </h3>
                <div className="space-y-6">
                  <Input
                    label="Avatar URL"
                    placeholder="https://images.unsplash.com/..."
                    {...register('avatarUrl')}
                    error={errors.avatarUrl?.message}
                    className="rounded-xl border-gray-100"
                  />
                  <Textarea
                    label="Short Bio"
                    placeholder="Write a few words about yourself..."
                    rows="4"
                    {...register('bio')}
                    error={errors.bio?.message}
                    className="rounded-2xl border-gray-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-end pt-6 border-t border-gray-50">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => reset()}
                  className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reset Changes
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isPending}
                  className="px-10 py-3 rounded-xl font-black bg-[#4B2676] text-white shadow-xl shadow-indigo-100 flex items-center gap-2"
                >
                  {isPending ? 'Saving...' : (
                    <>
                      <Save className="w-4 h-4" /> Save Profile
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
