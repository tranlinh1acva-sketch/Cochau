import React, { useState } from 'react';
import { 
  Sun, Play, AlertTriangle, CheckCircle2, Bot, RefreshCw, 
  ChevronRight, Award, HelpCircle, BookOpen, Sparkles, FileText, Check, Camera
} from 'lucide-react';
import { ReflectionData, CerSubmission } from '../types/physics';
import { calculateReflection } from '../utils/physicsCalculations';
import { SocraticChatModal } from './SocraticChatModal';
import { PhotoAnalysisModal } from './PhotoAnalysisModal';

interface ReflectionLabProps {
  onSaveCer: (submission: CerSubmission) => void;
  studentId: string;
  studentName: string;
  classCode: string;
  isDemo: boolean;
  hasGeminiKey: boolean;
}

export const ReflectionLab: React.FC<ReflectionLabProps> = ({
  onSaveCer,
  studentId,
  studentName,
  classCode,
  isDemo,
  hasGeminiKey,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [prediction, setPrediction] = useState<string>('');

  const [data, setData] = useState<ReflectionData>({
    i: 30,
    r: 30,
    measuredFromNormal: true,
  });

  const [claim, setClaim] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [aiEval, setAiEval] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isSocraticOpen, setIsSocraticOpen] = useState<boolean>(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);

  const result = calculateReflection(data);

  const handleLoadStandardTest = () => {
    setData({
      i: 30,
      r: 30,
      measuredFromNormal: true,
    });
    setPrediction('Em dự đoán khi chiếu tia tới 30° so với pháp tuyến thì góc phản xạ cũng sẽ bằng đúng 30°.');
    setClaim('Tia phản xạ nằm trong mặt phẳng tới và góc phản xạ luôn bằng góc tới (r = i).');
    setEvidence('Khi chỉnh đèn chiếu tới góc i = 30° so với pháp tuyến, vệt sáng phản xạ nằm ở đúng vạch r = 30° bên kia pháp tuyến. Độ chênh lệch giữa hai góc là |i - r| = 0°.');
    setReasoning('Mặt gương phẳng nhẵn bóng phản xạ ánh sáng theo định luật phản xạ ánh sáng. Góc phản xạ bằng góc tới và hai tia đối xứng nhau qua pháp tuyến tại điểm tới.');
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
          topic: 'Sự phản xạ ánh sáng',
          claim,
          evidence,
          reasoning,
          experimentalData: {
            i: data.i,
            r: data.r,
            diff: result.diff,
            measuredFromNormal: data.measuredFromNormal,
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
      id: 'sub-refl-' + Date.now(),
      topic: 'reflection',
      studentId: studentId || 'HS001',
      studentName: studentName || 'Học sinh ẩn danh',
      classCode: classCode || 'CVA-KHTN7',
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

  // SVG trigonometry coordinates
  // Point of incidence I = (190, 200)
  // Mirror along y = 200 (from x = 50 to 330)
  // Normal line vertical along x = 190 (from y = 40 to 200)
  const I_x = 190;
  const I_y = 200;
  const rayLength = 140;

  // Incident ray comes from top-left: angle i with vertical normal
  const i_rad = (data.i * Math.PI) / 180;
  const S_x = I_x - rayLength * Math.sin(i_rad);
  const S_y = I_y - rayLength * Math.cos(i_rad);

  // Reflected ray goes to top-right: angle r with vertical normal
  const r_rad = (data.r * Math.PI) / 180;
  const R_x = I_x + rayLength * Math.sin(r_rad);
  const R_y = I_y - rayLength * Math.cos(r_rad);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              KHTN LỚP 7 – ÁNH SÁNG & SỰ PHẢN XẠ
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Thời lượng: 1 tiết (45 phút)</span>
          </div>
          <h2 className="text-2xl font-black text-[#10213B] tracking-tight">
            PHÒNG THÍ NGHIỆM SỐ 3: SỰ PHẢN XẠ ÁNH SÁNG
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Khảo sát định luật phản xạ ánh sáng trên đĩa quang học và phân biệt rõ góc đo so với pháp tuyến.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadStandardTest}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
            title="Tải bộ kiểm thử: i = 30°, r = 30°, sai lệch 0°"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
            <span>Nạp số liệu chuẩn (30°)</span>
          </button>

          <button
            onClick={() => setIsSocraticOpen(true)}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Hỏi Nhà khoa học nhí</span>
          </button>
        </div>
      </div>

      {/* 5-Step Bar */}
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
          <div className="flex items-center gap-2 text-teal-700 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3>BƯỚC 1: DỰ ĐOÁN KHOA HỌC (HYPOTHESIS)</h3>
          </div>
          <p className="text-sm text-slate-600">
            Hãy suy nghĩ và ghi lại dự đoán của em trước khi bật nguồn sáng mô phỏng:
          </p>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Câu hỏi gợi ý:
            </p>
            <p>1. Khi chiếu một tia sáng đến mặt gương phẳng với góc tới i = 45°, góc phản xạ r sẽ bằng bao nhiêu độ?</p>
            <p>2. Tia phản xạ nằm ở cùng phía hay đối diện với tia tới qua đường pháp tuyến?</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dự đoán của em:</label>
            <textarea
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Em dự đoán góc phản xạ r luôn bằng góc tới i và tia phản xạ nằm ở nửa mặt phẳng đối diện qua pháp tuyến..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!prediction.trim()) {
                  alert('Em hãy nhập dự đoán trước khi chuyển sang bước thực nghiệm!');
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
          {/* Optical Bench SVG */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-teal-600" />
                  Mô phỏng đĩa quang học & Thước đo góc
                </h3>
                <span className="text-xs bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">
                  i = {data.i}° | r = {data.r}°
                </span>
              </div>

              {/* Optical Bench SVG */}
              <div className="bg-slate-950 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-slate-800 shadow-inner">
                <svg viewBox="0 0 380 260" className="w-full max-w-[360px] h-[240px]">
                  {/* Semicircular Protractor Outline */}
                  <path d="M 50 200 A 140 140 0 0 1 330 200 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Radial Angle Grid Lines every 15 deg */}
                  {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = 190 - 135 * Math.cos(rad);
                    const y1 = 200 - 135 * Math.sin(rad);
                    const x2 = 190 - 140 * Math.cos(rad);
                    const y2 = 200 - 140 * Math.sin(rad);
                    return (
                      <g key={deg}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748B" strokeWidth="1" />
                      </g>
                    );
                  })}

                  {/* Plane Mirror Base along x-axis */}
                  <rect x="40" y="200" width="300" height="14" rx="2" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Mirror diagonal hatching lines underneath */}
                  {[60, 90, 120, 150, 180, 210, 240, 270, 300].map((x) => (
                    <line key={x} x1={x} y1="214" x2={x - 10} y2="224" stroke="#64748B" strokeWidth="1" />
                  ))}
                  <text x="285" y="228" fill="#94A3B8" fontSize="9">
                    Gương phẳng
                  </text>

                  {/* Normal Line (Pháp tuyến NN') vertical dashed */}
                  <line x1="190" y1="45" x2="190" y2="200" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="195" y="55" fill="#FCD34D" fontSize="10" fontWeight="bold">
                    N (Pháp tuyến)
                  </text>

                  {/* Point of Incidence I */}
                  <circle cx="190" cy="200" r="4" fill="#EF4444" />
                  <text x="185" y="195" fill="#EF4444" fontSize="10" fontWeight="bold">
                    I
                  </text>

                  {/* Incident Ray SI (Red Laser) */}
                  <line x1={S_x} y1={S_y} x2={I_x} y2={I_y} stroke="#EF4444" strokeWidth="3" />
                  {/* Laser emitter box */}
                  <circle cx={S_x} cy={S_y} r="5" fill="#DC2626" />
                  <text x={S_x - 20} y={S_y - 8} fill="#FCA5A5" fontSize="10" fontWeight="bold">
                    S (Tia tới)
                  </text>

                  {/* Reflected Ray IR (Green/Emerald laser) */}
                  <line x1={I_x} y1={I_y} x2={R_x} y2={R_y} stroke="#10B981" strokeWidth="3" />
                  <text x={R_x + 6} y={R_y - 8} fill="#6EE7B7" fontSize="10" fontWeight="bold">
                    R (Tia phản xạ)
                  </text>

                  {/* Angle arc for i */}
                  <path
                    d={`M 190 140 A 60 60 0 0 0 ${190 - 60 * Math.sin(i_rad)} ${200 - 60 * Math.cos(i_rad)}`}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                  />
                  <text x={190 - 45 * Math.sin(i_rad / 2) - 14} y={200 - 45 * Math.cos(i_rad / 2)} fill="#FCA5A5" fontSize="10" fontWeight="bold">
                    i = {data.i}°
                  </text>

                  {/* Angle arc for r */}
                  <path
                    d={`M 190 140 A 60 60 0 0 1 ${190 + 60 * Math.sin(r_rad)} ${200 - 60 * Math.cos(r_rad)}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                  <text x={190 + 45 * Math.sin(r_rad / 2) + 4} y={200 - 45 * Math.cos(r_rad / 2)} fill="#6EE7B7" fontSize="10" fontWeight="bold">
                    r = {data.r}°
                  </text>
                </svg>
              </div>

              {/* Angle Note */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <p className="font-semibold text-slate-800">Quy ước đo góc:</p>
                <p className="mt-0.5">{result.explanation}</p>
              </div>
            </div>

            {/* Safety Reminder */}
            <div className="mt-4 p-3 bg-red-50/80 rounded-xl border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cảnh báo an toàn quang học:</strong> Nguồn sáng thí nghiệm phải được đặt cố định, tuyệt đối không chiếu chùm sáng laser trực tiếp vào mắt người khác.
              </div>
            </div>
          </div>

          {/* Right: Data sliders & Controls */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  Điều chỉnh Góc tới (i) và Góc phản xạ (r)
                </h3>
                <span className="text-[11px] text-slate-400">Đơn vị: Độ (°)</span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Incident Angle Slider */}
                <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-red-950">
                      Góc tới i (tính từ pháp tuyến):
                    </label>
                    <span className="font-mono text-red-700 font-bold text-sm">{data.i}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    step="1"
                    value={data.i}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setData({ ...data, i: val, r: val }); // by default sync, but student can tweak r to test errors
                    }}
                    className="w-full accent-red-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0° (chiếu thẳng đứng)</span>
                    <span>45°</span>
                    <span>85° (chiếu là là mặt gương)</span>
                  </div>
                </div>

                {/* Reflected Angle Slider (allow slight deviation to test real errors) */}
                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-emerald-950">
                      Góc phản xạ r đọc được trên thước:
                    </label>
                    <span className="font-mono text-emerald-700 font-bold text-sm">{data.r}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    step="1"
                    value={data.r}
                    onChange={(e) => setData({ ...data, r: parseInt(e.target.value, 10) || 0 })}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0°</span>
                    <span>45°</span>
                    <span>85°</span>
                  </div>
                </div>

                {/* Common misconception checkbox */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={data.measuredFromNormal}
                      onChange={(e) => setData({ ...data, measuredFromNormal: e.target.checked })}
                      className="rounded text-teal-600 mt-0.5"
                    />
                    <span>Góc được đo so với PHÁP TUYẾN (đúng quy chuẩn khoa học)</span>
                  </label>
                  {!data.measuredFromNormal && (
                    <p className="text-[11px] text-red-700 bg-white p-2 rounded border border-red-200">
                      Cảnh báo: Nếu đo so với mặt gương, góc đo được là {result.angleWithMirrorSurface}°. Điều này vi phạm quy ước định luật phản xạ ánh sáng!
                    </p>
                  )}
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
                BƯỚC 3: PHÂN TÍCH ĐỐI CHIẾU GÓC TỚI VÀ GÓC PHẢN XẠ
              </h3>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              result.isValidLaw
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              Chênh lệch |i - r| = {result.diff}°
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-red-800 uppercase">Góc tới i</span>
              <div className="mt-2 text-2xl font-black text-red-900 font-mono">
                {data.i}°
              </div>
              <p className="text-xs text-red-700 mt-1">Đo từ tia tới SI đến pháp tuyến</p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Góc phản xạ r</span>
              <div className="mt-2 text-2xl font-black text-emerald-900 font-mono">
                {data.r}°
              </div>
              <p className="text-xs text-emerald-700 mt-1">Đo từ tia phản xạ IR đến pháp tuyến</p>
            </div>

            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-teal-800 uppercase">Góc tia tới và tia phản xạ</span>
              <div className="mt-2 text-2xl font-black text-teal-900 font-mono">
                {data.i + data.r}°
              </div>
              <p className="text-xs text-teal-700 mt-1">i + r = {data.i}° + {data.r}°</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-800">Đánh giá thực nghiệm:</p>
            <p>{result.explanation}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Quay lại Đĩa quang học
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
              <FileText className="w-5 h-5 text-teal-600" />
              BƯỚC 4: LẬP LUẬN VÀ PHẢN BIỆN CER QUANG HỌC
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">C</span>
                <span>CLAIM: Tuyên bố định luật phản xạ ánh sáng của em:</span>
              </label>
              <textarea
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Tia phản xạ luôn nằm trong mặt phẳng tới và góc phản xạ bằng góc tới (r = i)..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">E</span>
                <span>EVIDENCE: Số liệu góc đo thực nghiệm làm bằng chứng:</span>
              </label>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={3}
                placeholder={`Ví dụ: Khi chiếu tia tới i = ${data.i}° so với pháp tuyến, tia phản xạ đo được r = ${data.r}° ở phía đối diện, độ chênh lệch là ${result.diff}°...`}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] font-black">R</span>
                <span>REASONING: Lập luận khoa học kết nối số liệu với lý thuyết:</span>
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Bề mặt gương phẳng làm chùm sáng đổi hướng nhưng không làm tán xạ lộn xộn. Vì i = r nên tia sáng tuân theo định luật phản xạ ánh sáng..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
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
              BƯỚC 5: TỔNG HỢP KIẾN THỨC & ỨNG DỤNG QUANG HỌC
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-2">
              <h4 className="font-bold text-teal-900 text-sm">Định luật phản xạ ánh sáng (KHTN 7):</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Tia phản xạ nằm trong mặt phẳng tới và ở phía bên kia pháp tuyến so với tia tới.</li>
                <li>Góc phản xạ bằng góc tới: <code>r = i</code>.</li>
                <li>Ảnh tạo bởi gương phẳng là ảnh ảo, có kích thước bằng đúng vật.</li>
              </ul>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Ứng dụng thực tiễn:</h4>
              <p className="text-slate-700 leading-relaxed">
                Kính tiềm vọng trong tàu ngầm (gồm hai gương phẳng đặt nghiêng 45°), gương chiếu hậu xe máy, mắt mèo phản quang trên đường phố ban đêm...
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

      {/* Modals */}
      <SocraticChatModal
        isOpen={isSocraticOpen}
        onClose={() => setIsSocraticOpen(false)}
        topic="reflection"
        studentPrediction={prediction}
        experimentalData={data}
        studentExplanation={reasoning}
        hasGeminiKey={hasGeminiKey}
      />

      <PhotoAnalysisModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        topic="reflection"
      />
    </div>
  );
};
