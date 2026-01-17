import React, { useState } from 'react'
import { UserDataDhruv } from '../context/UserContext.dhruv'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPills, FaPhone } from 'react-icons/fa'
import { theme } from '../theme'

const RegisterDhruv = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState("")
    
    const { registerUser, btnLoading } = UserDataDhruv()
    const navigate = useNavigate()
    
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Validation
        if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
        // Mobile number validation (basic - 10 digits)
        const mobileRegex = /^[0-9]{10}$/
        if (!mobileRegex.test(mobile)) {
            setFormError("Please enter a valid 10-digit mobile number")
            return
        }
        
        if (password !== confirmPassword) {
            setFormError("Passwords do not match")
            return
        }
        
        if (password.length < 6) {
            setFormError("Password must be at least 6 characters")
            return
        }
        
        setFormError("")
        registerUser(name, email, mobile, password, navigate)
    }
    
    // Animation variants
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
    }
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }
    
    return (
        <div className='min-h-screen flex items-center justify-center py-8' style={{ background: theme.background }}>
            <motion.div 
                className='p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-sm'
                style={{ 
                    background: theme.surface, 
                    border: `1px solid ${theme.border}` 
                }}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Logo/Brand Section */}
                <motion.div className='text-center mb-4' variants={itemVariants}>
                    <div className='flex items-center justify-center mb-2'>
                        <FaPills className='text-4xl' style={{ color: theme.primary }} />
                    </div>
                    <h2 className='text-xl font-semibold' style={{ color: theme.primary }}>
                        Digital Pharmacy
                    </h2>
                </motion.div>
                
                <motion.h2 className='text-2xl font-bold text-center mb-6' 
                    style={{ color: theme.textPrimary }} 
                    variants={itemVariants}
                >
                    Create Account
                </motion.h2>
                
                {formError && (
                    <motion.div 
                        className='mb-4 p-3 rounded text-sm'
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #EF4444',
                            color: '#DC2626'
                        }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {formError}
                    </motion.div>
                )}
                
                <form onSubmit={submitHandler}>
                    <motion.div className='mb-4' variants={itemVariants}>
                        <label 
                            htmlFor="name" 
                            className='block text-sm font-medium mb-1'
                            style={{ color: theme.textPrimary }}
                        >
                            FULL NAME
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaUser style={{ color: theme.textSecondary }} />
                            </div>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                type="text" 
                                id='name' 
                                className='w-full py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 transition-all'
                                style={{ 
                                    border: `1px solid ${theme.border}`,
                                    background: theme.surface,
                                    color: theme.textPrimary
                                }}
                                placeholder='Enter your full name'
                            />
                        </div>
                    </motion.div>

                    <motion.div className='mb-4' variants={itemVariants}>
                        <label 
                            htmlFor="mobile" 
                            className='block text-sm font-medium mb-1'
                            style={{ color: theme.textPrimary }}
                        >
                            MOBILE NUMBER
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaPhone style={{ color: theme.textSecondary }} />
                            </div>
                            <input 
                                value={mobile} 
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                                required 
                                type="tel" 
                                id='mobile' 
                                className='w-full py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 transition-all'
                                style={{ 
                                    border: `1px solid ${theme.border}`,
                                    background: theme.surface,
                                    color: theme.textPrimary
                                }}
                                placeholder='Enter 10-digit mobile number'
                                maxLength="10"
                            />
                        </div>
                    </motion.div>

                    <motion.div className='mb-4' variants={itemVariants}>
                        <label 
                            htmlFor="email" 
                            className='block text-sm font-medium mb-1'
                            style={{ color: theme.textPrimary }}
                        >
                            EMAIL
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaEnvelope style={{ color: theme.textSecondary }} />
                            </div>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                type="email" 
                                id='email' 
                                className='w-full py-2 pl-10 pr-3 rounded-md focus:outline-none focus:ring-2 transition-all'
                                style={{ 
                                    border: `1px solid ${theme.border}`,
                                    background: theme.surface,
                                    color: theme.textPrimary
                                }}
                                placeholder='Enter your email'
                            />
                        </div>
                    </motion.div>
                    
                    <motion.div className='mb-4' variants={itemVariants}>
                        <label 
                            htmlFor="password" 
                            className='block text-sm font-medium mb-1'
                            style={{ color: theme.textPrimary }}
                        >
                            PASSWORD
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaLock style={{ color: theme.textSecondary }} />
                            </div>
                            <input 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                type={showPassword ? "text" : "password"} 
                                id='password' 
                                className='w-full py-2 pl-10 pr-10 rounded-md focus:outline-none focus:ring-2 transition-all'
                                style={{ 
                                    border: `1px solid ${theme.border}`,
                                    background: theme.surface,
                                    color: theme.textPrimary
                                }}
                                placeholder='Create a password'
                            />
                            <div 
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 
                                    <FaEyeSlash style={{ color: theme.textSecondary }} /> : 
                                    <FaEye style={{ color: theme.textSecondary }} />
                                }
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className='mb-6' variants={itemVariants}>
                        <label 
                            htmlFor="confirmPassword" 
                            className='block text-sm font-medium mb-1'
                            style={{ color: theme.textPrimary }}
                        >
                            CONFIRM PASSWORD
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaLock style={{ color: theme.textSecondary }} />
                            </div>
                            <input 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                type={showConfirmPassword ? "text" : "password"} 
                                id='confirmPassword' 
                                className='w-full py-2 pl-10 pr-10 rounded-md focus:outline-none focus:ring-2 transition-all'
                                style={{ 
                                    border: `1px solid ${theme.border}`,
                                    background: theme.surface,
                                    color: theme.textPrimary
                                }}
                                placeholder='Confirm your password'
                            />
                            <div 
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 
                                    <FaEyeSlash style={{ color: theme.textSecondary }} /> : 
                                    <FaEye style={{ color: theme.textSecondary }} />
                                }
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.button 
                        type='submit' 
                        className='w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 flex items-center justify-center'
                        style={{ 
                            background: theme.primary,
                        }}
                        disabled={btnLoading}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, background: theme.primaryDark }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {btnLoading ? <LoadingAnimation /> : "CREATE ACCOUNT"}
                    </motion.button>
                </form>
                
                <motion.div className='mt-6 text-center' variants={itemVariants}>
                    <div style={{ color: theme.textSecondary }}>
                        Already have an account?{' '}
                        <Link to="/dhruv/login" className='font-medium hover:underline' style={{ color: theme.primary }}>
                            Sign in
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default RegisterDhruv
