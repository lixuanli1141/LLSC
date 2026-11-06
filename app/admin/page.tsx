import type { Metadata } from 'next';
import AdminApp from './admin-app';

export const metadata: Metadata = {
  title: '后台管理 | LLSC',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
