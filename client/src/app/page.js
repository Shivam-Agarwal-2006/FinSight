import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">
          FinSight
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-10 py-24 text-center">
        <h1 className="text-6xl font-bold mb-6">
          AI-Powered Financial Research
        </h1>

        <p className="text-xl text-slate-300 mb-10">
          Analyze market sentiment, track financial news,
          and generate AI-powered company insights.
        </p>

        <Link
          href="/register"
          className="bg-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-10 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              Financial News
            </h3>

            <p className="text-slate-400">
              Aggregate the latest company news from
              trusted financial sources.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              FinBERT Sentiment Analysis
            </h3>

            <p className="text-slate-400">
              Detect whether market news is positive,
              negative, or neutral.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3">
              AI Summaries
            </h3>

            <p className="text-slate-400">
              Generate concise company insights from
              multiple articles.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}