'use client';

import { useCallback, useEffect, useState } from 'react';

interface PostItem {
  slug: string;
  sha: string;
  title: string;
  date: string;
}

interface PostDetail extends PostItem {
  description: string;
  cover: string;
  tags: string[];
  content: string;
}

function nowShanghai(): string {
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

function slugFromTitle(title: string): string {
  const s = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  if (s) return s;
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `post-${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

const emptyForm = (): Omit<PostDetail, 'sha'> & { sha: string | null } => ({
  slug: '',
  sha: null,
  title: '',
  date: nowShanghai(),
  description: '',
  cover: '/cover.svg',
  tags: [],
  content: '',
});

export default function AdminApp() {
  const [phase, setPhase] = useState<'checking' | 'not-configured' | 'login' | 'main'>('checking');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [tagsText, setTagsText] = useState('');
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const loadList = useCallback(async () => {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        setPhase('login');
        return;
      }
      setStatus(data.error || '读取文章列表失败');
      return;
    }
    setPosts(data.posts || []);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (!data.configured) {
          setPhase('not-configured');
          return;
        }
        if (data.ok) {
          setPhase('main');
          await loadList();
        } else {
          setPhase('login');
        }
      } catch {
        setPhase('login');
      }
    })();
  }, [loadList]);

  async function doLogin() {
    setLoginError('');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || '登录失败');
        return;
      }
      setPassword('');
      setPhase('main');
      await loadList();
    } finally {
      setBusy(false);
    }
  }

  async function doLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setPhase('login');
    setPosts([]);
    setEditing(false);
  }

  function startNew() {
    setForm(emptyForm());
    setTagsText('');
    setEditing(true);
    setStatus('');
  }

  async function startEdit(slug: string) {
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || '打开失败');
        return;
      }
      const p: PostDetail = data.post;
      setForm(p);
      setTagsText(p.tags.join(', '));
      setEditing(true);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!form.title.trim()) {
      setStatus('标题不能为空');
      return;
    }
    const slug = form.slug.trim() || slugFromTitle(form.title);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      setStatus('链接名只能用小写字母、数字和 -');
      return;
    }
    setBusy(true);
    setStatus('保存中…');
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: form.title.trim(),
          date: form.date.trim(),
          description: form.description.trim(),
          cover: form.cover.trim(),
          tags: tagsText.split(/[,，、]/).map((t) => t.trim()).filter(Boolean),
          content: form.content,
          sha: form.sha,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || '保存失败');
        return;
      }
      setStatus(data.updated ? '已更新，博客约 1 分钟后自动更新。' : '已发布，博客约 1 分钟后自动更新。');
      setEditing(false);
      await loadList();
    } finally {
      setBusy(false);
    }
  }

  async function removePost(p: PostItem) {
    if (!window.confirm(`确定删除「${p.title}」吗？删了就没了。`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(p.slug)}&sha=${encodeURIComponent(p.sha)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || '删除失败');
        return;
      }
      setStatus('已删除，博客约 1 分钟后自动更新。');
      await loadList();
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-violet-400';
  const labelCls = 'mb-1 block text-xs text-white/60';
  const btnPrimary =
    'rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50';
  const btnGhost =
    'rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50';

  if (phase === 'checking') {
    return <main className="mx-auto max-w-2xl px-4 py-16 text-center text-white/60">正在打开后台…</main>;
  }

  if (phase === 'not-configured') {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-white">后台还没配置好</h1>
        <p className="mt-2 text-sm text-white/60">需要先在 Vercel 里配好后台密码和 GitHub 令牌，再重新部署一次。</p>
      </main>
    );
  }

  if (phase === 'login') {
    return (
      <main className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-center text-2xl font-bold text-white">LLSC 后台</h1>
        <p className="mt-1 text-center text-sm text-white/50">输入后台密码登录</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <label className={labelCls}>密码</label>
          <input
            type="password"
            className={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') doLogin();
            }}
            placeholder="后台密码"
            autoFocus
          />
          {loginError && <p className="mt-2 text-sm text-red-400">{loginError}</p>}
          <button className={`${btnPrimary} mt-4 w-full`} onClick={doLogin} disabled={busy || !password}>
            {busy ? '登录中…' : '登录'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">LLSC 后台</h1>
        <button className={btnGhost} onClick={doLogout}>
          退出
        </button>
      </div>

      {status && <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80">{status}</p>}

      {editing ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white">{form.sha ? '编辑文章' : '写新文章'}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>标题</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: f.sha ? f.slug : slugFromTitle(title) }));
                }}
                placeholder="文章标题"
              />
            </div>
            <div>
              <label className={labelCls}>链接名（网址里用的那段，只能小写字母、数字和 -）</label>
              <input
                className={inputCls}
                value={form.slug}
                disabled={!!form.sha}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="比如 hello-llsc"
              />
            </div>
            <div>
              <label className={labelCls}>日期</label>
              <input className={inputCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>简介</label>
              <input
                className={inputCls}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="一句话介绍这篇文章"
              />
            </div>
            <div>
              <label className={labelCls}>标签（用逗号隔开）</label>
              <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="比如 LLSC, 日常" />
            </div>
            <div>
              <label className={labelCls}>正文（支持 Markdown）</label>
              <textarea
                className={`${inputCls} min-h-72 font-mono leading-relaxed`}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="在这里写文章正文…"
              />
            </div>
            <div className="flex gap-2">
              <button className={btnPrimary} onClick={save} disabled={busy}>
                {busy ? '保存中…' : form.sha ? '保存修改' : '发布文章'}
              </button>
              <button
                className={btnGhost}
                onClick={() => {
                  setEditing(false);
                  setStatus('');
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button className={`${btnPrimary} mt-5`} onClick={startNew}>
            写新文章
          </button>
          <div className="mt-4 space-y-2">
            {posts.length === 0 && <p className="text-sm text-white/50">还没有文章，写一篇吧。</p>}
            {posts.map((p) => (
              <div key={p.slug} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-white/50">
                    {p.slug} · {p.date || '无日期'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className={btnGhost} onClick={() => startEdit(p.slug)} disabled={busy}>
                    编辑
                  </button>
                  <button className={btnGhost} onClick={() => removePost(p)} disabled={busy}>
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/40">保存或删除后，Vercel 会自动重新部署，博客约 1 分钟后更新。</p>
        </>
      )}
    </main>
  );
}
