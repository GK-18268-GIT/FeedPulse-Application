'use client'
import { useRouter } from 'next/navigation';
import { useState} from 'react';

export default function Home() {
  const [form, setForm] = useState({title: '', description: '', category: 'Bug', submitterName: '', submitterEmail: ''});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    if(!form.title.trim()) e.title = 'Title is required';
    if(form.description.length < 20) e.description = 'Description must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!validate()) return;

    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');
      setStatus('success');
      setForm({ title: '', description: '', category: 'Bug', submitterName: '', submitterEmail: '' });
    } catch {
      setStatus('error');
    }

  };

  return(
    <main className = "max-w-xl mx-auto mt-16 p-6 bg-white rounded-b-xl shadow-2xl">
      <button type='submit' onClick={() => router.back()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold cursor-pointer">
          ← Back to Home
      </button>
      <h1 className = "text-2xl font-bold mb-6">Feedback Form</h1>
      
      {status === 'success' && <div className='bg-green-100 text-green-700 p-3 rounded mb-4'>Thank you! Feedback submitted</div>}
      {status === 'error' && <div className='bg-red-100 text-red-700 p-3 rounded mb-4'>Something went wrong. Try again</div>}
      
      <form onSubmit = {handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium mb-1'>Title</label>
          <input id='title' title='Feedback Title' placeholder='Enter a brief title'
            className='w-full border rounded p-2' value={form.title} onChange={e => setForm({
            ...form,
            title: e.target.value 
          })}
          />
          {errors.title && <p className='text-red-500 text-xs mt-1'>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium mb-1'>Description</label>
          <textarea id='description' title='Feedback Description' placeholder='Provide detailed feedback (min. 20 characters)'
            className='w-full border rounded p-2 h-32' value={form.description} onChange={e => setForm({
            ...form,
            description: e.target.value
          })}
          />
        </div>

        <div>
          <label htmlFor='category' className="block text-sm font-medium mb-1">Category</label>
          <select id='category' title='Feedback Category' className="w-full border rounded p-2" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            {['Bug', 'Feature Request', 'Improvement', 'Other'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <input id='submitterName' title='submitterName' className='w-full border p-2' placeholder='Your name(Optional)'
        value={form.submitterName} onChange={e => setForm({
          ...form,
          submitterName: e.target.value
        })}
        />

        <input id='submitterEmail' title='submitterEmail' type='email' className='w-full border p-2' placeholder='Your email(Optional)'
        value={form.submitterEmail} onChange={e => setForm({
          ...form,
          submitterEmail: e.target.value
        })}
        />

        <button type='submit' className='w-full bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 cursor-pointer'>
          Submit Feedback
        </button>
      </form>
    </main>
  );

}
