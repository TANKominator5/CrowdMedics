// src/app/page.tsx
import Link from 'next/link';
import { ShieldCheck, Siren, UserRoundCheck, HeartPulse } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fadeIn">
      {/* ========== 1. Hero Section ========== */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Get Help Fast. <span className="text-blue-500">Be a Hero.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          CrowdMedics instantly connects first-aid volunteers with nearby emergencies, bridging the critical gap before an ambulance arrives.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
          >
            Get Protected
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-transparent hover:bg-gray-700 border-2 border-gray-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Sign Up to Help
          </Link>
        </div>
      </section>

      {/* ========== 2. Problem & Solution Section ========== */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">The Problem: Every Second Counts</h2>
          <p className="mt-2 text-gray-400">In a cardiac arrest, survival chances drop 10% every minute. Ambulance wait times can be fatal.</p>
        </div>

        <div className="text-center">
            <h2 className="text-3xl font-bold">Our Solution: Instant Activation</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <Siren className="h-12 w-12 mx-auto text-red-500" />
                <h3 className="mt-4 text-xl font-semibold">SOS Triggered</h3>
                <p className="mt-2 text-gray-400">A person in need sends an alert with their live location and emergency type.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <UserRoundCheck className="h-12 w-12 mx-auto text-blue-500" />
                <h3 className="mt-4 text-xl font-semibold">Medic Notified</h3>
                <p className="mt-2 text-gray-400">Our system finds and instantly alerts the nearest available CrowdMedic.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <HeartPulse className="h-12 w-12 mx-auto text-green-500" />
                <h3 className="mt-4 text-xl font-semibold">Help Arrives</h3>
                <p className="mt-2 text-gray-400">The volunteer provides crucial aid, guided by our app, until professionals take over.</p>
            </div>
            </div>
        </div>
      </section>

      {/* ========== 3. "Who can be a CrowdMedic?" Section ========== */}
      <section className="bg-gray-800 rounded-xl p-8 md:p-12 my-16 text-center">
        <ShieldCheck className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
        <h2 className="text-3xl font-bold">Who Can Be a CrowdMedic?</h2>
        <p className="mt-2 max-w-3xl mx-auto text-gray-300">
          If you have basic first-aid training, you have the power to save a life. You don't need to be a doctor to be a hero.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-gray-700 rounded-full px-4 py-2">CPR-Trained Citizens</span>
            <span className="bg-gray-700 rounded-full px-4 py-2">Nursing Students</span>
            <span className="bg-gray-700 rounded-full px-4 py-2">Red Cross Volunteers</span>
            <span className="bg-gray-700 rounded-full px-4 py-2">Ex-Military/Police</span>
            <span className="bg-gray-700 rounded-full px-4 py-2">Medical Interns</span>
            <span className="bg-gray-700 rounded-full px-4 py-2">Scouts & Guides</span>
        </div>
        <div className="mt-8">
             <Link
                href="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
            >
                Join the Network Today
            </Link>
        </div>
      </section>
    </div>
  );
}