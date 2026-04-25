const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string, role?: string) =>
    apiFetch<{ access_token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  // Courses
  getCourses: () => apiFetch<any[]>('/courses'),
  getCourse: (id: string) => apiFetch<any>(`/courses/${id}`),
  createCourse: (data: any) =>
    apiFetch<any>('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) =>
    apiFetch<any>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) =>
    apiFetch<any>(`/courses/${id}`, { method: 'DELETE' }),
  addModule: (courseId: string, data: any) =>
    apiFetch<any>(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
  addTopic: (moduleId: string, data: any) =>
    apiFetch<any>(`/courses/modules/${moduleId}/topics`, { method: 'POST', body: JSON.stringify(data) }),
  getTopic: (topicId: string) => apiFetch<any>(`/courses/topics/${topicId}`),

  // Enrollments
  enroll: (courseId: string) =>
    apiFetch<any>(`/enrollments`, { method: 'POST', body: JSON.stringify({ courseId }) }),
  getMyEnrollments: () => apiFetch<any[]>('/enrollments/my'),
  getCourseProgress: (courseId: string) =>
    apiFetch<any>(`/enrollments/course/${courseId}`),
  completeTopic: (topicId: string) =>
    apiFetch<any>(`/enrollments/topics/${topicId}/complete`, { method: 'POST' }),

  // Quiz
  getQuiz: (topicId: string) => apiFetch<any[]>(`/quizzes/topic/${topicId}`),
  submitQuiz: (topicId: string, answers: any[]) =>
    apiFetch<any>(`/quizzes/topic/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getQuizHistory: (topicId: string) => apiFetch<any[]>(`/quizzes/topic/${topicId}/history`),
  generateQuiz: (topicId: string) =>
    apiFetch<any>(`/quizzes/topic/${topicId}/generate`, { method: 'POST' }),

  // Topics
  deleteTopic: (topicId: string) =>
    apiFetch<any>(`/courses/topics/${topicId}`, { method: 'DELETE' }),

  // AI Tutor Chat
  chatWithTutor: async (context: string, message: string) => {
    const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${AI_URL}/generate/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, message })
    });
    const rawData = await res.text();
    // Aggressively strip ALL control characters (0-31 and 127-159) to prevent JSON.parse errors
    // This includes raw newlines and tabs that might be illegally present inside string values.
    const data = rawData
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");

    if (!res.ok) {
      let errDetail = 'Chat failed';
      try {
        const errJson = JSON.parse(data);
        errDetail = errJson.detail || errJson.message || errDetail;
      } catch {
        errDetail = data.substring(0, 200) || errDetail;
      }
      throw new Error(errDetail);
    }
    try {
      console.log('DEBUG: Final data to parse:', data);
      return JSON.parse(data);
    } catch (e: any) {
      console.error('DEBUG: JSON Parse Final Error:', e.message, 'Data snippet:', data.substring(0, 100));
      return { answer: data, citations: [] };
    }
  },
};
