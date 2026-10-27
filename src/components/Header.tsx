import React from 'react';
import { Atom, Scale, Sun, UserCheck, ShieldAlert, Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types/physics';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  hasGeminiKey: boolean;
  onOpenTestModal: () => void;
  studentId: string;
  classCode: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  activeTab,
  onSelectTab,
  hasGeminiKey,
  onOpenTestModal,
  studentId,
  classCode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner: Author & School info + Mode Alert */}
      <div className="bg-[#10213B] text-slate-100 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-600/30 border border-blue-400/30 text-blue-200 px-2 py-0.5 rounded-full text-[11px]">
            <Award className="w-3 h-3 text-amber-300" />
            GDPT 2018 - Vật lí THCS
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-slate-200">
            Tác giả: <strong className="text-white font-semibold">Đỗ Thị Giáng Châu</strong> – Trường THCS Chu Văn An, tỉnh Đồng Nai
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Transparent System status indicator */}
          <div className="flex items-center gap-1.5 text-[11px] bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-300">
              {hasGeminiKey ? 'Gemini 3.8 Flash AI: Hoạt động' : 'Hệ chuyên gia Sư phạm Socratic'}
            </span>
          </div>

          <button
            onClick={onOpenTestModal}
            className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium px-2 py-0.5 rounded-sm transition flex items-center gap-1"
            title="Chạy bộ 10 bài kiểm tra xác thực định lượng và an toàn"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            10 Kiểm thử tự động
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Logo with Atom + Force Dynamometer + Ray Emblem */}
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-[#10213B] via-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Atom className="w-6 h-6 text-white absolute" />
            <Scale className="w-3.5 h-3.5 text-amber-300 absolute -bottom-0.5 -right-0.5" />
            <Sun className="w-3 h-3 text-yellow-200 absolute -top-0.5 -left-0.5 animate-spin-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#10213B] tracking-tight group-hover:text-blue-600 transition-colors">
                VẬT LÍ THỰC CHỨNG AI
              </h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                THCS 7-8
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Từ dự đoán đến bằng chứng – Phát triển năng lực thực nghiệm & tư duy khoa học
            </p>
          </div>
        </div>

        {/* Role Selector Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onSelectRole('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentRole === 'student'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Học sinh {studentId ? `(${studentId})` : ''}
          </button>

          <button
            onClick={() => onSelectRole('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentRole === 'teacher'
                ? 'bg-[#10213B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Giáo viên
          </button>

          <button
            onClick={() => onSelectRole('demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              currentRole === 'demo'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/60'
            }`}
            title="Dữ liệu giả lập – không dùng làm minh chứng nghiên cứu"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Trải nghiệm mẫu
          </button>
        </div>
      </div>

      {/* Demo Warning Banner if in DEMO mode */}
      {currentRole === 'demo' && (
        <div className="bg-amber-50 border-y border-amber-200 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>CHẾ ĐỘ TRẢI NGHIỆM MẪU:</strong> Dữ liệu giả lập – không dùng làm minh chứng nghiên cứu. Dữ liệu này được cô lập hoàn toàn khỏi thống kê lớp học thực tế.
          </span>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'home'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🏠 Trang chủ
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => onSelectTab('archimedes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'archimedes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-700 hover:bg-white'
            }`}
          >
            <span>💧 Phòng 1: Archimedes</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">Lớp 8</span>
          </button>

          <button
            onClick={() => onSelectTab('lever')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'lever'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-700 hover:bg-white'
            }`}
          >
            <span>⚖️ Phòng 2: Đòn bẩy & Moment</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">Lớp 8</span>
          </button>

          <button
            onClick={() => onSelectTab('reflection')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === 'reflection'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-700 hover:bg-white'
            }`}
          >
            <span>💡 Phòng 3: Phản xạ ánh sáng</span>
            <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full font-bold">Lớp 7</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'quiz'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            📝 Bộ 30 câu hỏi tương tác
          </button>

          {currentRole === 'teacher' && (
            <button
              onClick={() => onSelectTab('teacher-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'teacher-dashboard'
                  ? 'bg-[#10213B] text-white shadow-xs'
                  : 'text-purple-900 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              📊 Bảng điều khiển Giáo viên
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
