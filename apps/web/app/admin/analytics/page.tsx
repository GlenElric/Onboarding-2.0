'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export default function AdminAnalyticsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && user?.role !== 'PLATFORM_ADMIN') {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (isLoading || user?.role !== 'PLATFORM_ADMIN') return null;

  const totalCourses = courses.length;
  const totalModules = courses.reduce((acc, c) => acc + (c._count?.modules || 0), 0);
  const totalEnrollments = courses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0);

  const stats = [
    { label: 'Total Courses', value: totalCourses, icon: 'school', color: 'from-black to-slate-700' },
    { label: 'Total Modules', value: totalModules, icon: 'layers', color: 'from-slate-700 to-slate-500' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: 'group', color: 'from-slate-600 to-slate-400' },
    { label: 'Avg Modules/Course', value: totalCourses > 0 ? (totalModules / totalCourses).toFixed(1) : '0', icon: 'analytics', color: 'from-slate-800 to-slate-600' },
  ];

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
                { name: 'Course Builder', href: '/admin/courses' },
                { name: 'Analytics', href: '/admin/analytics', active: true },
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Analytics</h1>
          <p className="text-sm text-slate-500 font-medium">Platform performance overview</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="relative overflow-hidden bg-white/40 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] group hover:-translate-y-1 transition-all">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-8xl">{stat.icon}</span>
                  </div>
                  <div className="relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                    <h3 className="text-4xl font-bold text-black mt-2 tracking-tight">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Breakdown */}
            <div className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="px-8 py-6 border-b border-white/40">
                <h2 className="text-lg font-bold text-black">Course Breakdown</h2>
              </div>
              {courses.length === 0 ? (
                <div className="px-8 py-12 text-center text-slate-400 text-sm">
                  No courses to display. Create your first course in the Course Builder.
                </div>
              ) : (
                <div className="divide-y divide-white/30">
                  {courses.map((course) => {
                    const modules = course._count?.modules || 0;
                    const enrollments = course._count?.enrollments || 0;
                    return (
                      <div key={course.id} className="px-8 py-5 flex items-center gap-6 hover:bg-white/30 transition-colors group">
                        <div className="flex-1">
                          <h4 className="font-bold text-black text-sm">{course.title}</h4>
                          <div className="flex gap-6 mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {modules} Module{modules !== 1 ? 's' : ''}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {enrollments} Enrolled
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
                          {course.difficulty}
                        </span>

                        {/* Visual bar */}
                        <div className="hidden md:block w-32">
                          <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black rounded-full transition-all"
                              style={{ width: `${Math.min(100, enrollments * 20)}%` }}
                            ></div>
                          </div>
                        </div>

                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Manage →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Enrollment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Difficulty Distribution</h3>
                <div className="space-y-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                    const count = courses.filter(c => c.difficulty === level).length;
                    const pct = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;
                    return (
                      <div key={level}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs font-bold text-black">{level}</span>
                          <span className="text-[10px] font-bold text-slate-400">{count} course{count !== 1 ? 's' : ''} ({pct}%)</span>
                        </div>
                        <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-black rounded-[2rem] p-8 text-white shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-6">Platform Summary</h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-5xl font-bold">{totalEnrollments}</span>
                    <p className="text-sm text-white/50 font-medium mt-1">Total student enrollments across all courses</p>
                  </div>
                  <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-2xl font-bold">{totalCourses}</span>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Courses</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold">{totalModules}</span>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Modules</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/courses"
                    className="block w-full py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] text-center hover:bg-white/90 transition-all mt-4"
                  >
                    Go to Course Builder
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
