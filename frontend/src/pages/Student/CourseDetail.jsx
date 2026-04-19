import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, Button, Input, Textarea, Modal, Loading, Badge } from '../../components/ui.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowLeft, Download, FileText, MessageSquare, CheckCircle, 
  AlertCircle, Clock, BookOpen, Users, ChevronRight, PlayCircle, Award
} from 'lucide-react';
import { coursesAPI, assignmentsAPI, announcementsAPI, materialsAPI } from '../../api/client.js';
import MaterialRow from '../../components/materials/MaterialRow.jsx';
import YouTubeModal from '../../components/materials/YouTubeModal.jsx';
import { extractVideoId, isGoogleDriveUrl, isYouTubeUrl, getYouTubeEmbedUrl } from '../../lib/videoUtils.js';

const commentSchema = {
  content: (value) => (value && value.trim().length > 0) || 'Comment cannot be empty',
};

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments'); // assignments, materials, announcements, people
  const [submissions, setSubmissions] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [videoModal, setVideoModal] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const [courseRes, assignmentsRes, announcementsRes, materialsRes] = await Promise.all([
        coursesAPI.get(courseId),
        assignmentsAPI.list(courseId),
        announcementsAPI.list(courseId),
        materialsAPI.list(courseId),
      ]);

      setCourse(courseRes.data);
      setAssignments(assignmentsRes.data);
      setAnnouncements(announcementsRes.data);
      setMaterials(materialsRes.data);

      const submissionMap = {};
      for (const assignment of assignmentsRes.data) {
        try {
          const subRes = await assignmentsAPI.getStudentSubmission(assignment.id);
          submissionMap[assignment.id] = subRes.data;
        } catch (error) {
          // No submission yet
        }
      }
      setSubmissions(submissionMap);
    } catch (error) {
      toast.error('Failed to load course');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddComment = async () => {
    if (!selectedAnnouncement) return;
    const validation = commentSchema.content(commentContent);
    if (validation !== true) {
      toast.error(typeof validation === 'string' ? validation : 'Comment cannot be empty');
      return;
    }
    try {
      await announcementsAPI.addComment(selectedAnnouncement.id, { content: commentContent });
      toast.success('Comment added!');
      await fetchCourseData();
      setCommentContent('');
      setShowCommentModal(false);
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submission = submissions[assignment.id];
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    const isOverdue = now > dueDate;

    if (submission && submission.grade !== null) {
      return { status: 'Graded', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle };
    } else if (submission) {
      return { status: 'Submitted', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: CheckCircle };
    } else if (isOverdue) {
      return { status: 'Overdue', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle };
    } else {
      return { status: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
    }
  };

  const handleMaterialClick = (material) => {
    const url = material?.link_url;
    if (!url) return;
    if (isYouTubeUrl(url)) {
      const info = getYouTubeEmbedUrl(url);
      if (info) {
        setVideoModal({ platform: 'youtube', embedUrl: info.embedUrl, title: material.title || 'Video', thumbnailUrl: info.thumbnailUrl });
        return;
      }
    }
    if (isGoogleDriveUrl(url)) {
      const info = extractVideoId(url);
      if (info?.embedUrl) {
        setVideoModal({ platform: 'gdrive', embedUrl: info.embedUrl, title: material.title || 'Video', thumbnailUrl: null });
        return;
      }
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </Button>

      {/* Course Hero */}
      {course && (
        <div
          className="relative rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl shadow-indigo-100"
          style={{ backgroundColor: course.cover_color }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl" />
          
          <div className="relative z-10">
            <Badge className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-4">
              {course.subject} • Section {course.section}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-4 text-white/80 font-bold">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span>Taught by <span className="text-white">Prof. {course.first_name} {course.last_name}</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
        {[
          { tab: 'assignments', label: 'Assignments', icon: FileText },
          { tab: 'materials', label: 'Materials', icon: BookOpen },
          { tab: 'announcements', label: 'Announcements', icon: MessageSquare },
          { tab: 'people', label: 'People', icon: Users },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 ${
              activeTab === item.tab
                ? 'bg-white text-[#4B2676] shadow-sm'
                : 'text-gray-500 hover:text-[#4B2676]'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl">
        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="grid gap-6">
            {assignments.length === 0 ? (
              <Card glass className="text-center py-20 rounded-[2rem]">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-[#1E1B4B]">No assignments yet</h3>
                <p className="text-gray-500">Check back later for new tasks from your instructor.</p>
              </Card>
            ) : (
              assignments.map((assignment, idx) => {
                const statusInfo = getAssignmentStatus(assignment);
                const submission = submissions[assignment.id];
                
                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card glass className="p-8 rounded-[2rem] border-gray-100 hover:border-[#4B2676]/20 transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-start gap-8">
                        <div className={`w-14 h-14 rounded-2xl ${statusInfo.bg} ${statusInfo.color} flex items-center justify-center shrink-0`}>
                          <statusInfo.icon className="w-7 h-7" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-2xl font-black text-[#1E1B4B] mb-1">{assignment.title}</h3>
                              <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Due {new Date(assignment.due_date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> {assignment.points} Points</span>
                              </div>
                            </div>
                            <Badge className={`${statusInfo.bg} ${statusInfo.color} px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest`}>
                              {statusInfo.status}
                            </Badge>
                          </div>

                          <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                            {assignment.instructions}
                          </p>

                          {submission?.feedback && (
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 mb-6">
                              <p className="text-[10px] font-black text-[#4B2676] uppercase tracking-widest mb-1">Teacher Feedback</p>
                              <p className="text-sm text-[#4B2676] font-medium leading-relaxed italic">"{submission.feedback}"</p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-4">
                            <Button
                              variant={submission ? 'secondary' : 'primary'}
                              onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                              className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${submission ? 'text-[#4B2676] border-2 border-indigo-50 hover:bg-indigo-50' : 'bg-[#4B2676] text-white'}`}
                            >
                              {submission ? 'View Submission' : 'Submit Assignment'}
                            </Button>
                            {submission && submission.grade !== null && (
                              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <Award className="w-4 h-4" />
                                <span className="text-sm font-black">Grade: {submission.grade} / {assignment.points}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {materials.length === 0 ? (
              <Card glass className="text-center py-20 rounded-[2rem]">
                <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-[#1E1B4B]">No materials yet</h3>
                <p className="text-gray-500">Your teacher hasn't uploaded any resources yet.</p>
              </Card>
            ) : (
              <Card glass className="overflow-hidden rounded-[2rem] border-gray-100">
                <div className="divide-y divide-gray-50">
                  {materials.map((material) => (
                    <div 
                      key={material.id} 
                      onClick={() => handleMaterialClick(material)}
                      className="group p-6 flex items-center justify-between hover:bg-indigo-50/30 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#4B2676] group-hover:scale-110 transition-transform">
                          {isYouTubeUrl(material.link_url) ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1E1B4B] group-hover:text-[#4B2676] transition-colors">{material.title}</h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{material.type || 'Document'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#4B2676] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <AnimatePresence>
              {videoModal && (
                <YouTubeModal
                  embedUrl={videoModal.embedUrl}
                  title={videoModal.title}
                  platform={videoModal.platform}
                  onClose={() => setVideoModal(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {announcements.length === 0 ? (
              <Card glass className="text-center py-20 rounded-[2rem]">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-[#1E1B4B]">No announcements</h3>
                <p className="text-gray-500">Check here for updates from your professor.</p>
              </Card>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id} glass className="p-8 rounded-[2rem] border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4B2676] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1E1B4B]">{announcement.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed mb-8">{announcement.content}</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowCommentModal(true);
                    }}
                    className="px-6 py-2.5 rounded-xl font-black text-xs text-[#4B2676] border-2 border-indigo-50 hover:bg-indigo-50 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Add Comment
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}

        {/* People Tab */}
        {activeTab === 'people' && (
          <Card glass className="p-10 rounded-[2rem] border-gray-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 text-[#4B2676] rounded-[2rem] flex items-center justify-center mb-6">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">Class Community</h3>
            <p className="text-gray-500 font-medium mb-8">You are learning with {course?.enrollments?.length || 0} other students in this section.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[...Array(Math.min(course?.enrollments?.length || 0, 5))].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center text-gray-400">
                  <Users className="w-5 h-5" />
                </div>
              ))}
              {(course?.enrollments?.length || 0) > 5 && (
                <div className="w-12 h-12 rounded-2xl bg-[#4B2676] border-4 border-white shadow-sm flex items-center justify-center text-white text-xs font-black">
                  +{(course?.enrollments?.length || 0) - 5}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Comment Modal */}
      {showCommentModal && selectedAnnouncement && (
        <Modal 
          isOpen={true} 
          onClose={() => setShowCommentModal(false)} 
          title={`Discussion: ${selectedAnnouncement.title}`} 
          size="xl"
        >
          <div className="space-y-6 pt-4">
            <Textarea
              label="Join the Conversation"
              placeholder="What are your thoughts?"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="rounded-2xl"
            />
            <div className="flex gap-3">
              <Button onClick={onAddComment} className="bg-[#4B2676] text-white px-8 rounded-xl font-bold">
                Post Comment
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedAnnouncement(null);
                  setCommentContent('');
                }}
                className="px-8 rounded-xl font-bold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
