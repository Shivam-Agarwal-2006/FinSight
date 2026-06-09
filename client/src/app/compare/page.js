"use client";

import { useState } from "react";
import api from "../../services/api";
import Link from "next/link";
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
        <div className="min-h-screen bg-slate-950 text-white p-10">
            <Link href="/dashboard">
                <button className="mb-6 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                    ← Back to Dashboard
                </button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">
                Company Comparison
            </h1>

            <p className="text-slate-400 mb-8">
                Compare market sentiment and AI-generated insights for two companies.
            </p>

            <form
                onSubmit={handleCompare}
                className="grid md:grid-cols-3 gap-4 mb-8"
            >
                <input
                    value={companyA}
                    onChange={(e) => setCompanyA(e.target.value)}
                    placeholder="First company e.g. NVIDIA"
                    className="p-3 rounded-lg bg-slate-800"
                />

                <input
                    value={companyB}
                    onChange={(e) => setCompanyB(e.target.value)}
                    placeholder="Second company e.g. AMD"
                    className="p-3 rounded-lg bg-slate-800"
                />

                <button className="bg-blue-600 rounded-lg font-semibold">
                    Compare
                </button>
            </form>

            {loading && (
                <div className="bg-slate-900 p-6 rounded-xl mb-8">
                    <p className="text-blue-400">
                        Comparing companies using news, FinBERT sentiment, and AI summaries...
                    </p>
                </div>
            )}

            {resultA && resultB && (
                <>
                    <div className="bg-slate-900 p-6 rounded-xl mb-8">
                        <h2 className="text-2xl font-bold mb-4">
                            Sentiment Comparison
                        </h2>

                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="sentiment" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey={resultA.company} fill="#2563eb" />
                                    <Bar dataKey={resultB.company} fill="#9333ea" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[resultA, resultB].map((result) => (
                            <div
                                key={result.company}
                                className="bg-slate-900 p-6 rounded-xl"
                            >
                                <h2 className="text-3xl font-bold mb-4">
                                    {result.company.toUpperCase()}
                                </h2>

                                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                                    <div>
                                        <p className="text-green-400 text-2xl font-bold">
                                            {result.counts.positive}
                                        </p>
                                        <p className="text-slate-400">Positive</p>
                                    </div>

                                    <div>
                                        <p className="text-yellow-400 text-2xl font-bold">
                                            {result.counts.neutral}
                                        </p>
                                        <p className="text-slate-400">Neutral</p>
                                    </div>

                                    <div>
                                        <p className="text-red-400 text-2xl font-bold">
                                            {result.counts.negative}
                                        </p>
                                        <p className="text-slate-400">Negative</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2">
                                    AI Summary
                                </h3>

                                <p className="text-slate-300">
                                    {result.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}