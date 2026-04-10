"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Play, Loader2 } from "lucide-react";
import { api } from "@/app/lib/api";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { id, topicId } = params;
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      api.getTopic(topicId as string)
        .then(data => {
          setTopic(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Topic not found</h1>
        <Link href={`/courses/${id}`} className="text-indigo-600 font-semibold">
          Return to course
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/courses/${id}`}
            className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-medium text-sm">Back to Curriculum</span>
          </Link>
          <div className="flex items-center gap-4">
             <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
               Mark as Complete
             </button>
             <Link
                href={`/courses/${id}/topics/${topicId}/quiz`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
             >
                Take Quiz
             </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wider uppercase">Current Topic</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-6">{topic.title}</h1>

            <div className="prose prose-slate max-w-none">
              {topic.contentChunks && topic.contentChunks.length > 0 ? (
                topic.contentChunks.map((chunk: any) => (
                  <div key={chunk.id} className="mb-6 text-lg text-slate-600 leading-relaxed">
                    {chunk.content}
                  </div>
                ))
              ) : (
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  No content available for this topic yet.
                </p>
              )}

              <div className="aspect-video bg-slate-900 rounded-xl mb-8 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                 <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <Play className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-4">Key Learning Objectives</h2>
              <p className="text-slate-600 mb-6">{topic.learningObjectives || "No objectives listed."}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
