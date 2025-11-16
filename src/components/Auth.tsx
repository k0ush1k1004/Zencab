import { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();

  useEffect(() => {
    document.title = isLogin ? 'Login | ZenCab' : 'Sign Up | ZenCab';
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin && signIn) {
        const res = await signIn.create({ identifier: email, password });
        if (res.status === 'complete') {
          await setSignInActive({ session: res.createdSessionId });
        }
      } else if (signUp) {
        const res = await signUp.create({
          emailAddress: email,
          password,
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ')[1] || '',
          phoneNumber: phone || undefined,
        });
        if (res.status === 'complete') {
          await setSignUpActive({ session: res.createdSessionId });
        }
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message?: string }> };
      setError(error.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#00BFA6] p-4 rounded-full mb-4 shadow-md">
          <Car className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#27857c]">ZenCab</h1>
        <p className="text-gray-700 mt-2">Your ride. Your vibe.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00BFA6]"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00BFA6]"
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00BFA6]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00BFA6]"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00BFA6] text-white py-3 rounded-lg font-semibold hover:bg-[#009688]"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#00BFA6] font-medium hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
