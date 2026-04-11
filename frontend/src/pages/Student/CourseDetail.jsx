import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, Button, Input, Textarea, Modal, Loading } from '../../components/ui.jsx';
import { 
  ArrowLeft, Download, FileText, MessageSquare, CheckCircle, 
  AlertCircle, Clock, BookOpen, Users 
} from 'lucide-react';
import { coursesAPI, assignmentsAPI, announcementsAPI, materialsAPI } from '../../api/client.js';
import confetti from 'canvas-confetti';

const submitSchema = z.object({
  submissionText: z.string().optional().default(''),
});

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments'); // assignments, materials, announcements, people
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissions, setSubmissions] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  const { register: registerSubmission, handleSubmit: handleSubmitAssignment, reset: resetSubmission } = useForm({
    resolver: zodResolver(submitSchema),
  });

  const { register: registerComment, handleSubmit: handleSubmitComment, reset: resetComment } = useForm({
    resolver: zodResolver(commentSchema),
  });

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

      // Fetch student submissions
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

  const onSubmitAssignment = async (data) => {
    if (!selectedAssignment) return;
    setSubmittingId(selectedAssignment.id);

    try {
      const formData = new FormData();
      formData.append('submissionText', data.submissionText || '');

      await assignmentsAPI.submit(selectedAssignment.id, data);
      toast.success('Assignment submitted successfully!');

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      await fetchCourseData();
      setShowSubmitModal(false);
      resetSubmission();
      setSelectedAssignment(null);
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setSubmittingId(null);
    }
  };

  const onAddComment = async (data) => {
    if (!selectedAnnouncement) return;

    try {
      await announcementsAPI.addComment(selectedAnnouncement.id, data);
      toast.success('Comment added!');
      await fetchCourseData();
      resetComment();
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
      return { status: 'graded', color: 'text-green-600', icon: CheckCircle };
    } else if (submission) {
      return { status: 'submitted', color: 'text-blue-600', icon: CheckCircle };
    } else if (isOverdue) {
      return { status: 'overdue', color: 'text-red-600', icon: AlertCircle };
    } else {
      return { status: 'pending', color: 'text-yellow-600', icon: Clock };
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </Button>

      {/* Course Header */}
      {course && (
        <div
          className="rounded-xl p-8 text-white mb-8"
          style={{ backgroundColor: course.cover_color }}
        >
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg opacity-90">
            {course.subject && `${course.subject} • `}Section {course.section}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {[
          { tab: 'assignments', label: 'Assignments' },
          { tab: 'materials', label: 'Materials' },
          { tab: 'announcements', label: 'Announcements' },
          { tab: 'people', label: 'People' },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === item.tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No assignments yet</p>
            </Card>
          ) : (
            assignments.map((assignment) => {
              const statusInfo = getAssignmentStatus(assignment);
              const StatusIcon = statusInfo.icon;
              const submission = submissions[assignment.id];
              const dueDate = new Date(assignment.due_date).toLocaleDateString();

              return (
                <Card key={assignment.id} className="p-6">
                  <div className="flex gap-6">
                    <div className={`${statusInfo.color}`}>
                      <StatusIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {assignment.title}
                        </h3>
                        <span className="text-sm font-semibold text-gray-600">
                          {assignment.points} pts
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {assignment.instructions}
                      </p>
                      <div className="flex gap-4 items-center text-sm text-gray-600 mb-4">
                        <span>Due: {dueDate}</span>
                        {submission && submission.grade !== null && (
                          <span className="text-green-600 font-semibold">
                            Grade: {submission.grade}/{assignment.points}
                          </span>
                        )}
                      </div>
                      {submission && submission.feedback && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Teacher Feedback:
                          </p>
                          <p className="text-sm text-blue-800">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                      <Button
                        variant={submission ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                      >
                        {submission ? 'Resubmit' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {materials.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No materials yet</p>
            </Card>
          ) : (
            materials.map((material) => (
              <Card key={material.id} className="p-6 flex items-start gap-4">
                <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{material.title}</h3>
                  {material.description && (
                    <p className="text-sm text-gray-600 mb-3">{material.description}</p>
                  )}
                  {material.link_url && (
                    <a
                      href={material.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Open Material
                    </a>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <Card className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No announcements yet</p>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {announcement.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{announcement.content}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedAnnouncement(announcement);
                    setShowCommentModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Comment
                </Button>
              </Card>
            ))
          )}
        </div>
      )}

      {/* People Tab */}
      {activeTab === 'people' && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-bold">Classmates</h3>
          </div>
          <p className="text-gray-600">
            {course?.enrollments?.length || 0} students enrolled in this class
          </p>
        </Card>
      )}

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <Modal className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Submit: {selectedAssignment.title}
            </h2>
            <p className="text-sm text-gray-600">
              Due: {new Date(selectedAssignment.due_date).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmitAssignment(onSubmitAssignment)} className="space-y-6">
            <Textarea
              label="Your Answer"
              placeholder="Enter your response here..."
              {...registerSubmission('submissionText')}
            />

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={submittingId}>
                {submittingId ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedAssignment(null);
                  resetSubmission();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Comment Modal */}
      {showCommentModal && selectedAnnouncement && (
        <Modal className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Comment on: {selectedAnnouncement.title}
            </h2>
          </div>

          <form onSubmit={handleSubmitComment(onAddComment)} className="space-y-6">
            <Textarea
              label="Your Comment"
              placeholder="Share your thoughts..."
              {...registerComment('content')}
            />

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Post Comment
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedAnnouncement(null);
                  resetComment();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
