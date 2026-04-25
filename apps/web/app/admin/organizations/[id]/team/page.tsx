'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../lib/auth-context';

export default function TeamManagementPage() {
  const { id: orgId } = useParams() as { id: string };
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [organization, setOrganization] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  const loadData = async () => {
    try {
      const [orgData, coursesData] = await Promise.all([
        api.getOrganization(orgId),
        api.getCourses()
      ]);
      setOrganization(orgData);
      setCourses(coursesData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [orgId]);

  const handleAssignCourse = async (userId: string, courseId: string) => {
    setAssigning(`${userId}-${courseId}`);
    try {
      await api.assignCourse(orgId, { userId, courseId });
      alert('Course assigned successfully');
      await loadData();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading team...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/organizations" className="text-slate-500 hover:text-black">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="font-bold text-lg">{organization?.name} Team</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Member</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Course Assignments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organization?.members.map((member: any) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{member.user.name}</div>
                    <div className="text-xs text-slate-500">{member.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-600">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {courses.map((course) => {
                        // In a real app, we'd check if they're already enrolled
                        return (
                          <button
                            key={course.id}
                            onClick={() => handleAssignCourse(member.userId, course.id)}
                            disabled={assigning === `${member.userId}-${course.id}`}
                            className="px-3 py-1.5 border border-slate-200 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
                          >
                            {assigning === `${member.userId}-${course.id}` ? '...' : `Assign ${course.title}`}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
