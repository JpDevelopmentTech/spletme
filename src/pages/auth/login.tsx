import logo from "../../assets/images/2 - BLANCO.png";
import { motion } from "framer-motion";
import { UserPlus, ArrowRight, Shield, Sparkles, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleEmailLogin = () => {
    navigate("/auth/email-login");
  };

  const handleRegister = () => {
    navigate("/auth/register");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-blue-500" />
                <h1 className="text-4xl font-bold text-gray-800">
                  Welcome Back
                </h1>
              </div>
              <p className="text-gray-600 mb-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Ready to continue your journey? Sign in to access your account.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl 
                         hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 
                         shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-4"
              >
                <Mail className="w-5 h-5" />
                Sign in with Email
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <p className="text-center text-gray-600 mt-6 flex items-center justify-center gap-2">
                Don't have an account?{" "}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleRegister}
                  className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign up
                </motion.button>
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-full max-w-lg mx-auto"
              src={logo}
              alt="SplitMe Logo"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Split Expenses, Share Moments
              </h2>
              <p className="text-gray-600">
                The easiest way to manage shared expenses with friends and family
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
