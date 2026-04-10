'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

interface Course {
  id: string;
  title: string;
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
    if (!isLoading && user?.role !== 'ADMIN') {
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

  if (isLoading || user?.role !== 'ADMIN') return null;

  return (
    <div className="bg-surface min-h-screen pt-8 px-8 pb-12 max-w-7xl mx-auto font-body">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-black text-primary mb-2">Admin: Course Builder</h1>
          <p className="text-on-surface-variant text-lg">Manage and create new curricula.</p>
        </div>
        <button
          id="create-course-btn"
          onClick={() => setShowModal(true)}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 shadow-md"
        >
          <span className="material-symbols-outlined">add</span> Create New Course
        </button>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
      )}

      {loadingCourses ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 font-bold text-primary">Course Name</th>
                <th className="px-6 py-4 font-bold text-primary">Difficulty</th>
                <th className="px-6 py-4 font-bold text-primary">Modules</th>
                <th className="px-6 py-4 font-bold text-primary">Enrollments</th>
                <th className="px-6 py-4 font-bold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    No courses yet. Create your first course!
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-5 font-bold text-primary">{course.title}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant">{course._count?.modules ?? 0}</td>
                    <td className="px-6 py-5 text-on-surface-variant">{course._count?.enrollments ?? 0}</td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => router.push(`/admin/courses/${course.id}`)}
                        className="text-secondary font-bold hover:underline mr-4"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="text-xl font-headline font-bold text-primary">New Course</h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Course Title</label>
                <input
                  id="course-title-input"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary"
                  placeholder="e.g. Introduction to Machine Learning"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary resize-none"
                  placeholder="Brief course description..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary bg-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-outline-variant/30 text-on-surface-variant py-3 rounded-xl font-bold hover:bg-surface-container-low transition-all"
                >
                  Cancel
                </button>
                <button
                  id="save-course-btn"
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
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
