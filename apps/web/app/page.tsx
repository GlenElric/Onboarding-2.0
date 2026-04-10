"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from './lib/api';

export default function Dashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch courses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">Aura Learning</h1>
            <div className="hidden md:flex items-center gap-6">
              {['Dashboard', 'Courses', 'Community', 'Reports'].map((item) => (
                <span key={item} className={`text-sm font-bold cursor-pointer transition-colors ${item === 'Dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full">Upgrade Plan</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors">notifications</span>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors">help_outline</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                <img className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Side Nav */}
          <aside className="lg:col-span-2 space-y-2">
            {[
              { icon: 'dashboard', label: 'Home', active: true },
              { icon: 'auto_stories', label: 'My Learning' },
              { icon: 'edit_note', label: 'Course Builder' },
              { icon: 'insights', label: 'Analytics' },
              { icon: 'group', label: 'Team Management' },
              { icon: 'settings', label: 'Settings' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group ${item.active ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'hover:bg-white dark:hover:bg-slate-900 text-slate-500'}`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm font-bold">{item.label}</span>
              </div>
            ))}

            <div className="mt-12 p-4 bg-indigo-600 rounded-2xl text-white relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-20 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-8xl">smart_toy</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Stuck on a concept?</p>
              <h4 className="font-bold text-sm mb-4">Ask AI Tutor</h4>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold transition-all">Start Chat</button>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">contact_support</span>
                <span className="text-sm font-bold">Support</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-sm font-bold">Log Out</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            {/* Hero Section */}
            <section className="relative h-96 rounded-3xl overflow-hidden bg-indigo-600 group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>

              <div className="relative z-10 h-full p-12 flex flex-col justify-center max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6">AI-Powered Learning Platform</span>
                <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter mb-6">Elevate Your Knowledge with Aura AI.</h2>
                <p className="text-indigo-100 text-lg font-medium leading-relaxed mb-8">Experience a personalized learning journey driven by advanced AI. Upload your materials and let Aura generate structured courses and quizzes just for you.</p>
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:shadow-xl transition-all hover:-translate-y-0.5">Get Started</button>
                  <button className="px-8 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl font-bold hover:bg-white/20 transition-all">Explore Courses</button>
                </div>
              </div>
            </section>

            {/* My Courses Gallery */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Courses</h2>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 text-indigo-600 shadow-sm rounded-lg text-xs font-bold">In Progress</button>
                  <button className="px-4 py-2 text-slate-500 text-xs font-bold hover:text-slate-900 dark:hover:text-white transition-colors">Completed</button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 h-80 rounded-3xl"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.length === 0 && (
                    <div className="col-span-2 py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">school</span>
                      <p className="text-slate-500 font-bold">No courses found. Create one in the Course Builder!</p>
                    </div>
                  )}
                  {courses.map((course) => {
                    const latestVersion = course.versions?.[0];
                    return (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <div className="group bg-white dark:bg-slate-900 rounded-3xl p-5 transition-all hover:translate-y-[-8px] hover:shadow-2xl border border-slate-100 dark:border-slate-800 cursor-pointer overflow-hidden">
                        <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative">
                          <img
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                          />
                          <div className="absolute top-4 right-4 bg-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white shadow-lg">{course.difficulty || 'Intermediate'}</div>
                        </div>
                        <h4 className="font-black text-2xl text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{course.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <span className="material-symbols-outlined text-sm text-indigo-500">layers</span> {latestVersion?._count?.modules || 0} Modules
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                              <span className="material-symbols-outlined text-sm text-purple-500">group</span> {course._count?.enrollments || 0} Learners
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-indigo-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-slate-900 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Performance Insight</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 leading-tight">Focus Score: 92%</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                  Your comprehension of "Neural Networks" peaked during your 8 AM session yesterday. Consider scheduling intensive topics early.
                </p>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-indigo-500/20 transition-all hover:bg-indigo-500">Optimize Schedule</button>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { icon: 'quiz', color: 'bg-teal-50 text-teal-600', title: 'Quiz Mastery', detail: 'Neural Networks: 98/100', time: '2h ago' },
                  { icon: 'forum', color: 'bg-indigo-50 text-indigo-600', title: 'Tutor Session', detail: 'Recursive Algorithms', time: '5h ago' },
                  { icon: 'verified', color: 'bg-purple-50 text-purple-600', title: 'Module Complete', detail: 'Backpropagation', time: 'Yesterday' }
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md cursor-pointer group">
                    <div className={`w-12 h-12 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                      <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{activity.title}</h4>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">{activity.detail}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all">View Analytics</button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
