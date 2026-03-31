'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('')
    const router = useRouter();

    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();
        if(data.success) {
            localStorage.setItem('token', data.data.token);
            router.push('/dashboard')
        } else {
            setError("Invalid Credentials")
        }

    };

    return(
        <main className="max-w-sm mx-auto mt-32 p-6 bg-white rounded-xl shadow-2xl">
            <h1 className="text-xl font-bold mb-4">Admin Login</h1>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-3">

                <input className="w-full border rounded p-2" type="email" placeholder="Enter your email"
                    value={email} onChange={e => setEmail(e.target.value)} />
                <input className="w-full border rounded p-2" type="password" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} />
                
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold cursor-pointer">Login</button>
                    <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded font-semibold cursor-pointer">Back to Home</button>
                </div>

            </form>
        </main>
    );

}

