import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Company() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Company Details
          </h1>
          <p className="text-slate-400 text-lg">
            Detailed company information coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}