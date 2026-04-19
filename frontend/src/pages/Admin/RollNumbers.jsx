import { useState, useEffect } from 'react';
import { Card, Button, Loading, Badge } from '../../components/ui.jsx';
import { adminAPI } from '../../api/client.js';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, Hash, ArrowUpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminRollNumbers() {
  const [rollNumbers, setRollNumbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchRollNumbers();
  }, []);

  const fetchRollNumbers = async () => {
    try {
      const response = await adminAPI.getValidRollNumbers();
      setRollNumbers(response.data);
    } catch (error) {
      toast.error('Failed to load institutional records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Parsing institutional data...');
    
    try {
      const response = await adminAPI.uploadRollNumbers(file);
      toast.success(`Successfully provisioned ${response.data.count} new IDs`, { id: toastId });
      fetchRollNumbers();
      event.target.value = '';
    } catch (error) {
      toast.error(error.response?.data?.error || 'Validation failure during upload', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <Loading />;

  const usedCount = rollNumbers.filter(r => r.is_used).length;
  const availableCount = rollNumbers.length - usedCount;

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#1E1B4B]">Enrollment Keys</h1>
          <p className="text-gray-500 font-medium italic">Manage valid student roll numbers and registration status.</p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4B2676] flex items-center justify-center mb-6">
              <Hash className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-[#1E1B4B] mb-1">{rollNumbers.length}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Keys</p>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-emerald-600 mb-1">{usedCount}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Activated</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-4xl font-black text-cyan-600 mb-1">{availableCount}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-black text-[#1E1B4B] px-2">Provisioning</h2>
          <Card glass className="p-8 rounded-[3rem] border-indigo-100 shadow-2xl bg-gradient-to-br from-white to-indigo-50/30">
            <div className="w-16 h-16 rounded-3xl bg-[#4B2676] text-white flex items-center justify-center mb-8 shadow-xl shadow-indigo-200">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#1E1B4B] mb-4">Bulk Provisioning</h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
              Upload a .csv or .txt file containing one enrollment key per line to authorize new student registrations.
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              as="label"
              htmlFor="file-upload"
              disabled={isUploading}
              className="w-full h-14 rounded-2xl bg-[#4B2676] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-all"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Select Manifest
                </>
              )}
            </Button>
            
            <div className="mt-8 p-4 rounded-2xl bg-white/50 border border-white flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-gray-400 leading-normal uppercase tracking-wider">
                Duplicate keys will be ignored automatically by the system.
              </p>
            </div>
          </Card>
        </div>

        {/* Directory Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-[#1E1B4B] px-2 flex items-center justify-between">
            Key Registry
            <Badge className="bg-gray-100 text-gray-400 border-none font-black text-[10px] tracking-widest">LIVE DATA</Badge>
          </h2>
          <Card glass className="rounded-[3rem] border-gray-100 shadow-xl overflow-hidden p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto p-6 scrollbar-hide">
              {rollNumbers.map((roll, index) => (
                <motion.div
                  key={roll.roll_number}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`p-4 rounded-2xl border text-center transition-all group ${
                    roll.is_used
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-white border-gray-100 text-gray-400 hover:border-[#4B2676] hover:text-[#4B2676]'
                  }`}
                >
                  <p className="text-xs font-black tracking-widest uppercase">{roll.roll_number}</p>
                  {roll.is_used && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-[8px] font-black uppercase tracking-[0.1em]">Activated</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {rollNumbers.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Hash className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No keys provisioned</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
