import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserDataDhruv } from "../context/UserContext.dhruv";
import { motion } from "framer-motion";
import { FaPills, FaEnvelope, FaLock, FaSignInAlt, FaShieldAlt, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function LoginDhruvEnhanced() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, btnLoading } = UserDataDhruv();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    loginUser(email, password, navigate);
  };

  const features = [
    { icon: <FaShieldAlt />, title: "100% Secure", desc: "Your data is encrypted and safe" },
    { icon: <FaPills />, title: "Wide Selection", desc: "1000+ medicines available" },
    { icon: <FaUserCircle />, title: "Easy Ordering", desc: "Quick checkout process" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block"
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg"
            >
              <FaPills className="text-white text-4xl" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">NexPharma</h1>
              <p className="text-gray-600">Your Trusted Health Partner</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Access your account to order medicines, track deliveries, and manage prescriptions with ease.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-md border border-gray-200"
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={btnLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {btnLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSignInAlt />
                  </motion.div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/dhruv/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
            <Link
              to="/forgot"
              className="text-sm text-gray-500 hover:text-gray-700 block"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> Use any registered email
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
