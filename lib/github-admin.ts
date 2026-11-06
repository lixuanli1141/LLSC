const OWNER = 'lixuanli1141';
const REPO = 'LLSC';
const API = 'https://api.github.com';

function token(): string {
  return (process.env.GITHUB_TOKEN || '').trim();
}

export function githubReady(): boolean {
  return !!token();
}

async function gh(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
}

export interface PostFile {
  name: string;
  sha: string;
  path: string;
}

export async function listPostFiles(): Promise<PostFile[]> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/posts?ref=main`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub list failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as Array<{ name: string; sha: string; path: string; type: string }>;
  return data
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => ({ name: f.name, sha: f.sha, path: f.path }));
}

export async function getPostFile(slug: string): Promise<{ content: string; sha: string }> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/posts/${slug}.md?ref=main`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub get failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { content: string; sha: string; encoding: string };
  const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
  return { content, sha: data.sha };
}

export async function savePostFile(
  slug: string,
  content: string,
  sha: string | null,
  message: string,
): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
  };
  if (sha) body.sha = sha;
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/posts/${slug}.md`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub save failed ${res.status}: ${text.slice(0, 300)}`);
  }
}

export async function deletePostFile(slug: string, sha: string): Promise<void> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/posts/${slug}.md`, {
    method: 'DELETE',
    body: JSON.stringify({ message: `删除文章 ${slug}`, sha }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub delete failed ${res.status}: ${text.slice(0, 300)}`);
  }
}
