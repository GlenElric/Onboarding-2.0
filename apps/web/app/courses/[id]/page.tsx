"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  Layers,
  Play,
  Star,
  Loader2
} from "lucide-react";
import { api } from "../../lib/api";

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Course not found</h1>
        <Link href="/" className="text-indigo-600 font-bold">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <span className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">
            {course.title}
          </span>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          Enroll Now
        </button>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {course.difficulty}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-slate-600 text-sm font-bold">4.9 (2.4k reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-bold">12 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-bold">{course.modules?.length || 0} Modules</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm font-bold">Certification Included</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
             <img
               src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
               alt={course.title}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
               <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                 <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Course Content</h2>
            <div className="space-y-4">
              {course.modules?.map((module: any, idx: number) => (
                <div key={module.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-indigo-600 shadow-sm border border-slate-100">
                        {idx + 1}
                      </div>
                      <h3 className="font-bold text-slate-900">{module.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {module.topics?.length || 0} Lessons
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {module.topics?.map((topic: any) => (
                      <Link
                        key={topic.id}
                        href={`/courses/${id}/topics/${topic.id}`}
                        className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <BookOpen className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                            {topic.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-medium text-slate-400">15 mins</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl sticky top-24">
               <h3 className="text-2xl font-black mb-4">Start Learning Today</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-8">
                 Get unlimited access to this course and 500+ others. Learn at your own pace with AI-powered assistance.
               </p>
               <div className="space-y-4 mb-8">
                  {[
                    "Self-paced learning",
                    "AI Tutor available 24/7",
                    "Practical projects",
                    "Official certification"
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300">{benefit}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">
                 Enroll for Free
               </button>
               <p className="text-center text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest">
                 7-Day Money Back Guarantee
               </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
