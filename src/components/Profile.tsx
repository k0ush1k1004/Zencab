import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  ArrowLeft,
  Clock,
  LogOut,
  Car,
  Star,
  CheckCircle,
  Mail,
  Shield,
} from "lucide-react";
import StudentVerification from "./StudentVerification";

type ProfileProps = {
  onBack: () => void;
};

export default function Profile({ onBack }: ProfileProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [rideHistory] = useState([
    {
      id: 1,
      pickup: "Techno Main Salt Lake",
      destination: "South City Mall",
      fare: 180,
      date: "Nov 4, 2025",
      rating: 5,
    },
    {
      id: 2,
      pickup: "Howrah Station",
      destination: "Park Street",
      fare: 220,
      date: "Nov 2, 2025",
      rating: 4,
    },
    {
      id: 3,
      pickup: "Airport Gate No. 1",
      destination: "New Town",
      fare: 300,
      date: "Oct 28, 2025",
      rating: 5,
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#00BFA6] to-[#00A896] text-white flex justify-between items-center">
        <button
          onClick={onBack}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <div></div>
      </div>

      {/* Profile Section */}
      <div className="p-6 text-center">
        <div className="relative inline-block">
          <img
            src={user?.imageUrl || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-4 border-[#00BFA6] shadow-md"
          />
          <span className="absolute bottom-2 right-2 bg-[#00BFA6] w-4 h-4 rounded-full border-2 border-white"></span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mt-3">
          {user?.firstName || "ZENCAB User"} {user?.lastName || ""}
        </h2>
        <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl shadow p-3">
            <Car className="w-6 h-6 text-[#00BFA6] mx-auto mb-1" />
            <p className="text-xs text-gray-500">Total Rides</p>
            <p className="font-semibold text-gray-800">37</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3">
            <Clock className="w-6 h-6 text-[#00A896] mx-auto mb-1" />
            <p className="text-xs text-gray-500">Hours Ridden</p>
            <p className="font-semibold text-gray-800">56h</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Rating</p>
            <p className="font-semibold text-gray-800">4.9</p>
          </div>
        </div>
      </div>

      {/* Ride History */}
      <div className="flex-1 bg-white rounded-t-3xl p-6 mt-4 shadow-inner">
        <h3 className="text-md font-semibold text-gray-800 mb-3">
          Recent Trips
        </h3>

        <div className="space-y-3 overflow-y-auto max-h-80">
          {rideHistory.map((ride) => (
            <div
              key={ride.id}
              className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl hover:shadow-md transition"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {ride.pickup} → {ride.destination}
                </p>
                <p className="text-xs text-gray-500">{ride.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">₹{ride.fare}</p>
                <p className="text-xs text-yellow-500 flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 fill-yellow-400" /> {ride.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Verification & Discount Section */}
      <section className="w-full max-w-xl mx-auto mt-8">
        {/* Student Verification Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#00BFA6]/80 bg-[#00BFA6] mb-8">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#FFD700] to-[#00E5FF]" />
          <div className="pl-8 pr-6 py-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="w-6 h-6 text-white" /> Student Verification
            </h2>
            <StudentVerification forceNewVerification />
          </div>
        </div>
        {/* Student Discount Card */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#00BFA6]/80 bg-[#00BFA6] px-8 py-7 mb-8 flex flex-col items-center">
          <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow">Student Discount</h2>
          <p className="text-white text-lg leading-relaxed drop-shadow text-center max-w-md">Verified students get <span className="font-bold text-yellow-200">up to 20% off</span> on all rides! Use your verified student email to claim your discount automatically at checkout.</p>
        </div>
      </section>

      {/* Footer */}
      <div className="p-5 border-t bg-white flex justify-between items-center">
        <button
          onClick={() => signOut()}
          className="w-full bg-[#00BFA6] text-white py-3 rounded-xl font-semibold hover:bg-[#009688] transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
