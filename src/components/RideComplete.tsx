import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import confetti from "canvas-confetti";
import { Star, MapPin, Share2, Receipt, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Location } from "../App";

type RideCompleteProps = {
  pickup: Location;
  destination: Location;
  fare: number;
  vehicle: string;
  onFinish: () => void;
};

const containerStyle = { width: "100%", height: "300px" };
const MAP_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export default function RideComplete({
  pickup,
  destination,
  fare,
  vehicle,
  onFinish,
}: RideCompleteProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: MAP_LIBRARIES,
  });

  const [tip, setTip] = useState(0);
  const [rating, setRating] = useState(0);
  const [paymentFeedback, setPaymentFeedback] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [rideId] = useState(`#ZC${Math.floor(Math.random() * 9000 + 1000)}`);

  // ✅ Fare logic fix
  const baseFare = 30;
  const totalFare = baseFare + fare + tip;

  // ✅ Confetti animation
  useEffect(() => {
    const duration = 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 10,
        spread: 90,
        origin: { y: 0.7 },
        colors: ["#00BFA6", "#00E5FF", "#FFD700"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  // ✅ Directions route path (instead of straight line)
  useEffect(() => {
    if (!isLoaded) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: pickup,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result?.routes[0]) {
          const decoded = google.maps.geometry.encoding.decodePath(
            result.routes[0].overview_polyline
          );
          setPath(decoded.map((p) => ({ lat: p.lat(), lng: p.lng() })));
        }
      }
    );
  }, [isLoaded, pickup, destination]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 bg-[#00BFA6] text-white flex justify-between items-center shadow-md">
        <h2 className="font-semibold text-lg">Ride Complete</h2>
        <button
          onClick={onFinish}
          className="flex items-center text-sm hover:underline"
        >
          <Home className="w-4 h-4 mr-1" /> Home
        </button>
      </div>

      {/* Map */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={destination}
          zoom={13}
          options={{ disableDefaultUI: true }}
        >
          <Marker position={pickup} label="P" />
          <Marker position={destination} label="D" />
          {path.length > 0 && (
            <Polyline
              path={path}
              options={{ strokeColor: "#00BFA6", strokeWeight: 5 }}
            />
          )}
        </GoogleMap>
      )}

      {/* Ride summary */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {vehicle} Ride
            </h3>
            <p className="text-gray-500 text-sm">
              {pickup.lat.toFixed(3)}, {pickup.lng.toFixed(3)} →{" "}
              {destination.lat.toFixed(3)}, {destination.lng.toFixed(3)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[#00BFA6]">
              ₹{totalFare.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Total Fare (incl. tip)</p>
          </div>
        </div>

        {/* Tip options */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Add a Tip</h4>
          <div className="flex gap-3">
            {[10, 20, 50].map((amount) => (
              <button
                key={amount}
                onClick={() => setTip(amount)}
                className={`px-4 py-2 rounded-xl border ${
                  tip === amount
                    ? "bg-[#00BFA6] text-white"
                    : "text-gray-700 border-gray-300"
                } transition`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Rate your driver</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                className={`w-7 h-7 cursor-pointer transition ${
                  rating >= num ? "text-[#FFD700]" : "text-gray-300"
                }`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>
        </div>

        {/* Payment feedback */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700">Payment Experience</h4>
          <div className="flex gap-3">
            {["good", "bad"].map((type) => (
              <button
                key={type}
                onClick={() => setPaymentFeedback(type)}
                className={`px-4 py-2 rounded-xl border ${
                  paymentFeedback === type
                    ? "bg-[#00BFA6] text-white"
                    : "text-gray-700 border-gray-300"
                } transition`}
              >
                {type === "good" ? "👍 Smooth" : "👎 Could Improve"}
              </button>
            ))}
          </div>

          {paymentFeedback && (
            <p className="text-sm text-gray-500 mt-2">
              {paymentFeedback === "good"
                ? "Thanks for your feedback! 😊"
                : "We’ll work on improving our payment process."}
            </p>
          )}
        </div>

        {/* Share + Receipt */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setShowReceipt(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-[#E0F7FA] transition"
          >
            <Receipt className="w-4 h-4" /> View Receipt
          </button>
          <button
            onClick={() => navigator.share?.({ title: "ZenCab Ride", text: "I just completed a ZenCab ride!", url: window.location.href })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00BFA6] text-white font-semibold shadow hover:bg-[#009688] transition"
          >
            <Share2 className="w-4 h-4" /> Share Ride
          </button>
        </div>
      </div>

      {/* ✅ Receipt Modal with fade animation */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-96 p-5 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold mb-3">Ride Receipt</h3>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex justify-between">
                  <span>Ride ID</span> <span>{rideId}</span>
                </p>
                <p className="flex justify-between">
                  <span>Vehicle</span> <span>{vehicle}</span>
                </p>
                <p className="flex justify-between">
                  <span>Base Fare</span> <span>₹{baseFare.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Distance Fare</span> <span>₹{fare.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Tip</span> <span>₹{tip.toFixed(2)}</span>
                </p>
                <hr />
                <p className="flex justify-between font-semibold text-gray-800">
                  <span>Total</span> <span>₹{totalFare.toFixed(2)}</span>
                </p>
              </div>

              <button
                onClick={() => setShowReceipt(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
