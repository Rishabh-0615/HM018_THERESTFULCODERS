import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeliveryBoyChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setFormError("Please fill in all fields");
      return;
    }
    
    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match");
      return;
    }
    
    setFormError("");
    setBtnLoading(true);

    try {
      const { data } = await axios.put('/api/delivery-boy/change-password', { 
        currentPassword, 
        newPassword 
      });
      toast.success(data.message + " Please login again with your new password");
      navigate('/delivery-boy/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      setFormError(error.response?.data?.message || 'Failed to change password');
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
          Change Password
        </motion.h2>

        <motion.p className='text-center text-[#7F7E85] mb-6 text-sm' variants={itemVariants}>
          Please change your temporary password to secure your account
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
          <motion.div className='mb-4' variants={itemVariants}>
            <label htmlFor="currentPassword" className='block text-sm font-medium text-[#343838] mb-1'>
              CURRENT PASSWORD
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='text-[#7F7E85]' />
              </div>
              <input 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                type={showCurrentPassword ? "text" : "password"} 
                id='currentPassword' 
                className='w-full py-2 pl-10 pr-10 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] focus:border-transparent' 
                placeholder='Enter current password'
              />
              <div 
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? 
                  <FaEyeSlash className='text-[#7F7E85] hover:text-[#343838]' /> : 
                  <FaEye className='text-[#7F7E85] hover:text-[#343838]' />
                }
              </div>
            </div>
          </motion.div>

          <motion.div className='mb-4' variants={itemVariants}>
            <label htmlFor="newPassword" className='block text-sm font-medium text-[#343838] mb-1'>
              NEW PASSWORD
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='text-[#7F7E85]' />
              </div>
              <input 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                type={showNewPassword ? "text" : "password"} 
                id='newPassword' 
                className='w-full py-2 pl-10 pr-10 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] focus:border-transparent' 
                placeholder='Enter new password'
              />
              <div 
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? 
                  <FaEyeSlash className='text-[#7F7E85] hover:text-[#343838]' /> : 
                  <FaEye className='text-[#7F7E85] hover:text-[#343838]' />
                }
              </div>
            </div>
          </motion.div>

          <motion.div className='mb-6' variants={itemVariants}>
            <label htmlFor="confirmPassword" className='block text-sm font-medium text-[#343838] mb-1'>
              CONFIRM NEW PASSWORD
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaLock className='text-[#7F7E85]' />
              </div>
              <input 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                type={showConfirmPassword ? "text" : "password"} 
                id='confirmPassword' 
                className='w-full py-2 pl-10 pr-10 border border-[#C7C9CE] bg-[#FCFCFE] rounded-md text-[#343838] focus:outline-none focus:ring-2 focus:ring-[#055AF9] focus:border-transparent' 
                placeholder='Confirm new password'
              />
              <div 
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 
                  <FaEyeSlash className='text-[#7F7E85] hover:text-[#343838]' /> : 
                  <FaEye className='text-[#7F7E85] hover:text-[#343838]' />
                }
              </div>
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
              "CHANGE PASSWORD"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default DeliveryBoyChangePassword;