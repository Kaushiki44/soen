import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'

const Login = () => {


    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()

    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)

            navigate('/home')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">

            {/* Ambient background glow blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-700/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Login card */}
            <div className="relative z-10 bg-gray-900/80 backdrop-blur-xl border border-indigo-900/40 rounded-2xl shadow-2xl shadow-indigo-950/60 w-full max-w-md mx-4 p-8"
                style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.15), 0 25px 50px -12px rgba(79,70,229,0.25)' }}
            >
                {/* Top glow line */}
                <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"></div>

                {/* Branding */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-900/50 mb-3">
                        <i className="ri-code-s-slash-fill text-white text-xl"></i>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">CodeSync</span>
                        <span className="text-gray-200"> AI</span>
                    </h1>
                    <p className="text-gray-500 text-xs mt-1.5">Login to your account to continue</p>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">

                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase" htmlFor="email">
                            Email
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 text-gray-100 text-sm placeholder-gray-600
                                       focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-400 tracking-wider uppercase" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 text-gray-100 text-sm placeholder-gray-600
                                       focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        id="login-submit-btn"
                        className="mt-1 w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white
                                   bg-gradient-to-r from-indigo-600 to-purple-600
                                   hover:from-indigo-500 hover:to-purple-500
                                   hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-900/50
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                                   active:scale-[0.98]
                                   transition-all duration-200 ease-out"
                    >
                        Login
                    </button>
                </form>

                {/* Footer link */}
                <p className="text-gray-600 text-xs text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login