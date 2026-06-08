"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

import SearchBar from "../../components/SearchBar";
import NewsCard from "../../components/NewsCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const searchCompany = async (company) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/news/${company}`
      );

      setArticles(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

      <SearchBar
        onSearch={searchCompany}
      />

      {loading && (
        <p>Loading news...</p>
      )}

      <div className="grid gap-6">

        {articles.map((article, index) => (
          <NewsCard
            key={index}
            article={article}
          />
        ))}

      </div>

    </div>
  );
}