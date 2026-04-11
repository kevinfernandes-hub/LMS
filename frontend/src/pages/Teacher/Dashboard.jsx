import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses, useCreateCourse } from '../../hooks/index.js';
import { Button, Card, Input, Textarea, Loading } from '../../components/ui.jsx';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  section: z.string().optional().default(''),
  subject: z.string().optional().default(''),
  description: z.string().optional().default(''),
  coverColor: z.string().regex(/^#/).optional().default('#4F46E5'),
});

const COLORS = ['#4F46E5', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useCourses();
  const { mutate: createCourse, isPending } = useCreateCourse();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(createCourseSchema),
    defaultValues: { coverColor: selectedColor },
  });

  const onSubmit = (data) => {
    createCourse({ ...data, coverColor: selectedColor }, {
      onSuccess: () => {
        toast.success('Course created successfully!');
        reset();
        setShowCreateModal(false);
        setSelectedColor('#4F46E5');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create course');
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Class
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/teacher/course/${course.id}`)}
            className="cursor-pointer group"
          >
            <Card className="h-48 flex flex-col justify-between p-6 transform transition-transform duration-200 group-hover:shadow-lg group-hover:-translate-y-1"
              style={{ borderTopColor: course.cover_color, borderTopWidth: '4px' }}>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.subject || 'No subject'}</p>
              </div>
              <p className="text-xs text-gray-500">Section: {course.section || 'N/A'}</p>
            </Card>
          </div>
        ))}
      </div>

      {courses?.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any classes yet</p>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Class
          </Button>
        </Card>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Class Name"
                placeholder="e.g., Web Development"
                {...register('title')}
                error={errors.title?.message}
              />
              <Input
                label="Subject"
                placeholder="e.g., Computer Science"
                {...register('subject')}
                error={errors.subject?.message}
              />
              <Input
                label="Section"
                placeholder="e.g., A"
                {...register('section')}
                error={errors.section?.message}
              />
              <Textarea
                label="Description"
                placeholder="Describe your class..."
                rows="3"
                {...register('description')}
                error={errors.description?.message}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Cover Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-full h-10 rounded-lg transition-all ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isPending}
                >
                  {isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                    setSelectedColor('#4F46E5');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
