import React, { useState } from 'react';
import { 
  Scale, Play, AlertTriangle, CheckCircle2, Bot, RefreshCw, 
  ChevronRight, Award, HelpCircle, BookOpen, Sparkles, FileText, Check, Camera
} from 'lucide-react';
import { LeverData, CerSubmission } from '../types/physics';
import { calculateLever } from '../utils/physicsCalculations';
import { SocraticChatModal } from './SocraticChatModal';
import { PhotoAnalysisModal } from './PhotoAnalysisModal';

interface LeverLabProps {
  onSaveCer: (submission: CerSubmission) => void;
  studentId: string;
  studentName: string;
  classCode: string;
  isDemo: boolean;
  hasGeminiKey: boolean;
}

export const LeverLab: React.FC<LeverLabProps> = ({
  onSaveCer,
  studentId,
  studentName,
  classCode,
  isDemo,
  hasGeminiKey,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [prediction, setPrediction] = useState<string>('');

  const [data, setData] = useState<LeverData>({
    F1: 2,
    d1: 20,
    F2: 4,
    d2: 10,
  });

  const [claim, setClaim] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [aiEval, setAiEval] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isSocraticOpen, setIsSocraticOpen] = useState<boolean>(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);

  const result = calculateLever(data);

  // Load standard test case
  const handleLoadStandardTest = () => {
    setData({
      F1: 2,
      d1: 20,
      F2: 4,
      d2: 10,
    });
    setPrediction('Em dự đoán một lực nhỏ 2 N ở xa trục quay vẫn có thể làm cân bằng một lực lớn 4 N ở gần trục quay.');
    setClaim('Đòn bẩy ở trạng thái cân bằng nằm ngang khi tổng moment lực làm quay ngược chiều kim đồng hồ bằng tổng moment lực làm quay cùng chiều kim đồng hồ (M1 = M2).');
    setEvidence('Khi F1 = 2 N ở cánh tay đòn d1 = 20 cm thì M1 = 2 × 20 = 40 N.cm. Khi F2 = 4 N ở cánh tay đòn d2 = 10 cm thì M2 = 4 × 10 = 40 N.cm. Độ lệch moment là 0 N.cm và thanh đòn thăng bằng nằm ngang.');
    setReasoning('Lực F1 tuy nhỏ hơn F2 (2 N < 4 N) nhưng có cánh tay đòn dài gấp đôi (20 cm so với 10 cm), nên tác dụng làm quay của hai lực là như nhau, thỏa mãn điều kiện cân bằng moment lực.');
  };

  const handleEvaluateCer = async () => {
    if (!claim.trim() || !evidence.trim() || !reasoning.trim()) {
      alert('Vui lòng hoàn thành cả 3 mục: C (Tuyên bố), E (Bằng chứng) và R (Lập luận) trước khi chấm.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/cer-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Đòn bẩy và Moment lực',
          claim,
          evidence,
          reasoning,
          experimentalData: {
            F1: data.F1,
            d1: data.d1,
            M1: result.M1,
            F2: data.F2,
            d2: data.d2,
            M2: result.M2,
            diff: result.diff,
            isBalanced: result.isBalanced,
          },
        }),
      });
      const evalData = await res.json();
      setAiEval(evalData);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSaveSubmission = () => {
    const submission: CerSubmission = {
      id: 'sub-lever-' + Date.now(),
      topic: 'lever',
      studentId: studentId || 'HS001',
      studentName: studentName || 'Học sinh ẩn danh',
      classCode: classCode || 'CVA-KHTN8',
      timestamp: new Date().toLocaleString('vi-VN'),
      prediction,
      data: { ...data, ...result },
      claim,
      evidence,
      reasoning,
      aiEvaluation: aiEval,
      isDemo,
    };
    onSaveCer(submission);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Lab Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              KHTN LỚP 8 – ĐÒN BẨY & QUY TẮC MOMENT LỰC
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Thời lượng: 1 tiết (45 phút)</span>
          </div>
          <h2 className="text-2xl font-black text-[#10213B] tracking-tight">
            PHÒNG THÍ NGHIỆM SỐ 2: ĐÒN BẨY VÀ MOMENT LỰC
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Khảo sát điều kiện cân bằng của đòn bẩy và trả lời câu hỏi cốt lõi: <em>"Vì sao lực nhỏ hơn vẫn có thể cân bằng lực lớn hơn?"</em>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadStandardTest}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
            title="Tải bộ kiểm thử: F1=2N, d1=20cm; F2=4N, d2=10cm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Nạp số liệu chuẩn (40 N.cm)</span>
          </button>

          <button
            onClick={() => setIsSocraticOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Hỏi Nhà khoa học nhí</span>
          </button>
        </div>
      </div>

      {/* 5-Step Cycle Nav */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {[
            { num: 1, label: '1. DỰ ĐOÁN' },
            { num: 2, label: '2. THỰC NGHIỆM' },
            { num: 3, label: '3. PHÂN TÍCH' },
            { num: 4, label: '4. PHẢN BIỆN CER' },
            { num: 5, label: '5. KẾT LUẬN' },
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                currentStep === step.num
                  ? 'bg-blue-600 text-white shadow-xs'
                  : currentStep > step.num
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {currentStep > step.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: DỰ ĐOÁN */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3>BƯỚC 1: DỰ ĐOÁN KHOA HỌC (HYPOTHESIS)</h3>
          </div>
          <p className="text-sm text-slate-600">
            Hãy đưa ra dự đoán của em trước khi quan sát phản hồi của mô phỏng và trợ lý AI:
          </p>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Câu hỏi kích thích tư duy:
            </p>
            <p>1. Nếu một người có trọng lượng nhỏ hơn muốn bập bênh thăng bằng với một người nặng hơn, người đó phải ngồi ở vị trí nào?</p>
            <p>2. Khi tăng cánh tay đòn d lên gấp đôi thì lực F cần tác dụng để giữ cân bằng sẽ thay đổi như thế nào?</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dự đoán của em:</label>
            <textarea
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Em dự đoán để đòn bẩy thăng bằng, lực tác dụng nhỏ hơn cần phải đặt ở vị trí xa trục quay hơn..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!prediction.trim()) {
                  alert('Em hãy ghi lại dự đoán của mình trước khi tiếp tục!');
                  return;
                }
                setCurrentStep(2);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-xs"
            >
              <span>Lưu dự đoán & Chuyển sang Thực nghiệm</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: THỰC NGHIỆM */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SVG Visual Beam */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  Mô phỏng đòn bẩy nghiêng theo Moment lực
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  result.isBalanced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {result.isBalanced ? 'Đòn bẩy CÂN BẰNG' : 'Đang NGHIÊNG'}
                </span>
              </div>

              {/* Dynamic SVG Balance Beam */}
              <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-slate-800">
                <svg viewBox="0 0 380 260" className="w-full max-w-[360px] h-[240px]">
                  {/* Stand Base */}
                  <polygon points="170,240 210,240 190,160" fill="#64748B" />
                  <circle cx="190" cy="160" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                  <text x="195" y="178" fill="#FCD34D" fontSize="10" fontWeight="bold">
                    Trục quay O
                  </text>

                  {/* Tilting Lever Beam */}
                  <g transform={`rotate(${result.tiltAngle}, 190, 160)`}>
                    {/* The bar */}
                    <rect x="30" y="156" width="320" height="8" rx="2" fill="#E2E8F0" stroke="#334155" strokeWidth="1.5" />
                    {/* Graduation ticks on bar (every 10 cm scaled) */}
                    {[-30, -20, -10, 0, 10, 20, 30].map((dist) => {
                      const xPos = 190 + (dist * 4.6);
                      return (
                        <line key={dist} x1={xPos} y1="153" x2={xPos} y2="167" stroke="#475569" strokeWidth="1.5" />
                      );
                    })}

                    {/* Left Force Hanging Point F1 at distance d1 */}
                    <g transform={`translate(${190 - (data.d1 * 4.6)}, 164)`}>
                      <line x1="0" y1="0" x2="0" y2="25" stroke="#CBD5E1" strokeWidth="1.5" />
                      {/* Weight box proportional to F1 */}
                      <rect x="-12" y="25" width="24" height={Math.max(16, data.F1 * 7)} rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                      <text x="-8" y="42" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                        {data.F1}N
                      </text>
                      {/* Vector arrow down */}
                      <path d="M 0 25 L 0 50" stroke="#60A5FA" strokeWidth="2" markerEnd="url(#arrow)" />
                    </g>

                    {/* Right Force Hanging Point F2 at distance d2 */}
                    <g transform={`translate(${190 + (data.d2 * 4.6)}, 164)`}>
                      <line x1="0" y1="0" x2="0" y2="25" stroke="#CBD5E1" strokeWidth="1.5" />
                      {/* Weight box proportional to F2 */}
                      <rect x="-12" y="25" width="24" height={Math.max(16, data.F2 * 7)} rx="3" fill="#10B981" stroke="#047857" strokeWidth="1" />
                      <text x="-8" y="42" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                        {data.F2}N
                      </text>
                    </g>
                  </g>

                  {/* Horizontal Guideline */}
                  <line x1="30" y1="160" x2="350" y2="160" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

                  {/* Moment Labels */}
                  <text x="35" y="40" fill="#60A5FA" fontSize="12" fontWeight="bold">
                    M1 = {result.M1} N.cm (Ngược chiều KĐH)
                  </text>
                  <text x="210" y="40" fill="#34D399" fontSize="12" fontWeight="bold">
                    M2 = {result.M2} N.cm (Cùng chiều KĐH)
                  </text>
                </svg>
              </div>

              {/* Visual Explanation */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">Trạng thái cơ học:</p>
                <p className="mt-0.5">{result.explanation}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsPhotoOpen(true)}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-teal-600" />
                <span>Chụp ảnh đòn bẩy thực tế</span>
              </button>
            </div>
          </div>

          {/* Right: Data sliders & Inputs */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Điều chỉnh thông số Lực và Cánh tay đòn
                </h3>
                <span className="text-[11px] text-slate-400">Đơn vị: Lực (N), Tay đòn (cm)</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Side 1: Left */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2.5">
                  <span className="font-bold text-blue-900 block">NHÁNH TRÁI (Làm quay ngược chiều KĐH):</span>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-medium">Lực tác dụng F1:</label>
                      <span className="font-bold font-mono text-blue-700">{data.F1} N</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={data.F1}
                      onChange={(e) => setData({ ...data, F1: parseFloat(e.target.value) || 0 })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-medium">Cánh tay đòn d1 (khoảng cách đến trục quay):</label>
                      <span className="font-bold font-mono text-blue-700">{data.d1} cm</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="1"
                      value={data.d1}
                      onChange={(e) => setData({ ...data, d1: parseFloat(e.target.value) || 0 })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-blue-100 flex justify-between font-mono font-bold text-blue-900">
                    <span>Moment M1 = F1 × d1 =</span>
                    <span>{result.M1} N.cm</span>
                  </div>
                </div>

                {/* Side 2: Right */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
                  <span className="font-bold text-emerald-900 block">NHÁNH PHẢI (Làm quay cùng chiều KĐH):</span>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-medium">Lực tác dụng F2:</label>
                      <span className="font-bold font-mono text-emerald-700">{data.F2} N</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={data.F2}
                      onChange={(e) => setData({ ...data, F2: parseFloat(e.target.value) || 0 })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-700 font-medium">Cánh tay đòn d2 (khoảng cách đến trục quay):</label>
                      <span className="font-bold font-mono text-emerald-700">{data.d2} cm</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="30"
                      step="1"
                      value={data.d2}
                      onChange={(e) => setData({ ...data, d2: parseFloat(e.target.value) || 0 })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-emerald-100 flex justify-between font-mono font-bold text-emerald-900">
                    <span>Moment M2 = F2 × d2 =</span>
                    <span>{result.M2} N.cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Quay lại Dự đoán
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Chuyển sang Phân tích số liệu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PHÂN TÍCH */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                BƯỚC 3: PHÂN TÍCH ĐỐI CHIẾU MOMENT LỰC
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                So sánh hai moment làm quay và phân tích cơ chế "lợi về lực" của đòn bẩy.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-full border border-slate-200">
              Chênh lệch: {result.diff} N.cm
            </span>
          </div>

          {/* Interactive Bar Chart for Moment comparison */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Biểu đồ trực quan so sánh 2 Moment làm quay:
            </h4>

            {/* M1 Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Nhánh 1 (M1 = F1 × d1 = {data.F1}N × {data.d1}cm):</span>
                <span className="font-mono text-blue-700 font-bold">{result.M1} N.cm</span>
              </div>
              <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-lg flex items-center justify-end pr-2 text-white text-[11px] font-bold"
                  style={{ width: `${Math.min(100, Math.max(5, (result.M1 / (Math.max(result.M1, result.M2, 1) * 1.2)) * 100))}%` }}
                >
                  {result.M1}
                </div>
              </div>
            </div>

            {/* M2 Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Nhánh 2 (M2 = F2 × d2 = {data.F2}N × {data.d2}cm):</span>
                <span className="font-mono text-emerald-700 font-bold">{result.M2} N.cm</span>
              </div>
              <div className="h-6 w-full bg-slate-200 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-lg flex items-center justify-end pr-2 text-white text-[11px] font-bold"
                  style={{ width: `${Math.min(100, Math.max(5, (result.M2 / (Math.max(result.M1, result.M2, 1) * 1.2)) * 100))}%` }}
                >
                  {result.M2}
                </div>
              </div>
            </div>
          </div>

          {/* Socratic Deep Thinking Card */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Câu hỏi phân tích khoa học:
            </p>
            <p>
              <em>"Vì sao lực F1 = {data.F1} N nhỏ hơn lực F2 = {data.F2} N nhưng vẫn có thể làm cân bằng hoặc nâng bổng được F2?"</em>
            </p>
            <p className="text-slate-700">
              Gợi ý: Hãy quan sát tỉ số giữa các cánh tay đòn <code>d1/d2 = {+(data.d1 / data.d2).toFixed(2)}</code> và tỉ số hai lực <code>F2/F1 = {+(data.F2 / data.F1).toFixed(2)}</code>.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Quay lại Bảng điều khiển
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Chuyển sang Phản biện CER</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PHẢN BIỆN CER */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              BƯỚC 4: LẬP LUẬN VÀ PHẢN BIỆN CER VỀ ĐÒN BẨY
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng cấu trúc: Claim (Tuyên bố) - Evidence (Bằng chứng số liệu) - Reasoning (Lập luận Vật lí).
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">C</span>
                <span>CLAIM: Kết luận khoa học của em về điều kiện cân bằng đòn bẩy:</span>
              </label>
              <textarea
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Đòn bẩy thăng bằng khi tích giữa lực và cánh tay đòn ở hai phía trục quay bằng nhau (M1 = M2)..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">E</span>
                <span>EVIDENCE: Số liệu từ thí nghiệm làm bằng chứng:</span>
              </label>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={3}
                placeholder={`Ví dụ: Lực F1 = ${data.F1} N cách trục quay d1 = ${data.d1} cm cho moment M1 = ${result.M1} N.cm. Lực F2 = ${data.F2} N cách trục quay d2 = ${data.d2} cm cho moment M2 = ${result.M2} N.cm...`}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] font-black">R</span>
                <span>REASONING: Lập luận khoa học giải thích quy tắc moment:</span>
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Theo quy tắc moment lực, tác dụng làm quay phụ thuộc vào tích F × d. Dù lực nhỏ nhưng cánh tay đòn lớn hơn tương ứng nên tạo ra tác dụng quay bằng lực lớn..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Quay lại Phân tích
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEvaluateCer}
                disabled={isEvaluating}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                {isEvaluating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang chấm Rubric...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Chấm điểm Rubric CER</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveSubmission}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Đã lưu bài nộp!' : 'Lưu hồ sơ thực chứng'}</span>
              </button>

              <button
                onClick={() => setCurrentStep(5)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Chuyển sang Kết luận & Vận dụng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Rubric Output */}
          {aiEval && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Kết quả đánh giá Rubric CER
                </h4>
                <span className="text-base font-black text-indigo-900 bg-white px-3 py-0.5 rounded-lg border border-indigo-200">
                  {aiEval.totalScore} / 6 điểm
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Tuyên bố (Claim):</span>
                    <span className="text-indigo-600 font-mono">{aiEval.claimScore}/2đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.claimFeedback}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Bằng chứng (Evidence):</span>
                    <span className="text-emerald-600 font-mono">{aiEval.evidenceScore}/2đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.evidenceFeedback}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Lập luận (Reasoning):</span>
                    <span className="text-amber-600 font-mono">{aiEval.reasoningScore}/2đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.reasoningFeedback}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: KẾT LUẬN & VẬN DỤNG */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              BƯỚC 5: TỔNG HỢP KIẾN THỨC & ỨNG DỤNG ĐỜI SỐNG
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-sm">Quy tắc trọng tâm KHTN 8:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Moment lực: <code>M = F × d</code> (đơn vị: N.m hoặc N.cm).</li>
                <li>Điều kiện cân bằng đòn bẩy: <code>F1 × d1 = F2 × d2</code>.</li>
                <li>Muốn được lợi về lực (<code>F1 &lt; F2</code>) thì cánh tay đòn phải dài hơn (<code>d1 &gt; d2</code>).</li>
              </ul>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Ứng dụng chế tạo & kỹ thuật:</h4>
              <p className="text-slate-700">
                Xà beng bẩy đá, kìm cắt kim loại, xe rùa chở cát, kéo cắt giấy, chiếc kéo cắt cành cây to có cán dài lưỡi ngắn...
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(4)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Quay lại Phản biện CER
            </button>
            <button
              onClick={handleSaveSubmission}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Hoàn tất & Nộp bài học tập</span>
            </button>
          </div>
        </div>
      )}

      {/* Socratic Modal */}
      <SocraticChatModal
        isOpen={isSocraticOpen}
        onClose={() => setIsSocraticOpen(false)}
        topic="lever"
        studentPrediction={prediction}
        experimentalData={data}
        studentExplanation={reasoning}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Photo Modal */}
      <PhotoAnalysisModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        topic="lever"
      />
    </div>
  );
};
