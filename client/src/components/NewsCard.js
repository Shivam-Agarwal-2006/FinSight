export default function NewsCard({
  article,
  sentiment,
}) {

  const color =
    sentiment === "positive"
      ? "bg-green-600"
      : sentiment === "negative"
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <div className="bg-slate-900 p-5 rounded-xl">

      <div
        className={`inline-block px-3 py-1 rounded mb-3 ${color}`}
      >
        {sentiment}
      </div>

      <h2 className="text-xl font-semibold mb-3">
        {article.title}
      </h2>

      <p className="text-slate-400 mb-4">
        {article.description}
      </p>

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-400"
      >
        Read Article →
      </a>

    </div>
  );
}