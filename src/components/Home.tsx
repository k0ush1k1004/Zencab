import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { MapPin, Navigation, Search } from "lucide-react";
import { Location } from "../App";

type HomeProps = {
  onBookRide: (pickup: Location, destination: Location) => void;
};

const containerStyle = { width: "100%", height: "100vh" };
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function Home({ onBookRide }: HomeProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [route, setRoute] = useState<google.maps.LatLngLiteral[]>([]);

  const [pickupValue, setPickupValue] = useState("");
  const [destinationValue, setDestinationValue] = useState("");

  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  // Draw polyline route
  useEffect(() => {
    if (!isLoaded || !pickup || !destination) return;
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: pickup,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result?.routes[0]) {
          const path = google.maps.geometry.encoding.decodePath(
            result.routes[0].overview_polyline || ""
          );
          setRoute(path.map((p) => ({ lat: p.lat(), lng: p.lng() })));
        }
      }
    );
  }, [pickup, destination, isLoaded]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const loc = {
      lat: e.latLng?.lat() || 0,
      lng: e.latLng?.lng() || 0,
      address: "Pinned location",
    };

    if (!pickup) {
      setPickup(loc);
      setPickupValue("Pinned pickup");
    } else if (!destination) {
      setDestination(loc);
      setDestinationValue("Pinned drop-off");
    }
  };

  const handlePlaceChanged = (type: "pickup" | "destination") => {
    const ac =
      type === "pickup" ? pickupRef.current : destinationRef.current;
    const place = ac?.getPlace();
    if (!place?.geometry?.location) return;

    const loc = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      address: place.name || place.formatted_address || "",
    };

    if (type === "pickup") {
      setPickup(loc);
      setPickupValue(place.name || place.formatted_address || "");
      mapRef.current?.panTo(loc);
    } else {
      setDestination(loc);
      setDestinationValue(place.name || place.formatted_address || "");
      mapRef.current?.panTo(loc);
    }
  };

  const confirmRide = () => {
    if (pickup && destination) onBookRide(pickup, destination);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Search UI */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg bg-white p-4 rounded-2xl shadow-lg z-10 space-y-3">
        {/* Pickup */}
        {isLoaded && (
          <Autocomplete
            onLoad={(ac) => (pickupRef.current = ac)}
            onPlaceChanged={() => handlePlaceChanged("pickup")}
          >
            <div className="flex items-center bg-gray-100 rounded-lg p-2">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                value={pickupValue}
                onChange={(e) => setPickupValue(e.target.value)}
                placeholder="Enter pickup location"
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </Autocomplete>
        )}

        {/* Destination */}
        {isLoaded && (
          <Autocomplete
            onLoad={(ac) => (destinationRef.current = ac)}
            onPlaceChanged={() => handlePlaceChanged("destination")}
          >
            <div className="flex items-center bg-gray-100 rounded-lg p-2">
              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                value={destinationValue}
                onChange={(e) => setDestinationValue(e.target.value)}
                placeholder="Enter drop-off location"
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </Autocomplete>
        )}

        <button
          onClick={confirmRide}
          disabled={!pickup || !destination}
          className="w-full bg-[#00BFA6] text-white py-2 rounded-lg font-semibold hover:bg-[#009688] transition disabled:opacity-50"
        >
          Confirm Ride
        </button>
      </div>

      {/* Map */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={pickup || { lat: 22.5726, lng: 88.3639 }}
          zoom={13}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={handleMapClick}
          options={{ disableDefaultUI: false, zoomControl: true }}
        >
          {pickup && (
            <Marker
              position={pickup}
              label="P"
              draggable
              onDragEnd={(e) =>
                setPickup({
                  lat: e.latLng?.lat() || 0,
                  lng: e.latLng?.lng() || 0,
                  address: pickup.address,
                })
              }
            />
          )}
          {destination && (
            <Marker
              position={destination}
              label="D"
              draggable
              onDragEnd={(e) =>
                setDestination({
                  lat: e.latLng?.lat() || 0,
                  lng: e.latLng?.lng() || 0,
                  address: destination.address,
                })
              }
            />
          )}
          {route.length > 0 && (
            <Polyline path={route} options={{ strokeColor: "#00BFA6", strokeWeight: 5 }} />
          )}
        </GoogleMap>
      )}

      {/* Floating GPS Button */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              const loc = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                address: "Current location",
              };
              setPickup(loc);
              setPickupValue("Current location");
              mapRef.current?.panTo(loc);
            });
          }
        }}
        className="absolute bottom-6 right-6 bg-white p-4 rounded-full shadow-md hover:scale-105 transition"
      >
        <Navigation className="w-6 h-6 text-[#00BFA6]" />
      </button>
    </div>
  );
}
