import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsAPI } from '../api/client.js';
import { useToast } from './useToast.js';

/**
 * Fetch all assignments for a course
 */
export const useAssignments = (courseId) => {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: async () => {
      const response = await assignmentsAPI.list(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};

/**
 * Create a new assignment
 */
export const useCreateAssignment = (courseId) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (assignment) => {
      const response = await assignmentsAPI.create(courseId, assignment);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the assignments query to refetch
      queryClient.invalidateQueries({
        queryKey: ['assignments', courseId],
      });
      toast.success('Assignment created!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Failed to create assignment';
      toast.error(message);
    },
  });
};

/**
 * Delete an assignment
 */
export const useDeleteAssignment = (courseId) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (assignmentId) => {
      await assignmentsAPI.delete(assignmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignments', courseId],
      });
      toast.success('Assignment deleted');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete assignment';
      toast.error(message);
    },
  });
};

/**
 * Submit an assignment (for students)
 */
export const useSubmitAssignment = (assignmentId) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (submission) => {
      const response = await assignmentsAPI.submit(assignmentId, submission);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['submissions', assignmentId],
      });
      toast.success('Assignment submitted!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit assignment';
      toast.error(message);
    },
  });
};

/**
 * Update an assignment (for teachers)
 */
export const useUpdateAssignment = (assignmentId) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (updates) => {
      const response = await assignmentsAPI.update(assignmentId, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignments'],
      });
      toast.success('Assignment updated');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update assignment';
      toast.error(message);
    },
  });
};
