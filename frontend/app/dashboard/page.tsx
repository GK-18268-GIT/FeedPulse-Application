'use client'
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SENTIMENT_COLORS: Record<string, string> = {
    Positive: 'bg-green-100 text-green-700',
    Neutral: 'bg-yellow-100 text-yellow-700',
    Negative: 'bg-red-100 text-red-700'
};

interface IFeedback {
    _id: string;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    status: string;
    ai_summary?: string;
    ai_tags?: string[];
    ai_sentiment?: string;
    ai_priority?: number;
}

export default function Dashboard() {
    const [feedback, setFeedback] = useState<IFeedback[]>([]);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const tokenRef = useRef<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('token');
        if (!stored) {
            router.push('/admin');
            return;
        }

        tokenRef.current = stored;

        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (status) params.append("status", status);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback?${params}`, {
            headers: { Authorization: `Bearer ${stored}` },
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    router.push('/admin');
                    return;
                }
                setFeedback(data.data);
            })
            .catch(() => router.push('/admin'));

    }, [category, status, router]);

    const updateStatus = async (id: string, newStatus: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenRef.current}`
            },
            body: JSON.stringify({ status: newStatus }),
        });

        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (status) params.append("status", status);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback?${params}`, {
            headers: { Authorization: `Bearer ${tokenRef.current}` },
        });
        const data = await res.json();
        if (data.success) setFeedback(data.data);
    };



    return (
        <main className="max-w-5xl mx-auto p-6">
            <button type="submit" onClick={() => router.back()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold cursor-pointer">
                ← Back to Home
            </button>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="flex gap-3 mb-6">
                <select title="category" className="border rounded p-2" value={category}
                    onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {['Bug', 'Feature Request', 'Improvement', 'Other'].map(c => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
                <select title="status" className="border rounded p-2" value={status}
                    onChange={e => setStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    {['New', 'In Review', 'Resolved'].map(s => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {feedback.length === 0 && (
                    <p className="text-gray-500 text-sm">No feedback found.</p>
                )}
                {feedback.map((fb) => (
                    <div key={fb._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-semibold text-lg">{fb.title}</h2>
                                <p className="text-sm text-gray-600">{fb.description}</p>
                                <p className="text-sm text-gray-500">
                                    {fb.category} · {new Date(fb.createdAt).toLocaleDateString()}
                                </p>
                                {fb.ai_summary && (
                                    <p className="text-sm mt-1 text-gray-600">{fb.ai_summary}</p>
                                )}
                                {fb.ai_tags && (
                                    <div className="flex gap-1 flex-wrap mt-1">
                                        {fb.ai_tags.map((tag: string) => (
                                            <span key={tag} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {fb.ai_sentiment && (
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${SENTIMENT_COLORS[fb.ai_sentiment] || ''}`}>
                                        {fb.ai_sentiment}
                                    </span>
                                )}
                                {fb.ai_priority && (
                                    <span className="text-xs text-gray-500">Priority: {fb.ai_priority}/10</span>
                                )}
                                <select title="updateStatus" className="text-sm border rounded p-1"
                                    value={fb.status}
                                    onChange={e => updateStatus(fb._id, e.target.value)}>
                                    {['New', 'In Review', 'Resolved'].map(s => (
                                        <option key={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}