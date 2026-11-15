import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postSlug } from '../../lib/posts';
import { siteConfig } from '../../config';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: siteConfig.name.en,
    description: siteConfig.description.en,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/en/blog/${postSlug(post.id)}/`
    }))
  });
}
