import React, { useState, useEffect } from 'react';
import { UserRole, CerSubmission, StudentProfile } from './types/physics';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { ArchimedesLab } from './components/ArchimedesLab';
import { LeverLab } from './components/LeverLab';
import { ReflectionLab } from './components/ReflectionLab';
import { QuizSection } from './components/QuizSection';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SystemTestModal } from './components/SystemTestModal';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [studentId, setStudentId] = useState<string>('HS001');
  const [studentName, setStudentName] = useState<string>('Trần Gia Bảo');
  const [classCode, setClassCode] = useState<string>('CVA-KHTN8');
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  // Persistent storage for Real Submissions (isolated from demo)
  const [realSubmissions, setRealSubmissions] = useState<CerSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('vatli_real_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Persistent storage for Real Students roster
  const [realStudents, setRealStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('vatli_real_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        studentId: 'HS001',
        studentName: 'Trần Gia Bảo',
        classCode: 'CVA-KHTN8',
        preTestScore: 5.0,
        postTestScore: 8.5,
        completedLabs: ['archimedes'],
        cerSubmissions: [],
        identifiedMisconceptions: [],
        needSupport: false,
        recommendedActivity: 'Rèn luyện thêm bài toán thực tế về lực đẩy Archimedes trong nước muối',
        isDemo: false,
      },
      {
        studentId: 'HS002',
        studentName: 'Nguyễn Lê Quỳnh Chi',
        classCode: 'CVA-KHTN8',
        preTestScore: 6.0,
        postTestScore: 9.0,
        completedLabs: ['lever'],
        cerSubmissions: [],
        identifiedMisconceptions: [],
        needSupport: false,
        recommendedActivity: 'Mở rộng: Chế tạo mô hình bập bênh nhiều tải trọng',
        isDemo: false,
      },
      {
        studentId: 'HS003',
        studentName: 'Lê Hoàng Yến',
        classCode: 'CVA-KHTN8',
        preTestScore: 4.0,
        postTestScore: 7.0,
        completedLabs: [],
        cerSubmissions: [],
        identifiedMisconceptions: ['Quên đổi đơn vị mL sang m³'],
        needSupport: true,
        supportReason: 'Điểm trước thử nghiệm dưới trung bình, hay nhầm đơn vị đo thể tích.',
        recommendedActivity: 'Luyện tập: Quy đổi đơn vị chuẩn SI trong bài toán lực đẩy',
        isDemo: false,
      }
    ];
  });

  // Fetch server status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(!!data.hasGeminiKey);
      })
      .catch((err) => {
        console.warn('Status fetch error, using local fallback:', err);
      });
  }, []);

  // Save to localStorage when real data changes
  useEffect(() => {
    try {
      localStorage.setItem('vatli_real_submissions', JSON.stringify(realSubmissions));
    } catch (e) {
      console.error(e);
    }
  }, [realSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem('vatli_real_students', JSON.stringify(realStudents));
    } catch (e) {
      console.error(e);
    }
  }, [realStudents]);

  // Handle saving CER submission
  const handleSaveCer = (submission: CerSubmission) => {
    if (submission.isDemo) {
      // In demo mode, don't contaminate real data
      return;
    }

    setRealSubmissions((prev) => [submission, ...prev]);

    // Update student progress in roster
    setRealStudents((prev) => {
      const existing = prev.find((s) => s.studentId === submission.studentId);
      if (existing) {
        return prev.map((s) => {
          if (s.studentId === submission.studentId) {
            const completed = Array.from(new Set([...s.completedLabs, submission.topic]));
            return {
              ...s,
              completedLabs: completed,
              cerSubmissions: [submission, ...s.cerSubmissions],
              postTestScore: Math.min(10, +(s.postTestScore + 0.5).toFixed(1)),
            };
          }
          return s;
        });
      } else {
        const newStudent: StudentProfile = {
          studentId: submission.studentId,
          studentName: submission.studentName,
          classCode: submission.classCode,
          preTestScore: 5.0,
          postTestScore: 8.0,
          completedLabs: [submission.topic],
          cerSubmissions: [submission],
          identifiedMisconceptions: [],
          needSupport: false,
          isDemo: false,
        };
        return [newStudent, ...prev];
      }
    });
  };

  // Handle teacher grade override
  const handleUpdateSubmissionScore = (submissionId: string, teacherScore: any) => {
    setRealSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId) {
          return { ...sub, teacherScore };
        }
        return sub;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={(role) => {
          setCurrentRole(role);
          if (role === 'teacher') {
            setActiveTab('teacher-dashboard');
          } else if (role === 'student' && activeTab === 'teacher-dashboard') {
            setActiveTab('archimedes');
          }
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasGeminiKey={hasGeminiKey}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        studentId={studentId}
        classCode={classCode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <Home
            onSelectTab={setActiveTab}
            onSelectRole={setCurrentRole}
            studentId={studentId}
            setStudentId={setStudentId}
            classCode={classCode}
            setClassCode={setClassCode}
            studentName={studentName}
            setStudentName={setStudentName}
            onOpenTestModal={() => setIsTestModalOpen(true)}
          />
        )}

        {activeTab === 'archimedes' && (
          <ArchimedesLab
            onSaveCer={handleSaveCer}
            studentId={studentId}
            studentName={studentName}
            classCode={classCode}
            isDemo={currentRole === 'demo'}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'lever' && (
          <LeverLab
            onSaveCer={handleSaveCer}
            studentId={studentId}
            studentName={studentName}
            classCode={classCode}
            isDemo={currentRole === 'demo'}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'reflection' && (
          <ReflectionLab
            onSaveCer={handleSaveCer}
            studentId={studentId}
            studentName={studentName}
            classCode={classCode}
            isDemo={currentRole === 'demo'}
            hasGeminiKey={hasGeminiKey}
          />
        )}

        {activeTab === 'quiz' && <QuizSection />}

        {activeTab === 'teacher-dashboard' && (
          <TeacherDashboard
            realSubmissions={realSubmissions}
            realStudents={realStudents}
            onUpdateSubmissionScore={handleUpdateSubmissionScore}
          />
        )}
      </main>

      {/* 10-Criteria Automated Test Suite Modal */}
      <SystemTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#10213B] text-slate-300 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-white text-sm">VẬT LÍ THỰC CHỨNG AI</span>
              <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-500/30">
                GDPT 2018
              </span>
            </div>
            <p className="text-slate-400">
              Dự đoán – Thực nghiệm – Phân tích – Phản biện – Kết luận.
            </p>
            <p className="text-slate-400">
              Tác giả: <strong className="text-slate-200">Đỗ Thị Giáng Châu</strong> – Trường THCS Chu Văn An, tỉnh Đồng Nai.
            </p>
          </div>

          <div className="space-y-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo vệ quyền riêng tư học sinh | Tính toán chính xác bằng logic</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ứng dụng web phục vụ dạy học và phát triển năng lực khoa học tự nhiên cấp THCS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
