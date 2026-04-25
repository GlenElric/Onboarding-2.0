'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../lib/auth-context';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000';

export default function AdminCourseDetailPage() {
  const { id } = useParams() as { id: string };
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [moduleTitle, setModuleTitle] = useState('');
  const [addingModule, setAddingModule] = useState(false);
  const [topicInputs, setTopicInputs] = useState<Record<string, string>>({});
  const [uploadingTopic, setUploadingTopic] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingTopicId, setPendingTopicId] = useState<string | null>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<Record<string, string>>({});
  const [deletingTopic, setDeletingTopic] = useState<string | null>(null);

  // Course Edit/Delete State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', difficulty: '', price: 0, imageUrl: '' });
  const [savingCourse, setSavingCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.role !== 'PLATFORM_ADMIN') router.push('/');
  }, [user, isLoading, router]);

  const loadCourse = async () => {
    try {
      const data = await api.getCourse(id);
      setCourse(data);
      setEditForm({
        title: data.title,
        description: data.description || '',
        difficulty: data.difficulty,
        price: data.price || 0,
        imageUrl: data.imageUrl || '',
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourse(); }, [id]);

  const handleAddModule = async () => {
    if (!moduleTitle.trim()) return;
    setAddingModule(true);
    try {
      const order = (course?.modules?.length || 0) + 1;
      await api.addModule(id, { title: moduleTitle, order });
      setModuleTitle('');
      await loadCourse();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddingModule(false);
    }
  };

  const handleAddTopic = async (moduleId: string, currentTopicsCount: number) => {
    const title = topicInputs[moduleId]?.trim();
    if (!title) return;
    try {
      await api.addTopic(moduleId, { title, order: currentTopicsCount + 1 });
      setTopicInputs((prev) => ({ ...prev, [moduleId]: '' }));
      await loadCourse();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic? This will also delete all associated content and quizzes.')) return;
    setDeletingTopic(topicId);
    try {
      await api.deleteTopic(topicId);
      await loadCourse();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingTopic(null);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      await api.updateCourse(id, editForm);
      setShowEditModal(false);
      await loadCourse();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm('CRITICAL: Are you sure you want to delete this entire course? This action is IRREVERSIBLE and will delete all modules, topics, student progress, and payments.')) return;
    setDeletingCourse(true);
    try {
      await api.deleteCourse(id);
      router.push('/admin/courses');
    } catch (e: any) {
      setError(e.message);
      setDeletingCourse(false);
    }
  };

  const handlePdfUpload = (topicId: string) => {
    setPendingTopicId(topicId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pendingTopicId) return;
    const topicId = pendingTopicId;
    setUploadingTopic(topicId);
    setUploadStatus((prev) => ({ ...prev, [topicId]: 'Uploading...' }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(
        `${AI_SERVICE_URL}/process/pdf?topicId=${topicId}&token=${token}`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');
      setUploadStatus((prev) => ({ ...prev, [topicId]: `✓ ${data.chunkCount} chunks saved` }));
    } catch (e: any) {
      setUploadStatus((prev) => ({ ...prev, [topicId]: `✗ ${e.message}` }));
    } finally {
      setUploadingTopic(null);
      setPendingTopicId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateQuiz = async (topicId: string) => {
    setGeneratingQuiz(topicId);
    setQuizStatus((prev) => ({ ...prev, [topicId]: 'Generating...' }));
    try {
      const res = await fetch(
        `${AI_SERVICE_URL}/generate/quiz?topicId=${topicId}&token=${token}`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Generation failed');
      await api.generateQuiz(topicId);
      setQuizStatus((prev) => ({ ...prev, [topicId]: `✓ ${data.questions?.length || 0} questions generated` }));
    } catch (e: any) {
      setQuizStatus((prev) => ({ ...prev, [topicId]: `✗ ${e.message}` }));
    } finally {
      setGeneratingQuiz(null);
    }
  };

  if (isLoading || user?.role !== 'PLATFORM_ADMIN') return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-bold">{error || 'Course not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/courses" className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center hover:bg-white/60 transition-all">
              <span className="material-symbols-outlined text-black text-[18px]">arrow_back</span>
            </Link>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Course Builder</span>
              <h2 className="font-bold text-black text-sm">{course?.title}</h2>
            </div>
          </div>
          <Link href="/admin/analytics" className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 hover:text-black transition-colors">Analytics</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Course Header */}
        <div className="mb-10 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-black tracking-tight">{course?.title}</h1>
              <button
                onClick={() => setShowEditModal(true)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-black"
                title="Edit Course Details"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <p className="text-slate-500 font-medium text-sm max-w-2xl">{course?.description}</p>
          </div>
          <button
            onClick={handleDeleteCourse}
            disabled={deletingCourse}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-200/50 px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            {deletingCourse ? 'Deleting...' : 'Delete Course'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-md border border-red-200/50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold mb-6">{error}</div>
        )}

        {/* Add Module */}
        <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-6 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Add Module</h2>
          <div className="flex gap-3">
            <input
              id="module-title-input"
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Introduction to Neural Networks"
              className="flex-1 px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
            />
            <button
              id="add-module-btn"
              onClick={handleAddModule}
              disabled={addingModule || !moduleTitle.trim()}
              className="bg-black text-white px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-40"
            >
              {addingModule ? 'Adding...' : 'Add Module'}
            </button>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {course?.modules
            ?.sort((a: any, b: any) => a.order - b.order)
            .map((mod: any, mIdx: number) => (
              <div key={mod.id} className="bg-white/40 backdrop-blur-2xl rounded-[2rem] border border-white/60 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                {/* Module Header */}
                <div className="px-6 py-5 flex items-center gap-4 border-b border-white/40">
                  <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center font-bold text-white text-sm shadow-lg">
                    {mIdx + 1}
                  </div>
                  <h3 className="font-bold text-black flex-1">{mod.title}</h3>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{mod.topics?.length || 0} topics</span>
                </div>

                {/* Topics */}
                <div className="divide-y divide-white/30">
                  {mod.topics
                    ?.sort((a: any, b: any) => a.order - b.order)
                    .map((topic: any) => (
                      <div key={topic.id} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-black/30 text-[18px]">article</span>
                          <span className="font-medium text-black text-sm flex-1">{topic.title}</span>

                          {/* Upload PDF */}
                          <button
                            onClick={() => handlePdfUpload(topic.id)}
                            disabled={uploadingTopic === topic.id}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-black/10 px-3 py-2 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-sm">upload_file</span>
                            {uploadingTopic === topic.id ? '...' : 'PDF'}
                          </button>

                          {/* Generate Quiz */}
                          <button
                            onClick={() => handleGenerateQuiz(topic.id)}
                            disabled={generatingQuiz === topic.id}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 border border-black/10 px-3 py-2 rounded-xl hover:bg-black hover:text-white transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            {generatingQuiz === topic.id ? '...' : 'Quiz'}
                          </button>

                          {/* Delete Topic */}
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            disabled={deletingTopic === topic.id}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-400 border border-red-200/50 px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            {deletingTopic === topic.id ? '...' : ''}
                          </button>
                        </div>

                        {/* Status messages */}
                        {uploadStatus[topic.id] && (
                          <p className={`text-[10px] font-bold ml-7 mt-1.5 ${uploadStatus[topic.id].startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                            {uploadStatus[topic.id]}
                          </p>
                        )}
                        {quizStatus[topic.id] && (
                          <p className={`text-[10px] font-bold ml-7 mt-1 ${quizStatus[topic.id].startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                            {quizStatus[topic.id]}
                          </p>
                        )}
                      </div>
                    ))}
                </div>

                {/* Add Topic */}
                <div className="px-6 py-4 border-t border-white/40 flex gap-3">
                  <input
                    type="text"
                    value={topicInputs[mod.id] || ''}
                    onChange={(e) => setTopicInputs((prev) => ({ ...prev, [mod.id]: e.target.value }))}
                    placeholder="Add topic title..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(mod.id, mod.topics?.length || 0)}
                  />
                  <button
                    onClick={() => handleAddTopic(mod.id, mod.topics?.length || 0)}
                    disabled={!topicInputs[mod.id]?.trim()}
                    className="bg-black text-white px-5 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-40"
                  >
                    Add Topic
                  </button>
                </div>
              </div>
            ))}

          {(!course?.modules || course.modules.length === 0) && (
            <div className="text-center py-16 bg-white/30 backdrop-blur-lg rounded-[2rem] border border-white/50">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block">menu_book</span>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No modules yet. Add the first module above.</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/60">
            <div className="px-8 py-6 border-b border-white/40 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit Course</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-black transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateCourse} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Course Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Difficulty</label>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Price (INR)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                    className="w-full px-5 py-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md text-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border border-black/10 text-slate-500 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/50 transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-60"
                >
                  {savingCourse ? 'Saving...' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
