import React, { useState } from 'react';
import { 
  Atom, Scale, Sun, ArrowRight, Sparkles, ShieldCheck, 
  BookOpen, Compass, CheckCircle2, Award, Users, ChevronRight, Droplet, Play
} from 'lucide-react';
import { UserRole } from '../types/physics';

interface HomeProps {
  onSelectTab: (tab: string) => void;
  onSelectRole: (role: UserRole) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  classCode: string;
  setClassCode: (code: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  onOpenTestModal: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onSelectTab,
  onSelectRole,
  studentId,
  setStudentId,
  classCode,
  setClassCode,
  studentName,
  setStudentName,
  onOpenTestModal,
}) => {
  const [isJoined, setIsJoined] = useState<boolean>(!!studentId);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      alert('Vui lòng nhập Mã học sinh (ví dụ: HS001)');
      return;
    }
    setIsJoined(true);
    onSelectRole('student');
    onSelectTab('archimedes');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10213B] via-[#1E3A8A] to-[#0D9488] text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Chương trình Giáo dục Phổ thông 2018 – Môn KHTN 7 & 8</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              VẬT LÍ THỰC CHỨNG AI
            </h1>
            <p className="text-base sm:text-xl font-medium text-blue-100 max-w-2xl leading-relaxed">
              Từ dự đoán đến bằng chứng – Phát triển năng lực thực nghiệm và tư duy khoa học cho học sinh THCS bằng trí tuệ nhân tạo.
            </p>
          </div>

          {/* Author Credits Badge */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 inline-block text-xs text-slate-200">
            <p className="font-semibold text-white">
              Tác giả: <span className="text-amber-300 font-bold">Đỗ Thị Giáng Châu</span>
            </p>
            <p className="text-slate-300 mt-0.5">
              Đơn vị: <strong>Trường THCS Chu Văn An, tỉnh Đồng Nai</strong>
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                onSelectRole('student');
                onSelectTab('archimedes');
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-lg shadow-blue-900/30 flex items-center gap-2 group cursor-pointer"
            >
              <span>VÀO PHÒNG THÍ NGHIỆM</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                onSelectRole('teacher');
                onSelectTab('teacher-dashboard');
              }}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-white/20 backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>DÀNH CHO GIÁO VIÊN</span>
            </button>

            <button
              onClick={() => {
                onSelectRole('demo');
                onSelectTab('archimedes');
              }}
              className="bg-amber-500/90 hover:bg-amber-500 text-white font-bold px-5 py-3.5 rounded-2xl text-sm transition flex items-center gap-2 cursor-pointer"
              title="Dữ liệu giả lập – không dùng làm minh chứng nghiên cứu"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>TRẢI NGHIỆM MẪU</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Icons */}
        <div className="absolute right-6 -bottom-6 opacity-15 hidden lg:block pointer-events-none select-none">
          <Atom className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* STUDENT QUICK LOGIN / IDENTIFIER CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Thông tin lớp học & Mã học sinh</h3>
            <p className="text-xs text-slate-500">
              Bảo vệ quyền riêng tư: Học sinh tham gia bằng mã định danh, không bắt buộc cung cấp email hay số điện thoại.
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinClass} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mã học sinh (*):</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="VD: HS001"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Họ và tên (hoặc Bí danh):</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="VD: Gia Bảo"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mã lớp học:</label>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="VD: CVA-KHTN8"
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 font-mono text-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Dữ liệu được lưu trữ an toàn theo phiên học tập
            </span>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition text-xs shadow-xs"
            >
              Lưu thông tin & Bắt đầu học
            </button>
          </div>
        </form>
      </div>

      {/* THE 5-STEP PEDAGOGICAL CYCLE (CHU TRÌNH 5 BƯỚC THỰC CHỨNG) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Khung phương pháp luận GDPT 2018
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10213B]">
            Chu trình Thực chứng Khoa học 5 bước
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Học sinh được rèn luyện tác phong nghiên cứu của một nhà khoa học thực thụ: Không đoán mò, không ỷ lại AI, lập luận dựa trên bằng chứng số liệu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {[
            {
              step: '1',
              title: 'DỰ ĐOÁN',
              desc: 'Học sinh đưa ra giả thuyết ban đầu trước khi làm thí nghiệm. Bắt buộc nhập dự đoán riêng trước khi xem giải thích.',
              color: 'from-blue-600 to-blue-700',
              badge: 'Hypothesis',
            },
            {
              step: '2',
              title: 'THỰC NGHIỆM',
              desc: 'Thực hiện thao tác với dụng cụ đo (lực kế, bình chia độ, đòn bẩy, đĩa quang học). Ghi nhận số liệu đo đạc thực tế.',
              color: 'from-indigo-600 to-indigo-700',
              badge: 'Experiment',
            },
            {
              step: '3',
              title: 'PHÂN TÍCH',
              desc: 'Hệ thống tự động tính toán chính xác bằng công thức Vật lí, đối chiếu thực nghiệm với lý thuyết và phân tích sai số.',
              color: 'from-teal-600 to-teal-700',
              badge: 'Analysis',
            },
            {
              step: '4',
              title: 'PHẢN BIỆN CER',
              desc: 'Viết kết luận theo mô hình CER: Claim (Tuyên bố) - Evidence (Bằng chứng) - Reasoning (Lập luận). AI đóng vai trò phản biện.',
              color: 'from-amber-600 to-amber-700',
              badge: 'Argumentation',
            },
            {
              step: '5',
              title: 'KẾT LUẬN',
              desc: 'Khái quát hóa định luật, phát hiện ngộ nhận và vận dụng giải quyết các tình huống thực tiễn đời sống.',
              color: 'from-emerald-600 to-emerald-700',
              badge: 'Conclusion',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
                    {item.step}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{item.badge}</span>
                </div>
                <h4 className="font-bold text-sm text-[#10213B]">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 VIRTUAL LABS SPOTLIGHT (3 PHÒNG THÍ NGHIỆM THỰC TẾ) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10213B]">
            Ba phòng thí nghiệm trực quan & thực chứng
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tích hợp đầy đủ mô phỏng đồ họa SVG, kiểm tra sai số, cảnh báo an toàn và tính toán định lượng chuẩn xác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lab 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  KHTN Lớp 8
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Phòng 1: Lực đẩy Archimedes
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đo trọng lượng vật ngoài không khí (P1), trong chất lỏng (P2), đo thể tích nước tràn (V) để kiểm chứng FA = P1 - P2 và FA = d × V.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl text-[11px] font-mono text-slate-700 space-y-0.5 border border-slate-100">
                <p>Kiểm chuẩn: P1 = 2,0 N, P2 = 1,6 N</p>
                <p>FA thực nghiệm = 0,4 N (Trùng khớp 100%)</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('archimedes')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Vào thí nghiệm Archimedes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lab 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  KHTN Lớp 8
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Phòng 2: Đòn bẩy & Moment lực
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mô phỏng thanh đòn thăng bằng nghiêng động theo hiệu Moment. Trả lời câu hỏi: <em>"Vì sao lực nhỏ hơn vẫn có thể cân bằng lực lớn hơn?"</em>
              </p>
              <div className="bg-slate-50 p-3 rounded-xl text-[11px] font-mono text-slate-700 space-y-0.5 border border-slate-100">
                <p>Kiểm chuẩn: F1 = 2 N, d1 = 20 cm</p>
                <p>F2 = 4 N, d2 = 10 cm (Cùng bằng 40 N.cm)</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('lever')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Vào thí nghiệm Đòn bẩy</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lab 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  KHTN Lớp 7
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Phòng 3: Sự phản xạ ánh sáng
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đĩa quang học đo góc tới i và góc phản xạ r so với pháp tuyến. Ngăn ngừa triệt để ngộ nhận đo nhầm góc so với mặt gương phẳng.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl text-[11px] font-mono text-slate-700 space-y-0.5 border border-slate-100">
                <p>Kiểm chuẩn: i = 30°, r = 30°</p>
                <p>Sai lệch: Δ = |i - r| = 0° (Nghiệm đúng định luật)</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('reflection')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Vào thí nghiệm Phản xạ ánh sáng</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
