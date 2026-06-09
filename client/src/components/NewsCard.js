"use client";

import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function NewsCard({
  article,
  sentiment,
}) {

  const getBadgeStyles = () => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500/20 text-green-300 border border-green-500/50";
      case "negative":
        return "bg-red-500/20 text-red-300 border border-red-500/50";
      default:
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50";
    }
  };

  const getSentimentIcon = () => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp size={14} className="inline mr-1" />;
      case "negative":
        return <TrendingDown size={14} className="inline mr-1" />;
      default:
        return <Minus size={14} className="inline mr-1" />;
    }
  };

  return (
    <div className="card group hover:shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${getBadgeStyles()}`}
        >
          {getSentimentIcon()}
          {sentiment}
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition">
        {article.title}
      </h2>

      <p className="text-slate-400 mb-4 line-clamp-3">
        {article.description}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition font-medium"
      >
        Read Article <ExternalLink size={16} />
      </a>
    </div>
  );
}