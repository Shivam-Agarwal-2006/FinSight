export default function NewsCard({ article }) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl">

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