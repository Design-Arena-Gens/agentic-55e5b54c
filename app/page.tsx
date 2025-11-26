import GeneratorForm from '@/components/GeneratorForm';
import Preview from '@/components/Preview';
import { useState } from 'react';

export default function HomePage() {
  // Client component boundary
  return (
    <main className="container">
      <div className="card">
        <h1>Agentic SEO Review Generator</h1>
        <p className="muted">
          Generate Google Discover?friendly review articles with affiliate links and AI images.
        </p>
      </div>
      <div className="space" />
      <div className="grid grid-2">
        <div className="card">
          <GeneratorForm />
        </div>
        <div className="card">
          <Preview />
        </div>
      </div>
    </main>
  );
}

