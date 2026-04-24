'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

interface Course {
  id: string;
  title: string;
  description?: string;
  difficulty: string;
  _count?: { modules: number; enrollments: number };
}

export default function AdminCoursesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Beginner', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && user?.role !== 'PLATFORM_ADMIN') {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingCourses(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newCourse = await api.createCourse(form);
      setCourses((prev) => [...prev, newCourse]);
      setShowModal(false);
      setForm({ title: '', description: '', difficulty: 'Beginner', imageUrl: '' });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || user?.role !== 'PLATFORM_ADMIN') return null;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-xl font-black tracking-[0.3em] uppercase text-black">CHIAC-ASI</Link>
            <div className="hidden md:flex items-center gap-6">
              {[
                { name: 'Dashboard', href: '/' },
                { name: 'Courses', href: '/courses' },
                { name: 'Course Builder', href: '/admin/courses', active: true },
                { name: 'Analytics', href: '/admin/analytics' },
              ].map((item) => (
                <Link key={item.name} href={item.href} className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${item.active ? 'text-black' : 'text-slate-500 hover:text-black'}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{user?.name}</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Course Builder</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and create new curricula</p>
          </div>
          <button
            id="create-course-btn"
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:shadow-2xl hover:-translate-y-0.5 transition-all shadow-xl"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> New Course
          </button>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold mb-6">{error}</div>
        )}

        {loadingCourses ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white/30 backdrop-blur-lg rounded-[2rem] border border-white/50">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">school</span>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No courses yet. Create your first course!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white/40 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.25em]">{course.difficulty}</span>
                </div>
                <h3 className="font-bold text-xl text-black mb-2 leading-tight">{course.title}</h3>
                <div className="flex gap-6 mb-6 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">layers</span>{course._count?.modules ?? 0} Modules</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">group</span>{course._count?.enrollments ?? 0} Enrolled</span>
                </div>
                <button
                  onClick={() => router.push(`/admin/courses/${course.id}`)}
                  className="w-full py-3 bg-transparent border border-black/20 text-black hover:bg-black hover:text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
                >
                  Manage Course
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/60">
            <div className="px-8 py-6 border-b border-white/40 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">New Course</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-black transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Course Title</label>
                <input
                  id="course-title-input"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                  placeholder="e.g. Introduction to Machine Learning"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium resize-none"
                  placeholder="Brief course description..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                  placeholder="https://..."
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-black/10 text-slate-500 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/50 transition-all">
                  Cancel
                </button>
                <button
                  id="save-course-btn"
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
