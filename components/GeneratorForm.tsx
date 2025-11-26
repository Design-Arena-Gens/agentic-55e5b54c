"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  productUrl: string;
  targetLocale: string;
  primaryKeywords: string;
  brand?: string;
  generateImages: boolean;
  wordCount: number;
};

export default function GeneratorForm() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      productUrl: '',
      targetLocale: 'en-US',
      primaryKeywords: '',
      brand: '',
      generateImages: true,
      wordCount: 1400
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }
      const data = await res.json();
      const event = new CustomEvent('generation:done', { detail: data });
      window.dispatchEvent(event);
    } catch (e: any) {
      setError(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Product URL</label>
      <input placeholder="https://..." {...register('productUrl', { required: true })} />

      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Target Locale</label>
          <select {...register('targetLocale')}>
            <option value="en-US">English (US)</option>
            <option value="pt-BR">Portugu?s (Brasil)</option>
            <option value="es-ES">Espa?ol (ES)</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Desired Word Count</label>
          <input type="number" min={600} max={3000} {...register('wordCount')} />
        </div>
      </div>

      <label>Primary Keywords (comma separated)</label>
      <input placeholder="best budget ..." {...register('primaryKeywords')} />

      <label>Brand (optional)</label>
      <input placeholder="Brand name" {...register('brand')} />

      <div className="flex">
        <input id="genimg" type="checkbox" {...register('generateImages')} />
        <label htmlFor="genimg">Generate/attach hero and in-article images</label>
      </div>

      <div className="space" />
      <div className="flex">
        <button type="submit" disabled={loading}>
          {loading ? 'Generating?' : 'Generate Article'}
        </button>
        <button type="button" className="secondary" onClick={() => window.location.reload()}>
          Reset
        </button>
      </div>
      {error ? <p className="muted">{error}</p> : null}
    </form>
  );
}
