import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { QRCodeSVG } from "qrcode.react";
import {
  Car,
  Bike,
  Truck,
  Bus,
  Timer,
  ArrowLeft,
  Users,
  Zap,
  Tag,
  Clock,
  TrendingUp,
  Shield,
  Star,
  Sparkles,
  Leaf,
  TreePine,
  Wind,
  CheckCircle
} from "lucide-react";
import { Location } from "../App";

type RideOptionsProps = {
  pickup: Location;
  destination: Location;
  onBack: () => void;
  onSelectRide: (vehicleType: string, fare: number, driverName?: string) => void;
};

const containerStyle = { width: "100%", height: "300px" };
const MAP_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

type RideType = {
  type: string;
  rate: number;
  icon: JSX.Element;
  color: string;
  eta: string;
  capacity: number;
  features: string[];
  isPopular?: boolean;
  surgeMultiplier?: number;
  carbonEmission: number; // grams of CO2 per km
  isEcoFriendly?: boolean;
};

export default function RideOptions({
  pickup,
  destination,
  onBack,
  onSelectRide,
}: RideOptionsProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES,
  });

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState("");
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [studentDiscount, setStudentDiscount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [scheduleRide, setScheduleRide] = useState(false);
  const [showCarbonInfo, setShowCarbonInfo] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [otp, setOtp] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrScanned, setQrScanned] = useState(false);
  const [selectedRideData, setSelectedRideData] = useState<{type: string, fare: number} | null>(null);

  const rides: RideType[] = [
    {
      type: "Bike",
      rate: 8,
      icon: <Bike className="w-5 h-5" />,
      color: "#FF9800",
      eta: "4 mins",
      capacity: 1,
      features: ["Fastest", "Eco-friendly"],
      surgeMultiplier: 1.2,
      carbonEmission: 0, // Electric/zero emission
      isEcoFriendly: true
    },
    {
      type: "Auto",
      rate: 12,
      icon: <Truck className="w-5 h-5" />,
      color: "#FBC02D",
      eta: "6 mins",
      capacity: 3,
      features: ["Budget-friendly", "Quick"],
      isPopular: true,
      carbonEmission: 65, // CNG auto
      isEcoFriendly: true
    },
    {
      type: "Mini",
      rate: 14,
      icon: <Car className="w-5 h-5" />,
      color: "#00BFA6",
      eta: "8 mins",
      capacity: 4,
      features: ["AC", "Comfortable"],
      isPopular: true,
      carbonEmission: 120 // Small car
    },
    {
      type: "Sedan",
      rate: 18,
      icon: <Car className="w-5 h-5" />,
      color: "#2196F3",
      eta: "9 mins",
      capacity: 4,
      features: ["Premium AC", "Spacious", "Music"],
      carbonEmission: 150 // Medium car
    },
    {
      type: "SUV",
      rate: 22,
      icon: <Bus className="w-5 h-5" />,
      color: "#9C27B0",
      eta: "11 mins",
      capacity: 6,
      features: ["Luxury", "Extra Space", "Premium"],
      carbonEmission: 200 // Large SUV
    },
  ];

  useEffect(() => {
    if (!isLoaded) return;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickup,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result?.routes[0]) {
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.value ? leg.distance.value / 1000 : 0);
          setDuration(leg.duration?.text || "");
          const encoded = result.routes[0].overview_polyline;
          if (encoded) {
            const decoded = google.maps.geometry.encoding.decodePath(encoded);
            setPath(decoded.map((p) => ({ lat: p.lat(), lng: p.lng() })));
          }
        }
      }
    );
  }, [pickup, destination, isLoaded]);

  const calculateFare = (rate: number, surgeMultiplier = 1) => {
    const baseFare = Math.max(30, Math.round(rate * distance * surgeMultiplier));
    return Math.round(baseFare * (1 - discount / 100));
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "ZENCAB10") {
      setDiscount(10);
      setShowPromo(false);
    } else if (promoCode.toUpperCase() === "STUDENT30") {
      setDiscount(30);
      setShowPromo(false);
    } else if (promoCode.toUpperCase() === "FIRST20") {
      setDiscount(20);
      setShowPromo(false);
    } else {
      alert("Invalid promo code");
    }
  };

  // Check for student verification on component mount
  useEffect(() => {
    const storedVerification = localStorage.getItem('studentEmailVerified');
    if (storedVerification) {
      try {
        const verificationData = JSON.parse(storedVerification);
        const verifiedAt = new Date(verificationData.verifiedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - verifiedAt.getTime()) / (1000 * 3600 * 24);
        if (daysDiff < 30) {
          setStudentDiscount(20); // 20% student discount
        }
      } catch (error) {
        // Ignore invalid data
      }
    }
  }, []);

  const getLowestFare = () => {
    return Math.min(...rides.map(r => calculateFare(r.rate, r.surgeMultiplier || 1)));
  };

  // Function to check if student discount should be applied
  const isStudentVerified = () => {
    const storedVerification = localStorage.getItem('studentEmailVerified');
    if (storedVerification) {
      try {
        const verificationData = JSON.parse(storedVerification);
        const verifiedAt = new Date(verificationData.verifiedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - verifiedAt.getTime()) / (1000 * 3600 * 24);
        return daysDiff < 30;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // Calculate carbon footprint in grams
  const calculateCarbon = (carbonPerKm: number) => {
    return Math.round(carbonPerKm * distance);
  };

  // Calculate carbon saved vs average car (150g/km)
  const calculateCarbonSaved = (carbonPerKm: number) => {
    const averageCarEmission = 150;
    const saved = (averageCarEmission - carbonPerKm) * distance;
    return Math.round(saved);
  };

  // Get total carbon for all rides
  const getTotalCarbonSaved = () => {
    return rides.reduce((total, ride) => {
      const saved = calculateCarbonSaved(ride.carbonEmission);
      return total + (saved > 0 ? saved : 0);
    }, 0);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-[#f9fafb]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#00BFA6] to-[#00A896] text-white shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <button onClick={onBack} className="text-sm font-semibold flex items-center space-x-1 hover:bg-white/20 px-3 py-1 rounded-lg transition">
            <ArrowLeft className="w-4 h-4" /> <span>Back</span>
          </button>
          <h2 className="font-bold text-lg tracking-wide">Select Your Ride</h2>
          <div className="w-16" />
        </div>

        {/* Trip Info */}
        <div className="flex items-center justify-between text-sm bg-white/10 backdrop-blur-sm rounded-lg p-2 mt-2">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="h-4 w-px bg-white/30" />
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>{distance.toFixed(1)} km</span>
          </div>
          <div className="h-4 w-px bg-white/30" />
          <button
            onClick={() => setScheduleRide(!scheduleRide)}
            className={flex items-center space-x-1 px-2 py-1 rounded transition ${scheduleRide ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}}
          >
            <Clock className="w-4 h-4" />
            <span className="text-xs">Schedule</span>
          </button>
          <div className="h-4 w-px bg-white/30" />
          <button
            onClick={() => setShowCarbonInfo(!showCarbonInfo)}
            className={flex items-center space-x-1 px-2 py-1 rounded transition ${showCarbonInfo ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}}
          >
            <Leaf className="w-4 h-4" />
            <span className="text-xs">Carbon</span>
          </button>
        </div>
      </div>

      {/* Map */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={pickup}
          zoom={13}
          options={{ disableDefaultUI: true }}
        >
          <Marker position={pickup} label="P" />
          <Marker position={destination} label="D" />
          {path.length > 0 && (
            <Polyline path={path} options={{ strokeColor: "#00BFA6", strokeWeight: 4 }} />
          )}
        </GoogleMap>
      )}

      {/* Booking Confirmation Card */}
      {bookingConfirmed && (
        <div className="mx-4 mt-4 bg-white border-2 border-[#00BFA6] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="font-bold text-lg text-gray-800">Booking Confirmed!</h3>
            </div>
            <button
              onClick={() => setBookingConfirmed(false)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
          <p className="text-gray-700 mb-4">{driverName} has accepted your booking and will arrive within 6 min.</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={relative ${qrScanned ? 'opacity-50' : ''}}>
                <QRCodeSVG value={qrData} size={100} />
                {qrScanned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-80 rounded">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {qrScanned ? 'QR Code Scanned' : 'Scan QR Code'}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className={text-2xl font-bold ${qrScanned ? 'text-green-600' : 'text-[#00BFA6]'}}>
                {otp}
              </div>
              <p className="text-sm text-gray-500">6-Digit OTP</p>
            </div>
          </div>
          {qrScanned && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                Driver has verified the booking. Proceeding to ride tracking...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Carbon Impact Banner */}
      {showCarbonInfo && (
        <div className="mx-4 mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-800 mb-1">Your Environmental Impact</h3>
              <p className="text-sm text-green-700 mb-2">
                Choose eco-friendly rides to reduce your carbon footprint
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-green-600 font-semibold">Trees Planted Equivalent</p>
                  <p className="text-lg font-bold text-green-800">
                    {Math.ceil(getTotalCarbonSaved() / 21000)} 🌳
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-2">
                  <p className="text-green-600 font-semibold">CO₂ Saved Today</p>
                  <p className="text-lg font-bold text-green-800">
                    {(getTotalCarbonSaved() / 1000).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promo Code Section */}
      <div className="px-4 pt-3">
        {!showPromo && discount === 0 && (
          <button
            onClick={() => setShowPromo(true)}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:shadow-md transition"
          >
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-amber-700">Apply Promo Code</span>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </button>
        )}

        {showPromo && (
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code (ZENCAB10 or FIRST20)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFA6] outline-none"
            />
            <button
              onClick={applyPromo}
              className="px-4 py-2 bg-[#00BFA6] text-white rounded-lg font-semibold hover:bg-[#009688] transition"
            >
              Apply
            </button>
          </div>
        )}

        {discount > 0 && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl mb-2">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">{discount}% OFF Applied!</span>
            </div>
            <button onClick={() => setDiscount(0)} className="text-green-600 text-sm underline">
              Remove
            </button>
          </div>
        )}

        {studentDiscount > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Student Discount: {studentDiscount}% OFF</span>
            </div>
            <span className="text-blue-600 text-sm">Verified</span>
          </div>
        )}
      </div>

      {/* Ride List */}
      <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto">
        {rides.map((ride) => {
          const fare = calculateFare(ride.rate, ride.surgeMultiplier || 1);
          const totalDiscount = Math.min(100, discount + studentDiscount);
          const originalFare = calculateFare(ride.rate, ride.surgeMultiplier || 1) / (1 - totalDiscount / 100);
          const savings = fare === getLowestFare() && fare < originalFare;
          const carbonFootprint = calculateCarbon(ride.carbonEmission);
          const carbonSaved = calculateCarbonSaved(ride.carbonEmission);

          return (
            <div
              key={ride.type}
              onClick={() => {
                setSelectedRide(ride.type);
                // Generate confirmation details
                const driverNames = ["Rajesh Kumar", "Amit Singh", "Priya Sharma", "Vikram Patel", "Sneha Gupta"];
                const randomDriver = driverNames[Math.floor(Math.random() * driverNames.length)];
                const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                setDriverName(randomDriver);
                setOtp(randomOtp);
                setQrData(randomOtp); // QR contains OTP
                setBookingConfirmed(true);
                setSelectedRideData({type: ride.type, fare});
                // Simulate QR scanning after 10 seconds
                setTimeout(() => {
                  setQrScanned(true);
                  setTimeout(() => onSelectRide(ride.type, fare, driverName), 1000); // Additional delay after QR scan
                }, 10000);
              }}
              className={`relative flex justify-between items-center p-4 border-2 rounded-2xl transition-all cursor-pointer ${
                selectedRide === ride.type
                  ? 'border-[#00BFA6] bg-[#E0F7FA] shadow-lg scale-[1.02]'
                  : 'border-gray-200 bg-white hover:shadow-lg hover:scale-[1.01]'
              }`}
            >
              {/* Eco-Friendly Badge */}
              {ride.isEcoFriendly && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1 z-10">
                  <Leaf className="w-3 h-3" />
                  <span>Eco</span>
                </div>
              )}

              {/* Popular Badge */}
              {ride.isPopular && !ride.isEcoFriendly && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Popular</span>
                </div>
              )}

              {/* Surge Indicator */}
              {ride.surgeMultiplier && ride.surgeMultiplier > 1 && (
                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{ride.surgeMultiplier}x</span>
                </div>
              )}

              <div className="flex items-start space-x-4 flex-1">
                <div
                  className="p-3 rounded-full shadow-md flex-shrink-0"
                  style={{ backgroundColor: ride.color, color: "white" }}
                >
                  {ride.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-gray-800 text-lg">{ride.type}</p>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{ride.capacity}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 flex items-center space-x-1 mb-2">
                    <Timer className="w-3 h-3" />
                    <span>Arrives in {ride.eta}</span>
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ride.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center space-x-1"
                      >
                        {feature === "Fastest" && <Zap className="w-3 h-3" />}
                        {feature === "Premium" && <Shield className="w-3 h-3" />}
                        <span>{feature}</span>
                      </span>
                    ))}
                  </div>

                  {/* Carbon Footprint Info */}
                  {showCarbonInfo && (
                    <div className={`text-xs rounded-lg p-2 flex items-center justify-between ${
                      ride.isEcoFriendly ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Wind className={w-3 h-3 ${ride.isEcoFriendly ? 'text-green-600' : 'text-gray-500'}} />
                        <span className={ride.isEcoFriendly ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                          {carbonFootprint === 0 ? 'Zero Emission' : ${carbonFootprint}g CO₂}
                        </span>
                      </div>
                      {carbonSaved > 0 && (
                        <span className="text-green-600 font-semibold flex items-center space-x-1">
                          <Leaf className="w-3 h-3" />
                          <span>-{carbonSaved}g saved</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="text-right ml-4">
                <div className="flex flex-col items-end">
                  {(discount > 0 || studentDiscount > 0) && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{Math.round(originalFare)}
                    </span>
                  )}
                  <p className="font-bold text-[#00BFA6] text-xl">₹{fare}</p>
                  {savings && (
                    <span className="text-xs text-green-600 font-semibold flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>Best Value</span>
                    </span>
                  )}
                  {studentDiscount > 0 && (
                    <span className="text-xs text-blue-600 font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Student Discount</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Info Footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
          <p className="text-xs text-blue-700 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>All rides are sanitized and drivers are verified for your safety</span>
          </p>
        </div>
      </div>
    </div>
  );
}
