'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      // Fetch medic profile from helpers table using user_id
      const { data, error } = await supabase
        .from('helpers')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl">Profile not found.</span>
      </div>
    );
  }

  // Determine badge and status
  const isVerified = profile.verified === true;
  const isRejected = profile.verified === false;
  const badge = isVerified
    ? <span className="ml-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Verified</span>
    : isRejected
      ? <span className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">Rejected</span>
      : <span className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded-full text-sm font-semibold">Pending</span>;
  const status = isVerified
    ? null
    : isRejected
      ? <div className="mt-2 text-red-700 font-medium">Status: Rejected. Please contact admin for more information or update your details.</div>
      : <div className="mt-2 text-yellow-700 font-medium">Status: Pending Approval</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-blue-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-white">
            {profile.name?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-1 flex items-center">{profile.name} {badge}</h1>
            <div className="text-lg text-gray-600">{profile.email}</div>
          </div>
        </div>
        {status}
        {!isVerified && !isRejected && (
          <div className="mt-2 mb-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-center text-sm font-medium shadow">Your profile is pending verification. You will be notified once an admin verifies your details.</div>
        )}
       {isRejected && (
         <div className="mt-2 mb-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg text-center text-sm font-medium shadow">Your profile has been rejected. Please contact admin or update your details for reconsideration.</div>
       )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-100 rounded-xl p-5 shadow flex flex-col gap-2 border border-blue-300">
            <div><span className="font-semibold text-gray-800">Phone:</span> <span className="text-gray-900">{profile.phone}</span></div>
            <div><span className="font-semibold text-gray-800">Qualification:</span> <span className="text-gray-900">{profile.qualification}</span></div>
            <div><span className="font-semibold text-gray-800">Gov. Registration Type:</span> <span className="text-gray-900">{profile.gov_registration_type}</span></div>
            <div><span className="font-semibold text-gray-800">Gov. Registration Number:</span> <span className="text-gray-900">{profile.gov_registration_number}</span></div>
            <div><span className="font-semibold text-gray-800">Gov. Employer:</span> <span className="text-gray-900">{profile.gov_employer}</span></div>
            <div><span className="font-semibold text-gray-800">Gov. ID Card Number:</span> <span className="text-gray-900">{profile.gov_id_card_number}</span></div>
          </div>
          <div className="bg-purple-100 rounded-xl p-5 shadow flex flex-col gap-2 border border-purple-300">
            <div><span className="font-semibold text-gray-800">Servable Region:</span> <span className="text-gray-900">{profile.servable_region}</span></div>
            <div><span className="font-semibold text-gray-800">Latitude:</span> <span className="text-gray-900">{profile.latitude}</span></div>
            <div><span className="font-semibold text-gray-800">Longitude:</span> <span className="text-gray-900">{profile.longitude}</span></div>
            <div><span className="font-semibold text-gray-800">Gov. Registration Document:</span> <a href={profile.gov_registration_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">View Document</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
