import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { Car, Bike, User, Clock, Star, Phone, MessageCircle, Shield, Share2, Music, Thermometer, CreditCard, MapPin, Navigation } from "lucide-react";
import { Location } from "../App";

type RideTrackingProps = {
  pickup: Location;
  destination: Location;
  vehicleType?: "Car" | "Bike" | "Auto" | "SUV" | "Mini" | "Sedan";
  driverName?: string;
  vehicleNumber?: string;
  driverRating?: number;
  onCancel: () => void;
  goDriverProfile: () => void;
  onComplete: () => void;
};

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function RideTracking({
  pickup,
  destination,
  vehicleType = "Car",
  driverName = "Rohit Sharma",
  vehicleNumber = "WB 01 AB 1234",
  driverRating = 4.8,
  onCancel,
  goDriverProfile,
  onComplete,
}: RideTrackingProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [driverPos, setDriverPos] = useState<google.maps.LatLngLiteral>(pickup);
  const [, setIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [duration, setDuration] = useState("");
  const [progress, setProgress] = useState(0);

  // 🎯 Route setup
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
          const encoded = result.routes[0].overview_polyline;
          const decoded = google.maps.geometry.encoding.decodePath(encoded || "");
          const coords = decoded.map((p) => ({ lat: p.lat(), lng: p.lng() }));
          setPath(coords);
          setDuration(result.routes[0].legs[0].duration?.text || "10 min");
        }
      }
    );
  }, [pickup, destination, isLoaded]);

  // 🧭 Bearing (direction angle)
  const calculateBearing = (from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral) => {
    const lat1 = (from.lat * Math.PI) / 180;
    const lat2 = (to.lat * Math.PI) / 180;
    const dLng = ((to.lng - from.lng) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    const bearing = Math.atan2(y, x);
    return (bearing * 180) / Math.PI;
  };

  // 🏎 Vehicle animation (with rotation + variable speed)
  useEffect(() => {
    if (path.length === 0) return;

    const speedMap = {
      Bike: 100,
      Auto: 180,
      Mini: 200,
      Sedan: 220,
      Car: 200,
      SUV: 250,
    };
    const intervalSpeed = speedMap[vehicleType] || 200;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < path.length - 1) {
          const next = path[prev + 1];
          const bearing = calculateBearing(path[prev], next);
          setDriverPos(next);
          setRotation(bearing);
          setProgress(((prev + 1) / (path.length - 1)) * 100);
          mapRef.current?.panTo(next);
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
      });
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [path, onComplete, vehicleType]);

  // 🛠 Dynamic icons per vehicle
  const getVehicleIcon = () => {
    const iconSize = 40;
    const commonOptions = {
      scaledSize: new google.maps.Size(iconSize, iconSize),
      anchor: new google.maps.Point(iconSize / 2, iconSize / 2),
      rotation,
    };

    switch (vehicleType) {
      case "Bike":
        return {
          url: "https://cdn-icons-png.flaticon.com/512/889/889442.png",
          ...commonOptions,
        };
      case "Auto":
        return {
          url: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
          ...commonOptions,
        };
      case "Mini":
        return {
          url: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
          ...commonOptions,
        };
      case "Sedan":
        return {
          url: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
          ...commonOptions,
        };
      case "SUV":
        return {
          url: "https://cdn-icons-png.flaticon.com/512/7430/7430921.png",
          ...commonOptions,
        };
      default:
        return {
          url: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
          ...commonOptions,
        };
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#0F172A] text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-[#00BFA6] py-4 px-6 flex justify-between items-center z-10 shadow-lg">
        <h2 className="text-lg font-semibold">Ride in Progress</h2>
      </div>

      {/* Map */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={driverPos}
          zoom={15}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          options={{
            disableDefaultUI: true,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#1A1A2E" }] },
              { featureType: "road", stylers: [{ color: "#293241" }] },
              { featureType: "water", stylers: [{ color: "#00BFA6" }] },
            ],
          }}
        >
          {path.length > 0 && (
            <Polyline path={path} options={{ strokeColor: "#00BFA6", strokeWeight: 5 }} />
          )}
          <Marker position={pickup} label="P" />
          <Marker position={destination} label="D" />
          <Marker position={driverPos} icon={getVehicleIcon()} />
        </GoogleMap>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-white text-gray-800 p-6 rounded-t-3xl shadow-xl z-10">
        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3">
            <button className="flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition">
              <Phone className="w-5 h-5 text-[#00BFA6]" />
              <span className="text-xs text-gray-600">Call</span>
            </button>
            <button className="flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition">
              <MessageCircle className="w-5 h-5 text-[#00BFA6]" />
              <span className="text-xs text-gray-600">Message</span>
            </button>
            <button className="flex flex-col items-center space-y-1 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition">
              <Share2 className="w-5 h-5 text-[#00BFA6]" />
              <span className="text-xs text-gray-600">Share</span>
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">ETA</p>
            <p className="text-xl font-semibold text-[#00BFA6]">{duration}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#00BFA6] via-[#00E5FF] to-[#00BFA6] transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Driver Card */}
        <div className="bg-[#E0F2F1] p-4 rounded-xl mb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-[#00BFA6] p-3 rounded-full text-white">
                {vehicleType === "Bike" ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold">{driverName}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{driverRating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{vehicleType} • {vehicleNumber}</p>
              </div>
            </div>
            <button
              onClick={goDriverProfile}
              className="flex items-center space-x-2 bg-[#00BFA6] text-white px-3 py-2 rounded-lg text-sm"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </div>

          {/* Vehicle Features */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <Music className="w-4 h-4 text-blue-500" />
              <span>Music</span>
            </div>
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>AC</span>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Pickup</span>
            </div>
            <span className="text-sm text-gray-600">{pickup.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Drop</span>
            </div>
            <span className="text-sm text-gray-600">{destination.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
