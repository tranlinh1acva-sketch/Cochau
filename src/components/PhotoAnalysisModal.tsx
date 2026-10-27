import React, { useState, useRef } from 'react';
import { Camera, Upload, ShieldCheck, AlertCircle, X, CheckCircle, Info, Trash2, Eye } from 'lucide-react';
import { LabTopic } from '../types/physics';

interface PhotoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: LabTopic;
  onPhotoAnalyzed?: (photoData: { url: string; analysis: any }) => void;
}

export const PhotoAnalysisModal: React.FC<PhotoAnalysisModalProps> = ({
  isOpen,
  onClose,
  topic,
  onPhotoAnalyzed,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chỉ chọn tệp định dạng hình ảnh (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImage) {
      setErrorMsg('Vui lòng chọn ảnh dụng cụ thí nghiệm trước.');
      return;
    }

    if (!consentGranted) {
      setErrorMsg('Bạn cần tích chọn xác nhận đồng ý gửi ảnh thiết bị thí nghiệm.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          imageBase64: selectedImage,
          userConsent: true,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
      if (onPhotoAnalyzed) {
        onPhotoAnalyzed({ url: selectedImage, analysis: data });
      }
    } catch (err: any) {
      setErrorMsg('Không thể kết nối máy chủ phân tích ảnh: ' + (err.message || 'Lỗi mạng'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearPhoto = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#10213B] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-base">Phân tích ảnh bố trí thí nghiệm</h3>
              <p className="text-xs text-slate-300">Hỗ trợ kiểm tra an toàn & kiểm soát bố trí dụng cụ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Privacy Notice */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 text-xs text-blue-900 space-y-1.5">
          <div className="flex items-start gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>Chính sách an toàn & Bảo vệ quyền riêng tư học sinh (GDPT 2018):</span>
          </div>
          <ul className="list-disc pl-6 space-y-1 text-slate-700 text-[11px]">
            <li>Chỉ chụp <strong>dụng cụ đo và cách bố trí</strong> (lực kế, bình chia độ, đòn bẩy, gương). <strong>Tuyệt đối không chụp mặt học sinh</strong>.</li>
            <li>Nếu ảnh mờ hoặc không đọc rõ vạch đo, AI sẽ <strong>từ chối đoán số</strong> để bảo đảm tính thực chứng khoa học. Học sinh cần đọc số đo trực tiếp bằng mắt.</li>
          </ul>
        </div>

        <div className="p-5 space-y-4">
          {/* Upload / Camera zone */}
          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center transition">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Tải ảnh lên hoặc Chụp ảnh dụng cụ</p>
                <p className="text-xs text-slate-500 mt-1">Hỗ trợ PNG, JPG, JPEG (tối đa 10MB)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Dụng cụ thí nghiệm"
                  className="max-h-64 object-contain"
                />
                <button
                  onClick={handleClearPhoto}
                  className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs flex items-center gap-1 shadow-md"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa ảnh</span>
                </button>
              </div>

              {/* Consent check */}
              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Em xác nhận ảnh này <strong>chỉ chứa dụng cụ thí nghiệm</strong> (không có khuôn mặt hay thông tin cá nhân) và đồng ý để AI phân tích kiểm tra cách bố trí.
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={handleAnalyzePhoto}
                disabled={isAnalyzing || !consentGranted}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang kiểm tra cách bố trí dụng cụ...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Phân tích cách bố trí thí nghiệm</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-sm text-[#10213B] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Kết quả đánh giá bố trí dụng cụ
                </h4>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  analysisResult.setupQuality === 'Tốt'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  Đánh giá: {analysisResult.setupQuality || 'Cần điều chỉnh'}
                </span>
              </div>

              {analysisResult.observations && analysisResult.observations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1">Quan sát bố trí:</p>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-0.5">
                    {analysisResult.observations.map((obs: string, idx: number) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.potentialErrors && analysisResult.potentialErrors.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-1">Nguy cơ sai số hoặc cảnh báo:</p>
                  <ul className="list-disc pl-5 text-xs text-amber-900 space-y-0.5">
                    {analysisResult.potentialErrors.map((errItem: string, idx: number) => (
                      <li key={idx}>{errItem}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.studentActionNotice && (
                <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs text-blue-900">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lưu ý quan trọng cho học sinh:</span>
                  </div>
                  <p>{analysisResult.studentActionNotice}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
