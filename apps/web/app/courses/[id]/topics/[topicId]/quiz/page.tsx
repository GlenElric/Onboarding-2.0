"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, HelpCircle, Timer, Loader2 } from "lucide-react";
import { api } from "@/app/lib/api";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { id, topicId } = params;

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (topicId) {
      api.getQuiz(topicId as string)
        .then(data => {
          setQuestions(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [topicId]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">No quiz available for this topic</h2>
        <Link href={`/courses/${id}/topics/${topicId}`} className="text-indigo-600 font-semibold">
          Go back
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
          <p className="text-slate-500 mb-8">Verification complete. Results will be saved to your profile.</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/courses/${id}`)}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Continue to Next Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/courses/${id}/topics/${topicId}`}
            className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Exit Quiz</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center text-slate-500 gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-mono font-medium">15:00</span>
            </div>
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
               <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
               />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 leading-tight">
          {question.stem}
        </h1>

        <div className="space-y-4 mb-12">
          {question.options.map((option: any) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-center justify-between ${
                selectedOption === option.id
                  ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    selectedOption === option.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                    {option.optionLabel}
                </span>
                <span className={`font-semibold ${selectedOption === option.id ? "text-indigo-900" : "text-slate-700"}`}>
                    {option.optionText}
                </span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedOption === option.id ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
              }`}>
                {selectedOption === option.id && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-slate-400 gap-2 text-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Need a hint? (AI Tutor available)</span>
          </div>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
              selectedOption !== null
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
