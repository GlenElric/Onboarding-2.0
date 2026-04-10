const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
  addModule: (courseId: string, data: any) =>
    apiFetch<any>(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(data) }),
  addTopic: (moduleId: string, data: any) =>
    apiFetch<any>(`/courses/modules/${moduleId}/topics`, { method: 'POST', body: JSON.stringify(data) }),
  getTopic: (topicId: string) => apiFetch<any>(`/courses/topics/${topicId}`),

  // Enrollments
  enroll: (courseId: string) =>
    apiFetch<any>(`/enrollments/${courseId}`, { method: 'POST' }),
  getMyEnrollments: () => apiFetch<any[]>('/enrollments/my'),
  getCourseProgress: (courseId: string) =>
    apiFetch<any>(`/enrollments/${courseId}/progress`),
  completeTopic: (topicId: string) =>
    apiFetch<any>(`/enrollments/topics/${topicId}/complete`, { method: 'POST' }),

  // Quiz
  getQuiz: (topicId: string) => apiFetch<any[]>(`/quiz/${topicId}`),
  submitQuiz: (topicId: string, answers: any[]) =>
    apiFetch<any>(`/quiz/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getQuizHistory: (topicId: string) => apiFetch<any[]>(`/quiz/${topicId}/history`),
  generateQuiz: (topicId: string) =>
    apiFetch<any>(`/quiz/generate/${topicId}`, { method: 'POST' }),
};
