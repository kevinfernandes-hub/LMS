import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, Button, Loading, Badge } from '../../components/ui.jsx';
import GradeAnalytics from '../../components/GradeAnalytics.jsx';
import { ArrowLeft, BarChart3, Edit2, AlertCircle, Users, FileText, CheckCircle2, Search, Filter, Download } from 'lucide-react';
import { assignmentsAPI } from '../../api/client.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherGradebook() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [gradebook, setGradebook] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editGrade, setEditGrade] = useState('');
  const [editFeedback, setEditFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGradebookData();
  }, [courseId]);

  const fetchGradebookData = async () => {
    setIsLoading(true);
    try {
      const [gradebookRes, analyticsRes] = await Promise.all([
        assignmentsAPI.getGradebook(courseId),
        assignmentsAPI.getAnalytics(courseId),
      ]);

      setGradebook(gradebookRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to load gradebook');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmission = (studentId, assignmentId) => {
    if (!gradebook) return null;
    return gradebook.submissions.find(
      (s) => s.assignment_id === assignmentId && s.user_id === studentId
    );
  };

  const handleEditGrade = (submission) => {
    setEditingSubmission(submission.id);
    setEditGrade(submission.grade || '');
    setEditFeedback(submission.feedback || '');
  };

  const handleSaveGrade = async () => {
    if (!editingSubmission) return;
    setIsSaving(true);

    try {
      await assignmentsAPI.grade(editingSubmission, {
        grade: parseFloat(editGrade) || 0,
        feedback: editFeedback,
      });
      toast.success('Grade saved!');
      await fetchGradebookData();
      setEditingSubmission(null);
    } catch (error) {
      toast.error('Failed to save grade');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  if (!gradebook) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676]"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
        <Card glass className="text-center py-20 rounded-[3rem] border-gray-100">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-6 opacity-30" />
          <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">No Gradebook Data</h3>
          <p className="text-gray-500 font-medium">Please ensure assignments are created and students are enrolled.</p>
        </Card>
      </div>
    );
  }

  const students = gradebook.students || [];
  const assignments = gradebook.assignments || [];
  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676]"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Course
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl font-bold border-gray-100 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Header & Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Badge className="bg-indigo-50 text-[#4B2676] border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
            Academic Ledger
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1E1B4B]">
            Course <span className="text-[#4B2676]">Gradebook</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Monitor and manage student performance across all assessments.
          </p>
        </div>
        
        <Card glass className="p-6 rounded-[2rem] border-gray-100 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4B2676]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E1B4B]">{students.length}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolled Students</p>
          </div>
        </Card>

        <Card glass className="p-6 rounded-[2rem] border-gray-100 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4B2676]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#1E1B4B]">{assignments.length}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Assessments</p>
          </div>
        </Card>
      </div>

      {/* Control Bar & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-indigo-50/50">
        <div className="flex gap-2 p-1 bg-gray-50/50 rounded-xl">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${
              activeTab === 'grid'
                ? 'bg-[#4B2676] text-white shadow-lg shadow-indigo-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Grade Ledger
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-8 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#4B2676] text-white shadow-lg shadow-indigo-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4B2676] outline-none transition-all"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Ledger View */}
          {activeTab === 'grid' && (
            <Card className="rounded-[2.5rem] border-gray-100 shadow-xl overflow-hidden bg-white">
              {assignments.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-[#4B2676] opacity-30" />
                  </div>
                  <h3 className="text-xl font-black text-[#1E1B4B]">No assignments tracked</h3>
                  <p className="text-gray-500 font-medium">Create assignments in the Course Details tab to populate this ledger.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest sticky left-0 bg-white/80 backdrop-blur-md z-20 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                          Student Profile
                        </th>
                        {assignments.map((assignment) => (
                          <th
                            key={assignment.id}
                            className="text-center py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap min-w-[140px]"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[#1E1B4B] tracking-normal normal-case text-sm font-black truncate max-w-[120px]" title={assignment.title}>
                                {assignment.title}
                              </span>
                              <Badge className="bg-indigo-50 text-[#4B2676] border-none font-bold px-2 py-0.5">
                                {assignment.points} PTS
                              </Badge>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="group hover:bg-gray-50/30 transition-all">
                          <td className="py-6 px-8 sticky left-0 bg-white group-hover:bg-gray-50/50 z-10 transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4B2676] font-black">
                                {student.first_name[0]}{student.last_name[0]}
                              </div>
                              <div className="min-w-[120px]">
                                <p className="font-bold text-[#1E1B4B]">
                                  {student.first_name} {student.last_name}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">#{student.roll_number || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          {assignments.map((assignment) => {
                            const submission = getSubmission(student.id, assignment.id);
                            return (
                              <td
                                key={assignment.id}
                                className="py-6 px-4 text-center relative group/cell"
                              >
                                {editingSubmission === submission?.id ? (
                                  <div className="space-y-2 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-lg animate-in zoom-in-95 duration-200">
                                    <input
                                      type="number"
                                      value={editGrade}
                                      onChange={(e) => setEditGrade(e.target.value)}
                                      min="0"
                                      max={assignment.points}
                                      placeholder="Grade"
                                      className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#4B2676] outline-none transition-all"
                                    />
                                    <div className="flex gap-1">
                                      <button
                                        onClick={handleSaveGrade}
                                        disabled={isSaving}
                                        className="flex-1 py-1.5 bg-[#4B2676] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50"
                                      >
                                        {isSaving ? '...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={() => setEditingSubmission(null)}
                                        className="flex-1 py-1.5 bg-white text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:text-gray-600"
                                      >
                                        Esc
                                      </button>
                                    </div>
                                  </div>
                                ) : submission && submission.grade !== null ? (
                                  <div className="flex items-center justify-center gap-2 group/grade">
                                    <div className="text-center">
                                      <p className="text-lg font-black text-[#4B2676]">
                                        {parseFloat(submission.grade).toFixed(1)}
                                      </p>
                                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1 max-w-[40px] mx-auto">
                                        <div 
                                          className="h-full bg-[#4B2676]" 
                                          style={{ width: `${(submission.grade / assignment.points) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleEditGrade(submission)}
                                      className="opacity-0 group-hover/grade:opacity-100 p-2 text-gray-300 hover:text-[#4B2676] hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : submission ? (
                                  <button
                                    onClick={() => handleEditGrade(submission)}
                                    className="px-4 py-2 text-[10px] font-black bg-amber-50 text-amber-600 rounded-xl uppercase tracking-widest border border-amber-100 hover:bg-amber-100 hover:scale-105 transition-all"
                                  >
                                    Ungraded
                                  </button>
                                ) : (
                                  <span className="text-gray-300 font-bold opacity-30">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <GradeAnalytics analytics={analytics} isLoading={false} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
