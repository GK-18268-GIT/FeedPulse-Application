import type { Request, Response } from "express";
import Feedback from "../models/Feedback.model.js";
import { analyzeFeedbackWithGemini } from "../services/gemini.service.js";

export async function createFeedback(req: Request, res: Response) {
    try {
        const { title, description, category, status, submitterName, submitterEmail } = req.body || {};

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Bad request",
                message: "Missing required fields"
            });
        }

        const feedback = await Feedback.create({ title, description, category, status, submitterName, submitterEmail });

        // AI analyze with Gemini
        analyzeFeedbackWithGemini(title, description)
            .then(async (geminiAI) => {
                await Feedback.findByIdAndUpdate(feedback._id, {
                    ai_category: geminiAI.category,
                    ai_sentiment: geminiAI.sentiment,
                    ai_priority: geminiAI.priority_score,
                    ai_summary: geminiAI.summary,
                    ai_tags: geminiAI.tags,
                    ai_processed: true,
                });
            })
            .catch(err => console.error('Gemini analysis failed:', err));

        res.status(201).json({
            success: true,
            data: feedback,
            error: null,
            message: 'Feedback submitted successfully'
        });

    } catch (error) {
        console.error('createFeedback failed:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Server error',
            message: 'Failed to create feedback'
        });
    }
}

export async function getAllFeedbacks(req: Request, res: Response) {
    try {
        const { category, status, page = 1, limit = 10, search, sort = '-createdAt' } = req.query;
        const query: any = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (search) query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { ai_summary: { $regex: search, $options: 'i' } }
        ];

        const total = await Feedback.countDocuments(query);
        const feedbacks = await Feedback.find(query)
            .sort(sort as string)
            .skip((+page - 1) * +limit)
            .limit(+limit);

        res.status(200).json({
            success: true,
            data: feedbacks,
            error: null,
            total,
            page: +page
        });

    } catch (error) {
        console.error('getAllFeedbacks failed:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Server error',
            message: 'Failed to fetch feedbacks'
        });
    }
}

export async function getFeedbackById(req: Request, res: Response) {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({
            success: false,
            data: null,
            error: 'Not found',
            message: 'Feedback not found'
        });

        res.status(200).json({
            success: true,
            data: feedback,
            error: null
        });

    } catch (error) {
        console.error('getFeedbackById failed:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Server error',
            message: 'Failed to fetch feedback'
        });
    }
}

export async function updateFeedbackById(req: Request, res: Response) {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!feedback) return res.status(404).json({
            success: false,
            data: null,
            error: 'Not found',
            message: 'Feedback not found'
        });

        res.status(200).json({
            success: true,
            data: feedback,
            error: null,
            message: 'Feedback updated successfully'
        });

    } catch (error) {
        console.error('updateFeedbackById failed:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Server error',
            message: 'Failed to update feedback'
        });
    }
}

export async function deleteFeedbackById(req: Request, res: Response) {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({
            success: false,
            data: null,
            error: 'Not found',
            message: 'Feedback not found'
        });

        res.status(200).json({
            success: true,
            data: null,
            error: null,
            message: 'Feedback deleted successfully'
        });

    } catch (error) {
        console.error('deleteFeedbackById failed:', error);
        res.status(500).json({
            success: false,
            data: null,
            error: 'Server error',
            message: 'Failed to delete feedback'
        });
    }
}