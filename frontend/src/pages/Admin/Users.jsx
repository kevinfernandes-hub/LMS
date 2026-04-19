import { useState, useEffect } from 'react';
import { Card, Button, Input, Loading, Badge } from '../../components/ui.jsx';
import { adminAPI } from '../../api/client.js';
import { toast } from 'sonner';
import { Trash2, Ban, UserPlus, Search, Filter, MoreHorizontal, User, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getUsers(role === 'all' ? null : role);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      await adminAPI.banUser(userId, !isBanned);
      fetchUsers();
      toast.success(`User ${!isBanned ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Permanent deletion. Are you sure you want to proceed?')) return;
    try {
      setIsDeleting(true);
      await adminAPI.deleteUser(userId);
      fetchUsers();
      toast.success('User purged from records');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#1E1B4B]">User Directory</h1>
          <p className="text-gray-500 font-medium italic">Manage institutional identities and access levels.</p>
        </div>
        <Button variant="primary" className="bg-[#4B2676] text-white px-8 h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Provision User
        </Button>
      </div>

      {/* Control Bar */}
      <Card glass className="p-6 rounded-[2.5rem] border-gray-100 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4B2676] transition-colors" />
          <input 
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#4B2676] transition-all"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-14 pl-12 pr-10 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#4B2676] transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card glass className="rounded-[3rem] border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E1B4B] text-white">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Identity</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Role</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-[#4B2676] group-hover:shadow-lg transition-all">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-[#1E1B4B]">{user.first_name} {user.last_name}</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-none ${
                        user.role === 'admin' ? 'bg-[#4B2676] text-white' : 
                        user.role === 'teacher' ? 'bg-cyan-100 text-cyan-600' : 
                        'bg-rose-100 text-rose-600'
                      }`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      {user.is_banned ? (
                        <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-rose-600" />
                          Suspended
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          Active
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => handleBanUser(user.id, user.is_banned)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            user.is_banned ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          }`}
                          title={user.is_banned ? 'Restore Access' : 'Suspend Access'}
                        >
                          {user.is_banned ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeleting}
                          className="w-10 h-10 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all flex items-center justify-center"
                          title="Permanent Deletion"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#4B2676] opacity-30" />
            </div>
            <h3 className="text-xl font-black text-[#1E1B4B]">No identities matching your query</h3>
            <p className="text-gray-500 font-medium">Try refining your search or filter parameters.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
