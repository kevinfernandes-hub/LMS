import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import * as coursesController from '../controllers/coursesController.js';

const router = Router();

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  section: z.string().optional().default(''),
  subject: z.string().optional().default(''),
  description: z.string().optional().default(''),
  coverColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().default('#4F46E5')
});

const enrollSchema = z.object({
  code: z.string().min(1, 'Invite code is required')
});

// Create course (teachers only)
router.post('/', authenticateToken, requireRole('teacher'), validate(createCourseSchema), coursesController.createCourse);

// Get all courses for user
router.get('/', authenticateToken, coursesController.listCourses);

// Get specific course
router.get('/:courseId', authenticateToken, coursesController.getCourse);

// Update course (teacher only)
router.put('/:courseId', authenticateToken, requireRole('teacher'), validate(createCourseSchema), coursesController.updateCourse);

// Delete course (teacher only)
router.delete('/:courseId', authenticateToken, requireRole('teacher'), coursesController.deleteCourse);

// Enroll by code
router.post('/enroll/code', authenticateToken, validate(enrollSchema), coursesController.enrollByCourt);

// Get enrollments for a course (teacher only)
router.get('/:courseId/enrollments', authenticateToken, requireRole('teacher'), coursesController.getEnrollments);

// Get invite code (teacher only)
router.get('/:courseId/invite-code', authenticateToken, requireRole('teacher'), coursesController.getInviteCode);

export default router;
