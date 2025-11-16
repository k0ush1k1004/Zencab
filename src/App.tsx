import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/Header";
import Home from "./components/Home";
import Profile from "./components/Profile";
import DriverProfile from "./components/DriverProfile";
import RideOptions from "./components/RideOptions";
import RideTracking from "./components/RideTracking";
import RideComplete from "./components/RideComplete";
import LandingPage from "./components/LandingPage";

// ✅ Export globally so other files can import this type
export type Location = {
  address: string;
  lat: number;
  lng: number;
};

export default function App() {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState("home");
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [fare, setFare] = useState<number>(0);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [driverRating, setDriverRating] = useState<number>(4.8);

  // ✅ Booking flow
  const handleBookRide = (pickupLoc: Location, destinationLoc: Location) => {
    setPickup(pickupLoc);
    setDestination(destinationLoc);
    setCurrentPage("rideOptions");
  };

  const handleSelectRide = (type: string, cost: number, driver?: string) => {
    setVehicleType(type);
    setFare(cost);
    if (driver) setDriverName(driver);

    // Generate West Bengal vehicle number and random rating
    const wbPrefixes = ["WB", "WB-01", "WB-02", "WB-03", "WB-04"];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomPrefix = wbPrefixes[Math.floor(Math.random() * wbPrefixes.length)];
    const randomLetters = letters[Math.floor(Math.random() * letters.length)] +
                         letters[Math.floor(Math.random() * letters.length)];
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const generatedVehicleNumber = `${randomPrefix} ${randomLetters} ${randomNumbers}`;

    const randomRating = Math.round((4.0 + Math.random() * 1.0) * 10) / 10; // 4.0 to 5.0

    setVehicleNumber(generatedVehicleNumber);
    setDriverRating(randomRating);
    setCurrentPage("tracking");
  };

  const handleRideComplete = () => {
    setCurrentPage("complete");
  };

  const handleGoProfile = () => {
    setPreviousPage(currentPage);
    setCurrentPage("profile");
  };

  const handleGoDriverProfile = () => {
    setPreviousPage(currentPage);
    setCurrentPage("driverProfile");
  };

  const handleGoHome = () => {
    setCurrentPage("home");
  };

  const handleGoBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    } else {
      setCurrentPage("home");
    }
  };

  const handleCancelRide = () => {
    setCurrentPage("home");
  };

  if (!user) {
    return <LandingPage />;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* ✅ Simplified Header with unified props */}
        <Header goHome={handleGoHome} goProfile={handleGoProfile} />

        <main className="flex-1 overflow-y-auto">
          {currentPage === "home" && (
            <Home onBookRide={handleBookRide} />
          )}

          {currentPage === "rideOptions" && pickup && destination && (
            <RideOptions
              pickup={pickup}
              destination={destination}
              onBack={handleGoHome}
              onSelectRide={handleSelectRide}
            />
          )}

          {currentPage === "tracking" && pickup && destination && (
            <RideTracking
              pickup={pickup}
              destination={destination}
              vehicleType={vehicleType as any}
              driverName={driverName}
              vehicleNumber={vehicleNumber}
              driverRating={driverRating}
              goDriverProfile={handleGoDriverProfile}
              onCancel={handleCancelRide}
              onComplete={handleRideComplete}
            />
          )}

          {currentPage === "complete" && pickup && destination && (
            <RideComplete
              pickup={pickup}
              destination={destination}
              fare={fare}
              vehicle={vehicleType || "Sedan"}
              onFinish={handleGoHome}
            />

          )}

          {currentPage === "profile" && (
            <Profile onBack={handleGoBack} />
          )}

          {currentPage === "driverProfile" && (
            <DriverProfile
              driverName={driverName}
              driverRating={driverRating}
              vehicleType={vehicleType}
              vehicleNumber={vehicleNumber}
              onBack={handleGoBack}
            />
          )}
        </main>
      </div>
    </Router>
  );
}
