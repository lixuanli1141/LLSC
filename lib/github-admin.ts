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

function ghError(res: Response, text: string, action: string): Error {
  return new Error(`GitHub ${action} failed ${res.status}: ${text.slice(0, 300)}`);
}

export interface DirEntry {
  name: string;
  sha: string;
  path: string;
}

/** 列出仓库里某个目录下的 .md 文件 */
export async function listMdFiles(dir: string): Promise<DirEntry[]> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${dir}?ref=main`);
  if (!res.ok) throw ghError(res, await res.text(), 'list');
  const data = (await res.json()) as Array<{ name: string; sha: string; path: string; type: string }>;
  return data
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => ({ name: f.name, sha: f.sha, path: f.path }));
}

/** 读仓库里任意文本文件，返回内容和 sha */
export async function getTextFile(path: string): Promise<{ content: string; sha: string }> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${path}?ref=main`);
  if (!res.ok) throw ghError(res, await res.text(), 'get');
  const data = (await res.json()) as { content: string; sha: string };
  const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
  return { content, sha: data.sha };
}

/** 新建或更新仓库里的文本文件（sha 为 null 时新建） */
export async function saveTextFile(path: string, content: string, sha: string | null, message: string): Promise<void> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
  };
  if (sha) body.sha = sha;
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw ghError(res, await res.text(), 'save');
}

/** 删除仓库里的文件 */
export async function deleteTextFile(path: string, sha: string, message: string): Promise<void> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha }),
  });
  if (!res.ok) throw ghError(res, await res.text(), 'delete');
}

/** 列出 public/images/ 下的图片文件 */
export async function listImages(): Promise<DirEntry[]> {
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/public/images?ref=main`);
  if (res.status === 404) return [];
  if (!res.ok) throw ghError(res, await res.text(), 'list');
  const data = (await res.json()) as Array<{ name: string; sha: string; path: string; type: string; size: number }>;
  return data
    .filter((f) => f.type === 'file' && /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f.name))
    .map((f) => ({ name: f.name, sha: f.sha, path: f.path }));
}

/** 上传二进制文件（data 为不带 data: 前缀的 base64） */
export async function saveBinaryFile(path: string, base64: string, sha: string | null, message: string): Promise<void> {
  const body: Record<string, unknown> = { message, content: base64 };
  if (sha) body.sha = sha;
  const res = await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw ghError(res, await res.text(), 'upload');
}

// ---- 兼容旧的 posts 路由 ----
export async function listPostFiles(): Promise<DirEntry[]> {
  return listMdFiles('posts');
}
export async function getPostFile(slug: string): Promise<{ content: string; sha: string }> {
  return getTextFile(`posts/${slug}.md`);
}
export async function savePostFile(slug: string, content: string, sha: string | null, message: string): Promise<void> {
  return saveTextFile(`posts/${slug}.md`, content, sha, message);
}
export async function deletePostFile(slug: string, sha: string): Promise<void> {
  return deleteTextFile(`posts/${slug}.md`, sha, `删除文章 ${slug}`);
}
