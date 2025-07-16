"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [medics, setMedics] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [sosProfiles, setSosProfiles] = useState<any[]>([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch all medic profiles
      const { data: helpers } = await supabase.from('helpers').select('*');
      setMedics(helpers || []);
      // Fetch all client profiles (assuming a 'clients' table)
      const { data: clientData } = await supabase.from('clients').select('*');
      setClients(clientData || []);
      // Fetch recently SOS requested profiles (assuming a 'sos_requests' table with user_id)
      const { data: sosData } = await supabase
        .from('sos_requests')
        .select('*, helpers(*), clients(*)')
        .order('created_at', { ascending: false })
        .limit(10);
      setSosProfiles(sosData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const unverifiedMedics = medics.filter((m: any) => m.verified !== 'true');
  const verifiedMedics = medics.filter((m: any) => m.verified === 'true');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 py-10 px-2">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">Admin Dashboard</h1>
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-full font-semibold ${tab==='all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>All Medics</button>
          <button onClick={() => setTab('unverified')} className={`px-4 py-2 rounded-full font-semibold ${tab==='unverified' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>Needs Verification</button>
          <button onClick={() => setTab('verified')} className={`px-4 py-2 rounded-full font-semibold ${tab==='verified' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>Verified</button>
          <button onClick={() => setTab('clients')} className={`px-4 py-2 rounded-full font-semibold ${tab==='clients' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>Clients</button>
          <button onClick={() => setTab('sos')} className={`px-4 py-2 rounded-full font-semibold ${tab==='sos' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}>Recent SOS</button>
        </div>
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <div>
            {tab === 'all' && (
              <ProfileList title="All Medic Profiles" profiles={medics} showActions={false} />
            )}
            {tab === 'unverified' && (
              <ProfileList title="Profiles Needing Verification" profiles={unverifiedMedics} highlightUnverified showActions={true} />
            )}
            {tab === 'verified' && (
              <ProfileList title="Verified Profiles" profiles={verifiedMedics} />
            )}
            {tab === 'clients' && (
              <ClientList title="Client Profiles" clients={clients} />
            )}
            {tab === 'sos' && (
              <SOSList title="Recently SOS Requested Profiles" sosProfiles={sosProfiles} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileList({ title, profiles, highlightUnverified, showActions }: any) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [localProfiles, setLocalProfiles] = useState(profiles);
  
  // Update local profiles when profiles prop changes
  useEffect(() => {
    setLocalProfiles(profiles);
  }, [profiles]);

  const handleVerify = async (profileId: string) => {
    setUpdating(profileId);
    try {
      console.log('Verifying profile:', profileId);
      const { error } = await supabase
        .from('helpers')
        .update({ verified: 'true' }) // Use string 'true' since verified is varchar
        .eq('id', parseInt(profileId));
      
      if (error) {
        console.error('Error verifying profile:', error);
        alert('Error verifying profile. Please try again.');
      } else {
        console.log('Profile verified successfully:', profileId);
        // Update local state immediately
        setLocalProfiles((prev: any[]) => 
          prev.map((profile: any) => 
            profile.id === parseInt(profileId) 
              ? { ...profile, verified: 'true' }
              : profile
          )
        );
        alert('Profile verified successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (profileId: string) => {
    setUpdating(profileId);
    try {
      console.log('Rejecting profile:', profileId);
      const { error } = await supabase
        .from('helpers')
        .update({ verified: 'false' }) // Use string 'false' since verified is varchar
        .eq('id', parseInt(profileId));
      
      if (error) {
        console.error('Error rejecting profile:', error);
        alert('Error rejecting profile. Please try again.');
      } else {
        console.log('Profile rejected successfully:', profileId);
        // Update local state immediately
        setLocalProfiles((prev: any[]) => 
          prev.map((profile: any) => 
            profile.id === parseInt(profileId) 
              ? { ...profile, verified: 'false' }
              : profile
          )
        );
        alert('Profile rejected successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setUpdating(null);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localProfiles.map((profile: any) => {
          const isVerified = profile.verified === 'true';
          const isRejected = profile.verified === 'false';
          const isPending = profile.verified === null || profile.verified === undefined || profile.verified === '';
          let statusBadge = isVerified
            ? <span className="ml-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">Verified</span>
            : isRejected
              ? <span className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">Rejected</span>
              : <span className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded-full text-xs font-semibold">Pending</span>;
          return (
            <div key={profile.id} className={`rounded-xl p-6 shadow bg-gradient-to-br from-blue-50 to-purple-50 border ${highlightUnverified && isPending ? 'border-yellow-400' : 'border-blue-100'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold text-white">{profile.name?.charAt(0) || '?'}</div>
                <div>
                  <div className="font-semibold text-lg">{profile.name}</div>
                  <div className="text-sm text-gray-500">{profile.email}</div>
                </div>
                {statusBadge}
              </div>
              <div className="text-sm text-gray-700 mb-1"><strong>Phone:</strong> {profile.phone}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Qualification:</strong> {profile.qualification}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Gov. Reg. Type:</strong> {profile.gov_registration_type}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Gov. Reg. Number:</strong> {profile.gov_registration_number}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Servable Region:</strong> {profile.servable_region}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Gov. Employer:</strong> {profile.gov_employer}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Gov. ID Card Number:</strong> {profile.gov_id_card_number}</div>
              <div className="text-sm text-gray-700 mb-1"><strong>Document:</strong> <a href={profile.gov_registration_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></div>
              {showActions && isPending && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleVerify(profile.id.toString())} disabled={updating === profile.id.toString()} className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50">{updating === profile.id.toString() ? 'Accepting...' : 'Accept'}</button>
                  <button onClick={() => handleReject(profile.id.toString())} disabled={updating === profile.id.toString()} className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50">{updating === profile.id.toString() ? 'Rejecting...' : 'Reject'}</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientList({ title, clients }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client: any) => (
          <div key={client.id} className="rounded-xl p-6 shadow bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-purple-300 flex items-center justify-center text-xl font-bold text-white">{client.name?.charAt(0) || '?'}</div>
              <div>
                <div className="font-semibold text-lg">{client.name}</div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-1"><strong>Phone:</strong> {client.phone}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>Region:</strong> {client.region}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SOSList({ title, sosProfiles }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sosProfiles.map((sos: any) => (
          <div key={sos.id} className="rounded-xl p-6 shadow bg-gradient-to-br from-red-50 to-yellow-50 border border-red-200">
            <div className="font-semibold text-lg mb-1">SOS Request #{sos.id}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>User ID:</strong> {sos.user_id}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>Email:</strong> {sos.email}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                sos.status === 'active' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {sos.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-1"><strong>Location:</strong> 
              {sos.latitude && sos.longitude 
                ? `${(sos.latitude / 1000000).toFixed(6)}, ${(sos.longitude / 1000000).toFixed(6)}`
                : 'Not available'
              }
            </div>
            <div className="text-sm text-gray-700 mb-1"><strong>Created:</strong> {new Date(sos.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
