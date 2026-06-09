"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

import SearchBar from "../../components/SearchBar";
import NewsCard from "../../components/NewsCard";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [currentCompany, setCurrentCompany] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token =
          localStorage.getItem("token");

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
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const searchCompany = async (company) => {
    try {
      setCurrentCompany(company);
      setLoading(true);
      setSummary("");
      setArticles([]);

      const res = await api.get(`/news/${company}`);

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
      console.log(articlesWithSentiment);
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
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-2">
        FinSight Dashboard
      </h1>

      {user && (
        <p className="mb-8 text-slate-400">
          Welcome {user.name}
        </p>
      )}
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 rounded-lg mb-6"
      >
        Logout
      </button>
      {watchlist.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">
            My Watchlist
          </h2>

          <div className="flex flex-wrap gap-3">
            {watchlist.map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2"
              >
                <button onClick={() => searchCompany(company)}>
                  {company}
                </button>

                <button
                  onClick={() => removeFromWatchlist(company)}
                  className="text-red-400 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <SearchBar
        onSearch={searchCompany}
      />
      {currentCompany && (
        <button
          onClick={addToWatchlist}
          className="mb-8 px-5 py-3 bg-purple-600 rounded-lg"
        >
          Add {currentCompany} to Watchlist
        </button>
      )}
      {loading && (
        <p>Loading news...</p>
      )}
      {summary && (
        <div className="bg-slate-900 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-3">
            AI Summary
          </h2>

          <p className="text-slate-300">
            {summary}
          </p>
        </div>
      )}
      {articles.length > 0 && (
        <div className="bg-slate-900 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Sentiment Overview
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p className="text-green-400 font-bold">
                {sentimentCounts.positive}
              </p>
              <p className="text-slate-400">Positive</p>
            </div>

            <div>
              <p className="text-yellow-400 font-bold">
                {sentimentCounts.neutral}
              </p>
              <p className="text-slate-400">Neutral</p>
            </div>

            <div>
              <p className="text-red-400 font-bold">
                {sentimentCounts.negative}
              </p>
              <p className="text-slate-400">Negative</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-6">

        {articles.map((article, index) => (
          <NewsCard
            key={index}
            article={article}
            sentiment={article.sentiment}
          />
        ))}

      </div>

    </div>
  );
}