// src/app/profile-setup/page.tsx (or your file path)
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function ProfileCompletionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    qualification: '',
    govRegistrationNumber: '',
    govRegistrationType: '',
    govRegistrationDocument: '', // This holds the URL
    govEmployer: '',
    govIdCardNumber: '',
    servableRegion: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      // Check if user is already a medic
      const { data: helpers, error } = await supabase
        .from('helpers')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);
      if (helpers && helpers.length > 0) {
        // User is already a medic, redirect to dashboard
        router.push('/dashboard');
        return;
      }
      setIsCheckingUser(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // --- THIS IS THE CORRECTED SUBMIT FUNCTION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Session expired. Please log in again.");
        router.push('/login');
        return;
    }

    setLoading(true);

    const { error } = await supabase.from('helpers').insert({
      // The keys here MUST match your database column names
      // Removed id field - let database auto-generate it
      user_id: user.id, // Store the auth user ID in a separate field
      email: user.email,
      name: form.name,
      phone: form.phone,
      qualification: form.qualification,
      gov_registration_type: form.govRegistrationType,
      gov_registration_number: form.govRegistrationNumber,
      gov_id_card_number: form.govIdCardNumber,
      gov_registration_document_url: form.govRegistrationDocument,
      servable_region: form.servableRegion,
      latitude: parseFloat(form.latitude) || 0, // Convert to number, with a fallback
      longitude: parseFloat(form.longitude) || 0, // Convert to number, with a fallback
      verified: null, // Set as null initially for pending status
    });

    setLoading(false);

    if (error) {
      console.error('Database error:', error);
      alert(`Error saving profile: ${error.message}`);
    } else {
      // Notify admin for verification (simulate with fetch to /api/notify-admin)
      try {
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, email: user.email })
        });
      } catch (notifyError) {
        // Optionally handle notification error
        console.warn('Failed to notify admin:', notifyError);
      }
      alert('Profile saved successfully! You will now be taken to your dashboard.');
      router.push('/dashboard'); // Redirect to the dashboard
    }
  };

  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev: typeof form) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        alert('Location captured!');
      },
      () => alert('Unable to retrieve your location. Please enable location services.')
    );
  };
  
  if (isCheckingUser) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  // --- Your JSX form is already good, no changes needed there ---
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
        <form
          onSubmit={handleSubmit}
          className="glass glow-border p-12 rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col items-center border border-white/20 animate-fadeIn"
        >
          {/* Your form JSX is fine, keep it as is. The logic in handleSubmit is what matters. */}
           <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-8 drop-shadow-2xl">
            Complete Your Profile
          </h1>
          <p className="mb-8 text-lg text-center text-white/90">
            Please provide your government medical registration details. This information is required to verify that you are a registered government medical professional.
          </p>
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
              placeholder="Qualification (e.g. Registered Nurse, MBBS, Paramedic)"
              value={form.qualification}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <select
              name="govRegistrationType"
              value={form.govRegistrationType}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            >
              <option value="">Select Government Registration Type</option>
              <option value="Medical Council">Medical Council</option>
              <option value="Nursing Council">Nursing Council</option>
              <option value="Paramedic Council">Paramedic Council</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="govRegistrationNumber"
              placeholder="Government Registration Number"
              value={form.govRegistrationNumber}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <input
              type="text"
              name="govEmployer"
              placeholder="Government Employer / Hospital / Department"
              value={form.govEmployer}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <input
              type="text"
              name="govIdCardNumber"
              placeholder="Government ID Card Number"
              value={form.govIdCardNumber}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <textarea
              name="servableRegion"
              placeholder="Servable Region (e.g. City, District, or Area you can serve)"
              value={form.servableRegion}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-green-400 shadow resize-none"
              rows={2}
            />
            <div className="w-full">
              <label className="block mb-2 text-lg font-semibold text-white/90">
                Google Drive Link to Government Registration Document
              </label>
              <input
                type="url"
                name="govRegistrationDocument"
                placeholder="Paste Google Drive link to your document"
                value={form.govRegistrationDocument}
                onChange={handleChange}
                required
                className="w-full px-6 py-3 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
              />
              <p className="text-white/80 text-sm mt-2">
                Please upload your document to Google Drive (PDF, JPG, PNG), set sharing to "Anyone with the link can view", and paste the link above.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutofillLocation}
              className="mb-4 px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold"
            >
              Autofill My Location
            </button>
            <input
              type="text"
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-xl bg-white/80 text-lg text-gray-900 font-semibold border-none outline-none focus:ring-2 focus:ring-blue-400 shadow"
            />
            <input
              type="text"
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
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