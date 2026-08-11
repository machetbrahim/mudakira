import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SchoolInfo {
  wilaya: string;
  directorate: string;
  establishment: string;
  teacherName: string;
  academicYear: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: string;
  unit: string;
  duration: string;
  date: string;
  notes?: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  // معلومات المستخدم والمدرسة
  user: {
    email: string;
    name: string;
    isAuthenticated: boolean;
  } | null;
  schoolInfo: SchoolInfo;
  lessons: Lesson[];
  currentLesson: Lesson | null;

  // الإعدادات
  settings: {
    autoSave: boolean;
    defaultDuration: number;
  };

  // الإجراءات
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateSchoolInfo: (info: SchoolInfo) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (id: string, data: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

const defaultSchoolInfo: SchoolInfo = {
  wilaya: 'الجزائر',
  directorate: 'مديرية التربية لولاية الجزائر',
  establishment: 'متوسطة',
  teacherName: 'الأستاذ',
  academicYear: '2025/2026',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      schoolInfo: defaultSchoolInfo,
      lessons: [],
      currentLesson: null,
      settings: {
        autoSave: true,
        defaultDuration: 60,
      },

      login: async (email: string, password: string) => {
        // محاكاة تسجيل الدخول (في الإنتاج يتم الاتصال بالخادم)
        if (email && password.length >= 4) {
          set({
            user: {
              email,
              name: email.split('@')[0] || 'مستخدم',
              isAuthenticated: true,
            },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null });
      },

      updateSchoolInfo: (info: SchoolInfo) => {
        set({ schoolInfo: info });
      },

      addLesson: (lesson: Lesson) => {
        set((state) => ({
          lessons: [lesson, ...state.lessons],
        }));
      },

      updateLesson: (id: string, data: Partial<Lesson>) => {
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
          ),
          currentLesson:
            state.currentLesson?.id === id
              ? { ...state.currentLesson, ...data, updatedAt: new Date().toISOString() }
              : state.currentLesson,
        }));
      },

      deleteLesson: (id: string) => {
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== id),
          currentLesson: state.currentLesson?.id === id ? null : state.currentLesson,
        }));
      },

      setCurrentLesson: (lesson: Lesson | null) => {
        set({ currentLesson: lesson });
      },

      updateSettings: (settings: Partial<AppState['settings']>) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },
    }),
    {
      name: 'machet-physics-storage',
    }
  )
);
