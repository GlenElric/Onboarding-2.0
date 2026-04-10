'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

interface Topic {
  id: string;
  title: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  topics: Topic[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  imageUrl: string;
  modules: Module[];
}

type ProgressMap = Record<string, string>; // topicId → status

export default function CourseDetailPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const courseData = await api.getCourse(id);
        setCourse(courseData);

        if (user) {
          try {
            const progressData = await api.getCourseProgress(id);
            setEnrolled(true);
            const map: ProgressMap = {};
            (progressData.topicProgress || []).forEach((tp: any) => {
              map[tp.topicId] = tp.status;
            });
            setProgress(map);
          } catch {
            setEnrolled(false);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { router.push('/login'); return; }
    setEnrolling(true);
    try {
      await api.enroll(id);
      setEnrolled(true);
      // Reload progress
      const progressData = await api.getCourseProgress(id);
      const map: ProgressMap = {};
      (progressData.topicProgress || []).forEach((tp: any) => {
        map[tp.topicId] = tp.status;
      });
      setProgress(map);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setEnrolling(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'completed') return 'check_circle';
    if (status === 'in_progress') return 'play_circle';
    if (status === 'unlocked') return 'radio_button_unchecked';
    return 'lock';
  };

  const statusColor = (status: string) => {
    if (status === 'completed') return 'text-teal-600';
    if (status === 'in_progress') return 'text-secondary';
    if (status === 'unlocked') return 'text-primary';
    return 'text-slate-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-red-500">{error || 'Course not found'}</p>
      </div>
    );
  }

  const totalTopics = course.modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedTopics = Object.values(progress).filter((s) => s === 'completed').length;
  const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Header */}
      <div className="bg-indigo-950 text-white py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <a href="/courses" className="text-indigo-300 text-sm flex items-center gap-1 mb-6 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Catalog
          </a>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full md:w-64 rounded-2xl object-cover aspect-video"
              />
            )}
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {course.difficulty}
              </span>
              <h1 className="text-4xl font-headline font-black mb-4">{course.title}</h1>
              <p className="text-indigo-200 mb-6 text-lg">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-indigo-300 mb-6">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  {course.modules.length} Modules
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">topic</span>
                  {totalTopics} Topics
                </span>
              </div>

              {enrolled ? (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Your Progress</span>
                    <span className="font-bold">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-indigo-800 h-3 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-teal-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="inline-block bg-teal-500 text-white px-5 py-2 rounded-xl font-bold text-sm">
                    ✓ Enrolled
                  </span>
                </div>
              ) : (
                <button
                  id="enroll-btn"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-headline font-bold text-primary mb-8">Course Syllabus</h2>
        <div className="space-y-6">
          {course.modules
            .sort((a, b) => a.order - b.order)
            .map((mod, mIdx) => (
              <div key={mod.id} className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/10 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-bold">
                    {mIdx + 1}
                  </span>
                  <h3 className="font-headline font-bold text-primary">{mod.title}</h3>
                  <span className="ml-auto text-xs text-on-surface-variant">{mod.topics.length} topics</span>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {mod.topics
                    .sort((a, b) => a.order - b.order)
                    .map((topic) => {
                      const status = enrolled ? (progress[topic.id] || 'locked') : 'locked';
                      const canAccess = enrolled && (status === 'unlocked' || status === 'in_progress' || status === 'completed');
                      return (
                        <div
                          key={topic.id}
                          className={`flex items-center gap-4 px-6 py-4 transition-all ${canAccess ? 'hover:bg-surface-container-low cursor-pointer' : 'opacity-60'}`}
                          onClick={() => canAccess && router.push(`/courses/${id}/topics/${topic.id}`)}
                        >
                          <span className={`material-symbols-outlined ${statusColor(status)}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {statusIcon(status)}
                          </span>
                          <span className="font-medium text-primary flex-1">{topic.title}</span>
                          {canAccess && (
                            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                          )}
                          {!enrolled && (
                            <span className="text-xs text-on-surface-variant">Enroll to access</span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
