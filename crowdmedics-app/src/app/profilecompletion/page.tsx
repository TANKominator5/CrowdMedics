'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function ProfileCompletionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', qualification: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const upsertHelper = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/');
        return;
      }
    };
    upsertHelper();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/');
      return;
    }
    const user = session.user;
    const { error } = await supabase.from('helpers').upsert({
      id: user.id,
      email: user.email,
      name: form.name,
      phone: form.phone,
      qualification: form.qualification,
    });
    setLoading(false);
    if (!error) {
      alert('Profile saved successfully');
      router.push('/dashboard');
    } else {
      alert('Error saving profile. Please try again.');
    }
  };

  return (
    <div className="fullscreen-center bg-gradient-to-br from-[#43cea2] via-[#a18cd1] to-[#fbc2eb] animate-fadeIn relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center py-10 glass glow-border shadow-2xl">
        <div className="flex-1 flex justify-center">
          <span className="text-5xl font-extrabold gradient-text flex items-center gap-3 select-none drop-shadow-2xl animate-fadeIn">
            CrowdMedics <span className="text-5xl">🚑</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="absolute right-12 top-1/2 -translate-y-1/2 btn-animated bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-10 rounded-full text-lg shadow-xl glow-border"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 mt-48">
        <form onSubmit={handleSubmit} className="glass glow-border p-12 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col items-center border border-white/20 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-8 drop-shadow-2xl">Complete Your Profile</h1>
          <div className="w-full flex flex-col gap-6 mb-8">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <input
              type="text"
              name="qualification"
              placeholder="Qualification (e.g. CPR, Nurse, Doctor)"
              value={form.qualification}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-animated bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-4 px-16 rounded-full text-2xl shadow-xl glow-border disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
} 