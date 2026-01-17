import React, { useState, useEffect } from 'react'
import { UserDataDhruv } from '../context/UserContext.dhruv'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPills } from 'react-icons/fa'
import { theme } from '../theme'

const LoginDhruv = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formError, setFormError] = useState("")
    
    const { loginUser, btnLoading } = UserDataDhruv()
    const navigate = useNavigate()
   
    // Check if there's saved email in localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('dhruv_pharmacy_email')
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberMe(true)
        }
    }, [])
    
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Simple validation
        if (!email.trim() || !password.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
        // Save email if remember me is checked
        if (rememberMe) {
            localStorage.setItem('dhruv_pharmacy_email', email)
        } else {
            localStorage.removeItem('dhruv_pharmacy_email')
        }
        
        setFormError("")
        loginUser(email, password, navigate)
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
        <div className='min-h-screen flex items-center justify-center' style={{ background: theme.background }}>
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
                    Welcome Back
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
                    
                    <motion.div className='mb-6' variants={itemVariants}>
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
                                placeholder='Enter your password'
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
                    
                    <motion.div className='flex items-center justify-between mb-6' variants={itemVariants}>
                        <div className='flex items-center'>
                            <input 
                                type="checkbox" 
                                id="remember" 
                                className='h-4 w-4 rounded'
                                style={{ 
                                    accentColor: theme.primary,
                                    borderColor: theme.border 
                                }}
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label 
                                htmlFor="remember" 
                                className='ml-2 block text-sm'
                                style={{ color: theme.textSecondary }}
                            >
                                Remember me
                            </label>
                        </div>
                        <div>
                            <Link 
                                to="/dhruv/register" 
                                className='text-sm font-medium hover:underline'
                                style={{ color: theme.primary }}
                            >
                                Create account
                            </Link>
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
                        {btnLoading ? <LoadingAnimation /> : "SIGN IN"}
                    </motion.button>
                </form>
                
                <motion.div className='mt-6 text-center' variants={itemVariants}>
                    <div className='relative mb-4'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full' style={{ borderTop: `1px solid ${theme.border}` }}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span 
                                className='px-2' 
                                style={{ 
                                    background: theme.surface, 
                                    color: theme.textSecondary 
                                }}
                            >
                                Customer Portal
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ color: theme.textSecondary, fontSize: '14px' }}>
                        Search medicines, upload prescriptions & track orders
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default LoginDhruv
