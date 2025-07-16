'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function SosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [latestSos, setLatestSos] = useState<any>(null);
  const [fetchingSos, setFetchingSos] = useState(true);

  useEffect(() => {
    const upsertClient = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/');
        return;
      }
      const user = session.user;
      setUser(user);
      // Don't try to upsert with UUID as id - let database handle it
      const { error } = await supabase.from('clients').insert({
        user_id: user.id,
        email: user.email
      });
      if (error && !error.message.includes('duplicate')) {
        console.error('Error creating client record:', error);
      }
    };
    upsertClient();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [router]);

  // Fetch latest SOS request for this user
  useEffect(() => {
    const fetchLatestSos = async () => {
      if (!user) return;
      setFetchingSos(true);
      const { data, error } = await supabase
        .from('sos_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (!error && data) {
        setLatestSos(data);
      } else {
        setLatestSos(null);
      }
      setFetchingSos(false);
    };
    fetchLatestSos();
  }, [user, loading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSosPress = async () => {
    if (!user) {
      alert('Please log in to use SOS');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from('sos_requests').insert({
        user_id: user.id,
        email: user.email,
        latitude: Math.round((location?.latitude || 0) * 1000000),
        longitude: Math.round((location?.longitude || 0) * 1000000),
        status: 'pending'
      });

      if (error) {
        console.error('Full error object:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Error sending SOS: ${error.message || 'Unknown error'}`);
      } else {
        console.log('SOS sent successfully:', data);
        alert('SOS sent successfully! Help is on the way!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`An unexpected error occurred: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    // Implement payment logic here
    alert('Redirecting to payment...');
  };

  return (
    <div className="fullscreen-center bg-gradient-to-br from-[#fbc2eb] via-[#f6d365] to-[#a18cd1] animate-fadeIn relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center py-10 glass glow-border shadow-2xl">
        <div className="flex-1 flex justify-center">
          <span className="text-5xl font-extrabold gradient-text flex items-center gap-3 select-none drop-shadow-2xl animate-fadeIn">
            CrowdMedics <span className="text-5xl">🚑</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="absolute right-12 top-1/2 -translate-y-1/2 btn-animated bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold py-3 px-10 rounded-full text-lg shadow-xl glow-border"
        >
          Logout
        </button>
      </div>
      {/* SOS Button or Status Section */}
      <div className="flex flex-col items-center justify-center flex-1 mt-48">
        {fetchingSos ? (
          <div className="text-white text-2xl">Loading status...</div>
        ) : latestSos && latestSos.status === 'accepted' ? (
          <div className="flex flex-col items-center">
            <div className="bg-white/90 text-green-700 font-bold text-3xl rounded-2xl shadow-2xl px-12 py-10 border-4 border-green-500 mb-8">
              Request accepted and help is on the way!
            </div>
            <button
              onClick={handlePayment}
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold py-4 px-16 rounded-full text-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Payment Now
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleSosPress}
              disabled={loading}
              className={`bg-white text-red-600 font-extrabold text-7xl rounded-full shadow-2xl px-28 py-20 border-8 border-red-500 hover:scale-110 transition-transform animate-pulse drop-shadow-2xl glow-border disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'animate-spin' : ''}`}
            >
              {loading ? '...' : 'SOS'}
            </button>
            <p className="mt-14 text-white/95 text-3xl max-w-2xl text-center drop-shadow-2xl glass p-8 rounded-2xl border border-white/10">
              {loading ? 'Sending SOS...' : 'Press the SOS button to instantly alert nearby CrowdMedics. Help is on the way!'}
            </p>
            {location && (
              <div className="mt-4 text-white/80 text-sm glass p-4 rounded-xl">
                Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                <div className="text-xs mt-1">
                  (Stored as: {Math.round(location.latitude * 1000000)}, {Math.round(location.longitude * 1000000)})
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}