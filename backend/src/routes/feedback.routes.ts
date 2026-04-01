import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
    createFeedback, 
    getAllFeedbacks, 
    getFeedbackById, 
    updateFeedbackById, 
    deleteFeedbackById 
} from '../controllers/feedback.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const feedbackRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        data: null,
        error: "Too many requests",
        message: "You have exceeded the 5 submissions per hour limit. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const feedbackRouter = Router();

feedbackRouter.post('/', feedbackRateLimiter, createFeedback);
feedbackRouter.get('/', authMiddleware, getAllFeedbacks);
feedbackRouter.get('/:id', authMiddleware, getFeedbackById);
feedbackRouter.patch('/:id', authMiddleware, updateFeedbackById);
feedbackRouter.delete('/:id', authMiddleware, deleteFeedbackById);

export default feedbackRouter;