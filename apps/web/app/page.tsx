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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-xl font-black tracking-[0.3em] uppercase text-black">CHIAC-ASI</h1>
            <div className="hidden md:flex items-center gap-6">
              {[
                { name: 'Dashboard', href: '/' },
                { name: 'Courses', href: '/courses' },
                { name: 'Community', href: '#' },
                { name: 'Reports', href: '#' }
              ].map((item) => (
                <Link key={item.name} href={item.href} className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors ${item.name === 'Dashboard' ? 'text-black' : 'text-slate-500 hover:text-black'}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden lg:block text-[9px] uppercase tracking-[0.2em] font-black text-black border border-black/20 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all cursor-pointer">Upgrade Plan</span>
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
              { icon: 'dashboard', label: 'Home', active: true, href: '/' },
              { icon: 'auto_stories', label: 'My Learning', href: '/courses' },
              { icon: 'edit_note', label: 'Course Builder', href: '/admin/courses' },
              { icon: 'insights', label: 'Analytics', href: '#' },
              { icon: 'group', label: 'Team Management', href: '#' },
              { icon: 'settings', label: 'Settings', href: '#' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all group ${item.active ? 'bg-black shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-white' : 'hover:bg-white/40 text-slate-600 border border-transparent hover:border-white/50'}`}>
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">{item.label}</span>
              </Link>
            ))}

            <div className="mt-12 p-6 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl text-black relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
              <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-8xl">smart_toy</span>
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Stuck on a concept?</p>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Ask AI Tutor</h4>
              <button className="w-full py-3 bg-black hover:bg-black/80 rounded-xl text-white text-[9px] uppercase tracking-widest font-black transition-all">Start Chat</button>
            </div>

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-4 px-5 py-3 text-slate-500 hover:text-black cursor-pointer border border-transparent hover:border-white/40 hover:bg-white/30 rounded-2xl transition-all">
                <span className="material-symbols-outlined text-[20px]">contact_support</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Support</span>
              </div>
              <Link href="/login" className="flex items-center gap-4 px-5 py-3 text-slate-500 hover:text-black cursor-pointer border border-transparent hover:border-white/40 hover:bg-white/30 rounded-2xl transition-all">
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Log Out</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-7 space-y-12">
            {/* Hero Section */}
            <section className="relative min-h-[28rem] flex flex-col justify-center rounded-[3rem] overflow-hidden bg-white/20 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.02)] group p-12 text-center md:text-left items-center md:items-start">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-5 py-2 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-[0.25em] mb-10 shadow-lg">World's First Superintelligence Venture</span>
                <h2 className="text-5xl md:text-7xl font-semibold text-black leading-[1.05] tracking-tight mb-8">Elevate With<br/><span className="font-light">Chiac-Asi.</span></h2>
                <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed mb-12 max-w-lg">Experience ONBOARDING through a truly personalized journey driven by ethereal aesthetics and absolute minimalism.</p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup" className="px-10 py-5 bg-black text-white rounded-[1.25rem] text-[9px] uppercase tracking-[0.2em] font-black hover:shadow-2xl transition-all hover:-translate-y-1 inline-block text-center shadow-xl">Get Started</Link>
                  <Link href="/login" className="px-10 py-5 bg-white/40 border border-white/60 text-black hover:bg-white/60 rounded-[1.25rem] text-[9px] uppercase tracking-[0.2em] font-black transition-all inline-block text-center backdrop-blur-md shadow-sm">Sign In</Link>
                  <Link href="/courses" className="px-10 py-5 bg-transparent border border-black/10 text-black hover:border-black rounded-[1.25rem] text-[9px] uppercase tracking-[0.2em] font-black transition-all inline-block text-center">Explore Courses</Link>
                </div>
              </div>
            </section>

            {/* My Courses Gallery */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-black">My Courses</h2>
                <div className="flex bg-white/30 backdrop-blur-md border border-white/40 p-1 rounded-2xl">
                  <button className="px-5 py-2 bg-black text-white shadow-sm rounded-xl text-[10px] uppercase tracking-widest font-bold">In Progress</button>
                  <button className="px-5 py-2 text-slate-500 text-[10px] uppercase tracking-widest font-bold hover:text-black transition-colors">Completed</button>
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
                    <div className="col-span-2 py-20 text-center bg-white/30 backdrop-blur-lg rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                      <span className="material-symbols-outlined text-6xl text-slate-400 mb-4 opacity-50">school</span>
                      <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No courses found. Create one in the Course Builder!</p>
                    </div>
                  )}
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <div className="group bg-white/40 backdrop-blur-2xl rounded-[2rem] p-5 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white/60 cursor-pointer overflow-hidden">
                        <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-6 relative border border-white/40">
                          <img
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                          />
                          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-black shadow-lg border border-white">{course.difficulty}</div>
                        </div>
                        <h4 className="font-bold text-xl text-black mb-3 transition-colors leading-tight">{course.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-6 font-medium leading-relaxed">{course.description}</p>
                        <div className="flex items-center justify-between border-t border-black/5 pt-5">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                              <span className="material-symbols-outlined text-sm">layers</span> {course._count?.modules || 0}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                              <span className="material-symbols-outlined text-sm">group</span> {course._count?.enrollments || 0}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-black opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">arrow_forward</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="p-8 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">AI Performance Insight</span>
                </div>
                <h3 className="text-3xl font-light text-black mb-4 leading-tight tracking-tight">Focus Score: <span className="font-bold">92%</span></h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-8 max-w-xs">
                  Your comprehension of "Neural Networks" peaked during your 8 AM session yesterday. Consider scheduling intensive topics early.
                </p>
                <button className="w-full py-4 bg-transparent border border-black/20 text-black hover:border-black shadow-sm rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all">Optimize Schedule</button>
              </div>
            </div>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-6 mt-2">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { icon: 'quiz', color: 'bg-black/5 text-black', title: 'Quiz Mastery', detail: 'Neural Networks: 98/100', time: '2h ago' },
                  { icon: 'forum', color: 'bg-black/5 text-black', title: 'Tutor Session', detail: 'Recursive Algorithms', time: '5h ago' },
                  { icon: 'verified', color: 'bg-black/5 text-black', title: 'Module Complete', detail: 'Backpropagation', time: 'Yesterday' }
                ].map((activity, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white/30 backdrop-blur-xl rounded-[1.5rem] border border-white/50 transition-all hover:bg-white/50 cursor-pointer group">
                    <div className={`w-12 h-12 rounded-2xl ${activity.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 border border-white/50`}>
                      <span className="material-symbols-outlined text-[18px] opacity-80">{activity.icon}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[11px] uppercase tracking-widest font-black text-black">{activity.title}</h4>
                      <p className="text-[10px] text-slate-600 font-bold mt-0.5">{activity.detail}</p>
                      <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] hover:text-black transition-all">View Analytics</button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
