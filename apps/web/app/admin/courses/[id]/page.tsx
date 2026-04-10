'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../lib/auth-context';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export default function AdminCourseDetailPage() {
  const { id } = useParams() as { id: string };
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Module state
  const [moduleTitle, setModuleTitle] = useState('');
  const [addingModule, setAddingModule] = useState(false);

  // Add Topic state
  const [topicInputs, setTopicInputs] = useState<Record<string, string>>({}); // moduleId → title

  // PDF Upload state
  const [uploadingTopic, setUploadingTopic] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingTopicId, setPendingTopicId] = useState<string | null>(null);

  // Quiz Gen state
  const [generatingQuiz, setGeneratingQuiz] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && user?.role !== 'ADMIN') router.push('/');
  }, [user, isLoading, router]);

  const loadCourse = async () => {
    try {
      const data = await api.getCourse(id);
      setCourse(data);
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

      // Save questions to NestJS API
      await api.generateQuiz(topicId);
      setQuizStatus((prev) => ({ ...prev, [topicId]: `✓ ${data.questions?.length || 0} questions generated` }));
    } catch (e: any) {
      setQuizStatus((prev) => ({ ...prev, [topicId]: `✗ ${e.message}` }));
    } finally {
      setGeneratingQuiz(null);
    }
  };

  if (isLoading || user?.role !== 'ADMIN') return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-500">{error || 'Course not found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen px-8 py-10 max-w-5xl mx-auto">
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <button onClick={() => router.push('/admin/courses')} className="hover:text-indigo-600 transition-colors">
          Admin Courses
        </button>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-indigo-600 font-medium">{course.title}</span>
      </div>

      <h1 className="text-4xl font-black text-indigo-600 mb-2">{course.title}</h1>
      <p className="text-slate-500 mb-10">{course.description}</p>

      {/* Add Module */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="font-bold text-indigo-600 mb-4">Add Module</h2>
        <div className="flex gap-3">
          <input
            id="module-title-input"
            type="text"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="e.g. Introduction to Neural Networks"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
          />
          <button
            id="add-module-btn"
            onClick={handleAddModule}
            disabled={addingModule || !moduleTitle.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {addingModule ? 'Adding...' : 'Add Module'}
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {course.modules
          ?.sort((a: any, b: any) => a.order - b.order)
          .map((mod: any, mIdx: number) => (
            <div key={mod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {mIdx + 1}
                </span>
                <h3 className="font-bold text-indigo-600 flex-1">{mod.title}</h3>
                <span className="text-xs text-slate-500">{mod.topics?.length || 0} topics</span>
              </div>

              {/* Topics */}
              <div className="divide-y divide-slate-100">
                {mod.topics
                  ?.sort((a: any, b: any) => a.order - b.order)
                  .map((topic: any) => (
                    <div key={topic.id} className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-indigo-600 text-sm">article</span>
                        <span className="font-medium text-slate-700 flex-1">{topic.title}</span>
                        {/* PDF Upload */}
                        <button
                          onClick={() => handlePdfUpload(topic.id)}
                          disabled={uploadingTopic === topic.id}
                          title="Upload PDF content"
                          className="flex items-center gap-1 text-xs text-secondary font-bold border border-secondary/30 px-3 py-1 rounded-lg hover:bg-secondary/5 transition-all disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-sm">upload_file</span>
                          {uploadingTopic === topic.id ? 'Uploading...' : 'Upload PDF'}
                        </button>
                        {/* Generate Quiz */}
                        <button
                          onClick={() => handleGenerateQuiz(topic.id)}
                          disabled={generatingQuiz === topic.id}
                          title="Generate AI quiz"
                          className="flex items-center gap-1 text-xs text-teal-700 font-bold border border-teal-300 px-3 py-1 rounded-lg hover:bg-teal-50 transition-all disabled:opacity-60"
                        >
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                          {generatingQuiz === topic.id ? 'Generating...' : 'Gen Quiz'}
                        </button>
                      </div>
                      {/* Status messages */}
                      {uploadStatus[topic.id] && (
                        <p className={`text-xs ml-7 ${uploadStatus[topic.id].startsWith('✓') ? 'text-teal-600' : 'text-red-500'}`}>
                          {uploadStatus[topic.id]}
                        </p>
                      )}
                      {quizStatus[topic.id] && (
                        <p className={`text-xs ml-7 ${quizStatus[topic.id].startsWith('✓') ? 'text-teal-600' : 'text-red-500'}`}>
                          {quizStatus[topic.id]}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {/* Add Topic */}
              <div className="px-6 py-4 bg-white border-t border-slate-200 flex gap-3">
                <input
                  type="text"
                  value={topicInputs[mod.id] || ''}
                  onChange={(e) => setTopicInputs((prev) => ({ ...prev, [mod.id]: e.target.value }))}
                  placeholder="Add topic title..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(mod.id, mod.topics?.length || 0)}
                />
                <button
                  onClick={() => handleAddTopic(mod.id, mod.topics?.length || 0)}
                  disabled={!topicInputs[mod.id]?.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40"
                >
                  Add Topic
                </button>
              </div>
            </div>
          ))}

        {(!course.modules || course.modules.length === 0) && (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-5xl block mb-4">menu_book</span>
            <p>No modules yet. Add the first module above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
