import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, Button, Modal, Loading, Badge } from '../../components/ui.jsx';
import {
  ArrowLeft, Plus, Copy, Users, FileText, MessageSquare, BarChart3,
  Eye, Trash2, Settings, Share2, MoreVertical, Calendar, Clock,
  ExternalLink, Download, BookOpen
} from 'lucide-react';
import { coursesAPI, materialsAPI } from '../../api/client.js';
import PostComposer from '../../components/stream/PostComposer.jsx';
import CreateAssignmentModal from '../../components/assignment/CreateAssignmentModal.jsx';
import CreateMaterialModal from '../../components/material/CreateMaterialModal.jsx';
import { useAnnouncements, useDeleteAnnouncement } from '../../hooks/useAnnouncements.js';
import { useAssignments, useDeleteAssignment } from '../../hooks/useAssignments.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [material, setMaterials] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false);
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  // React Query hooks
  const { data: assignments = [] } = useAssignments(courseId);
  const { data: announcements = [] } = useAnnouncements(courseId);
  const { mutate: deleteAssignment } = useDeleteAssignment(courseId);
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement(courseId);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const [courseRes, materialsRes, enrollmentsRes, inviteRes] = await Promise.all([
        coursesAPI.get(courseId),
        materialsAPI.list(courseId),
        coursesAPI.getEnrollments(courseId),
        coursesAPI.getInviteCode(courseId),
      ]);

      setCourse(courseRes.data);
      setMaterials(materialsRes.data);
      setEnrollments(enrollmentsRes.data);
      setInviteCode(inviteRes.data.code);
    } catch (error) {
      toast.error('Failed to load course');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Delete this assignment? Students who submitted will keep their submissions.')) return;
    deleteAssignment(assignmentId);
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Delete this announcement?')) return;
    deleteAnnouncement(announcementId);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied!');
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676]"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowInviteCodeModal(true)} className="rounded-xl font-bold border-gray-100 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share Course
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/teacher/gradebook/${courseId}`)} className="rounded-xl font-bold border-gray-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Gradebook
          </Button>
        </div>
      </div>

      {/* Course Hero Header */}
      {course && (
        <div className="relative overflow-hidden rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-100 min-h-[300px] flex flex-col justify-end"
             style={{ backgroundColor: course.cover_color || '#4B2676' }}>
          <div className="relative z-10 space-y-4">
            <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
              {course.subject || 'Academic Management'}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-2">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Section {course.section}</span>
              <span>•</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {enrollments.length} Enrolled</span>
            </div>
            {course.description && (
              <p className="text-indigo-100 font-medium max-w-2xl text-lg opacity-70 line-clamp-2">
                {course.description}
              </p>
            )}
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
        </div>
      )}

      {/* Modern Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-2">
        <div className="flex flex-wrap gap-2">
          {[
            { tab: 'assignments', label: 'Assignments', icon: FileText },
            { tab: 'announcements', label: 'Announcements', icon: MessageSquare },
            { tab: 'materials', label: 'Materials', icon: BookOpen },
            { tab: 'students', label: 'Students', icon: Users },
            { tab: 'insights', label: 'Insights', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.tab
                  ? 'bg-[#4B2676] text-white shadow-lg shadow-indigo-100'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-[#1E1B4B]">Course Assignments</h2>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="rounded-xl font-black bg-[#4B2676] text-white flex items-center gap-2 shadow-xl shadow-indigo-100"
                >
                  <Plus className="w-5 h-5" /> New Assignment
                </Button>
              </div>

              {assignments.length === 0 ? (
                <Card glass className="text-center py-20 rounded-[3rem] border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-[#4B2676] opacity-30" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">No assignments yet</h3>
                  <p className="text-gray-500 font-medium mb-8">Ready to assess your students? Create your first assignment.</p>
                  <Button variant="primary" onClick={() => setShowCreateAssignmentModal(true)} className="px-10 py-4 rounded-2xl font-black bg-[#4B2676] text-white shadow-xl shadow-indigo-100">
                    Initialize Assignment
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id} className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl group hover:shadow-2xl transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4B2676] flex items-center justify-center">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-[#4B2676] uppercase tracking-[0.2em]">{assignment.points} Points</p>
                          <p className="text-xs font-bold text-gray-400 mt-1 flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" /> Due {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-[#1E1B4B] mb-3 group-hover:text-[#4B2676] transition-colors">{assignment.title}</h3>
                      <p className="text-gray-500 font-medium text-sm line-clamp-2 mb-8">{assignment.instructions || "No specific instructions provided."}</p>
                      
                      <div className="flex gap-3 pt-6 border-t border-gray-50">
                        <Button
                          variant="primary"
                          className="flex-1 rounded-xl font-bold bg-[#4B2676] text-white flex items-center justify-center gap-2"
                          onClick={() => navigate(`/teacher/grading/${assignment.id}`)}
                        >
                          <Eye className="w-4 h-4" /> Review Submissions
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-12 h-12 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 p-0 flex items-center justify-center"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <PostComposer courseId={courseId} className="rounded-[2.5rem] shadow-xl border-gray-100 p-8" />

              <div className="space-y-6">
                {announcements.length === 0 ? (
                  <Card glass className="text-center py-20 rounded-[3rem] border-gray-100">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4 opacity-20" />
                    <p className="text-gray-500 font-bold">The stream is empty. Share an update with your class!</p>
                  </Card>
                ) : (
                  announcements.map((announcement) => (
                    <Card key={announcement.id} className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4B2676]">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-[#1E1B4B]">{announcement.title}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                              {new Date(announcement.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-[#1E1B4B]">Resource Library</h2>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateMaterialModal(true)}
                  className="rounded-xl font-black bg-[#4B2676] text-white flex items-center gap-2 shadow-xl shadow-indigo-100"
                >
                  <Plus className="w-5 h-5" /> Add Material
                </Button>
              </div>

              {material.length === 0 ? (
                <Card glass className="text-center py-20 rounded-[3rem] border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-[#4B2676] opacity-30" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">Library is empty</h3>
                  <p className="text-gray-500 font-medium mb-8">Share PDFs, YouTube links, or Drive folders with your students.</p>
                  <Button variant="primary" onClick={() => setShowCreateMaterialModal(true)} className="px-10 py-4 rounded-2xl font-black bg-[#4B2676] text-white shadow-xl shadow-indigo-100">
                    Add Resource
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {material.map((mat) => (
                    <Card key={mat.id} className="p-6 rounded-[2.5rem] border-gray-100 shadow-xl flex flex-col group">
                      <div className="flex-1 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4B2676] flex items-center justify-center mb-4">
                          {mat.file_url ? <FileText className="w-6 h-6" /> : <ExternalLink className="w-6 h-6" />}
                        </div>
                        <h3 className="text-lg font-black text-[#1E1B4B] mb-2">{mat.title}</h3>
                        <p className="text-sm text-gray-500 font-medium line-clamp-2">{mat.description || "Reference material for class."}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex gap-2">
                          {mat.link_url && (
                            <a href={mat.link_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-[#4B2676] hover:bg-indigo-50 transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {mat.file_url && (
                            <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-[#4B2676] hover:bg-indigo-50 transition-all">
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => { if (confirm('Delete material?')) {} }}
                          className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl md:col-span-1 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-[#4B2676] mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-black text-[#1E1B4B]">{enrollments.length}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Total Enrolled</p>
                </Card>
                
                <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-[#1E1B4B]">Course Access</h3>
                    <Button variant="secondary" size="sm" onClick={copyInviteCode} className="rounded-xl font-bold border-gray-100 flex items-center gap-2">
                      <Copy className="w-4 h-4" /> Copy
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Invite Code</p>
                      <code className="text-4xl font-black text-[#4B2676] tracking-tighter">{inviteCode}</code>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="rounded-[2.5rem] border-gray-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Student ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enrollments.map((student) => (
                      <tr key={student.id} className="group hover:bg-gray-50/50 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4B2676] font-black">
                              {student.first_name[0]}{student.last_name[0]}
                            </div>
                            <span className="font-bold text-[#1E1B4B]">{student.first_name} {student.last_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-gray-500 font-medium text-sm">{student.email}</td>
                        <td className="px-8 py-5 text-right font-black text-[#4B2676] text-xs">#{student.roll_number || 'N/A'}</td>
                      </tr>
                    ))}
                    {enrollments.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                          No students have joined this course yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <Card className="p-20 text-center rounded-[3rem] border-gray-100 shadow-xl">
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-[#4B2676] opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">Performance Analytics</h3>
              <p className="text-gray-500 font-medium">Coming soon: Track student progress, average scores, and engagement metrics.</p>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <CreateAssignmentModal isOpen={showCreateAssignmentModal} onClose={() => setShowCreateAssignmentModal(false)} courseId={courseId} />
      <CreateMaterialModal isOpen={showCreateMaterialModal} onClose={() => setShowCreateMaterialModal(false)} courseId={courseId} onSuccess={() => fetchCourseData()} />
      
      {showInviteCodeModal && (
        <Modal onClose={() => setShowInviteCodeModal(false)} className="max-w-md rounded-[2.5rem] p-10">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 text-[#4B2676] flex items-center justify-center mx-auto">
              <Share2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#1E1B4B]">Invite Students</h2>
              <p className="text-gray-500 font-medium">Share this unique code with students to grant them access to your course materials.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <code className="text-5xl font-black text-[#4B2676] tracking-tighter">{inviteCode}</code>
            </div>
            <div className="flex gap-4">
              <Button onClick={copyInviteCode} className="flex-1 py-4 rounded-xl font-black bg-[#4B2676] text-white">Copy Code</Button>
              <Button variant="secondary" onClick={() => setShowInviteCodeModal(false)} className="flex-1 py-4 rounded-xl font-bold">Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
