'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { useAuth } from '../../../../../lib/auth-context';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

interface QuizResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  attemptId: string;
}

export default function QuizPage() {
  const { id: courseId, topicId } = useParams() as { id: string; topicId: string };
  const { user } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId → selectedOptionId
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.getQuiz(topicId)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [topicId, user, router]);

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));
    if (formattedAnswers.length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.submitQuiz(topicId, formattedAnswers);
      setResult(res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-5xl text-red-400">error</span>
        <p className="text-red-500">{error}</p>
        <button onClick={() => router.back()} className="text-primary font-bold">← Go Back</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center flex-col gap-4">
        <span className="material-symbols-outlined text-5xl text-slate-300">quiz</span>
        <p className="text-on-surface-variant">No quiz questions available for this topic yet.</p>
        <button onClick={() => router.back()} className="text-primary font-bold">← Go Back</button>
      </div>
    );
  }

  // Results screen
  if (result) {
    const passed = result.passed;
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-outline-variant/10 p-10 max-w-md w-full text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-teal-100' : 'bg-red-100'}`}>
            <span
              className={`material-symbols-outlined text-5xl ${passed ? 'text-teal-600' : 'text-red-500'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          <h2 className="text-3xl font-headline font-black text-primary mb-2">
            {passed ? 'You Passed! 🎉' : 'Not Quite'}
          </h2>
          <p className="text-on-surface-variant mb-6">
            {passed
              ? 'Great work! You can now move on to the next topic.'
              : 'Review the material and try again. You need 70% to pass.'}
          </p>
          <div className={`text-6xl font-black font-headline mb-2 ${passed ? 'text-teal-600' : 'text-red-500'}`}>
            {Math.round(result.score)}%
          </div>
          <p className="text-on-surface-variant text-sm mb-8">
            {result.correct} / {result.total} correct
          </p>
          <div className="flex gap-3 flex-col">
            {passed && (
              <button
                onClick={() => router.push(`/courses/${courseId}/topics/${topicId}`)}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:opacity-90 transition-all"
              >
                Back to Topic
              </button>
            )}
            <button
              onClick={() => { setResult(null); setAnswers({}); setCurrentIdx(0); }}
              className="w-full border border-primary text-primary py-3 rounded-xl font-bold hover:bg-surface-container-low transition-all"
            >
              {passed ? 'Retake Quiz' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-surface font-body">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Exit Quiz
          </button>
          <span className="text-sm text-on-surface-variant font-medium">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-container h-2 rounded-full mb-10 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-headline font-bold text-primary mb-6">
            {currentQuestion.text}
          </h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(currentQuestion.id, option.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                    selected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined">arrow_back</span> Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((i) => i + 1)}
              disabled={!answers[currentQuestion.id]}
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40"
            >
              Next <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button
              id="submit-quiz-btn"
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined">check_circle</span>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIdx
                  ? 'bg-primary scale-125'
                  : answers[q.id]
                  ? 'bg-teal-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
