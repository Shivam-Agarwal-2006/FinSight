"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import Link from "next/link";
import SearchBar from "../../components/SearchBar";
import NewsCard from "../../components/NewsCard";
import tickerMap from "../../utils/tickerMap";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [currentCompany, setCurrentCompany] = useState("");
  const [stockData, setStockData] = useState(null);
  const [currentTicker, setCurrentTicker] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await api.get(
          "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);

      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };

    fetchUser();
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/watchlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWatchlist(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWatchlist();
  }, [router]);
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const searchCompany = async (company) => {
    const ticker =
      tickerMap[company.toLowerCase()] ||
      company.toUpperCase();

    setCurrentTicker(ticker);
    try {
      setCurrentCompany(company);
      setStockData(null);
      setLoading(true);
      setSummary("");
      setArticles([]);

      // Fetch stock data
      try {
        const stockRes = await api.get(
          `/stock/${ticker}`
        );

        setStockData(stockRes.data);
      } catch (error) {
        console.log("Stock data unavailable", error);
      }

      // Fetch news
      const res = await api.get(`/news/${company}`);

      // Analyze sentiment
      const articlesWithSentiment = await Promise.all(
        res.data.map(async (article) => {
          try {
            const text = `${article.title || ""} ${article.description || ""}`;

            const sentimentRes = await api.post("/sentiment", {
              text,
            });

            const sentimentLabel =
              sentimentRes.data[0]?.label?.toLowerCase() || "neutral";

            const confidence =
              sentimentRes.data[0]?.score || 0;

            return {
              ...article,
              sentiment: sentimentLabel,
              confidence,
            };
          } catch (error) {
            console.log(error);

            return {
              ...article,
              sentiment: "neutral",
              confidence: 0,
            };
          }
        })
      );

      setArticles(articlesWithSentiment);

      // Generate summary
      const combinedText = articlesWithSentiment
        .map(
          (article) =>
            `${article.title || ""} ${article.description || ""}`
        )
        .join(" ");

      if (combinedText.trim()) {
        const summaryRes = await api.post("/summary", {
          text: combinedText,
        });

        setSummary(summaryRes.data.summary);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const addToWatchlist = async () => {
    if (watchlist.includes(currentCompany)) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/watchlist",
        {
          company: currentCompany,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWatchlist(res.data);
      alert("Added to watchlist");
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromWatchlist = async (company) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/watchlist/${company}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWatchlist(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const sentimentCounts = articles.reduce(
    (acc, article) => {
      acc[article.sentiment] =
        (acc[article.sentiment] || 0) + 1;
      return acc;
    },
    {
      positive: 0,
      neutral: 0,
      negative: 0,
    }
  );

  const chartData = [
    {
      name: "Positive",
      value: sentimentCounts.positive,
      fill: "#16a34a",
    },
    {
      name: "Neutral",
      value: sentimentCounts.neutral,
      fill: "#ca8a04",
    },
    {
      name: "Negative",
      value: sentimentCounts.negative,
      fill: "#dc2626",
    },
  ];
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FinSight Dashboard
            </h1>
            {user && <p className="text-slate-400 text-sm mt-1">Welcome, {user.name}</p>}
          </div>

          <div className="flex gap-2 sm:gap-4">
            <Link href="/compare">
              <button className="px-3 sm:px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-lg hover:bg-purple-600/30 transition text-sm sm:text-base cursor-pointer">
                Compare
              </button>
            </Link>

            <button
              onClick={logout}
              className="px-3 sm:px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg hover:bg-red-600/30 transition text-sm sm:text-base cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={searchCompany} />
        </div>

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              📌 My Watchlist
            </h2>

            <div className="flex flex-wrap gap-3">
              {watchlist.map((company, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 card p-3 hover:scale-105 transition"
                >
                  <button
                    onClick={() => searchCompany(company)}
                    className="font-medium hover:text-blue-400 transition cursor-pointer"
                  >
                    {company}
                  </button>

                  <button
                    onClick={() => removeFromWatchlist(company)}
                    className="text-red-400 hover:text-red-300 font-bold transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && !summary && (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">
              Search a Company
            </h2>

            <p className="text-slate-400 max-w-md mx-auto">
              Enter a company name or ticker symbol to view news, sentiment analysis, and AI insights.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="animate-spin">⚙️</div>
              <div>
                <h2 className="text-lg font-semibold text-blue-400">
                  Analyzing market sentiment...
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Fetching news, generating AI summary, and running FinBERT analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Company Header */}
        {currentCompany && !loading && (
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {currentCompany.toUpperCase()}
            </h2>
            <p className="text-slate-400 mt-2">
              Financial Research Dashboard
            </p>
          </div>
        )}

        {/* Stock Profile Card */}
        {stockData?.profile && (
          <div className="card mb-8">
            <div className="flex items-center gap-4 mb-6">
              {stockData.profile.logo && (
                <img
                  src={stockData.profile.logo}
                  alt={stockData.profile.name}
                  className="w-16 h-16 rounded-full bg-white p-2"
                />
              )}

              <div>
                <h3 className="text-2xl font-bold">
                  {stockData.profile.name}
                </h3>

                <p className="text-slate-400">
                  {stockData.profile.ticker} • {stockData.profile.exchange}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Industry</p>
                <p className="font-semibold">
                  {stockData.profile.industry || "N/A"}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Country</p>
                <p className="font-semibold">
                  {stockData.profile.country || "N/A"}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Market Cap</p>
                <p className="font-semibold">
                  ${stockData.profile.marketCapitalization}M
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">IPO</p>
                <p className="font-semibold">
                  {stockData.profile.ipo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Stock Quote */}
        {stockData && (
          <div className="card mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Stock Overview
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Current Price</p>
                <p className="text-2xl font-bold">
                  ${stockData.quote.current}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Change</p>
                <p
                  className={`text-2xl font-bold ${stockData.quote.change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                    }`}
                >
                  {stockData.quote.change >= 0 ? "+" : ""}{stockData.quote.change}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">% Change</p>
                <p
                  className={`text-2xl font-bold ${stockData.quote.percentChange >= 0
                    ? "text-green-400"
                    : "text-red-400"
                    }`}
                >
                  {stockData.quote.percentChange >= 0 ? "+" : ""}{stockData.quote.percentChange}%
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Previous Close</p>
                <p className="text-2xl font-bold">
                  ${stockData.quote.previousClose}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add to Watchlist Button */}
        {currentCompany && !loading && (
          <div className="mb-8">
            <button
              onClick={addToWatchlist}
              className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-purple-600 to-purple-500 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition cursor-pointer"
            >
              ⭐ Add {currentCompany} to Watchlist
            </button>
          </div>
        )}

        {/* Stock Chart */}
        {stockData?.chartData?.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              📈 30-Day Price Trend
            </h2>

            <div className="w-full overflow-x-auto">
              <div className="min-w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.chartData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                    />

                    <YAxis
                      tick={{ fill: "#cbd5e1", fontSize: 12 }}
                      domain={["auto", "auto"]}
                    />

                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />

                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {summary && (
          <div className="card mb-8 bg-linear-to-r from-slate-800 to-slate-900 border-blue-500/30">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              🤖 AI Summary
            </h2>

            <p className="text-slate-200 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Sentiment Overview */}
        {articles.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              📊 Sentiment Overview
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                      </Pie>

                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div className="bg-linear-to-r from-green-500/10 to-green-600/10 border border-green-500/50 p-4 rounded-lg">
                  <p className="text-green-400 font-bold text-lg">
                    {sentimentCounts.positive}
                  </p>
                  <p className="text-slate-300">Positive Articles</p>
                </div>

                <div className="bg-linear-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/50 p-4 rounded-lg">
                  <p className="text-yellow-400 font-bold text-lg">
                    {sentimentCounts.neutral}
                  </p>
                  <p className="text-slate-300">Neutral Articles</p>
                </div>

                <div className="bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/50 p-4 rounded-lg">
                  <p className="text-red-400 font-bold text-lg">
                    {sentimentCounts.negative}
                  </p>
                  <p className="text-slate-300">Negative Articles</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Cards */}
        {articles.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              📰 Latest News
            </h2>

            <div className="grid gap-4">
              {articles.map((article, index) => (
                <NewsCard
                  key={index}
                  article={article}
                  sentiment={article.sentiment}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
