import { Router } from 'express';
import { 
    createFeedback, 
    getAllFeedbacks, 
    getFeedbackById, 
    updateFeedbackById, 
    deleteFeedbackById 
} from '../controllers/feedback.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const feedbackRouter = Router();

feedbackRouter.post('/', createFeedback);
feedbackRouter.get('/', authMiddleware, getAllFeedbacks);
feedbackRouter.get('/:id', authMiddleware, getFeedbackById);
feedbackRouter.patch('/:id', authMiddleware, updateFeedbackById);
feedbackRouter.delete('/:id', authMiddleware, deleteFeedbackById);

export default feedbackRouter;