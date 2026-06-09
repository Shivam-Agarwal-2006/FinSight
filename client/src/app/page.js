import Link from "next/link";
import { TrendingUp, Brain, BarChart3, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FinSight
          </h1>

          <div className="flex gap-2 sm:gap-4">
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition text-sm sm:text-base"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition font-medium text-sm sm:text-base"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-32 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Financial
            </span>
            <br />
            <span className="text-white">Research Platform</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Analyze market sentiment, track financial news, and generate AI-powered company insights in real-time.
          </p>

          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Powerful Features
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Everything you need to make informed financial decisions
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="card group hover:shadow-lg">
            <div className="text-blue-400 mb-4 group-hover:scale-110 transition">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Financial News
            </h3>
            <p className="text-slate-400">
              Aggregate the latest company news from trusted financial sources
            </p>
          </div>

          <div className="card group hover:shadow-lg">
            <div className="text-purple-400 mb-4 group-hover:scale-110 transition">
              <Brain size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Sentiment Analysis
            </h3>
            <p className="text-slate-400">
              FinBERT-powered analysis to gauge market sentiment automatically
            </p>
          </div>

          <div className="card group hover:shadow-lg">
            <div className="text-pink-400 mb-4 group-hover:scale-110 transition">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Stock Analytics
            </h3>
            <p className="text-slate-400">
              Track stock prices, trends, and performance metrics in real-time
            </p>
          </div>

          <div className="card group hover:shadow-lg">
            <div className="text-green-400 mb-4 group-hover:scale-110 transition">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              AI Summaries
            </h3>
            <p className="text-slate-400">
              Get concise AI-generated insights from news articles instantly
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 sm:p-16 border border-blue-800/50">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Master Financial Markets?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors using FinSight for smarter financial decisions
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transform hover:scale-105 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2024 FinSight. All rights reserved.</p>
          <p className="mt-2 text-sm">AI-Powered Financial Intelligence</p>
        </div>
      </footer>

    </main>
  );
}
