'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../lib/auth-context';

export default function TopicPage() {
  const params = useParams();
  const courseId = params.id as string;
  const topicId = params.topicId as string;
  const router = useRouter();
  const { user } = useAuth();

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number, passed: boolean } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    api.getTopic(topicId)
      .then((data) => {
        setTopic(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicId, user, router]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await api.completeTopic(topicId);
      if (res.nextTopicId) {
        router.push(`/courses/${courseId}/topics/${res.nextTopicId}`);
      } else {
        router.push(`/courses/${courseId}`);
      }
    } catch (err: any) {
      setError(err.message);
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!topic.questions || topic.questions.length === 0) return;
    
    // Format answers for API
    const answers = Object.entries(quizAnswers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId
    }));

    try {
      const res = await api.submitQuiz(topicId, answers);
      setQuizScore({ score: res.score, passed: res.passed });
      setQuizSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4">
        <h1 className="text-2xl font-bold text-black mb-4">Content unavailable</h1>
        <p className="text-red-500 mb-8 font-medium">{error}</p>
        <Link href={`/courses/${courseId}`} className="text-[10px] uppercase tracking-[0.2em] font-black text-black border border-black/20 px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all">
          Return to Course
        </Link>
      </div>
    );
  }

  const hasQuiz = topic.questions && topic.questions.length > 0;
  const allQuestionsAnswered = hasQuiz && Object.keys(quizAnswers).length === topic.questions.length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center gap-4">
          <Link href={`/courses/${courseId}`} className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center hover:bg-white/60 transition-all">
            <span className="material-symbols-outlined text-black text-[18px]">arrow_back</span>
          </Link>
          <div className="flex-1 truncate">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Learning Session</span>
            <h1 className="font-bold text-black text-sm truncate">{topic.title}</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-8">
          <h2 className="text-3xl font-bold text-black tracking-tight mb-8 leading-tight">{topic.title}</h2>
          
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
            {topic.contentChunks?.length > 0 ? (
              topic.contentChunks.map((chunk: any) => (
                <div key={chunk.id} className="text-sm font-medium">
                  {chunk.content.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              ))
            ) : (
              <p className="italic text-slate-400">No content available for this topic yet.</p>
            )}
          </div>
        </div>

        {hasQuiz && (
          <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mb-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-black text-3xl">quiz</span>
              <div>
                <h3 className="text-xl font-bold text-black">Knowledge Check</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Test your understanding</p>
              </div>
            </div>

            <div className="space-y-8">
              {topic.questions.map((q: any, idx: number) => (
                <div key={q.id} className="space-y-4">
                  <p className="font-bold text-black text-sm">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt: any) => (
                      <label 
                        key={opt.id} 
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          quizAnswers[q.id] === opt.id 
                            ? 'bg-black/5 border-black/20' 
                            : 'bg-white/50 border-white/60 hover:bg-white/80'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={opt.id}
                          checked={quizAnswers[q.id] === opt.id}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                          disabled={quizSubmitted}
                          className="w-4 h-4 text-black border-slate-300 focus:ring-black/20"
                        />
                        <span className="text-sm font-medium text-slate-700">{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {quizSubmitted && quizScore ? (
              <div className={`mt-8 p-6 rounded-2xl border ${quizScore.passed ? 'bg-emerald-50/50 border-emerald-200/50 text-emerald-800' : 'bg-red-50/50 border-red-200/50 text-red-800'}`}>
                <h4 className="font-bold text-lg mb-1">{quizScore.passed ? 'Great job!' : 'Keep trying!'}</h4>
                <p className="text-sm font-medium">You scored {quizScore.score.toFixed(0)}%.</p>
              </div>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={!allQuestionsAnswered || quizSubmitted}
                className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-40"
              >
                Submit Answers
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-black/5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {topic.materials?.length > 0 ? `${topic.materials.length} reference files available` : ''}
          </span>
          <button
            onClick={handleComplete}
            disabled={completing || (hasQuiz && (!quizSubmitted || !quizScore?.passed))}
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:shadow-2xl hover:-translate-y-0.5 transition-all shadow-xl disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {completing ? 'Completing...' : 'Complete & Continue'}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
