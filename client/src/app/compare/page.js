"use client";

import { useState } from "react";
import api from "../../services/api";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ComparePage() {
    const [companyA, setCompanyA] = useState("");
    const [companyB, setCompanyB] = useState("");
    const [resultA, setResultA] = useState(null);
    const [resultB, setResultB] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeCompany = async (company) => {
        const newsRes = await api.get(`/news/${company}`);
        const articles = newsRes.data;

        const articlesWithSentiment = await Promise.all(
            articles.map(async (article) => {
                try {
                    const text = `${article.title || ""} ${article.description || ""}`;

                    const sentimentRes = await api.post("/sentiment", {
                        text,
                    });

                    const sentiment =
                        sentimentRes.data[0]?.label?.toLowerCase() || "neutral";

                    return {
                        ...article,
                        sentiment,
                    };
                } catch {
                    return {
                        ...article,
                        sentiment: "neutral",
                    };
                }
            })
        );

        const counts = {
            positive: 0,
            neutral: 0,
            negative: 0,
        };

        articlesWithSentiment.forEach((article) => {
            counts[article.sentiment] =
                (counts[article.sentiment] || 0) + 1;
        });

        const combinedText = articlesWithSentiment
            .map(
                (article) =>
                    `${article.title || ""} ${article.description || ""}`
            )
            .join(" ");

        let summary = "";

        try {
            const summaryRes = await api.post("/summary", {
                text: combinedText,
            });

            summary = summaryRes.data.summary;
        } catch {
            summary = "Summary could not be generated.";
        }

        return {
            company,
            articles: articlesWithSentiment,
            counts,
            summary,
        };
    };

    const handleCompare = async (e) => {
        e.preventDefault();

        if (!companyA.trim() || !companyB.trim()) return;

        try {
            setLoading(true);
            setResultA(null);
            setResultB(null);

            const [a, b] = await Promise.all([
                analyzeCompany(companyA),
                analyzeCompany(companyB),
            ]);

            setResultA(a);
            setResultB(b);
        } catch (error) {
            console.log(error);
            alert("Comparison failed");
        } finally {
            setLoading(false);
        }
    };

    const chartData =
        resultA && resultB
            ? [
                {
                    sentiment: "Positive",
                    [resultA.company]: resultA.counts.positive,
                    [resultB.company]: resultB.counts.positive,
                },
                {
                    sentiment: "Neutral",
                    [resultA.company]: resultA.counts.neutral,
                    [resultB.company]: resultB.counts.neutral,
                },
                {
                    sentiment: "Negative",
                    [resultA.company]: resultA.counts.negative,
                    [resultB.company]: resultB.counts.negative,
                },
            ]
            : [];

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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Company Comparison
                    </h1>
                    <p className="text-slate-400">
                        Compare market sentiment and AI-generated insights for two companies side by side.
                    </p>
                </div>

                {/* Search Form */}
                <form
                    onSubmit={handleCompare}
                    className="card mb-8 p-6"
                >
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                First Company
                            </label>
                            <input
                                type="text"
                                value={companyA}
                                onChange={(e) => setCompanyA(e.target.value)}
                                placeholder="e.g., NVIDIA"
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Second Company
                            </label>
                            <input
                                type="text"
                                value={companyB}
                                onChange={(e) => setCompanyB(e.target.value)}
                                placeholder="e.g., AMD"
                                className="w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-500 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Zap size={18} />
                            Compare
                        </button>
                    </div>
                </form>

                {/* Loading State */}
                {loading && (
                    <div className="card mb-8">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin">⚙️</div>
                            <div>
                                <p className="text-blue-400 font-semibold">
                                    Comparing companies using news, FinBERT sentiment, and AI summaries...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {resultA && resultB && (
                    <>
                        {/* Chart */}
                        <div className="card mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6">
                                Sentiment Comparison Chart
                            </h2>

                            <div className="w-full overflow-x-auto">
                                <div className="min-w-full h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <XAxis dataKey="sentiment" tick={{ fill: "#cbd5e1" }} />
                                            <YAxis allowDecimals={false} tick={{ fill: "#cbd5e1" }} />
                                            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                                            <Bar dataKey={resultA.company} fill="#2563eb" />
                                            <Bar dataKey={resultB.company} fill="#9333ea" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Cards */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Company A */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-blue-400">
                                    {resultA.company}
                                </h3>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-500/50 p-4 rounded-lg text-center">
                                        <p className="text-green-400 text-2xl font-bold">{resultA.counts.positive}</p>
                                        <p className="text-slate-400 text-sm">Positive</p>
                                    </div>
                                    <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/50 p-4 rounded-lg text-center">
                                        <p className="text-yellow-400 text-2xl font-bold">{resultA.counts.neutral}</p>
                                        <p className="text-slate-400 text-sm">Neutral</p>
                                    </div>
                                    <div className="bg-linear-to-br from-red-500/10 to-red-600/10 border border-red-500/50 p-4 rounded-lg text-center">
                                        <p className="text-red-400 text-2xl font-bold">{resultA.counts.negative}</p>
                                        <p className="text-slate-400 text-sm">Negative</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <p className="text-slate-300 leading-relaxed">{resultA.summary}</p>
                                </div>
                            </div>

                            {/* Company B */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4 text-purple-400">
                                    {resultB.company}
                                </h3>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-500/50 p-4 rounded-lg text-center">
                                        <p className="text-green-400 text-2xl font-bold">{resultB.counts.positive}</p>
                                        <p className="text-slate-400 text-sm">Positive</p>
                                    </div>
                                    <div className="bg-linear-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/50 p-4 rounded-lg text-center">
                                        <p className="text-yellow-400 text-2xl font-bold">{resultB.counts.neutral}</p>
                                        <p className="text-slate-400 text-sm">Neutral</p>
                                    </div>
                                    <div className="bg-linear-to-br from-red-500/10 to-red-600/10 border border-red-500/50 p-4 rounded-lg text-center">
                                        <p className="text-red-400 text-2xl font-bold">{resultB.counts.negative}</p>
                                        <p className="text-slate-400 text-sm">Negative</p>
                                    </div>
                                </div>

                                <div className="card">
                                    <p className="text-slate-300 leading-relaxed">{resultB.summary}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}
