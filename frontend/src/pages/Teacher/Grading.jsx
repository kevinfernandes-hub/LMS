import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, Button, Input, Textarea, Loading, Badge } from '../../components/ui.jsx';
import { ArrowLeft, CheckCircle, AlertCircle, User, Clock, FileText, ExternalLink, Send, MoreHorizontal, GraduationCap, Edit } from 'lucide-react';
import { assignmentsAPI } from '../../api/client.js';
import { motion, AnimatePresence } from 'framer-motion';

const gradeSchema = z.object({
  grade: z.string().transform(Number).refine(v => v >= 0, 'Grade must be 0 or higher'),
  feedback: z.string().optional().default(''),
});

export default function TeacherGrading() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [submittingGrade, setSubmittingGrade] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(gradeSchema),
  });

  useEffect(() => {
    fetchGradingData();
  }, [assignmentId]);

  const fetchGradingData = async () => {
    setIsLoading(true);
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        assignmentsAPI.get(assignmentId),
        assignmentsAPI.getSubmissions(assignmentId),
      ]);

      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      toast.error('Failed to load submissions');
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const onGradeSubmission = async (data) => {
    if (!gradingId) return;
    setSubmittingGrade(gradingId);

    try {
      const submission = submissions.find(s => s.id === gradingId);
      await assignmentsAPI.grade(submission.id, data);
      toast.success('Submission graded!');
      await fetchGradingData();
      setGradingId(null);
      reset();
    } catch (error) {
      toast.error('Failed to grade submission');
    }  finally {
      setSubmittingGrade(null);
    }
  };

  if (isLoading) return <Loading />;

  const ungradedCount = submissions.filter(s => s.grade === null).length;
  const gradedCount = submissions.length - ungradedCount;

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#4B2676]"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Course
        </Button>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#4B2676] p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
              Evaluation Terminal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Reviewing: <span className="text-indigo-200">{assignment?.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {assignment?.points} Points</span>
              <span>•</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Due {new Date(assignment?.due_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Card glass className="p-6 rounded-3xl border-white/10 flex flex-col items-center justify-center min-w-[120px]">
              <p className="text-3xl font-black">{submissions.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total</p>
            </Card>
            <Card glass className="p-6 rounded-3xl border-white/10 flex flex-col items-center justify-center min-w-[120px]">
              <p className="text-3xl font-black text-emerald-300">{gradedCount}</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Graded</p>
            </Card>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Submissions Feed */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#4B2676]" />
          Student Submissions
        </h2>

        {submissions.length === 0 ? (
          <Card glass className="text-center py-24 rounded-[3rem] border-gray-100">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-[#4B2676] opacity-30" />
            </div>
            <h3 className="text-xl font-black text-[#1E1B4B]">No submissions detected</h3>
            <p className="text-gray-500 font-medium">Once students submit their work, it will appear here for evaluation.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card glass className="p-8 rounded-[2.5rem] border-gray-100 shadow-xl overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4B2676] group-hover:bg-[#4B2676] group-hover:text-white transition-colors duration-300">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1E1B4B]">{submission.student_name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{submission.student_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      {submission.grade !== null ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 rounded-xl flex items-center gap-2 font-black text-sm">
                          <CheckCircle className="w-4 h-4" />
                          {submission.grade} / {assignment?.points}
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-600 border-none px-4 py-2 rounded-xl flex items-center gap-2 font-black text-sm">
                          <Clock className="w-4 h-4" />
                          Pending Evaluation
                        </Badge>
                      )}
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">
                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Content Panel */}
                  <div className="space-y-6">
                    <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Submission Material</p>
                      <p className="text-[#1E1B4B] font-medium leading-relaxed whitespace-pre-wrap mb-6">
                        {submission.submission_text || "(No written response provided)"}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        {submission.file_url && (
                          <a href={submission.file_url} target="_blank" rel="noreferrer" 
                             className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-[#4B2676] hover:bg-indigo-50 transition-all">
                            <FileText className="w-4 h-4" /> View Attachment
                          </a>
                        )}
                        {(submission.drive_link || submission.link_url) && (
                          <a href={submission.drive_link || submission.link_url} target="_blank" rel="noreferrer"
                             className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-[#4B2676] hover:bg-indigo-50 transition-all">
                            <ExternalLink className="w-4 h-4" /> Open External Link
                          </a>
                        )}
                      </div>
                    </div>

                    {submission.feedback && gradingId !== submission.id && (
                      <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                        <p className="text-[10px] font-black text-[#4B2676] uppercase tracking-[0.2em] mb-2">Previous Feedback</p>
                        <p className="text-[#4B2676] font-bold text-sm leading-relaxed italic">"{submission.feedback}"</p>
                      </div>
                    )}

                    {/* Grading Interface */}
                    <AnimatePresence>
                      {gradingId === submission.id ? (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleSubmit(onGradeSubmission)}
                          className="bg-[#4B2676]/5 p-8 rounded-3xl border border-[#4B2676]/10 space-y-6 animate-in zoom-in-95"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                              <label className="block text-[10px] font-black text-[#4B2676] uppercase tracking-[0.2em] mb-2 px-1">Score</label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max={assignment?.points}
                                  placeholder="0.0"
                                  {...register('grade')}
                                  className="w-full h-14 bg-white border border-[#4B2676]/10 rounded-2xl px-4 font-black text-xl text-[#4B2676] outline-none focus:ring-2 focus:ring-[#4B2676] transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">/ {assignment?.points}</span>
                              </div>
                              {errors.grade && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{errors.grade.message}</p>}
                            </div>
                            <div className="md:col-span-3">
                              <label className="block text-[10px] font-black text-[#4B2676] uppercase tracking-[0.2em] mb-2 px-1">Evaluation Feedback</label>
                              <textarea
                                placeholder="Refine your feedback..."
                                {...register('feedback')}
                                className="w-full h-14 bg-white border border-[#4B2676]/10 rounded-2xl px-4 py-4 font-medium text-sm text-[#1E1B4B] outline-none focus:ring-2 focus:ring-[#4B2676] transition-all min-h-[120px]"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-4 pt-4">
                            <Button
                              type="submit"
                              disabled={submittingGrade}
                              className="flex-1 h-14 rounded-2xl bg-[#4B2676] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              {submittingGrade ? 'Committing...' : 'Commit Grade'}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => { setGradingId(null); reset(); }}
                              className="px-8 h-14 rounded-2xl bg-white border border-gray-100 text-gray-400 font-bold text-sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.form>
                      ) : (
                        <Button
                          variant={submission.grade !== null ? 'secondary' : 'primary'}
                          onClick={() => {
                            setGradingId(submission.id);
                            if (submission.grade !== null) {
                              reset({ grade: submission.grade, feedback: submission.feedback });
                            }
                          }}
                          className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            submission.grade !== null 
                              ? 'bg-gray-50 text-[#1E1B4B] hover:bg-indigo-50 border border-gray-100' 
                              : 'bg-[#4B2676] text-white shadow-xl shadow-indigo-100 hover:scale-[1.02]'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          {submission.grade !== null ? 'Adjust Evaluation' : 'Evaluate Submission'}
                        </Button>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
