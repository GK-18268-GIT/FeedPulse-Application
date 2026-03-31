'use client'
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return(
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">FeedPulse</h1>
                <p className="text-gray-500 mb-10 text-lg">AI-Powered Product Feedback Platform</p>

                <div className="flex flex-col sm:flex-row gap-1 justify-center">
                    <button type="submit" onClick={() => router.push('/feedback')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">Submit Feedback</button>
                
                    <button type="submit" onClick={() => router.push('/admin')}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors cursor-pointer">Admin Login</button>
                </div>

            </div>
        </main>
    );

}