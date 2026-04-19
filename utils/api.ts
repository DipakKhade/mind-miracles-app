
const API_BASE_URL = 'http://192.168.1.10:8080';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function transformMongoDB(doc: any): any {
  if (doc === null || doc === undefined) return doc;
  
  if (Array.isArray(doc)) {
    return doc.map(transformMongoDB);
  }
  
  if (typeof doc !== 'object') {
    return doc;
  }
  
  if (doc.$oid) {
    return doc.$oid;
  }
  
  if (doc.$date) {
    if (Array.isArray(doc.$date)) {
      return new Date(doc.$date[0], doc.$date[1] - 1, doc.$date[2], doc.$date[3] || 0, doc.$date[4] || 0).toISOString();
    }
    return doc.$date;
  }
  
  const result: any = {};
  for (const key in doc) {
    result[key] = transformMongoDB(doc[key]);
  }
  return result;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Fetching:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    const rawJson = await response.json();
    
    const json = transformMongoDB(rawJson) as ApiResponse<T>;
    
    if (!json.success) {
      throw new Error(json.error || 'API request failed');
    }
    
    return json.data as T;
  } catch (error) {
    console.log('[API] Error:', error);
    throw error;
  }
}

export interface Course {
  _id?: string | { $oid: string };
  id?: string;
  title: string;
  description: string;
  price: number;
  thumbnailURL?: string;
  previewURL?: string;
  isPaid?: boolean;
  isActive?: boolean;
}

export interface CourseFeature {
  _id?: string;
  id?: string;
  courseId: string;
  feature: string;
  featureDesc?: string;
}

export interface CourseWithFeatures {
  course: Course;
  features: CourseFeature[];
}

export interface Video {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: number;
  thumbnailUrl?: string;
}

export interface TestSummary {
  testType: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
}

export interface TestOption {
  text: string;
  value: number;
}

export interface TestQuestion {
  questionId: number;
  question: string;
  options: TestOption[];
}

export interface ScoreRange {
  minScore: number;
  maxScore: number;
  level: string;
  description: string;
  recommendation?: string;
}

export interface MentalHealthTest {
  _id?: string;
  id?: string;
  testType: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questions: TestQuestion[];
  scoreRanges: ScoreRange[];
  maxScore: number;
}

export interface UserTestAnswer {
  questionId: number;
  selectedValue: number;
}

export interface CreateTestResultRequest {
  userId?: string;
  testType: string;
  answers: UserTestAnswer[];
  userInfo?: {
    name?: string;
    email?: string;
    mobile?: string;
    age?: number;
  };
}

export interface UserTestResult {
  _id?: string;
  id?: string;
  userId?: string;
  testType: string;
  score: number;
  totalScore: number;
  level: string;
  description: string;
  recommendation?: string;
  answers: UserTestAnswer[];
  createdAt?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Enrollment {
  _id?: string;
  id?: string;
  userId: string;
  courseId: string;
  enrolledAt?: string;
}

export interface Payment {
  _id?: string;
  id?: string;
  enrollmentId: string;
  amount: number;
  method: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const api = {
  courses: {
    getAll: () => fetchApi<Course[]>('/courses'),
    getById: (id: string) => fetchApi<CourseWithFeatures>(`/courses/${id}`),
    getVideos: (courseId: string) => fetchApi<Video[]>(`/courses/${courseId}/videos`),
  },
  
  tests: {
    getAll: () => fetchApi<TestSummary[]>('/tests'),
    getByType: (type: string) => fetchApi<MentalHealthTest>(`/tests/${type}`),
    submitResult: (data: CreateTestResultRequest) => 
      fetchApi<UserTestResult>('/tests/results', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getUserResults: (userId: string) => 
      fetchApi<UserTestResult[]>(`/tests/results/user/${userId}`),
  },
  
  users: {
    googleAuth: (name: string, email: string, picture?: string) =>
      fetchApi<User>('/users/google-auth', {
        method: 'POST',
        body: JSON.stringify({ name, email, picture }),
      }),
    getById: (id: string) => fetchApi<User>(`/users/${id}`),
    getByEmail: (email: string) => fetchApi<User>(`/users/email/${encodeURIComponent(email)}`),
  },
  
  payments: {
    createOrder: (amount: number, userId: string, courseId: string) =>
      fetchApi<RazorpayOrder>('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount, user_id: userId, course_id: courseId }),
      }),
    verify: (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) =>
      fetchApi<Payment>('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ razorpay_order_id: razorpayOrderId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature }),
      }),
  },
  
  enrollments: {
    create: (userId: string, courseId: string) =>
      fetchApi<Enrollment>('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, course_id: courseId }),
      }),
    getUserEnrollments: (userId: string) =>
      fetchApi<Enrollment[]>(`/enrollments/user/${userId}`),
    check: (userId: string, courseId: string) =>
      fetchApi<Enrollment>(`/enrollments/check/${userId}/${courseId}`),
  },
};

export default api;