import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryBoyForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setFormError("Please enter your email");
      return;
    }
    
    setFormError("");
    setBtnLoading(true);

    try {
      const { data } = await axios.post('/api/delivery-boy/forget-password', { email });
      toast.success(data.message);
      navigate(`/delivery-boy/reset-password/${data.token}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      setFormError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setBtnLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F0F3FB]'>
      <motion.div 
        className='p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm bg-[#FCFCFE] border border-[#C7C9CE]'
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className='flex justify-center mb-4' variants={itemVariants}>
          <div className='bg-[#055AF9] p-3 rounded-full'>
            <FaTruck className='text-3xl text-white' />
          </div>
        </motion.div>

        <motion.h2 className='text-xl font-semibold text-center mb-2 text-[#055AF9]' variants={itemVariants}>
          NexPharma DELIVERY
        </motion.h2>
        
        <motion.h2 className='text-2xl font-bold text-[#343838] text-center mb-2' variants={itemVariants}>
          Forgot Password
        </motion.h2>

        <motion.p className='text-center text-[#7F7E85] mb-6 text-sm' variants={itemVariants}>
          Enter your email and we'll send you an OTP to reset your password
        </motion.p>
        
        {formError && (
          <motion.div 
            className='mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-600 text-sm'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formError}
          </motion.div>
        )}
        
        <form onSubmit={submitHandler}>
          <motion.div className='mb-6' variants={itemVariants}>
            <label htmlFor="email" className='block text-sm font-medium text-[#343838] mb-1'>
              EMAIL
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaEnvelope className='text-[#7F7E85]' />
              </div>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                type="email" 
                id='email' 
                className='w-full py-2 pl-10 pr-3 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] focus:border-transparent' 
                placeholder='Enter your email'
              />
            </div>
          </motion.div>
          
          <motion.button 
            type='submit' 
            className='w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#055AF9] hover:bg-[#013188] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#055AF9] transition-colors duration-200 flex items-center justify-center'
            disabled={btnLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {btnLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "SEND OTP"
            )}
          </motion.button>
        </form>
        
        <motion.div className='mt-6 text-center' variants={itemVariants}>
          <div className='text-[#7F7E85]'>
            Remember your password?{' '}
            <Link to="/delivery-boy/login" className='font-medium text-[#055AF9] hover:text-[#013188] hover:underline'>
              Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeliveryBoyForgotPassword;