'use client';

import { useCallback, useEffect, useState } from 'react';

type CollectionKey = 'posts' | 'chatters' | 'moments';
type ListKey = 'friends' | 'projects' | 'albums';
type TabKey = CollectionKey | ListKey | 'settings';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'posts', label: '文章' },
  { key: 'chatters', label: '碎碎念' },
  { key: 'moments', label: '动态' },
  { key: 'friends', label: '友链' },
  { key: 'projects', label: '项目' },
  { key: 'albums', label: '相册' },
  { key: 'settings', label: '设置' },
];

const COLLECTION_LABEL: Record<CollectionKey, string> = { posts: '文章', chatters: '碎碎念', moments: '动态' };
const LIST_LABEL: Record<ListKey, string> = { friends: '友链', projects: '项目', albums: '相册' };

function nowShanghai(): string {
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

function slugFromTitle(title: string): string {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  if (s) return s;
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `post-${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
}

const inputCls =
  'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-violet-400';
const labelCls = 'mb-1 block text-xs text-white/60';
const btnPrimary = 'rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50';
const btnGhost = 'rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50';

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `请求失败 ${res.status}`);
  return data;
}

/* ---------------- Markdown 栏目：文章 / 碎碎念 / 动态 ---------------- */

interface MdItem {
  slug: string;
  sha: string;
  title: string;
  date: string;
}

function emptyForm(collection: CollectionKey): Record<string, unknown> & { sha: string | null } {
  const base: Record<string, unknown> & { sha: string | null } = {
    slug: '',
    sha: null,
    title: '',
    date: collection === 'moments' ? new Date().toISOString() : nowShanghai(),
    content: '',
  };
  if (collection === 'posts') Object.assign(base, { description: '', cover: '/cover.svg', tags: [] });
  if (collection === 'chatters') Object.assign(base, { description: '', cover: '', mood: '', tags: [] });
  if (collection === 'moments') Object.assign(base, { id: '', location: '', images: [] });
  return base;
}

function MarkdownTab({ collection }: { collection: CollectionKey }) {
  const label = COLLECTION_LABEL[collection];
  const [items, setItems] = useState<MdItem[]>([]);
  const [form, setForm] = useState(emptyForm(collection));
  const [extra, setExtra] = useState({ tags: '', images: '' });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const load = useCallback(async () => {
    const data = await api(`/api/admin/items?collection=${collection}`);
    setItems(data.items || []);
  }, [collection]);

  useEffect(() => {
    load().catch((e) => setStatus(e.message));
  }, [load]);

  function startNew() {
    setForm(emptyForm(collection));
    setExtra({ tags: '', images: '' });
    setEditing(true);
    setStatus('');
  }

  async function startEdit(slug: string) {
    setBusy(true);
    setStatus('');
    try {
      const data = await api(`/api/admin/items?collection=${collection}&slug=${encodeURIComponent(slug)}`);
      const it = data.item;
      setForm({ ...it, sha: it.sha });
      setExtra({
        tags: Array.isArray(it.tags) ? it.tags.join(', ') : '',
        images: Array.isArray(it.images) ? it.images.join('\n') : '',
      });
      setEditing(true);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '打开失败');
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (collection !== 'moments' && !String(form.title || '').trim()) {
      setStatus('标题不能为空');
      return;
    }
    const slug = String(form.slug || '').trim() || (collection === 'moments' ? '' : slugFromTitle(String(form.title)));
    if (slug && !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
      setStatus('链接名只能用小写字母、数字和 -');
      return;
    }
    setBusy(true);
    setStatus('保存中…');
    try {
      const body: Record<string, unknown> = { collection, slug, ...form, sha: form.sha };
      if (collection !== 'moments') body.tags = extra.tags;
      if (collection === 'moments') body.images = extra.images;
      const data = await api('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setStatus(data.updated ? '已更新，博客约 1 分钟后自动更新。' : '已发布，博客约 1 分钟后自动更新。');
      setEditing(false);
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(it: MdItem) {
    if (!window.confirm(`确定删除「${it.title}」吗？删了就没了。`)) return;
    setBusy(true);
    try {
      await api(
        `/api/admin/items?collection=${collection}&slug=${encodeURIComponent(it.slug)}&sha=${encodeURIComponent(it.sha)}`,
        { method: 'DELETE' },
      );
      setStatus('已删除，博客约 1 分钟后自动更新。');
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '删除失败');
    } finally {
      setBusy(false);
    }
  }

  const field = (labelText: string, key: string, placeholder?: string) => (
    <div>
      <label className={labelCls}>{labelText}</label>
      <input
        className={inputCls}
        value={String(form[key] ?? '')}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  if (editing) {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-base font-semibold text-white">{form.sha ? `编辑${label}` : `写新${label}`}</h2>
        <div className="mt-4 space-y-4">
          {collection !== 'moments' && (
            <>
              {field('标题', 'title', `${label}标题`)}
              <div>
                <label className={labelCls}>链接名（网址里用的那段，只能小写字母、数字和 -）</label>
                <input
                  className={inputCls}
                  value={String(form.slug ?? '')}
                  disabled={!!form.sha}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="比如 hello-llsc"
                />
              </div>
              {field('日期', 'date')}
              {field('简介', 'description', '一句话介绍')}
              {field('封面图链接（可空）', 'cover')}
              {collection === 'chatters' && field('心情', 'mood', '比如 开心')}
              <div>
                <label className={labelCls}>标签（用逗号隔开）</label>
                <input
                  className={inputCls}
                  value={extra.tags}
                  onChange={(e) => setExtra((x) => ({ ...x, tags: e.target.value }))}
                  placeholder="比如 LLSC, 日常"
                />
              </div>
            </>
          )}
          {collection === 'moments' && (
            <>
              {field('地点（可空）', 'location', '比如 深圳')}
              {field('日期', 'date')}
              <div>
                <label className={labelCls}>图片链接（一行一个）</label>
                <textarea
                  className={`${inputCls} min-h-24 font-mono`}
                  value={extra.images}
                  onChange={(e) => setExtra((x) => ({ ...x, images: e.target.value }))}
                  placeholder={'https://.../1.jpg\nhttps://.../2.jpg'}
                />
              </div>
            </>
          )}
          <div>
            <label className={labelCls}>正文（支持 Markdown）</label>
            <textarea
              className={`${inputCls} min-h-72 font-mono leading-relaxed`}
              value={String(form.content ?? '')}
              onChange={(e) => set('content', e.target.value)}
              placeholder="在这里写正文…"
            />
          </div>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={save} disabled={busy}>
              {busy ? '保存中…' : form.sha ? '保存修改' : collection === 'moments' ? '发布动态' : '发布'}
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
    );
  }

  return (
    <>
      <button className={`${btnPrimary} mt-5`} onClick={startNew}>
        写新{label}
      </button>
      {status && <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80">{status}</p>}
      <div className="mt-4 space-y-2">
        {items.length === 0 && <p className="text-sm text-white/50">还没有内容，写一篇吧。</p>}
        {items.map((it) => (
          <div key={it.slug} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{it.title}</p>
              <p className="text-xs text-white/50">
                {it.slug} · {it.date || '无日期'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className={btnGhost} onClick={() => startEdit(it.slug)} disabled={busy}>
                编辑
              </button>
              <button className={btnGhost} onClick={() => removeItem(it)} disabled={busy}>
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- 列表栏目：友链 / 项目 / 相册 ---------------- */

const LIST_FIELDS: Record<ListKey, Array<{ key: string; label: string; placeholder?: string }>> = {
  friends: [
    { key: 'name', label: '名称' },
    { key: 'url', label: '链接' },
    { key: 'description', label: '简介' },
    { key: 'avatar', label: '头像链接' },
    { key: 'themeColor', label: '主题色（比如 #7aa2ff）' },
  ],
  projects: [
    { key: 'name', label: '名称' },
    { key: 'description', label: '简介' },
    { key: 'icon', label: '图标（emoji 或链接）' },
    { key: 'githubUrl', label: 'GitHub 链接' },
    { key: 'tags', label: '标签（用逗号隔开）' },
  ],
  albums: [
    { key: 'title', label: '标题' },
    { key: 'description', label: '简介' },
    { key: 'cover', label: '封面图链接' },
    { key: 'date', label: '日期' },
  ],
};

function blankRow(key: ListKey): Record<string, unknown> {
  const id = `${key.slice(0, 4)}-${Date.now()}`;
  if (key === 'friends') return { id, name: '', url: '', description: '', avatar: '', themeColor: '#7aa2ff' };
  if (key === 'projects') return { id, name: '', description: '', icon: '', githubUrl: '', tags: [] };
  return { id, title: '', description: '', cover: '', date: nowShanghai().slice(0, 10), photos: [] };
}

function ListTab({ listKey }: { listKey: ListKey }) {
  const label = LIST_LABEL[listKey];
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [photosText, setPhotosText] = useState<Record<number, string>>({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api(`/api/admin/lists?type=${listKey}`)
      .then((d) => {
        setItems(d.items || []);
        setLoaded(true);
      })
      .catch((e) => setStatus(e.message));
  }, [listKey]);

  const update = (i: number, k: string, v: unknown) =>
    setItems((arr) => arr.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  async function saveAll() {
    setBusy(true);
    setStatus('保存中…');
    try {
      const cleaned = items.map((row, i) => {
        const r = { ...row };
        if (listKey === 'projects' && typeof r.tags === 'string') {
          r.tags = String(r.tags).split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
        }
        if (listKey === 'albums') {
          const text = photosText[i] ?? (Array.isArray(r.photos) ? (r.photos as Array<{ url: string; caption?: string }>).map((p) => (p.caption ? `${p.url} | ${p.caption}` : p.url)).join('\n') : '');
          r.photos = text.split('\n').map((line) => {
            const [url, caption] = line.split('|').map((s) => s.trim());
            return caption ? { url, caption } : { url };
          }).filter((p) => p.url);
        }
        return r;
      });
      await api('/api/admin/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: listKey, items: cleaned }),
      });
      setStatus('已保存，博客约 1 分钟后自动更新。');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) return <p className="mt-5 text-sm text-white/50">加载中…</p>;

  return (
    <>
      {status && <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80">{status}</p>}
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-white/50">还没有内容，点下面加一个吧。</p>}
        {items.map((row, i) => (
          <div key={String(row.id || i)} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                {String(row.name || row.title || `第 ${i + 1} 条`)}
              </span>
              <button className={btnGhost} onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))}>
                删除
              </button>
            </div>
            <div className="space-y-3">
              {LIST_FIELDS[listKey].map((f) => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <input
                    className={inputCls}
                    value={Array.isArray(row[f.key]) ? (row[f.key] as string[]).join(', ') : String(row[f.key] ?? '')}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              {listKey === 'albums' && (
                <div>
                  <label className={labelCls}>照片（一行一张，格式：链接 | 说明，可不写说明）</label>
                  <textarea
                    className={`${inputCls} min-h-24 font-mono`}
                    value={
                      photosText[i] ??
                      (Array.isArray(row.photos)
                        ? (row.photos as Array<{ url: string; caption?: string }>).map((p) => (p.caption ? `${p.url} | ${p.caption}` : p.url)).join('\n')
                        : '')
                    }
                    onChange={(e) => setPhotosText((m) => ({ ...m, [i]: e.target.value }))}
                    placeholder={'https://.../1.jpg | 日落\nhttps://.../2.jpg'}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className={btnGhost} onClick={() => setItems((arr) => [...arr, blankRow(listKey)])}>
          加一条{label}
        </button>
        <button className={btnPrimary} onClick={saveAll} disabled={busy}>
          {busy ? '保存中…' : '保存全部'}
        </button>
      </div>
    </>
  );
}

/* ---------------- 设置栏目 ---------------- */

function SettingsTab() {
  const [form, setForm] = useState<Record<string, unknown> | null>(null);
  const [danmakuText, setDanmakuText] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/admin/settings')
      .then((d) => {
        setForm(d.settings);
        setDanmakuText(((d.settings.danmaku as string[]) || []).join('\n'));
      })
      .catch((e) => setStatus(e.message));
  }, []);

  async function save() {
    if (!form) return;
    setBusy(true);
    setStatus('保存中…');
    try {
      const body: Record<string, unknown> = { ...form };
      body.danmaku = danmakuText.split('\n').map((s) => s.trim()).filter(Boolean);
      const data = await api('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setStatus(data.changed ? '已保存，博客约 1 分钟后自动更新。' : '没有改动。');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }

  if (!form) return <p className="mt-5 text-sm text-white/50">加载中…</p>;
  const social = (form.social as Record<string, string>) || {};
  const set = (k: string, v: unknown) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const setSocial = (k: string, v: string) =>
    setForm((f) => (f ? { ...f, social: { ...((f.social as Record<string, string>) || {}), [k]: v } } : f));

  const field = (labelText: string, key: string, placeholder?: string) => (
    <div>
      <label className={labelCls}>{labelText}</label>
      <input className={inputCls} value={String(form[key] ?? '')} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
      {status && <p className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/80">{status}</p>}
      <div className="space-y-4">
        {field('个人简介', 'bio', '山川有灵，归处有光。')}
        {field('碎碎念标题', 'chatterTitle')}
        {field('碎碎念简介', 'chatterDescription')}
        {field('文章默认封面', 'defaultPostCover')}
        {field('照片墙预览图', 'photoWallImage')}
        <div>
          <label className={labelCls}>弹幕（一行一条）</label>
          <textarea className={`${inputCls} min-h-32`} value={danmakuText} onChange={(e) => setDanmakuText(e.target.value)} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-white">社交账号</p>
          <div className="space-y-3">
            {(['github', 'gitee', 'google', 'email', 'qq', 'wechat'] as const).map((k) => (
              <div key={k}>
                <label className={labelCls}>{k}</label>
                <input className={inputCls} value={social[k] ?? ''} onChange={(e) => setSocial(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
        <button className={btnPrimary} onClick={save} disabled={busy}>
          {busy ? '保存中…' : '保存设置'}
        </button>
      </div>
    </div>
  );
}

/* ---------------- 主界面 ---------------- */

export default function AdminApp() {
  const [phase, setPhase] = useState<'checking' | 'not-configured' | 'login' | 'main'>('checking');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<TabKey>('posts');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (!data.configured) {
          setPhase('not-configured');
          return;
        }
        setPhase(data.ok ? 'main' : 'login');
      } catch {
        setPhase('login');
      }
    })();
  }, []);

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
    } finally {
      setBusy(false);
    }
  }

  async function doLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setPhase('login');
  }

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
      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm ${
              tab === t.key ? 'bg-violet-600 font-medium text-white' : 'border border-white/15 text-white/70 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'posts' && <MarkdownTab collection="posts" />}
      {tab === 'chatters' && <MarkdownTab collection="chatters" />}
      {tab === 'moments' && <MarkdownTab collection="moments" />}
      {tab === 'friends' && <ListTab listKey="friends" />}
      {tab === 'projects' && <ListTab listKey="projects" />}
      {tab === 'albums' && <ListTab listKey="albums" />}
      {tab === 'settings' && <SettingsTab />}
      <p className="mt-6 text-xs text-white/40">保存或删除后，Vercel 会自动重新部署，博客约 1 分钟后更新。</p>
    </main>
  );
}
