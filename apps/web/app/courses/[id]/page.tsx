"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.getCourse(id)
        .then(data => {
          setCourse(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      api.getMyEnrollments()
        .then(enrollments => {
          const isEnrolled = enrollments.some((e: any) => e.courseId === id);
          setEnrolled(isEnrolled);
          if (isEnrolled) {
            api.getCourseProgress(id).then(setProgress).catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [user, id]);

  const handleEnroll = async () => {
    if (!user) return;
    setEnrolling(true);
    try {
      await api.enroll(id);
      setEnrolled(true);
      const prog = await api.getCourseProgress(id);
      setProgress(prog);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-black mb-4">Course not found</h1>
        <Link href="/" className="text-black font-bold underline">Return to Dashboard</Link>
      </div>
    );
  }

  const totalTopics = course.modules?.reduce((acc: number, m: any) => acc + (m.topics?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center hover:bg-white/60 transition-all">
              <span className="material-symbols-outlined text-black text-[18px]">arrow_back</span>
            </Link>
            <span className="font-bold text-black truncate max-w-[200px] md:max-w-none">{course.title}</span>
          </div>
          {user && !enrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-60 shadow-xl"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
          {enrolled && (
            <span className="text-[9px] uppercase tracking-widest font-black text-black bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-full">✓ Enrolled</span>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.25em]">
              {course.difficulty}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight">
            {course.title}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-xl font-medium">
            {course.description || 'No description available'}
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span className="text-xs font-bold">{course.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-[18px]">topic</span>
              <span className="text-xs font-bold">{totalTopics} Topics</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span className="text-xs font-bold">{course._count?.enrollments || 0} Enrolled</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/40">
          <img
            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Course Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-black tracking-tight">Course Content</h2>
            <div className="space-y-4">
              {course.modules?.map((module: any, idx: number) => (
                <div key={module.id} className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-lg">
                        {idx + 1}
                      </div>
                      <h3 className="font-bold text-black">{module.title}</h3>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {module.topics?.length || 0} Lessons
                    </span>
                  </div>
                  <div className="divide-y divide-white/40">
                    {module.topics?.map((topic: any) => {
                      const topicContent = (
                        <div className="px-6 py-4 flex items-center justify-between hover:bg-white/30 transition-colors group">
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-black transition-colors text-[18px]">article</span>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-black transition-colors">
                              {topic.title}
                            </span>
                          </div>
                          {enrolled && (
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-black transition-all group-hover:translate-x-1 text-[18px]">chevron_right</span>
                          )}
                        </div>
                      );

                      return enrolled ? (
                        <Link key={topic.id} href={`/courses/${id}/topics/${topic.id}`} className="block">
                          {topicContent}
                        </Link>
                      ) : (
                        <div key={topic.id}>{topicContent}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-black rounded-[2rem] p-8 text-white shadow-[0_20px_40px_rgba(0,0,0,0.15)] sticky top-24">
              <h3 className="text-xl font-bold mb-4">Start Learning Today</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Get unlimited access to this course. Learn at your own pace with AI-powered assistance.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Self-paced learning",
                  "AI Tutor available 24/7",
                  "Practical projects",
                  "Certificate on completion"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    <span className="text-sm font-medium text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              {!enrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || !user}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 transition-all disabled:opacity-60"
                >
                  {!user ? 'Sign in to Enroll' : enrolling ? 'Enrolling...' : 'Enroll for Free'}
                </button>
              ) : (
                <div className="w-full py-4 bg-white/20 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] text-center">
                  ✓ You are enrolled
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
