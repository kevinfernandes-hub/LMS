import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Loading, Textarea, Input } from '../../components/ui.jsx';
import { assignmentsAPI } from '../../api/client.js';

const submitSchema = z.object({
  submissionText: z.string().optional().default(''),
  file: z.any().optional(),
});

export default function StudentAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(submitSchema),
  });

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const aRes = await assignmentsAPI.get(assignmentId);
        setAssignment(aRes.data);

        try {
          const sRes = await assignmentsAPI.getStudentSubmission(assignmentId);
          setSubmission(sRes.data);
          reset({ submissionText: sRes.data?.submission_text || '' });
        } catch {
          setSubmission(null);
          reset({ submissionText: '' });
        }
      } catch {
        toast.error('Failed to load assignment');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) run();
  }, [assignmentId, navigate, reset]);

  const onSubmit = async (data) => {
    if (!assignmentId) return;
    setIsSubmitting(true);
    try {
      const file = data.file?.[0];
      await assignmentsAPI.submit(assignmentId, {
        submissionText: data.submissionText,
        file,
      });
      toast.success('Submitted successfully');
      const sRes = await assignmentsAPI.getStudentSubmission(assignmentId);
      setSubmission(sRes.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  const dueDate = assignment?.due_date ? new Date(assignment.due_date) : null;
  const dueDateText = dueDate && !Number.isNaN(dueDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(dueDate)
    : 'No due date';

  const isGraded = submission?.grade !== null && submission?.grade !== undefined;
  const points = assignment?.points || 100;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{assignment?.title}</h1>
        <p className="text-gray-600">Due: {dueDateText}</p>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{assignment?.instructions || 'No instructions provided.'}</p>
        {assignment?.attachment_url && (
          <a
            href={assignment.attachment_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-indigo-600 hover:underline"
          >
            Download attachment
          </a>
        )}
        <p className="text-sm text-gray-600">Points: {points}</p>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Submission</h2>
          {submission ? (
            <span className="inline-flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" /> Submitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" /> Not submitted
            </span>
          )}
        </div>

        {isGraded && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Grade:</span> {submission.grade} / {points}
            </p>
            {submission.feedback && (
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                <span className="font-medium">Feedback:</span> {submission.feedback}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            label="Submission Text"
            rows="5"
            placeholder="Write your submission here..."
            {...register('submissionText')}
            error={errors.submissionText?.message}
          />

          <Input
            label="File (optional)"
            type="file"
            {...register('file')}
            error={errors.file?.message}
          />

          <Button type="submit" variant="primary" disabled={isSubmitting} className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
