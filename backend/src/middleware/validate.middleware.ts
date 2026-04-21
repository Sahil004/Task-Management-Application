import { body, ValidationChain } from 'express-validator';

import { taskPriorities, taskStatuses } from '../models/task.model';

export const validateRegister: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateLogin: ValidationChain[] = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateTask: ValidationChain[] = [
  body('title')
    .if((_, { req }) => req.method === 'POST' || req.body.title !== undefined)
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn([...taskPriorities])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn([...taskStatuses])
    .withMessage('Invalid status'),
  body('dueDate')
    .optional({ nullable: true, values: 'falsy' })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('position').optional().isNumeric().withMessage('Position must be a number'),
];

export const validateReorderTasks: ValidationChain[] = [
  body('tasks').isArray({ min: 1 }).withMessage('tasks must be a non-empty array'),
  body('tasks.*.id').isString().withMessage('Each task must include an id'),
  body('tasks.*.status')
    .isIn([...taskStatuses])
    .withMessage('Each task must include a valid status'),
  body('tasks.*.position')
    .isNumeric()
    .withMessage('Each task must include a numeric position'),
];
