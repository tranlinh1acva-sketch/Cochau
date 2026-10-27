import React, { useState } from 'react';
import { 
  Droplet, Play, AlertTriangle, CheckCircle2, Bot, Camera, RefreshCw, 
  ChevronRight, Award, HelpCircle, BookOpen, Sparkles, FileText, Check 
} from 'lucide-react';
import { ArchimedesData, CerSubmission } from '../types/physics';
import { calculateArchimedes, LIQUID_DENSITIES } from '../utils/physicsCalculations';
import { SocraticChatModal } from './SocraticChatModal';
import { PhotoAnalysisModal } from './PhotoAnalysisModal';

interface ArchimedesLabProps {
  onSaveCer: (submission: CerSubmission) => void;
  studentId: string;
  studentName: string;
  classCode: string;
  isDemo: boolean;
  hasGeminiKey: boolean;
}

export const ArchimedesLab: React.FC<ArchimedesLabProps> = ({
  onSaveCer,
  studentId,
  studentName,
  classCode,
  isDemo,
  hasGeminiKey,
}) => {
  // 5-step cycle tracker
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Prediction
  const [prediction, setPrediction] = useState<string>('');

  // Step 2: Experimental Data
  const [data, setData] = useState<ArchimedesData>({
    P1: 2.0,
    P2: 1.6,
    V: 40,
    liquid: 'water',
    g: 10,
    isSubmerged: true,
    isNotTouchingWalls: true,
    dynamometerResolution: 0.1,
    measuringCylinderResolution: 2,
  });

  // Step 4: CER
  const [claim, setClaim] = useState<string>('');
  const [evidence, setEvidence] = useState<string>('');
  const [reasoning, setReasoning] = useState<string>('');
  const [aiEval, setAiEval] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Modals
  const [isSocraticOpen, setIsSocraticOpen] = useState<boolean>(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState<boolean>(false);

  // Calculation Results
  const result = calculateArchimedes(data);

  // Load standard test case
  const handleLoadStandardTest = () => {
    setData({
      P1: 2.0,
      P2: 1.6,
      V: 40,
      liquid: 'water',
      g: 10,
      isSubmerged: true,
      isNotTouchingWalls: true,
      dynamometerResolution: 0.1,
      measuringCylinderResolution: 2,
    });
    setPrediction('Em dự đoán số chỉ lực kế sẽ giảm đúng bằng trọng lượng của lượng nước tràn ra cốc chia độ.');
    setClaim('Lực đẩy Archimedes của chất lỏng tác dụng lên vật có độ lớn bằng đúng trọng lượng khối chất lỏng bị vật chiếm chỗ.');
    setEvidence('Khi ở không khí P1 = 2,0 N; khi ngập trong nước P2 = 1,6 N. Lực đẩy đo được FA = 2,0 - 1,6 = 0,4 N. Lượng nước tràn ra V = 40 mL, trọng lượng tính được P_nước = 1000 × 10 × 0,00004 = 0,4 N.');
    setReasoning('Số chỉ lực kế giảm chứng tỏ nước tác dụng một lực hướng lên. Vì FA thực nghiệm (0,4 N) bằng đúng trọng lượng nước bị chiếm chỗ (0,4 N), điều này khẳng định bản chất lực đẩy Archimedes.');
  };

  // Evaluate CER with Gemini / Pedagogical rules
  const handleEvaluateCer = async () => {
    if (!claim.trim() || !evidence.trim() || !reasoning.trim()) {
      alert('Vui lòng hoàn thành cả 3 mục: Tuyên bố (C), Bằng chứng (E) và Lập luận (R) trước khi chấm phản biện.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/cer-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Lực đẩy Archimedes',
          claim,
          evidence,
          reasoning,
          experimentalData: {
            P1: data.P1,
            P2: data.P2,
            FA_exp: result.FA_exp,
            V_mL: data.V,
            FA_theo: result.FA_theo,
            liquid: data.liquid,
            g: data.g,
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
      id: 'sub-' + Date.now(),
      topic: 'archimedes',
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

  // SVG Visual computation
  // Liquid level and submerged cylinder height
  const liquidY = 160;
  const cylinderHeight = 60;
  const cylinderY = data.isSubmerged ? 180 : 130;
  // Dynamometer spring extension based on P1 or P2
  const springExtension = data.isSubmerged ? data.P2 * 18 : data.P1 * 18;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Lab Header & Breadcrumb */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              KHTN LỚP 8 – CHỦ ĐỀ CHẤT LỎNG & ÁP SUẤT
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Thời lượng: 1 tiết (45 phút)</span>
          </div>
          <h2 className="text-2xl font-black text-[#10213B] tracking-tight">
            PHÒNG THÍ NGHIỆM SỐ 1: LỰC ĐẨY ARCHIMEDES
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Xác định độ lớn lực đẩy Archimedes bằng lực kế và kiểm chứng mối liên hệ với thể tích chất lỏng bị chiếm chỗ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadStandardTest}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
            title="Tải bộ số liệu kiểm chuẩn: P1 = 2,0 N; P2 = 1,6 N; V = 40 mL"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Nạp số liệu chuẩn (0,4 N)</span>
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

      {/* 5-STEP PEDAGOGICAL PROGRESS BAR */}
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

      {/* STEP 1: DỰ ĐOÁN (HYPOTHESIS / PREDICTION) */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3>BƯỚC 1: DỰ ĐOÁN KHOA HỌC (HYPOTHESIS)</h3>
          </div>
          <p className="text-sm text-slate-600">
            Theo nguyên tắc thực chứng khoa học, học sinh cần ghi lại dự đoán của mình trước khi tiến hành đo đạc hoặc xem phản hồi của AI.
          </p>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Câu hỏi gợi mở dự đoán:
            </p>
            <p>1. Khi treo một vật nặng vào lực kế ngoài không khí, rồi nhúng chìm vật đó vào trong nước, số chỉ của lực kế sẽ tăng lên, giảm đi hay giữ nguyên?</p>
            <p>2. Lực đẩy của nước có bằng đúng trọng lượng của lượng nước bị vật chiếm chỗ không?</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dự đoán của em:</label>
            <textarea
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Em dự đoán số chỉ lực kế sẽ giảm 0,4 N vì nước tác dụng một lực đẩy hướng lên. Thể tích nước dâng lên bằng thể tích của vật..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!prediction.trim()) {
                  alert('Em hãy nhập dự đoán của mình trước khi chuyển sang bước thực nghiệm nhé!');
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

      {/* STEP 2: THỰC NGHIỆM (SIMULATION & DATA INPUT) */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive SVG Simulation */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  Mô phỏng thí nghiệm tương tác
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  g = {data.g} N/kg | ρ = {LIQUID_DENSITIES[data.liquid]?.rho} kg/m³
                </span>
              </div>

              {/* Interactive SVG Diagram */}
              <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-slate-800">
                <svg viewBox="0 0 380 340" className="w-full max-w-[360px] h-[300px]">
                  {/* Stand and Clamp */}
                  <line x1="60" y1="20" x2="60" y2="320" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
                  <line x1="30" y1="320" x2="160" y2="320" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
                  <line x1="60" y1="40" x2="200" y2="40" stroke="#64748B" strokeWidth="6" />

                  {/* Dynamometer Casing */}
                  <rect x="185" y="45" width="30" height="90" rx="4" fill="#E2E8F0" stroke="#334155" strokeWidth="2" />
                  <line x1="192" y1="55" x2="192" y2="125" stroke="#94A3B8" strokeWidth="1" />
                  {/* Graduation marks on dynamometer */}
                  {[0, 1, 2, 3, 4].map((mark) => (
                    <line key={mark} x1="190" y1={60 + mark * 15} x2="198" y2={60 + mark * 15} stroke="#334155" strokeWidth="1.5" />
                  ))}
                  {/* Dynamometer Spring & Pointer */}
                  <line
                    x1="200"
                    y1="60"
                    x2="200"
                    y2={60 + Math.min(65, Math.max(10, springExtension))}
                    stroke="#EF4444"
                    strokeWidth="3"
                  />
                  {/* Pointer arrow */}
                  <polygon
                    points={`190,${60 + Math.min(65, Math.max(10, springExtension))} 200,${60 + Math.min(65, Math.max(10, springExtension)) + 5} 190,${60 + Math.min(65, Math.max(10, springExtension)) + 10}`}
                    fill="#DC2626"
                  />
                  {/* Force Label */}
                  <text x="225" y="95" fill="#38BDF8" fontSize="12" fontWeight="bold">
                    {data.isSubmerged ? `P2 = ${data.P2} N` : `P1 = ${data.P1} N`}
                  </text>

                  {/* Suspension String */}
                  <line
                    x1="200"
                    y1={60 + Math.min(65, Math.max(10, springExtension)) + 10}
                    x2="200"
                    y2={cylinderY}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />

                  {/* Glass Beaker with Liquid */}
                  <rect x="140" y={liquidY} width="120" height="130" rx="6" fill="#0EA5E9" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="2" />
                  {/* Liquid Wave top */}
                  <path
                    d={`M 141 ${liquidY + 15} Q 170 ${liquidY + 12} 200 ${liquidY + 15} T 259 ${liquidY + 15} L 259 290 L 141 290 Z`}
                    fill="#0284C7"
                    fillOpacity="0.35"
                  />
                  <text x="148" y={liquidY + 35} fill="#BAE6FD" fontSize="10">
                    {LIQUID_DENSITIES[data.liquid]?.name}
                  </text>

                  {/* Submerged Metal Cylinder */}
                  <rect
                    x="180"
                    y={cylinderY}
                    width="40"
                    height={cylinderHeight}
                    rx="3"
                    fill="#94A3B8"
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  <text x="187" y={cylinderY + 35} fill="#0F172A" fontSize="9" fontWeight="bold">
                    Vật nặng
                  </text>

                  {/* Buoyant force arrow (FA) pointing upwards */}
                  {data.isSubmerged && (
                    <g>
                      <line x1="200" y1={cylinderY + cylinderHeight} x2="200" y2={cylinderY + 15} stroke="#10B981" strokeWidth="4" markerEnd="url(#arrow)" />
                      <path d="M 195 25 L 200 15 L 205 25 Z" fill="#10B981" />
                      <text x="210" y={cylinderY + 45} fill="#34D399" fontSize="12" fontWeight="bold">
                        FA = {result.FA_exp} N
                      </text>
                    </g>
                  )}

                  {/* Displaced water overflow pipe & beaker */}
                  <path d="M 260 175 L 290 175 L 290 220" fill="none" stroke="#38BDF8" strokeWidth="3" />
                  <rect x="275" y="220" width="45" height="70" rx="4" fill="#0EA5E9" fillOpacity="0.3" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="280" y="255" fill="#E0F2FE" fontSize="9">
                    {data.V} mL
                  </text>
                  <text x="270" y="305" fill="#94A3B8" fontSize="9">
                    Nước tràn
                  </text>
                </svg>
              </div>

              {/* Toggle Simulation State */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setData({ ...data, isSubmerged: !data.isSubmerged })}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    data.isSubmerged
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>{data.isSubmerged ? 'Đang ngập trong nước' : 'Đang ở ngoài không khí'}</span>
                </button>

                <button
                  onClick={() => setIsPhotoOpen(true)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                  <span>Chụp / Tải ảnh bố trí dụng cụ</span>
                </button>
              </div>
            </div>

            {/* Safety & Real Lab Checklist */}
            <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Cảnh báo an toàn & thao tác thực nghiệm:
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isNotTouchingWalls}
                  onChange={(e) => setData({ ...data, isNotTouchingWalls: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Vật lơ lửng, không chạm vào đáy hoặc thành bình chia độ</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isSubmerged}
                  onChange={(e) => setData({ ...data, isSubmerged: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Vật ngập hoàn toàn trong chất lỏng</span>
              </label>
            </div>
          </div>

          {/* Right Column: Physical Measurement Data Entry */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h3 className="font-bold text-[#10213B] text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Bảng số liệu thực nghiệm đo đạc
                </h3>
                <span className="text-[11px] text-slate-400">Đơn vị đo: N (Niutơn), mL (Mililít)</span>
              </div>

              {/* Data Inputs */}
              <div className="space-y-3.5 text-xs">
                {/* P1 */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">
                      P1: Số chỉ lực kế khi vật ở ngoài không khí (N)
                    </label>
                    <span className="font-mono text-blue-600 font-bold">{data.P1} N</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={data.P1}
                    onChange={(e) => setData({ ...data, P1: parseFloat(e.target.value) || 0 })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 N</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={data.P1}
                      onChange={(e) => setData({ ...data, P1: parseFloat(e.target.value) || 0 })}
                      className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 bg-white text-xs font-mono"
                    />
                    <span>10 N</span>
                  </div>
                </div>

                {/* P2 */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">
                      P2: Số chỉ lực kế khi vật ngập trong chất lỏng (N)
                    </label>
                    <span className="font-mono text-blue-600 font-bold">{data.P2} N</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={data.P2}
                    onChange={(e) => setData({ ...data, P2: parseFloat(e.target.value) || 0 })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 N</span>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={data.P2}
                      onChange={(e) => setData({ ...data, P2: parseFloat(e.target.value) || 0 })}
                      className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 bg-white text-xs font-mono"
                    />
                    <span>10 N</span>
                  </div>
                </div>

                {/* Displaced Volume V */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">
                      V: Thể tích chất lỏng bị chiếm chỗ (mL)
                    </label>
                    <span className="font-mono text-blue-600 font-bold">{data.V} mL</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="2"
                    value={data.V}
                    onChange={(e) => setData({ ...data, V: parseFloat(e.target.value) || 0 })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>0 mL</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={data.V}
                      onChange={(e) => setData({ ...data, V: parseFloat(e.target.value) || 0 })}
                      className="w-16 text-center border border-slate-300 rounded px-1 py-0.5 bg-white text-xs font-mono"
                    />
                    <span>200 mL</span>
                  </div>
                </div>

                {/* Liquid & Gravity Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Loại chất lỏng:</label>
                    <select
                      value={data.liquid}
                      onChange={(e: any) => setData({ ...data, liquid: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white text-xs"
                    >
                      {Object.entries(LIQUID_DENSITIES).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.name} ({val.rho} kg/m³)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gia tốc trọng trường (g):</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setData({ ...data, g: 10 })}
                        className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition ${
                          data.g === 10
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        10 N/kg
                      </button>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, g: 9.8 })}
                        className={`flex-1 py-1.5 rounded-lg border font-bold text-xs transition ${
                          data.g === 9.8
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        9,8 N/kg
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live warnings */}
              {result.warnings.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                  {result.warnings.map((w, idx) => (
                    <p key={idx} className="text-xs text-red-700 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span>{w}</span>
                    </p>
                  ))}
                </div>
              )}
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

      {/* STEP 3: PHÂN TÍCH (ANALYSIS & PROGRAMMATIC CALCULATIONS) */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                BƯỚC 3: PHÂN TÍCH VÀ ĐỐI CHIẾU SỐ LIỆU ĐỊNH LƯỢNG
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mọi phép tính được thực thi bằng thuật toán chương trình xác định (không giao cho AI tự tính nhẩm).
              </p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-200">
              Chênh lệch: {result.diff} N ({result.percentDiff}%)
            </span>
          </div>

          {/* Metric Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thực nghiệm */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                Lực đẩy Thực nghiệm (FA)
              </span>
              <div className="mt-2 text-2xl font-black text-blue-900 font-mono">
                {result.FA_exp} <span className="text-sm font-sans font-semibold text-blue-700">N</span>
              </div>
              <p className="text-xs text-blue-800/80 mt-1">
                Công thức: FA = P1 - P2 = {data.P1} - {data.P2} N
              </p>
            </div>

            {/* Lý thuyết */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                Lực đẩy Lý thuyết (F_lt)
              </span>
              <div className="mt-2 text-2xl font-black text-emerald-900 font-mono">
                {result.FA_theo} <span className="text-sm font-sans font-semibold text-emerald-700">N</span>
              </div>
              <p className="text-xs text-emerald-800/80 mt-1">
                Công thức: d × V = ρ × g × V (với V = {data.V} mL)
              </p>
            </div>

            {/* Sai số / Đánh giá */}
            <div className={`p-4 rounded-xl border ${
              result.diff <= 0.05
                ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wide">
                Mức độ tương đồng
              </span>
              <div className="mt-2 text-2xl font-black font-mono">
                {result.diff === 0 ? 'TRÙNG KHỚP 100%' : `Lệch ${result.diff} N`}
              </div>
              <p className="text-xs mt-1">
                {result.diff <= 0.05
                  ? 'Số liệu đạt độ chính xác cao trong giới hạn dụng cụ.'
                  : 'Cần kiểm tra sai số đọc vạch chia hoặc bọt khí.'}
              </p>
            </div>
          </div>

          {/* Mathematical Step-by-Step Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Các bước biến đổi Vật lí chi tiết:
            </h4>
            <div className="space-y-1.5 font-mono text-xs text-slate-800">
              {result.formulaSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-slate-200">
                  <span className="text-blue-600 font-bold shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Quay lại Bảng đo đạc
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

      {/* STEP 4: PHẢN BIỆN CER (CLAIM - EVIDENCE - REASONING) */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                BƯỚC 4: CƠ CHẾ PHẢN BIỆN KHOA HỌC THEO MÔ HÌNH CER
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Khung đánh giá lập luận khoa học chuẩn quốc tế: Claim (0-2đ) + Evidence (0-2đ) + Reasoning (0-2đ) = 6 điểm.
              </p>
            </div>

            <button
              onClick={() => setIsSocraticOpen(true)}
              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Gợi mở từ AI</span>
            </button>
          </div>

          {/* CER Form Inputs */}
          <div className="space-y-4">
            {/* C - Claim */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                    C
                  </span>
                  <span>CLAIM: Kết luận khoa học (Tuyên bố) của em là gì? (0-2 điểm)</span>
                </label>
                <span className="text-[11px] text-slate-400">Trả lời trực tiếp câu hỏi nghiên cứu</span>
              </div>
              <textarea
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Lực đẩy Archimedes của nước tác dụng lên vật có độ lớn bằng đúng trọng lượng của phần chất lỏng bị chiếm chỗ."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>

            {/* E - Evidence */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">
                    E
                  </span>
                  <span>EVIDENCE: Số liệu hoặc quan sát thực nghiệm làm bằng chứng (0-2 điểm)</span>
                </label>
                <span className="text-[11px] text-slate-400">Dẫn chứng số đo cụ thể kèm đơn vị N, mL</span>
              </div>
              <textarea
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={3}
                placeholder={`Ví dụ: Lực kế ngoài không khí P1 = ${data.P1} N, khi ngập trong nước P2 = ${data.P2} N, suy ra FA = ${result.FA_exp} N. Thể tích nước dâng lên V = ${data.V} mL, trọng lượng nước chiếm chỗ tính được là ${result.FA_theo} N...`}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>

            {/* R - Reasoning */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px] font-black">
                    R
                  </span>
                  <span>REASONING: Lập luận khoa học kết nối bằng chứng với kiến thức Vật lí (0-2 điểm)</span>
                </label>
                <span className="text-[11px] text-slate-400">Vì sao số liệu trên lại khẳng định kết luận?</span>
              </div>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows={3}
                placeholder="Ví dụ: Theo định luật Archimedes, chất lỏng tác dụng một lực đẩy hướng lên có độ lớn bằng trọng lượng khối chất lỏng bị chiếm chỗ. Vì FA thực nghiệm (0,4 N) bằng đúng trọng lượng nước bị chiếm chỗ (0,4 N), điều này khẳng định quy luật tự nhiên..."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Action Row */}
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
                    <span>Đang phân tích phản biện...</span>
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

          {/* AI Rubric Evaluation Card */}
          {aiEval && (
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-sm text-indigo-950">
                    Kết quả đánh giá sơ bộ theo Rubric CER
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-700 font-medium">Tổng điểm:</span>
                  <span className="text-lg font-black text-indigo-900 bg-white px-3 py-0.5 rounded-lg border border-indigo-200">
                    {aiEval.totalScore} / 6
                  </span>
                </div>
              </div>

              {/* Criterion Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Tuyên bố (Claim):</span>
                    <span className="text-indigo-600 font-mono">{aiEval.claimScore} / 2 đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.claimFeedback}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Bằng chứng (Evidence):</span>
                    <span className="text-emerald-600 font-mono">{aiEval.evidenceScore} / 2 đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.evidenceFeedback}</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Lập luận (Reasoning):</span>
                    <span className="text-amber-600 font-mono">{aiEval.reasoningScore} / 2 đ</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{aiEval.reasoningFeedback}</p>
                </div>
              </div>

              {aiEval.overallAssessment && (
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs text-slate-700">
                  <strong>Nhận xét chung:</strong> {aiEval.overallAssessment}
                </div>
              )}

              {aiEval.pedagogicalQuestion && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Câu hỏi tư duy phản biện:</strong> {aiEval.pedagogicalQuestion}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                * Lưu ý: Kết quả trên là gợi ý của AI. Giáo viên có thể điều chỉnh và phê duyệt điểm chính thức trên Bảng điều khiển.
              </p>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: KẾT LUẬN & VẬN DỤNG THỰC TIỄN */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-[#10213B] text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              BƯỚC 5: TỔNG HỢP KẾT LUẬN & VẬN DỤNG THỰC TẾ
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Khái quát hóa kiến thức thành năng lực tìm hiểu tự nhiên và giải thích các hiện tượng đời sống.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Core Knowledge */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-sm">Ghi nhớ trọng tâm KHTN 8:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                <li>
                  Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên, gọi là <strong>lực đẩy Archimedes</strong>.
                </li>
                <li>
                  Độ lớn lực đẩy Archimedes: <code>FA = d × V = ρ × g × V</code>, trong đó <code>d</code> là trọng lượng riêng chất lỏng, <code>V</code> là thể tích phần chất lỏng bị chiếm chỗ.
                </li>
                <li>
                  Vật chìm khi <code>P &gt; FA</code>; vật lơ lửng khi <code>P = FA</code>; vật nổi khi <code>P &lt; FA</code> (cho đến khi nổi cân bằng thì <code>P = FA</code>).
                </li>
              </ul>
            </div>

            {/* Real World Application Challenge */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">Vận dụng giải quyết vấn đề thực tiễn:</h4>
              <p className="text-slate-700 leading-relaxed">
                <strong>Thử thách:</strong> Một chiếc đinh sắt bị chìm khi thả vào nước, nhưng một con tàu bằng thép nặng hàng vạn tấn lại nổi được trên biển.
              </p>
              <p className="text-slate-600">
                Hãy vận dụng công thức <code>FA = d × V</code> và cấu tạo khoang rỗng của tàu để giải thích cho bạn học cùng nhóm nhé!
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

      {/* Socratic AI Assistant Modal */}
      <SocraticChatModal
        isOpen={isSocraticOpen}
        onClose={() => setIsSocraticOpen(false)}
        topic="archimedes"
        studentPrediction={prediction}
        experimentalData={data}
        studentExplanation={reasoning}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Photo Analysis Modal */}
      <PhotoAnalysisModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        topic="archimedes"
      />
    </div>
  );
};
