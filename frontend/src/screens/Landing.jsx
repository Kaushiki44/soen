import React from 'react'
import { Link } from 'react-router-dom'

const features = [
    {
        icon: 'ri-sparkling-2-fill',
        title: 'AI Code Generation',
        desc: 'Describe what you need and let the AI write production-ready code instantly — no prompting expertise required.',
        glow: 'from-indigo-500/20 to-purple-500/10',
        border: 'border-indigo-700/30',
        iconBg: 'from-indigo-500 to-purple-600',
        hoverBorder: 'hover:border-indigo-500/60',
        accent: 'text-indigo-400',
    },
    {
        icon: 'ri-team-fill',
        title: 'Real-time Collaboration',
        desc: 'Code with teammates in the same workspace simultaneously. See every change live with zero lag.',
        glow: 'from-violet-500/20 to-fuchsia-500/10',
        border: 'border-violet-700/30',
        iconBg: 'from-violet-500 to-fuchsia-600',
        hoverBorder: 'hover:border-violet-500/60',
        accent: 'text-violet-400',
    },
    {
        icon: 'ri-play-circle-fill',
        title: 'Live Code Execution',
        desc: 'Run your project directly in the browser via WebContainers. No setup, no config — just results.',
        glow: 'from-emerald-500/20 to-cyan-500/10',
        border: 'border-emerald-700/30',
        iconBg: 'from-emerald-500 to-cyan-600',
        hoverBorder: 'hover:border-emerald-500/60',
        accent: 'text-emerald-400',
    },
]

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans overflow-x-hidden">

            {/* ── Ambient blobs ───────────────────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-700/15 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-[-10%] w-[400px] h-[400px] bg-purple-700/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-3xl" />
            </div>

            {/* ── NAVBAR ──────────────────────────────────────────────────── */}
            <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 h-14 border-b border-indigo-900/30 bg-gray-950/80 backdrop-blur-md">
                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-900/50">
                        <i className="ri-code-s-slash-fill text-white text-sm"></i>
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">CodeSync</span>
                        <span className="text-gray-200"> AI</span>
                    </span>
                </div>

                {/* Nav right */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        id="nav-login-btn"
                        className="px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-700/50 rounded-lg hover:bg-indigo-900/40 hover:border-indigo-500 hover:text-indigo-100 transition-all duration-200"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        id="nav-register-btn"
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 hover:shadow-md hover:shadow-indigo-900/50 transition-all duration-200"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* ── HERO ────────────────────────────────────────────────────── */}
            <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-indigo-700/40 bg-indigo-950/50 text-indigo-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8] animate-pulse"></span>
                    Powered by AI · Built for developers
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-5">
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Code Smarter
                    </span>
                    <br />
                    <span className="text-gray-100">with AI</span>
                </h1>

                {/* Subtitle */}
                <p className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
                    Collaborate, generate, and run code in real-time — all inside one intelligent workspace.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/register"
                        id="hero-get-started-btn"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white
                                   bg-gradient-to-r from-indigo-600 to-purple-600
                                   hover:from-indigo-500 hover:to-purple-500
                                   hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-900/50
                                   active:scale-[0.98] transition-all duration-200"
                    >
                        <i className="ri-rocket-line"></i>
                        Get Started — it's free
                    </Link>
                    <Link
                        to="/login"
                        id="hero-login-btn"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-indigo-300
                                   border border-indigo-700/50 bg-indigo-950/40
                                   hover:bg-indigo-900/40 hover:border-indigo-500 hover:text-indigo-100
                                   active:scale-[0.98] transition-all duration-200"
                    >
                        Login
                        <i className="ri-arrow-right-line text-xs"></i>
                    </Link>
                </div>

                {/* Hero glow disc */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-700/10 rounded-full blur-3xl pointer-events-none -z-10" />
            </section>

            {/* ── FEATURES ────────────────────────────────────────────────── */}
            <section className="relative z-10 px-6 md:px-12 pb-28">
                <div className="max-w-5xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-12">
                        <p className="text-[11px] font-semibold tracking-widest text-indigo-500 uppercase mb-2">What you get</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
                            Everything you need to ship faster
                        </h2>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className={`group relative flex flex-col gap-4 p-6 rounded-2xl border ${f.border} ${f.hoverBorder}
                                            bg-gradient-to-br ${f.glow} bg-gray-900/60 backdrop-blur-sm
                                            hover:shadow-xl hover:scale-[1.02]
                                            transition-all duration-300 cursor-default overflow-hidden`}
                            >
                                {/* Card top glow line */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* Icon */}
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <i className={`${f.icon} text-white text-lg`}></i>
                                </div>

                                {/* Text */}
                                <div className="flex flex-col gap-1.5">
                                    <h3 className={`font-semibold text-sm ${f.accent}`}>{f.title}</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                                </div>

                                {/* Hover glow */}
                                <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${f.iconBg} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-indigo-900/20 px-6 py-6 flex items-center justify-center">
                <p className="text-[11px] text-gray-700">
                    © {new Date().getFullYear()} CodeSync AI — Built for developers, by developers.
                </p>
            </footer>

        </div>
    )
}

export default Landing
