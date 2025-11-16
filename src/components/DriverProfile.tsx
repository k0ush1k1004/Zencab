import { useState } from "react";
import {
  ArrowLeft,
  Star,
  Shield,
  Car,
  Phone,
  MessageCircle,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  ThumbsUp,
} from "lucide-react";

type DriverProfileProps = {
  driverName: string;
  driverRating: number;
  vehicleType: string;
  vehicleNumber: string;
  onBack: () => void;
};

export default function DriverProfile({
  driverName,
  driverRating,
  vehicleType,
  vehicleNumber,
  onBack,
}: DriverProfileProps) {
  const [reviews] = useState([
    {
      id: 1,
      user: "Priya S.",
      rating: 5,
      comment: "Very professional and safe driver. Reached on time!",
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Rahul M.",
      rating: 5,
      comment: "Excellent service. Clean car and great music selection.",
      date: "1 week ago",
    },
    {
      id: 3,
      user: "Anita K.",
      rating: 4,
      comment: "Good driver, but took a slightly longer route.",
      date: "2 weeks ago",
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
        <h1 className="text-lg font-semibold">Driver Profile</h1>
        <div></div>
      </div>

      {/* Driver Info Section */}
      <div className="p-6 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full mx-auto bg-[#00BFA6] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
            {driverName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-3">{driverName}</h2>
        <div className="flex items-center justify-center space-x-1 mt-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800">{driverRating}</span>
          <span className="text-gray-500">• 2,847 rides</span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl shadow p-3">
            <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Verified</p>
            <p className="font-semibold text-gray-800">Yes</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3">
            <Car className="w-6 h-6 text-[#00BFA6] mx-auto mb-1" />
            <p className="text-xs text-gray-500">Vehicle</p>
            <p className="font-semibold text-gray-800">{vehicleType}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-3">
            <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="font-semibold text-gray-800">2022</p>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="px-6 mb-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Car className="w-5 h-5 text-[#00BFA6]" />
            <span>Vehicle Details</span>
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">{vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number</span>
              <span className="font-medium">{vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Color</span>
              <span className="font-medium">White</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#00BFA6] text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:bg-[#009688] transition">
            <Phone className="w-6 h-6" />
            <span className="font-medium">Call Driver</span>
          </button>
          <button className="bg-blue-500 text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:bg-blue-600 transition">
            <MessageCircle className="w-6 h-6" />
            <span className="font-medium">Message</span>
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex-1 bg-white rounded-t-3xl p-6 mt-4 shadow-inner">
        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <ThumbsUp className="w-5 h-5 text-[#00BFA6]" />
          <span>Recent Reviews ({reviews.length})</span>
        </h3>

        <div className="space-y-3 overflow-y-auto max-h-80">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-4 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{review.user}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
