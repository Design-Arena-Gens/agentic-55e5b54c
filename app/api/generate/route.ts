import { NextRequest, NextResponse } from 'next/server';
import { scrapeProduct } from '@/lib/scrape';
import { generateArticle } from '@/lib/openai';
import { correctWithLanguageTool } from '@/lib/spellcheck';
import { replaceLinksWithAffiliates } from '@/lib/affiliate';
import { buildArticleSchema } from '@/lib/seo';
import { generateImage } from '@/lib/nanobanana';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productUrl, targetLocale, primaryKeywords, brand, generateImages, wordCount } = body as {
      productUrl: string;
      targetLocale: string;
      primaryKeywords: string;
      brand?: string;
      generateImages: boolean;
      wordCount: number;
    };
    if (!productUrl) {
      return NextResponse.json({ error: 'productUrl required' }, { status: 400 });
    }

    const product = await scrapeProduct(productUrl);
    if (brand) product.brand = brand;

    const keywords = primaryKeywords
      ? primaryKeywords.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    let html = await generateArticle({
      locale: targetLocale || 'en-US',
      wordCount: Math.max(600, Math.min(3000, Number(wordCount) || 1400)),
      product: {
        url: product.url,
        title: product.title,
        description: product.description,
        features: product.features,
        specs: product.specs,
        price: product.price,
        brand: product.brand
      },
      keywords
    });

    // Spell-check and auto-correct
    html = await correctWithLanguageTool(html, targetLocale || 'en-US');

    // Affiliate link rewrite
    html = replaceLinksWithAffiliates(html);

    // Hero image
    let heroImage: string | null = null;
    if (generateImages) {
      const heroPrompt = `High quality product hero image for: ${product.title || 'product'} in context.`;
      heroImage = await generateImage(heroPrompt);
    } else {
      heroImage = product.images[0] || null;
    }

    const title =
      product.title ||
      'In-depth Review';
    const description =
      product.description || `Hands-on style review and buyer's guide.`;

    const schema = buildArticleSchema({
      title,
      description,
      url: product.url,
      heroImage,
      brand: product.brand,
      price: product.price,
      locale: targetLocale || 'en-US'
    });

    return NextResponse.json({
      title,
      description,
      heroImage,
      html,
      schema,
      meta: {
        keywords,
        locale: targetLocale || 'en-US'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'generation failed' }, { status: 500 });
  }
}

