import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Archive,
  Undo2,
  MessageSquare,
  Clock,
  Award,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { toast } from 'sonner';

import { Card, Button, Input, Textarea, Modal, Badge, Loading } from '../ui.jsx';
import { assignmentsAPI, coursesAPI } from '../../api/client.js';
import { useMySubmission, useSubmitAssignment, useUnsubmitAssignment } from '../../hooks/useAssignments.js';

const isValidDriveLink = (value) => {
  const v = (value || '').trim();
  if (!v) return false;
  try {
    const url = new URL(v);
    const host = (url.hostname || '').toLowerCase();
    return host === 'drive.google.com' || host.endsWith('.drive.google.com');
  } catch {
    return false;
  }
};

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = unitIndex === 0 ? String(Math.round(value)) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
};

const fileIconFor = (file) => {
  const type = file?.type || '';
  const name = file?.name || '';
  const ext = name.split('.').pop()?.toLowerCase();
  if (type === 'application/pdf' || ext === 'pdf') return FileText;
  if (type.includes('word') || ext === 'doc' || ext === 'docx') return FileText;
  if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return ImageIcon;
  if (type === 'application/zip' || ext === 'zip') return Archive;
  return FileText;
};

export default function StudentAssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const submissionQuery = useMySubmission(assignmentId);
  const submission = submissionQuery.data;

  const [selectedFile, setSelectedFile] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [textComment, setTextComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const [turnInConfirmOpen, setTurnInConfirmOpen] = useState(false);
  const [unsubmitConfirmOpen, setUnsubmitConfirmOpen] = useState(false);

  const fileInputRef = useRef(null);

  const submitMutation = useSubmitAssignment(assignmentId, assignment?.course_id);
  const unsubmitMutation = useUnsubmitAssignment(assignmentId, assignment?.course_id);

  const graded = submission?.grade !== null && submission?.grade !== undefined;
  const submitted = submission?.status === 'submitted';
  const draft = submission?.status === 'draft';

  const dueDate = assignment?.due_date ? new Date(assignment.due_date) : null;
  const isMissing = !graded && !submitted && dueDate && !Number.isNaN(dueDate.getTime()) && new Date() > dueDate;

  const driveValid = isValidDriveLink(driveLink);
  const driveInvalid = !!driveLink.trim() && !driveValid;
  const canTurnIn = !graded && (selectedFile || driveValid);

  useEffect(() => {
    const run = async () => {
      if (!assignmentId) return;
      setIsLoading(true);
      try {
        const aRes = await assignmentsAPI.get(assignmentId);
        setAssignment(aRes.data);
        try {
          const cRes = await coursesAPI.get(aRes.data.course_id);
          setCourse(cRes.data);
        } catch {
          setCourse(null);
        }
      } catch {
        toast.error('Failed to load assignment');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [assignmentId, navigate]);

  useEffect(() => {
    if (graded || submitted) return;
    if (!submission) return;
    const existingDrive = submission.drive_link || submission.link_url || '';
    const existingComment = submission.text_comment || submission.submission_text || '';
    setDriveLink(existingDrive);
    setTextComment(existingComment);
    setShowComment(!!existingComment);
  }, [submission, graded, submitted]);

  const handleFileSelected = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleTurnIn = async () => {
    if (!assignmentId) return;
    if (!canTurnIn) return;
    const formData = new FormData();
    if (selectedFile) formData.append('file', selectedFile);
    if (driveValid) formData.append('drive_link', driveLink.trim());
    if (textComment.trim()) formData.append('text_comment', textComment.trim());
    try {
      await submitMutation.mutateAsync(formData);
      setTurnInConfirmOpen(false);
      setSelectedFile(null);
    } catch (err) {}
  };

  const handleUnsubmit = async () => {
    if (!assignmentId) return;
    try {
      await unsubmitMutation.mutateAsync();
      setUnsubmitConfirmOpen(false);
    } catch {}
  };

  if (isLoading) return <Loading />;

  const dueText = dueDate && !Number.isNaN(dueDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(dueDate)
    : 'No due date';

  const teacherName = course?.first_name ? `${course.first_name} ${course.last_name || ''}`.trim() : null;
  const ExistingFileIcon = submission?.file_name ? fileIconFor({ name: submission.file_name, type: submission.file_type }) : FileText;
  const SelectedFileIcon = selectedFile ? fileIconFor(selectedFile) : FileText;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676]">
        <ArrowLeft className="w-5 h-5" /> Back to Course
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card glass className="p-8 md:p-10 rounded-[2.5rem] border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="space-y-4">
                <Badge className="bg-[#4B2676] text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                  {course?.title || 'Course Assignment'}
                </Badge>
                <h1 className="text-4xl font-black text-[#1E1B4B] tracking-tight">{assignment?.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Due {dueText}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> {assignment?.points} Points</span>
                </div>
              </div>

              {graded && (
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-[2rem] bg-emerald-50 text-emerald-700 border-2 border-white shadow-xl shadow-emerald-100">
                  <span className="text-3xl font-black">{submission.grade}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Score</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                <h3 className="text-xs font-black text-[#4B2676] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Instructions
                </h3>
                <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {assignment?.instructions || "No specific instructions provided for this assignment."}
                </p>
              </div>

              {assignment?.attachment_url && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-indigo-50 bg-white">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4B2676] flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1E1B4B] truncate">Assignment Materials</p>
                    <a href={assignment.attachment_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#4B2676] hover:underline">
                      Download Reference File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {graded && submission.feedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card glass className="p-8 rounded-[2.5rem] bg-emerald-50/30 border-emerald-100">
                <h3 className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Instructor Feedback
                </h3>
                <p className="text-emerald-900 font-medium leading-relaxed italic">
                  "{submission.feedback}"
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar: Submission */}
        <div className="lg:col-span-2 space-y-6">
          <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl">
            <h2 className="text-xl font-black text-[#1E1B4B] mb-6 flex items-center justify-between">
              Your Work
              {submitted && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Turned In</Badge>}
              {isMissing && <Badge className="bg-rose-50 text-rose-700 border-rose-100">Missing</Badge>}
            </h2>

            {submitted && !graded ? (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700 font-black text-sm uppercase tracking-widest">
                    <CheckCircle className="w-5 h-5" /> All caught up!
                  </div>
                  <p className="text-xs text-emerald-600 font-medium">
                    Submitted on {new Date(submission.submitted_at).toLocaleDateString()} at {new Date(submission.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="space-y-3">
                  {submission.file_url && (
                    <a href={submission.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 group hover:border-[#4B2676]/20 transition-all">
                      <div className="flex items-center gap-3">
                        <ExistingFileIcon className="w-5 h-5 text-[#4B2676]" />
                        <span className="text-sm font-bold text-[#1E1B4B] truncate max-w-[150px]">{submission.file_name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#4B2676]" />
                    </a>
                  )}
                  {submission.drive_link && (
                    <a href={submission.drive_link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 group hover:border-[#4B2676]/20 transition-all">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5 text-[#4B2676]" />
                        <span className="text-sm font-bold text-[#1E1B4B]">Google Drive Link</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#4B2676]" />
                    </a>
                  )}
                </div>

                <Button variant="secondary" onClick={() => setUnsubmitConfirmOpen(true)} className="w-full py-4 rounded-xl font-bold text-[#4B2676] border-2 border-indigo-50 hover:bg-indigo-50">
                  <Undo2 className="w-4 h-4 mr-2" /> Unsubmit Assignment
                </Button>
              </div>
            ) : graded ? (
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                <p className="text-sm font-bold text-[#4B2676]">This assignment has been graded and is now locked for editing.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileSelected(e.dataTransfer.files?.[0]); }}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${isDragOver ? 'border-[#4B2676] bg-indigo-50/50 scale-[0.98]' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}
                >
                  <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${isDragOver ? 'text-[#4B2676]' : 'text-gray-300'}`} />
                  <p className="text-sm font-bold text-[#1E1B4B]">Drag your file here</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">or click to browse your computer</p>
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl font-bold bg-white border-gray-200">
                    Choose File
                  </Button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileSelected(e.target.files?.[0])} />
                </div>

                <AnimatePresence>
                  {selectedFile && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <SelectedFileIcon className="w-5 h-5 text-[#4B2676]" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1E1B4B] truncate">{selectedFile.name}</p>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{formatBytes(selectedFile.size)}</p>
                        </div>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <hr className="flex-1 border-gray-100" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Link</span>
                    <hr className="flex-1 border-gray-100" />
                  </div>
                  <Input
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="Paste Drive link here..."
                    icon={LinkIcon}
                    className="rounded-xl border-gray-100"
                    error={driveInvalid ? 'Please enter a valid Google Drive URL' : undefined}
                  />
                </div>

                <div className="space-y-3">
                  <button onClick={() => setShowComment(!showComment)} className="text-xs font-black text-[#4B2676] uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <MessageSquare className="w-3.5 h-3.5" /> {showComment ? 'Hide Comment' : 'Add private comment'}
                  </button>
                  <AnimatePresence>
                    {showComment && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <Textarea rows="3" placeholder="Write a note to your teacher..." value={textComment} onChange={(e) => setTextComment(e.target.value)} className="rounded-xl text-sm" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-5 rounded-[1.5rem] font-black bg-[#4B2676] text-white shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-[1.02]"
                  disabled={!canTurnIn || submitMutation.isPending}
                  onClick={() => setTurnInConfirmOpen(true)}
                >
                  <Upload className="w-5 h-5 mr-2" /> Turn In Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={turnInConfirmOpen} onClose={() => setTurnInConfirmOpen(false)} title="Submit Assignment?">
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            Ready to submit your work for <span className="font-black text-[#1E1B4B]">{assignment?.title}</span>? 
            {teacherName && ` Your instructor Prof. ${teacherName} will be notified.`}
          </p>
          <div className="flex gap-3">
            <Button onClick={handleTurnIn} className="flex-1 bg-[#4B2676] text-white py-3 rounded-xl font-bold">Turn In</Button>
            <Button variant="secondary" onClick={() => setTurnInConfirmOpen(false)} className="flex-1 py-3 rounded-xl font-bold">Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={unsubmitConfirmOpen} onClose={() => setUnsubmitConfirmOpen(false)} title="Unsubmit Work?">
        <div className="space-y-4 pt-4">
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            Unsubmitting will allow you to make changes to your work. Don't forget to resubmit before the deadline!
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleUnsubmit} className="flex-1 py-3 rounded-xl font-bold">Unsubmit</Button>
            <Button variant="secondary" onClick={() => setUnsubmitConfirmOpen(false)} className="flex-1 py-3 rounded-xl font-bold">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
