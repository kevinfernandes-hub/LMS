import { useNavigate } from 'react-router-dom';
import { Card, Button, Loading } from '../../components/ui.jsx';
import { useMe, useLogout } from '../../hooks/index.js';
import { User, Shield, Bell, Settings as SettingsIcon, LogOut, Mail, Hash, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-4xl font-black text-[#1E1B4B] tracking-tight mb-2">Account Settings</h1>
        <p className="text-gray-500 font-medium">Manage your profile, security, and session preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Overview */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <User className="w-5 h-5 text-[#4B2676]" /> Personal Information
          </h2>
          <Card glass className="p-8 rounded-[2rem] border-gray-100 shadow-xl space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Mail className="w-6 h-6 text-[#4B2676]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-bold text-[#1E1B4B] truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <UserCircle className="w-6 h-6 text-[#4B2676]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Role</p>
                <p className="text-sm font-bold text-[#1E1B4B] capitalize">{user?.role}</p>
              </div>
            </div>

            {user?.roll_number && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Hash className="w-6 h-6 text-[#4B2676]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll Number</p>
                  <p className="text-sm font-bold text-[#1E1B4B]">{user.roll_number}</p>
                </div>
              </div>
            )}

            <Button 
              variant="secondary" 
              onClick={() => navigate('/profile')}
              className="w-full py-4 rounded-xl font-bold text-[#4B2676] border-2 border-indigo-50 hover:bg-indigo-50"
            >
              Update Full Profile
            </Button>
          </Card>
        </div>

        {/* Security & Session */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4B2676]" /> Security & Preferences
          </h2>
          <div className="space-y-4">
            <Card glass className="p-6 rounded-[2rem] border-gray-100 shadow-xl flex items-center justify-between group cursor-not-allowed opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E1B4B]">Change Password</p>
                  <p className="text-xs text-gray-500">Security feature coming soon</p>
                </div>
              </div>
            </Card>

            <Card glass className="p-6 rounded-[2rem] border-gray-100 shadow-xl flex items-center justify-between group cursor-not-allowed opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1E1B4B]">Notification Settings</p>
                  <p className="text-xs text-gray-500">Customize your alerts</p>
                </div>
              </div>
            </Card>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => logout()}
                disabled={isPending}
                className="w-full bg-[#1E1B4B] hover:bg-red-600 text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all"
              >
                {isPending ? 'Signing out...' : (
                  <>
                    <LogOut className="w-5 h-5" /> Sign out of all sessions
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
