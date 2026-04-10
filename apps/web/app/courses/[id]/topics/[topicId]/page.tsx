'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../lib/auth-context';

interface ContentChunk {
  id: string;
  content: string;
  order: number;
}

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

interface Topic {
  id: string;
  title: string;
  contentChunks: ContentChunk[];
  questions: Question[];
}

export default function TopicPage() {
  const { id: courseId, topicId } = useParams() as { id: string; topicId: string };
  const { user } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [nextTopicId, setNextTopicId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const load = async () => {
      try {
        const topicData = await api.getTopic(topicId);
        setTopic(topicData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId, user, router]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const result = await api.completeTopic(topicId);
      setCompleted(true);
      setNextTopicId(result.nextTopicId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-red-500">{error || 'Topic not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <a href="/courses" className="hover:text-primary transition-colors">Courses</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a href={`/courses/${courseId}`} className="hover:text-primary transition-colors">Course</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-medium">{topic.title}</span>
        </div>

        {/* Topic Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-headline font-black text-primary mb-3">{topic.title}</h1>
          <div className="flex items-center gap-4 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">article</span>
              {topic.contentChunks.length} content blocks
            </span>
            {topic.questions.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">quiz</span>
                {topic.questions.length} quiz questions
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {topic.contentChunks.length === 0 ? (
          <div className="bg-surface-container-low rounded-2xl p-12 text-center text-on-surface-variant mb-8">
            <span className="material-symbols-outlined text-5xl mb-4 block">edit_document</span>
            <p className="font-medium">No content yet. An admin needs to upload a PDF for this topic.</p>
          </div>
        ) : (
          <div className="space-y-6 mb-10">
            {topic.contentChunks
              .sort((a, b) => a.order - b.order)
              .map((chunk, idx) => (
                <div
                  key={chunk.id}
                  className="bg-white rounded-2xl border border-outline-variant/10 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span>Section {idx + 1}</span>
                  </div>
                  <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{chunk.content}</p>
                </div>
              ))}
          </div>
        )}

        {/* Quiz CTA */}
        {topic.questions.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
            </div>
            <div className="flex-1">
              <h3 className="font-headline font-bold text-primary mb-1">Topic Quiz Available</h3>
              <p className="text-sm text-on-surface-variant mb-3">
                Test your understanding with {topic.questions.length} AI-generated questions. Score ≥70% to pass.
              </p>
              <button
                id="start-quiz-btn"
                onClick={() => router.push(`/courses/${courseId}/topics/${topicId}/quiz`)}
                className="bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                Take Quiz
              </button>
            </div>
          </div>
        )}

        {/* Complete Topic */}
        {!completed ? (
          <button
            id="complete-topic-btn"
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-md hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">check_circle</span>
            {completing ? 'Marking Complete...' : 'Mark Topic as Complete'}
          </button>
        ) : (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
            <span className="material-symbols-outlined text-teal-600 text-5xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <h3 className="font-headline font-bold text-teal-700 mb-2">Topic Completed!</h3>
            {nextTopicId ? (
              <button
                onClick={() => router.push(`/courses/${courseId}/topics/${nextTopicId}`)}
                className="mt-2 bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                Next Topic →
              </button>
            ) : (
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="mt-2 bg-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                Back to Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
