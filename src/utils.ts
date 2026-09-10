import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Canonical URL for a post — preserves the original /posts/<slug>/ paths. */
export function postUrl(post: Post): string {
  return `/posts/${post.id}/`;
}

/** kebab-case a tag for use in /tags/<slug>/ URLs. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** All posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}
