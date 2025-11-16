import { useUser, UserButton } from "@clerk/clerk-react";
import { Home, User } from "lucide-react";

type HeaderProps = {
  goHome: () => void;
  goProfile: () => void;
};

export default function Header({ goHome, goProfile }: HeaderProps) {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left - Logo */}
        <div
          onClick={goHome}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Home className="w-6 h-6 text-[#00BFA6]" />
          <h1 className="text-xl font-bold text-[#00BFA6]">ZENCAB</h1>
        </div>

        {/* Middle - Welcome */}
        <div className="hidden sm:flex flex-col items-center">
          {user ? (
            <>
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user.firstName}</span>
              </p>
              <p className="text-xs text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Welcome Guest</p>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={goProfile}
            className="flex items-center space-x-1 text-[#00BFA6] font-semibold hover:text-[#009688] transition"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Clerk User Button (visible if signed in) */}
          {user && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </header>
  );
}
