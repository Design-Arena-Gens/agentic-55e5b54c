"use client";
import { useEffect, useState } from 'react';

type GenerationResult = {
  title: string;
  description: string;
  heroImage: string | null;
  html: string; // sanitized HTML
  markdown?: string;
  schema: any;
  meta: {
    keywords: string[];
    locale: string;
  };
};

export default function Preview() {
  const [data, setData] = useState<GenerationResult | null>(null);
  const [downloadName, setDownloadName] = useState('article.html');

  useEffect(() => {
    function onDone(e: any) {
      setData(e.detail);
      const slug = e.detail?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setDownloadName(`${slug || 'article'}.html`);
    }
    window.addEventListener('generation:done', onDone);
    return () => window.removeEventListener('generation:done', onDone);
  }, []);

  function download() {
    if (!data) return;
    const html = `<!doctype html>
<html lang="${data.meta.locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${data.title}</title>
  <meta name="description" content="${data.description}" />
  <meta name="keywords" content="${data.meta.keywords.join(', ')}" />
  <script type="application/ld+json">${JSON.stringify(data.schema)}</script>
</head>
<body>
  <article>
    <h1>${data.title}</h1>
    ${data.heroImage ? `<img alt="hero" src="${data.heroImage}" />` : ''}
    ${data.html}
  </article>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) {
    return <p className="muted">Your generated article will appear here.</p>;
  }

  return (
    <div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: 0 }}>{data.title}</h3>
          <p className="muted" style={{ marginTop: 4 }}>{data.description}</p>
        </div>
        <button onClick={download}>Download HTML</button>
      </div>
      <div className="space" />
      {data.heroImage ? <img src={data.heroImage} alt="hero" style={{ width: '100%', borderRadius: 12 }} /> : null}
      <div className="space" />
      <div className="preview" dangerouslySetInnerHTML={{ __html: data.html }} />
    </div>
  );
}
