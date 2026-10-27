import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Lightbulb, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LabTopic } from '../types/physics';

interface SocraticChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: LabTopic;
  studentPrediction?: string;
  experimentalData?: any;
  studentExplanation?: string;
  hasGeminiKey: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  note?: string;
}

export const SocraticChatModal: React.FC<SocraticChatModalProps> = ({
  isOpen,
  onClose,
  topic,
  studentPrediction,
  experimentalData,
  studentExplanation,
  hasGeminiKey,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Chào em! Thầy/cô là "Nhà khoa học nhí" - trợ lý đồng hành cùng em trong phòng thí nghiệm ${
        topic === 'archimedes' ? 'Lực đẩy Archimedes' : topic === 'lever' ? 'Đòn bẩy và Moment lực' : 'Sự phản xạ ánh sáng'
      }.
Thầy/cô sẽ không giải hộ bài toán, mà sẽ cùng em đặt câu hỏi gợi mở để tìm ra quy luật tự nhiên từ số liệu thực nghiệm. Em đang gặp băn khoăn gì nào?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts: Record<LabTopic, string[]> = {
    archimedes: [
      'Tại sao khi nhúng vào nước số chỉ lực kế lại giảm đi?',
      'Một con tàu bằng thép nặng hàng vạn tấn tại sao vẫn nổi trên biển?',
      'Kiểm tra giúp em xem số liệu P1, P2 và V này có hợp lí chưa?',
      'Nếu em nhúng vật vào cốc dầu ăn thay vì cốc nước thì lực kế sẽ chỉ bao nhiêu?'
    ],
    lever: [
      'Vì sao một lực nhỏ hơn vẫn có thể nâng bổng một vật nặng hơn?',
      'Khi nào thì đòn bẩy đạt trạng thái thăng bằng nằm ngang?',
      'Cánh tay đòn d1 và d2 có ý nghĩa gì đối với tác dụng làm quay?',
      'Tại sao tay nắm cửa lại luôn được gắn ở mép xa bản lề?'
    ],
    reflection: [
      'Tại sao phải đo góc so với pháp tuyến chứ không đo so với mặt gương?',
      'Khi góc tới i = 45° thì tia phản xạ sẽ đi theo hướng nào?',
      'Số đo của em bị lệch 3° thì có thể do những nguyên nhân nào?',
      'Tại sao mắt mèo phản quang lại sáng rực khi đèn xe rọi vào?'
    ]
  };

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: textToSend }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          studentPrediction,
          experimentalData,
          studentExplanation,
          promptMessage: textToSend,
        }),
      });

      const result = await response.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: result.text || 'Thầy/cô đã ghi nhận. Em hãy quan sát tiếp dữ liệu thực nghiệm nhé!',
          source: result.source,
          note: result.note,
        }
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Thầy/cô gặp chút gián đoạn kết nối. Em hãy kiểm tra xem số liệu đo đạc đã đầy đủ đơn vị N, mL hay cm chưa nhé!',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10213B] to-[#2563EB] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Trợ lý Sư phạm "Nhà khoa học nhí"</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Phương pháp gợi mở
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Gợi mở tư duy – Phát hiện ngộ nhận – Không giải hộ bài tập
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System transparency banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-[11px] text-slate-600 flex items-center justify-between">
          <span>
            Trạng thái AI: <strong className="text-slate-800">{hasGeminiKey ? 'Gemini 3.8 Flash' : 'Hệ chuyên gia Socratic THCS'}</strong>
          </span>
          <span className="text-blue-600 font-medium">Chủ đề: {topic.toUpperCase()}</span>
        </div>

        {/* Chat message body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                {msg.note && (
                  <p className="text-[11px] text-slate-400 mt-2 italic border-t border-slate-100 pt-1">
                    {msg.note}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic py-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Nhà khoa học nhí đang suy ngẫm câu hỏi gợi mở...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="p-3 bg-white border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Gợi ý câu hỏi thường gặp:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts[topic]?.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-full px-2.5 py-1 text-left transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nhập câu hỏi hoặc chia sẻ suy nghĩ của em với trợ lý..."
            className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <span>Gửi</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
