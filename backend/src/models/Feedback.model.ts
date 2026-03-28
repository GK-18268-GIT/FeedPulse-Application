import mongoose, { Document, Schema} from "mongoose";

export interface IFeedback extends Document {
    //Feedback fields
    title: string;
    description: string;
    category: 'Bug' | 'Feature Request' | 'Improvement' | 'Other';
    status: 'New' | 'In Review'| 'Resolve';
    submitterName?: string;
    submitterEmail?: string;

    //AI Fields
    ai_category?: string; 
    ai_sentiment?: string;  
    ai_priority?:  number;  
    ai_summary?: string; 
    ai_tags?: string;
    ai_processed?: boolean;
}

const FeedbackSchema = new Schema<IFeedback>({

    title: {
        type: String, required: true, maxLength: 100
    },

    description: {
        type: String, required: true, maxLength: 100
    },

    category: {
        type: String, enum: ['Bug', 'Feature Request', 'Improvement', 'Other'], required: true
    },

    status: {
        type: String, enum: ['New', 'In Review', 'Resolve'], default: 'New'
    },

    submitterName: {
        type: String
    },

    submitterEmail: {
        type: String, match: /^\S+@\S+\.\S+$/
    },

    ai_category: String,
    ai_sentiment: String,
    ai_priority:  Number, 
    ai_summary: String,
    ai_tags: [String],
    ai_processed: {type: Boolean, default: false},

}, { timestamps: true});

//Indexes for performance
FeedbackSchema.index({status: 1});
FeedbackSchema.index({category: 1});
FeedbackSchema.index({ai_priority: -1});
FeedbackSchema.index({createdAt: -1});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
