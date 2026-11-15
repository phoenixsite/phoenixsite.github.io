import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postSlug } from '../lib/posts';
import { siteConfig } from '../config';

export async function GET(context: APIContext) {
  const posts = await getPosts('es');
  return rss({
    title: siteConfig.name.es,
    description: siteConfig.description.es,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${postSlug(post.id)}/`
    }))
  });
}
