import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, X, ShieldCheck, Zap } from 'lucide-react';
import { runFullTestSuite, TestResultItem } from '../utils/testSuite';

interface SystemTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemTestModal: React.FC<SystemTestModalProps> = ({ isOpen, onClose }) => {
  const [results, setResults] = useState<TestResultItem[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      handleRunTests();
    }
  }, [isOpen]);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runFullTestSuite();
      setResults(res);
      setIsRunning(false);
    }, 250);
  };

  if (!isOpen) return null;

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10213B] to-[#1E3A8A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Bộ kiểm chuẩn 10 Tiêu chí Vật lí & An toàn</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Tự động hóa 100%
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Xác thực định lượng theo Mục XVII của Đề án "Vật Lí Thực Chứng AI"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Chạy lại</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Pill */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Kết quả kiểm thử: <strong className="text-emerald-700">{passedCount}/{totalCount} tiêu chí ĐẠT CHUẨN</strong>
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Tác giả: Đỗ Thị Giáng Châu – THCS Chu Văn An, Đồng Nai
          </span>
        </div>

        {/* Test List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/50">
          {results.map((test) => (
            <div
              key={test.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                test.passed
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-red-50/60 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-slate-900 block">{test.title}</span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium">
                      {test.category}
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {test.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-100">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Kỳ vọng:</span>
                  <span className="text-slate-700">{test.expected}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Thực tế:</span>
                  <span className="text-blue-700 font-bold">{test.actual}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic pl-6">{test.details}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-2 rounded-xl text-xs transition"
          >
            Đóng bảng kiểm thử
          </button>
        </div>
      </div>
    </div>
  );
};
