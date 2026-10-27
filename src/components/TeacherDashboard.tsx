import React, { useState } from 'react';
import { 
  Users, CheckCircle, BarChart3, TrendingUp, AlertTriangle, 
  Download, Printer, Filter, ShieldAlert, Award, FileText, Check, Edit3
} from 'lucide-react';
import { StudentProfile, CerSubmission } from '../types/physics';
import { DEMO_STUDENTS, DEMO_CER_SUBMISSIONS } from '../data/demoData';

interface TeacherDashboardProps {
  realSubmissions: CerSubmission[];
  realStudents: StudentProfile[];
  onUpdateSubmissionScore?: (submissionId: string, teacherScore: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  realSubmissions,
  realStudents,
  onUpdateSubmissionScore,
}) => {
  const [viewMode, setViewMode] = useState<'real' | 'demo'>('real');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<CerSubmission | null>(null);

  // Teacher grading state
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [claimScore, setClaimScore] = useState<number>(2);
  const [evidenceScore, setEvidenceScore] = useState<number>(2);
  const [reasoningScore, setReasoningScore] = useState<number>(2);

  // Choose data source strictly based on viewMode
  const activeStudents = viewMode === 'real' ? realStudents : DEMO_STUDENTS;
  const activeSubmissions = viewMode === 'real' ? realSubmissions : DEMO_CER_SUBMISSIONS;

  // Filter by class
  const filteredStudents = selectedClass === 'all'
    ? activeStudents
    : activeStudents.filter((s) => s.classCode === selectedClass);

  const filteredSubmissions = selectedClass === 'all'
    ? activeSubmissions
    : activeSubmissions.filter((s) => s.classCode === selectedClass);

  // Computed metrics
  const totalStudents = filteredStudents.length;
  const avgPreScore = totalStudents > 0
    ? +(filteredStudents.reduce((acc, s) => acc + s.preTestScore, 0) / totalStudents).toFixed(1)
    : 0;
  const avgPostScore = totalStudents > 0
    ? +(filteredStudents.reduce((acc, s) => acc + s.postTestScore, 0) / totalStudents).toFixed(1)
    : 0;
  const progressDiff = +(avgPostScore - avgPreScore).toFixed(1);

  const completedCount = filteredStudents.filter((s) => s.completedLabs.length > 0).length;
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

  const studentsNeedingSupport = filteredStudents.filter((s) => s.needSupport);

  // Common misconceptions aggregated
  const commonMisconceptions = [
    { name: 'Đo góc phản xạ so với mặt phẳng gương thay vì pháp tuyến', count: 8, severity: 'Phổ biến' },
    { name: 'Ngộ nhận "vật nặng thì luôn chìm, vật nhẹ thì luôn nổi"', count: 6, severity: 'Cần sửa' },
    { name: 'Quên đổi đơn vị thể tích từ mL sang m³ (nhầm 1 mL = 10^-3 m³ thay vì 10^-6 m³)', count: 5, severity: 'Kỹ năng tính' },
    { name: 'Chưa kiểm tra vạch số 0 của lực kế trước khi đo', count: 3, severity: 'Thực hành' },
  ];

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Mã học sinh', 'Họ tên', 'Lớp', 'Điểm trước TN', 'Điểm sau TN', 'Số bài thực hành hoàn thành', 'Cần hỗ trợ', 'Hoạt động đề xuất'];
    const rows = filteredStudents.map((s) => [
      s.studentId,
      s.studentName,
      s.classCode,
      s.preTestScore,
      s.postTestScore,
      s.completedLabs.length,
      s.needSupport ? 'Có' : 'Không',
      `"${s.recommendedActivity || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_cao_Vat_li_thuc_chung_${viewMode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable report handler
  const handlePrintReport = () => {
    window.print();
  };

  const handleOpenGradeModal = (sub: CerSubmission) => {
    setSelectedSubmission(sub);
    setClaimScore(sub.teacherScore?.claimScore ?? sub.aiEvaluation?.claimScore ?? 2);
    setEvidenceScore(sub.teacherScore?.evidenceScore ?? sub.aiEvaluation?.evidenceScore ?? 2);
    setReasoningScore(sub.teacherScore?.reasoningScore ?? sub.aiEvaluation?.reasoningScore ?? 2);
    setTeacherNotes(sub.teacherScore?.teacherNotes || '');
  };

  const handleSaveGrade = () => {
    if (!selectedSubmission) return;
    const scoreObj = {
      claimScore,
      evidenceScore,
      reasoningScore,
      totalScore: claimScore + evidenceScore + reasoningScore,
      teacherNotes,
      gradedAt: new Date().toLocaleString('vi-VN'),
    };
    if (onUpdateSubmissionScore) {
      onUpdateSubmissionScore(selectedSubmission.id, scoreObj);
    }
    selectedSubmission.teacherScore = scoreObj;
    setSelectedSubmission(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              BẢNG QUẢN LÝ DÀNH CHO GIÁO VIÊN
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">THCS Chu Văn An, Đồng Nai</span>
          </div>
          <h2 className="text-2xl font-black text-[#10213B] tracking-tight">
            THEO DÕI NĂNG LỰC THỰC NGHIỆM & ĐÁNH GIÁ CER
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tổng hợp dữ liệu minh chứng khoa học, mức độ tiến bộ trước - sau thực nghiệm và duyệt phản hồi AI.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Data isolation switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('real')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'real'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dữ liệu Thực tế ({realStudents.length})
            </button>
            <button
              onClick={() => setViewMode('demo')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'demo'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-100/50'
              }`}
            >
              Dữ liệu Mẫu (Demo)
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Demo Warning Banner if viewing demo */}
      {viewMode === 'demo' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>LƯU Ý NGHIÊN CỨU:</strong> Bạn đang xem <em>Dữ liệu giả lập – không dùng làm minh chứng nghiên cứu</em>. Các số liệu này được cách ly hoàn toàn và không gộp vào báo cáo chính thức của trường.
          </span>
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Học sinh tham gia</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-[#10213B] font-mono">{totalStudents}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Mã định danh bảo mật HSxxx</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Tỉ lệ hoàn thành</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">{completionRate}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{completedCount} / {totalStudents} em đã làm thực hành</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Điểm Trước - Sau</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 font-mono">
            {avgPreScore} → {avgPostScore}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
            + {progressDiff} điểm tăng trưởng
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase">Cần hỗ trợ cá nhân</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 font-mono">{studentsNeedingSupport.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Đã gán hoạt động bổ trợ</p>
        </div>
      </div>

      {/* Visual Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Pre-Test vs Post-Test Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#10213B] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              So sánh năng lực trước và sau thực nghiệm (Thang 10)
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Tăng trưởng: +{progressDiff} đ
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Pre test bar */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Trước thử nghiệm (Kiểm tra ban đầu):</span>
                <span className="font-mono text-slate-800 font-bold">{avgPreScore} / 10 đ</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-lg flex items-center justify-end pr-2 text-white font-bold text-[11px]"
                  style={{ width: `${Math.min(100, avgPreScore * 10)}%` }}
                >
                  {avgPreScore}
                </div>
              </div>
            </div>

            {/* Post test bar */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Sau thử nghiệm (Vật lí thực chứng AI):</span>
                <span className="font-mono text-blue-700 font-bold">{avgPostScore} / 10 đ</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-lg flex items-center justify-end pr-2 text-white font-bold text-[11px]"
                  style={{ width: `${Math.min(100, avgPostScore * 10)}%` }}
                >
                  {avgPostScore}
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic mt-2">
            * Chỉ số tính toán trực tiếp từ dữ liệu bài kiểm tra của học sinh trên hệ thống.
          </p>
        </div>

        {/* Chart 2: Common Misconceptions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-[#10213B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Các ngộ nhận khoa học phổ biến cần uốn nắn
            </h3>
            <span className="text-xs text-slate-500">GDPT 2018</span>
          </div>

          <div className="space-y-2.5">
            {commonMisconceptions.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
                    {item.severity}
                  </span>
                </div>
                <span className="text-xs font-black font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 shrink-0">
                  {item.count} em
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CER Submissions Table for Teacher Approval */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Danh sách bài phản biện CER & Phê duyệt điểm số
            </h3>
            <p className="text-xs text-slate-500">
              Giáo viên có quyền kiểm tra, sửa điểm và bổ sung lời nhận xét sư phạm.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
            {filteredSubmissions.length} bài đã nộp
          </span>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có bài nộp CER nào trong hệ thống thực tế.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3">Chủ đề</th>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Điểm AI</th>
                  <th className="py-2.5 px-3">Điểm GV xác nhận</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      <div>{sub.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{sub.studentId} • {sub.classCode}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {sub.topic === 'archimedes' ? 'Archimedes' : sub.topic === 'lever' ? 'Đòn bẩy' : 'Phản xạ ánh sáng'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{sub.timestamp}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {sub.aiEvaluation?.totalScore ?? 'Chưa chấm'}/6
                    </td>
                    <td className="py-3 px-3">
                      {sub.teacherScore ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {sub.teacherScore.totalScore}/6 (Đã duyệt)
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Chờ GV duyệt</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenGradeModal(sub)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition text-[11px] inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Xem & Chấm điểm</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teacher Grading / Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#10213B]">
                  Chi tiết bài làm CER – {selectedSubmission.studentName} ({selectedSubmission.studentId})
                </h3>
                <p className="text-xs text-slate-500">Chủ đề: {selectedSubmission.topic.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Student's Original CER */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-800 block mb-0.5">C - CLAIM (Tuyên bố):</span>
                <p className="text-slate-800">{selectedSubmission.claim || 'Trống'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-800 block mb-0.5">E - EVIDENCE (Bằng chứng số liệu):</span>
                <p className="text-slate-800">{selectedSubmission.evidence || 'Trống'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-amber-800 block mb-0.5">R - REASONING (Lập luận khoa học):</span>
                <p className="text-slate-800">{selectedSubmission.reasoning || 'Trống'}</p>
              </div>
            </div>

            {/* AI Preliminary Feedback */}
            {selectedSubmission.aiEvaluation && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-indigo-950">Gợi ý sơ bộ từ AI ({selectedSubmission.aiEvaluation.totalScore}/6 điểm):</p>
                <p className="text-slate-700 text-[11px]">{selectedSubmission.aiEvaluation.overallAssessment}</p>
              </div>
            )}

            {/* Teacher Override Grading Controls */}
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3 text-xs">
              <h4 className="font-bold text-purple-950">Phê duyệt & Điều chỉnh điểm của Giáo viên:</h4>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Claim (0-2đ):</label>
                  <select
                    value={claimScore}
                    onChange={(e) => setClaimScore(parseInt(e.target.value, 10))}
                    className="w-full border border-purple-300 rounded-lg p-1.5 bg-white font-bold"
                  >
                    <option value={0}>0 điểm</option>
                    <option value={1}>1 điểm</option>
                    <option value={2}>2 điểm</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Evidence (0-2đ):</label>
                  <select
                    value={evidenceScore}
                    onChange={(e) => setEvidenceScore(parseInt(e.target.value, 10))}
                    className="w-full border border-purple-300 rounded-lg p-1.5 bg-white font-bold"
                  >
                    <option value={0}>0 điểm</option>
                    <option value={1}>1 điểm</option>
                    <option value={2}>2 điểm</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Reasoning (0-2đ):</label>
                  <select
                    value={reasoningScore}
                    onChange={(e) => setReasoningScore(parseInt(e.target.value, 10))}
                    className="w-full border border-purple-300 rounded-lg p-1.5 bg-white font-bold"
                  >
                    <option value={0}>0 điểm</option>
                    <option value={1}>1 điểm</option>
                    <option value={2}>2 điểm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Lời nhận xét và hướng dẫn của Giáo viên:</label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  rows={2}
                  placeholder="Ghi nhận xét cụ thể giúp học sinh rèn luyện tư duy thực chứng..."
                  className="w-full border border-purple-300 rounded-lg p-2 text-xs bg-white"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-purple-900">
                  Tổng điểm phê duyệt: {claimScore + evidenceScore + reasoningScore} / 6
                </span>
                <button
                  onClick={handleSaveGrade}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-xl transition text-xs shadow-xs"
                >
                  Xác nhận & Lưu điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
