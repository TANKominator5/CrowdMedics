'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);

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
      // Simple approach: don't include id field - let database auto-generate it
      const { data, error } = await supabase.from('sos_requests').insert({
        user_id: user.id, // Store auth user ID in separate field
        email: user.email,
        // Convert coordinates to integers (multiply by 1000000 to preserve precision)
        latitude: Math.round((location?.latitude || 0) * 1000000),
        longitude: Math.round((location?.longitude || 0) * 1000000),
        status: 'active'
      });

      if (error) {
        console.error('Full error object:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // If sos_requests table doesn't exist, try clients table approach
        console.log('Trying fallback to clients table...');
        const { data: clientData, error: clientError } = await supabase.from('clients').insert({
          user_id: user.id, // Store auth user ID in separate field
          email: user.email,
          sos_active: true,
          sos_time: new Date().toISOString(),
          // Convert coordinates to integers for bigint columns
          latitude: Math.round((location?.latitude || 0) * 1000000),
          longitude: Math.round((location?.longitude || 0) * 1000000)
        });
        
        if (clientError) {
          console.error('Client error:', clientError);
          console.error('Client error details:', JSON.stringify(clientError, null, 2));
          alert(`Error sending SOS: ${clientError.message || 'Unknown error'}`);
        } else {
          console.log('SOS saved to clients table:', clientData);
          alert('SOS sent successfully! Help is on the way!');
        }
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
      {/* SOS Button Section */}
      <div className="flex flex-col items-center justify-center flex-1 mt-48">
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
      </div>
    </div>
  );
} 