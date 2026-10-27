import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, XCircle, Award, HelpCircle, 
  RotateCcw, Sparkles, ChevronRight, Eye
} from 'lucide-react';
import { QUESTION_BANK } from '../data/questionBank';
import { LabTopic, Question } from '../types/physics';

export const QuizSection: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<LabTopic | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
  const [revealedSampleAnswers, setRevealedSampleAnswers] = useState<Record<string, boolean>>({});

  // Filter questions
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedLevel !== 'all' && q.level !== selectedLevel) return false;
    return true;
  });

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowExplanation({});
    setOpenEndedAnswers({});
    setRevealedSampleAnswers({});
  };

  // Calculate score for MCQs
  const answeredMCQs = filteredQuestions.filter(
    (q) => q.type === 'multiple_choice' && userAnswers[q.id] !== undefined
  );
  const correctMCQs = answeredMCQs.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  );
  const totalMCQs = filteredQuestions.filter((q) => q.type === 'multiple_choice').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Score Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              NGÂN HÀNG 30 CÂU HỎI THỰC HÀNH CHUẨN GDPT 2018
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#10213B] tracking-tight">
            LUYỆN TẬP TƯ DUY KHOA HỌC & GIẢI THÍCH HIỆN TƯỢNG
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Gồm 24 câu trắc nghiệm 4 phương án và 6 câu tự luận giải thích bản chất thực nghiệm.
          </p>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">Điểm trắc nghiệm</p>
              <p className="text-base font-black text-slate-900 font-mono">
                {correctMCQs.length} / {totalMCQs} <span className="text-xs font-normal text-slate-500">câu đúng</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Làm lại tất cả"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Topic filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-500 mr-1">Chủ đề:</span>
          {[
            { id: 'all', label: 'Tất cả 30 câu' },
            { id: 'archimedes', label: '💧 Lực đẩy Archimedes (10)' },
            { id: 'lever', label: '⚖️ Đòn bẩy & Moment (10)' },
            { id: 'reflection', label: '💡 Phản xạ ánh sáng (10)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTopic(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedTopic === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Level filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-500 mr-1">Mức độ:</span>
          {['all', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                selectedLevel === lvl
                  ? 'bg-[#10213B] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'all' ? 'Tất cả mức' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, qIndex) => {
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCorrect = userAnswers[q.id] === q.correctIndex;
          const isRevealed = revealedSampleAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              {/* Question header info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {qIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {q.topic === 'archimedes' ? 'Lực đẩy Archimedes' : q.topic === 'lever' ? 'Đòn bẩy' : 'Phản xạ ánh sáng'} (KHTN {q.grade})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.level === 'Nhận biết'
                      ? 'bg-slate-100 text-slate-700'
                      : q.level === 'Thông hiểu'
                      ? 'bg-blue-100 text-blue-800'
                      : q.level === 'Vận dụng'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {q.level}
                  </span>

                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                  </span>
                </div>
              </div>

              {/* Question text */}
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {q.question}
              </p>

              {/* Multiple Choice Options */}
              {q.type === 'multiple_choice' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    const isOptionCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                    if (isAnswered) {
                      if (isOptionCorrect) {
                        btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold';
                      } else if (isSelected && !isOptionCorrect) {
                        btnStyle = 'bg-red-50 text-red-900 border-red-300';
                      } else {
                        btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {isAnswered && isOptionCorrect && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isOptionCorrect && (
                          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Open-Ended Question Answer Box */}
              {q.type === 'open_ended' && (
                <div className="space-y-2 text-xs">
                  <textarea
                    value={openEndedAnswers[q.id] || ''}
                    onChange={(e) => setOpenEndedAnswers({ ...openEndedAnswers, [q.id]: e.target.value })}
                    rows={3}
                    placeholder="Em hãy viết câu trả lời và lập luận khoa học của mình vào đây..."
                    className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 focus:bg-white text-xs"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">
                      Rèn luyện kỹ năng giải thích hiện tượng theo Chương trình GDPT 2018
                    </span>
                    <button
                      onClick={() => setRevealedSampleAnswers({ ...revealedSampleAnswers, [q.id]: !isRevealed })}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition flex items-center gap-1.5 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Ẩn đáp án gợi ý' : 'Xem đáp án mẫu & Hướng dẫn'}</span>
                    </button>
                  </div>

                  {isRevealed && q.sampleAnswer && (
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                      <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Đáp án tham khảo chuẩn:
                      </p>
                      <p className="text-slate-800 leading-relaxed">{q.sampleAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation & Feedback for MCQ */}
              {q.type === 'multiple_choice' && isAnswered && (
                <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Chính xác! Chúc mừng em đã nắm vững kiến thức.</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Cần xem lại: Em có thể chọn lại phương án khác để kiểm tra sự hiểu biết.</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                  <p className="text-[11px] text-blue-700 font-semibold pt-1">
                    Khái niệm liên quan: {q.relatedConcept}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
