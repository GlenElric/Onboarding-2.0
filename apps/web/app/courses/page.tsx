'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth-context';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getCourses().catch(() => []),
      user ? api.getMyEnrollments().catch(() => []) : Promise.resolve([]),
    ]).then(([coursesData, enrollmentsData]) => {
      setCourses(coursesData);
      setEnrollments(enrollmentsData);
      setLoading(false);
    });
  }, [user]);

  const isEnrolled = (courseId: string) => enrollments.some((e: any) => e.courseId === courseId);

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    setEnrolling(courseId);
    try {
      await api.enroll(courseId);
      const updated = await api.getMyEnrollments();
      setEnrollments(updated);
    } catch (err: any) {
      console.error('Enroll failed:', err.message);
    } finally {
      setEnrolling(null);
    }
  };

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
              ].map((item) => (
                <Link key={item.name} href={item.href} className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${item.name === 'Courses' ? 'text-black' : 'text-slate-500 hover:text-black'}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{user.name}</span>
            ) : (
              <Link href="/login" className="text-[9px] uppercase tracking-[0.2em] font-black text-black border border-black/20 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-3">Course Catalog</h1>
          <p className="text-slate-500 font-medium text-sm">Explore our curated selection of AI-powered courses</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/30 h-80 rounded-[2rem]"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white/30 backdrop-blur-lg rounded-[2rem] border border-white/50">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">school</span>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No courses available yet</p>
            <p className="text-slate-400 text-sm mt-2">Check back later or create one in the Course Builder</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="group bg-white/40 backdrop-blur-2xl rounded-[2rem] p-5 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/60 overflow-hidden">
                <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative border border-white/40">
                  <img
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-black shadow-lg border border-white">
                    {course.difficulty}
                  </div>
                </div>
                <h4 className="font-bold text-xl text-black mb-2 leading-tight">{course.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{course.description || 'No description available'}</p>
                <div className="flex items-center justify-between border-t border-black/5 pt-5">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      <span className="material-symbols-outlined text-sm">layers</span> {course.modules?.length || course._count?.modules || 0}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      <span className="material-symbols-outlined text-sm">group</span> {course._count?.enrollments || 0}
                    </span>
                  </div>
                  {user && !isEnrolled(course.id) ? (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                      className="text-[9px] uppercase tracking-widest font-black bg-black text-white px-4 py-2 rounded-xl hover:bg-black/80 transition-all disabled:opacity-50"
                    >
                      {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                    </button>
                  ) : isEnrolled(course.id) ? (
                    <Link href={`/courses/${course.id}`} className="text-[9px] uppercase tracking-widest font-black text-black border border-black/20 px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">
                      Continue
                    </Link>
                  ) : (
                    <Link href={`/courses/${course.id}`} className="text-[9px] uppercase tracking-widest font-black text-slate-400 hover:text-black transition-all">
                      View →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
