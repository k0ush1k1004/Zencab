import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentVerification({ onVerified, forceNewVerification }: { onVerified?: () => void; forceNewVerification?: boolean }) {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const studentDomainsIndia = [
    "caluniv.ac.in", "jadavpuruniversity.in", "jadavpuruniversity.org", "presiuniv.ac.in", "vidyasagar.ac.in", "visva-bharati.ac.in", "rbu.ac.in", "klyuniv.ac.in", "buruniv.ac.in", "nbu.ac.in", "bankurauniv.ac.in", "makautwb.ac.in", "wbut.ac.in", "wbsu.ac.in", "aliah.ac.in", "dhwu.ac.in", "sanskritcollege.ac.in", "brainwareuniversity.ac.in", "technoindiauniversity.ac.in", "adamasuniversity.ac.in", "seacomskillsuniversity.ac.in", "snu.edu.in", "jisuniversity.ac.in", "tnu.in", "uem.edu.in", "amity.edu", "iem.edu.in", "ticollege.org", "stcet.ac.in", "rcciit.org.in", "nsec.ac.in", "heritageit.edu", "fiem.edu.in", "gnit.ac.in", "jit.edu.in", "aot.edu.in", "msit.edu.in", "iitkgp.ac.in", "iitd.ac.in", "iitb.ac.in", "iitm.ac.in", "iitr.ac.in", "iitk.ac.in", "iiti.ac.in", "iitj.ac.in", "iitp.ac.in", "iitg.ac.in", "iitbbs.ac.in", "iitbhilai.ac.in", "iitgoa.ac.in", "iith.ac.in", "iitdh.ac.in", "iitmandi.ac.in", "iitpkd.ac.in", "iitropar.ac.in", "nitsikkim.ac.in", "nitdgp.ac.in", "nitk.ac.in", "nitt.edu", "nitj.ac.in", "nitrkl.ac.in", "nitw.ac.in", "nitc.ac.in", "nitrr.ac.in", "nitp.ac.in", "nitttrbpl.ac.in", "du.ac.in", "jnu.ac.in", "amu.ac.in", "bharti.ac.in", "ignou.ac.in", "apu.edu.in", "vit.ac.in", "vitstudent.ac.in", "srmuniv.ac.in", "manipal.edu", "amrita.edu", "christuniversity.in", "srmist.edu.in", "lpu.in", "bml.edu.in", "pgimer.edu.in", "aiims.edu", "aiimspatna.org", "aiimsbhubaneswar.edu.in", "aiimskalyani.edu.in", "cmcvellore.ac.in", "sgpgims.in", "iimcal.ac.in", "iimahd.ernet.in", "iimb.ac.in", "iiml.ac.in", "iimtrichy.ac.in", "iimraipur.ac.in", "iimrohtak.ac.in", "iimudaipur.ac.in", 'mit.edu', 'harvard.edu', 'stanford.edu', 'berkeley.edu', 'ntu.edu.sg', 'nus.edu.sg', 'ox.ac.uk', 'cam.ac.uk', "ac.in", "edu.in", "edu", "ac.uk", "university.edu", "college.edu", "student.edu"
  ];

  const sendOtpToEmail = async () => {
    if (!email) {
      setMessage('Please enter your student email');
      setVerificationStatus('error');
      return;
    }
    setIsVerifying(true);
    setVerificationStatus('idle');
    const domain = email.split('@')[1]?.toLowerCase();
    const isValidDomain = domain && (
      studentDomainsIndia.includes(domain) ||
      domain.endsWith('.edu') ||
      domain.includes('.edu.') ||
      domain.endsWith('.ac.in') ||
      domain.endsWith('.ac.uk')
    );
    if (!isValidDomain) {
      setVerificationStatus('error');
      setMessage('❌ Email domain not recognized as a student institution. Please use your official student email.');
      setIsVerifying(false);
      return;
    }
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(`otp_${email}`, generatedOtp);
      sessionStorage.setItem(`otp_${email}_timestamp`, Date.now().toString());
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`🔐 Demo OTP for ${email}: ${generatedOtp}`);
      setVerificationStatus('pending');
      setShowOtpInput(true);
      setMessage(`📧 OTP sent to ${email}. Please check your inbox and enter the 6-digit code. (Demo: Check console for OTP)`);
    } catch (error: any) {
      setVerificationStatus('error');
      setMessage(`❌ Failed to send OTP: ${error.message || 'Please try again'}`);
    }
    setIsVerifying(false);
  };

  const verifyOtp = async () => {
    if (!otpCode) {
      setMessage('Please enter the OTP code');
      setVerificationStatus('error');
      return;
    }
    setIsVerifying(true);
    setVerificationStatus('idle');
    try {
      const storedOtp = sessionStorage.getItem(`otp_${email}`);
      const otpTimestamp = sessionStorage.getItem(`otp_${email}_timestamp`);
      if (!storedOtp || !otpTimestamp) {
        throw new Error('No OTP found. Please request a new one.');
      }
      const isExpired = Date.now() - parseInt(otpTimestamp) > 5 * 60 * 1000;
      if (isExpired) {
        sessionStorage.removeItem(`otp_${email}`);
        sessionStorage.removeItem(`otp_${email}_timestamp`);
        throw new Error('OTP expired. Please request a new one.');
      }
      if (otpCode === storedOtp) {
        sessionStorage.removeItem(`otp_${email}`);
        sessionStorage.removeItem(`otp_${email}_timestamp`);
        setVerificationStatus('success');
        setIsEmailVerified(true);
        setMessage(`✅ Email verified successfully! You now qualify for student discounts.`);
        setShowOtpInput(false);
        localStorage.setItem('studentEmailVerified', JSON.stringify({
          email: email,
          verifiedAt: new Date().toISOString(),
          domain: email.split('@')[1]
        }));
        if (onVerified) onVerified();
      } else {
        throw new Error('Invalid OTP code');
      }
    } catch (error: any) {
      setVerificationStatus('error');
      setMessage(`❌ ${error.message || 'Verification failed. Please try again.'}`);
    }
    setIsVerifying(false);
  };

  useEffect(() => {
    if (forceNewVerification) {
      // Always require new verification, clear any previous
      setIsEmailVerified(false);
      setEmail('');
      setVerificationStatus('idle');
      setMessage('');
      localStorage.removeItem('studentEmailVerified');
      return;
    }
    const storedVerification = localStorage.getItem('studentEmailVerified');
    if (storedVerification) {
      try {
        const verificationData = JSON.parse(storedVerification);
        const verifiedAt = new Date(verificationData.verifiedAt);
        const now = new Date();
        const daysDiff = (now.getTime() - verifiedAt.getTime()) / (1000 * 3600 * 24);
        if (daysDiff < 30) {
          setIsEmailVerified(true);
          setEmail(verificationData.email);
          setVerificationStatus('success');
          setMessage(`✅ Previously verified: ${verificationData.email}`);
        }
      } catch (error) {
        localStorage.removeItem('studentEmailVerified');
      }
    }
  }, [forceNewVerification]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20" id="student-verification">
      <div className="pl-8 pr-6 py-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-black mb-2">🎓 Student Verification</h3>
          <p className="text-sm text-black">Get exclusive student discounts on rides!</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00BFA6]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your student email (.edu, .ac.in, etc.)"
              className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 border border-[#00BFA6]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent shadow-sm"
              disabled={isVerifying}
            />
          </div>
          {!showOtpInput ? (
            <motion.button
              onClick={sendOtpToEmail}
              disabled={isVerifying || !email || isEmailVerified}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isVerifying || !email || isEmailVerified
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#00BFA6] hover:bg-[#009688] active:scale-95'
              } text-white`}
              whileHover={{ scale: isVerifying ? 1 : 1.02 }}
              whileTap={{ scale: isVerifying ? 1 : 0.98 }}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </div>
              ) : isEmailVerified ? (
                'Already Verified ✓'
              ) : (
                'Send OTP Code'
              )}
            </motion.button>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent text-center text-lg tracking-wider"
                  maxLength={6}
                  disabled={isVerifying}
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={verifyOtp}
                  disabled={isVerifying || otpCode.length !== 6}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    isVerifying || otpCode.length !== 6
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-[#00BFA6] hover:bg-[#009688] active:scale-95'
                  } text-white`}
                  whileHover={{ scale: isVerifying ? 1 : 1.02 }}
                  whileTap={{ scale: isVerifying ? 1 : 0.98 }}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtpCode('');
                    setVerificationStatus('idle');
                    setMessage('');
                  }}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
              <button
                onClick={sendOtpToEmail}
                disabled={isVerifying}
                className="w-full text-sm text-blue-400 hover:text-blue-300 underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          )}
          {verificationStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start space-x-2 p-3 rounded-lg ${
                verificationStatus === 'success'
                  ? 'bg-green-500/20 border border-green-500/30'
                  : verificationStatus === 'pending'
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}
            >
              {verificationStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              ) : verificationStatus === 'pending' ? (
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                verificationStatus === 'success'
                  ? 'text-green-300'
                  : verificationStatus === 'pending'
                  ? 'text-blue-300'
                  : 'text-red-300'
              }`}>
                {message}
              </p>
            </motion.div>
          )}
          {isEmailVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center"
            >
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-300">
                ✅ Email Verified! You now qualify for student discounts.
              </p>
            </motion.div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-black/10">
          <p className="text-xs text-black text-center">
            Supported: IITs, NITs, IIMs, major Indian universities (.ac.in, .edu.in), and international institutions (.edu, .ac.uk)
          </p>
        </div>
      </div>
    </div>
  );
}
