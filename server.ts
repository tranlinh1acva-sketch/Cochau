import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Helper to check Gemini key
const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

let aiClient: GoogleGenAI | null = null;
if (hasGeminiKey) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check & configuration status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    hasGeminiKey,
    firebaseConfigured: false, // Transparent status as required
    serverTime: new Date().toISOString(),
    version: '1.0.0',
    appTitle: 'VẬT LÍ THỰC CHỨNG AI',
    author: 'Đỗ Thị Giáng Châu - THCS Chu Văn An, Đồng Nai'
  });
});

// 2. Socratic Tutor API ("Nhà khoa học nhí")
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { topic, studentPrediction, experimentalData, studentExplanation, history, promptMessage } = req.body;

    // Pedagogical fallback if no API key or API call fails
    const fallbackGuidance = getPedagogicalFallback(topic, studentPrediction, experimentalData, studentExplanation, promptMessage);

    if (!aiClient) {
      return res.json({
        source: 'pedagogical_engine',
        isAiGenerated: false,
        text: fallbackGuidance,
        note: 'Đang dùng hệ chuyên gia sư phạm Vật lí GDPT 2018 (Chưa có GEMINI_API_KEY trên máy chủ).'
      });
    }

    const systemInstruction = `Bạn là "Nhà khoa học nhí" - Trợ lý AI sư phạm Vật lí THCS theo Chương trình GDPT 2018, đồng hành cùng học sinh THCS Chu Văn An, Đồng Nai.
MỤC TIÊU:
1. KHÔNG giải hộ bài toán, KHÔNG đưa ngay đáp án kết luận cuối cùng.
2. Dùng phương pháp GỢI MỞ BẰNG CÂU HỎI (Socratic method).
3. Luôn bám sát 4 yếu tố trong phản hồi:
   - 1 Nhận xét tích cực về bằng chứng/dữ liệu thực nghiệm mà học sinh đã thu thập.
   - 1 Điểm nghi vấn, ngộ nhận hoặc chi tiết cần kiểm tra lại (đơn vị, dụng cụ, cách đo, điều kiện ngập, độ chia nhỏ nhất).
   - 1 Câu hỏi gợi mở giúp học sinh tự tư duy kết nối công thức với hiện tượng.
   - 1 Bước gợi ý tiếp theo học sinh nên làm.
4. Phát hiện ngộ nhận: Ví dụ học sinh cho rằng "vật nhẹ nổi, vật nặng chìm", hãy hỏi về tàu sắt nổi trên biển và viên bi sắt chìm, gợi ý về lực đẩy Archimedes và trọng lượng.
5. Ngôn ngữ thân thiện, chuẩn mực Vật lí THCS lớp 7-8, xưng "thầy/cô" hoặc "Nhà khoa học nhí" và gọi học sinh là "em".
6. Tuyệt đối không tự bịa số đo khi chưa có căn cứ.`;

    const userPrompt = `Chủ đề thí nghiệm: ${topic}
- Dự đoán ban đầu của học sinh: "${studentPrediction || 'Chưa nhập'}"
- Dữ liệu thực nghiệm học sinh đã đo: ${JSON.stringify(experimentalData || {})}
- Giải thích/Lập luận hiện tại của học sinh: "${studentExplanation || 'Chưa nhập'}"
- Câu hỏi hoặc tin nhắn của học sinh: "${promptMessage || 'Xin thầy/cô gợi ý xem dữ liệu này có ý nghĩa gì?'}"

Hãy đưa ra phản hồi gợi mở sư phạm chuẩn mực theo đúng 4 yếu tố yêu cầu.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      source: 'gemini_3.8_flash',
      isAiGenerated: true,
      text: response.text || fallbackGuidance,
    });
  } catch (error: any) {
    console.error('Tutor error:', error);
    const fallbackGuidance = getPedagogicalFallback(
      req.body?.topic,
      req.body?.studentPrediction,
      req.body?.experimentalData,
      req.body?.studentExplanation,
      req.body?.promptMessage
    );
    res.json({
      source: 'pedagogical_engine',
      isAiGenerated: false,
      text: fallbackGuidance,
      errorDetail: error?.message,
      note: 'Hệ thống tự động chuyển sang phản hồi sư phạm chuẩn mực do sự cố mạng AI.'
    });
  }
});

// 3. CER Evaluation API
app.post('/api/gemini/cer-evaluate', async (req: Request, res: Response) => {
  try {
    const { topic, claim, evidence, reasoning, experimentalData } = req.body;

    const fallbackEval = evaluateCerFallback(topic, claim, evidence, reasoning, experimentalData);

    if (!aiClient) {
      return res.json({
        ...fallbackEval,
        isAiGenerated: false,
        disclaimer: 'Đánh giá sơ bộ theo Rubric chuẩn GDPT 2018 (Giáo viên có thể điều chỉnh và phê duyệt).'
      });
    }

    const prompt = `Bạn là chuyên gia khảo thí và đánh giá năng lực Vật lí THCS (GDPT 2018).
Đánh giá lập luận CER của học sinh về chủ đề: "${topic}".
Dữ liệu thực nghiệm thực tế đã đo: ${JSON.stringify(experimentalData || {})}
Bài làm của học sinh:
- C (Claim - Tuyên bố/Kết luận): "${claim || ''}"
- E (Evidence - Bằng chứng số liệu/quan sát): "${evidence || ''}"
- R (Reasoning - Lập luận khoa học): "${reasoning || ''}"

RUBRIC CHẤM ĐIỂM (Thang 6 điểm):
1. Claim (0-2 điểm):
   - 2 điểm: Kết luận chính xác, trả lời trực tiếp câu hỏi nghiên cứu, đúng bản chất Vật lí.
   - 1 điểm: Kết luận đúng một phần hoặc còn mơ hồ.
   - 0 điểm: Kết luận sai hoặc không liên quan.
2. Evidence (0-2 điểm):
   - 2 điểm: Nêu rõ số liệu cụ thể kèm đơn vị đo (N, mL, cm, độ...), đối chiếu được giữa các lần đo hoặc so sánh giá trị tính toán.
   - 1 điểm: Có số liệu nhưng thiếu đơn vị hoặc chưa đầy đủ bằng chứng then chốt.
   - 0 điểm: Không có số liệu thực nghiệm, chỉ nói chung chung.
3. Reasoning (0-2 điểm):
   - 2 điểm: Vận dụng đúng định luật/công thức Vật lí để giải thích tại sao bằng chứng đó dẫn đến kết luận.
   - 1 điểm: Có nêu công thức/định luật nhưng giải thích còn lủng củng, liên kết chưa chặt chẽ.
   - 0 điểm: Nhắc lại bằng chứng mà không có lập luận khoa học, hoặc áp dụng sai định luật.

Yêu cầu trả về định dạng JSON thuần túy (không bọc markdown block thừa):
{
  "claimScore": number (0-2),
  "evidenceScore": number (0-2),
  "reasoningScore": number (0-2),
  "totalScore": number (0-6),
  "claimFeedback": "nhận xét ngắn gọn và gợi ý sửa cho C",
  "evidenceFeedback": "nhận xét ngắn gọn và gợi ý sửa cho E",
  "reasoningFeedback": "nhận xét ngắn gọn và gợi ý sửa cho R",
  "overallAssessment": "nhận xét tổng quan mang tính khích lệ và chỉ rõ hướng cải thiện",
  "pedagogicalQuestion": "1 câu hỏi kích thích tư duy phản biện để học sinh tự nâng cao bài làm"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      isAiGenerated: true,
      disclaimer: 'Đánh giá gợi ý của AI dựa trên Rubric CER. Điểm số chính thức do giáo viên phê duyệt.'
    });
  } catch (err: any) {
    console.error('CER eval error:', err);
    const fallbackEval = evaluateCerFallback(
      req.body?.topic,
      req.body?.claim,
      req.body?.evidence,
      req.body?.reasoning,
      req.body?.experimentalData
    );
    res.json({
      ...fallbackEval,
      isAiGenerated: false,
      disclaimer: 'Đánh giá sư phạm chuẩn hóa (Dự phòng khi AI đang tải).'
    });
  }
});

// 4. Lab Photo Analysis API (Safe, objective, no facial recognition, no guessing blurry scales)
app.post('/api/gemini/analyze-photo', async (req: Request, res: Response) => {
  try {
    const { topic, imageBase64, mimeType, userConsent } = req.body;

    if (!userConsent) {
      return res.status(400).json({
        error: 'Người dùng chưa đồng ý gửi ảnh cho trợ lý phân tích.'
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Không nhận được dữ liệu ảnh.' });
    }

    if (!aiClient) {
      return res.json({
        isAiGenerated: false,
        status: 'manual_verification_required',
        message: 'Hệ thống chưa kết nối khóa Gemini API máy chủ. Vui lòng quan sát dụng cụ trực tiếp và nhập số đo bằng tay vào bảng dữ liệu.',
        safetyReminders: [
          'Đảm bảo lực kế được chỉnh về vạch số 0 trước khi đo.',
          'Vật phải ngập hoàn toàn trong lòng chất lỏng, không chạm vào đáy hoặc thành bình.',
          'Mắt nhìn ngang bằng với vạch chia độ của bình chia độ/lực kế.'
        ]
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `Bạn là trợ lý phân tích ảnh bố trí thí nghiệm Vật lí THCS.
Chủ đề: "${topic}".
QUY TẮC AN TOÀN VÀ KHOA HỌC:
1. KHÔNG nhận diện danh tính hoặc khuôn mặt học sinh.
2. Nếu ảnh bị mờ, góc chụp lệch, hoặc không nhìn thấy thước chuẩn/vạch chia rõ ràng: PHẢI THÔNG BÁO "Không đủ dữ liệu hoặc thang đo không đọc rõ". TUYỆT ĐỐI KHÔNG TỰ ĐOÁN MỘT CON SỐ CHÍNH XÁC.
3. Yêu cầu học sinh tự đọc số đo bằng mắt thực tế và nhập vào bảng số liệu.
4. Phân tích cách bố trí thí nghiệm:
   - Có an toàn không?
   - Dụng cụ có đặt thẳng đứng/cân bằng không?
   - Với thí nghiệm Archimedes: vật có bị chạm đáy hay thành bình không?
   - Với đòn bẩy: điểm tựa có vững chắc không?
   - Với quang học: nguồn sáng có chiếu vào mắt người không?
5. Trả về kết quả JSON:
{
  "isClear": boolean,
  "setupQuality": "Tốt" | "Cần điều chỉnh" | "Ảnh mờ/Không rõ",
  "observations": ["quan sát 1", "quan sát 2"],
  "potentialErrors": ["nguy cơ sai số 1", "nguy cơ sai số 2"],
  "studentActionNotice": "lời nhắn cho học sinh về việc đọc số đo"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error('Photo analysis error:', error);
    res.json({
      isAiGenerated: false,
      status: 'error',
      setupQuality: 'Cần kiểm tra thủ công',
      observations: ['Không thể phân tích tự động bức ảnh qua mạng.'],
      potentialErrors: ['Ảnh có thể quá mờ hoặc góc chụp chưa bao quát dụng cụ.'],
      studentActionNotice: 'Em hãy quan sát trực tiếp bằng mắt ở khoảng cách an toàn, đặt mắt ngang vạch đo và nhập số liệu vào hệ thống.'
    });
  }
});

// Socratic fallback engine
function getPedagogicalFallback(
  topic: string,
  prediction?: string,
  data?: any,
  explanation?: string,
  msg?: string
): string {
  const t = topic?.toLowerCase() || '';

  if (t.includes('archimedes') || t.includes('lực đẩy')) {
    const P1 = data?.P1 ? Number(data.P1) : null;
    const P2 = data?.P2 ? Number(data.P2) : null;
    const V = data?.V ? Number(data.V) : null;

    if (P1 !== null && P2 !== null) {
      const FA = +(P1 - P2).toFixed(2);
      if (P2 > P1) {
        return `Chào em! Thầy/cô nhận thấy số chỉ lực kế khi nhúng vào nước (${P2} N) lại lớn hơn khi ở ngoài không khí (${P1} N).
- Trong thực tế, chất lỏng tác dụng lực đẩy hướng lên trên hay hướng xuống dưới?
- Em hãy kiểm tra xem vật có bị dính vào đáy bình hay có lực nào khác kéo xuống không nhé.
- Hãy chỉnh lại số 0 của lực kế và đo lại P1, P2 nhé!`;
      }
      return `Chào nhà khoa học nhí!
1. Bằng chứng hiện có: Số chỉ lực kế giảm từ ${P1} N xuống ${P2} N, cho thấy nước đã tác dụng một lực đẩy hướng lên có độ lớn thực nghiệm là FA = ${FA} N.
2. Điểm cần kiểm tra: Khi nhúng vật vào nước, vật đã ngập hoàn toàn chưa? Vật có vô tình chạm vào đáy cốc hoặc thành cốc không?
3. Câu hỏi gợi mở: Nếu thể tích phần nước bị chiếm chỗ là ${V ? V + ' mL' : 'V (mL)'}, em hãy tính lực đẩy lý thuyết F = d * V xem có xấp xỉ ${FA} N không?
4. Bước tiếp theo: Em hãy viết kết luận CER để giải thích mối quan hệ giữa độ giảm trọng lượng của vật và trọng lượng khối nước bị chiếm chỗ nhé!`;
    }

    return `Chào em! Trước khi tiến hành thí nghiệm lực đẩy Archimedes, em hãy dự đoán: Khi nhúng một vật ngập vào nước, số chỉ của lực kế sẽ tăng lên, giảm đi hay giữ nguyên? Vì sao em lại nghĩ như vậy?`;
  }

  if (t.includes('đòn bẩy') || t.includes('lever') || t.includes('moment')) {
    const F1 = data?.F1 ? Number(data.F1) : null;
    const d1 = data?.d1 ? Number(data.d1) : null;
    const F2 = data?.F2 ? Number(data.F2) : null;
    const d2 = data?.d2 ? Number(data.d2) : null;

    if (F1 && d1 && F2 && d2) {
      const M1 = +(F1 * d1).toFixed(1);
      const M2 = +(F2 * d2).toFixed(1);
      const diff = Math.abs(M1 - M2);
      return `Chào nhà nghiên cứu trẻ!
1. Bằng chứng hiện có: Em đang thử nghiệm hai lực: F1 = ${F1} N (tay đòn d1 = ${d1} cm -> M1 = ${M1} N.cm) và F2 = ${F2} N (tay đòn d2 = ${d2} cm -> M2 = ${M2} N.cm). Độ lệch moment hiện là ${diff.toFixed(1)} N.cm.
2. Điểm cần kiểm tra: Thanh đòn bẩy đã nằm thăng bằng nằm ngang chưa? Khi M1 và M2 xấp xỉ bằng nhau thì thanh đòn có trạng thái gì?
3. Câu hỏi gợi mở: Vì sao lực F1 nhỏ hơn F2 (${F1} N < ${F2} N) mà vẫn có thể nâng hoặc cân bằng được F2? Khoảng cách từ trục quay đến giá của lực đóng vai trò gì?
4. Bước tiếp theo: Em hãy vận dụng điều này để giải thích cách dùng bập bênh hoặc xà beng trong đời sống nhé!`;
    }
    return `Chào em! Trong thí nghiệm đòn bẩy, em hãy quan sát vị trí trục quay. Nếu muốn nâng một vật nặng với một lực nhỏ hơn, em sẽ đặt điểm tác dụng lực ở gần hay xa trục quay hơn?`;
  }

  if (t.includes('phản xạ') || t.includes('ánh sáng') || t.includes('reflection')) {
    const i = data?.i !== undefined ? Number(data.i) : null;
    const r = data?.r !== undefined ? Number(data.r) : null;
    if (i !== null && r !== null) {
      const diff = Math.abs(i - r);
      return `Chào em!
1. Bằng chứng hiện có: Góc tới i = ${i}°, góc phản xạ đo được r = ${r}°. Chênh lệch là ${diff}°.
2. Điểm cần lưu ý: Em đã đo góc tới và góc phản xạ so với "Pháp tuyến" (đường thẳng vuông góc với mặt gương tại điểm tới) chưa, hay vô tình đo so với mặt gương?
3. Câu hỏi gợi mở: Định luật phản xạ ánh sáng phát biểu về mối quan hệ giữa góc tới i và góc phản xạ r' như thế nào? Sự sai lệch ${diff}° (nếu có) có thể do thước đo góc hay cách căn chỉnh vệt sáng không?
4. Bước tiếp theo: Em hãy ghi lại kết luận khoa học và hoàn thành bài phân biện CER nhé!`;
    }
    return `Chào em! Khi chiếu một tia sáng đến mặt gương phẳng với góc tới 45° so với pháp tuyến, em dự đoán góc phản xạ sẽ bằng bao nhiêu độ? Tia phản xạ nằm ở nửa mặt phẳng nào?`;
  }

  return `Chào em! Thầy/cô rất vui được đồng hành cùng em khám phá Vật lí thực chứng. Em hãy nêu dự đoán khoa học của mình và ghi lại các số liệu quan sát thực tế để chúng ta cùng phân tích nhé!`;
}

// Fallback CER evaluation logic
function evaluateCerFallback(
  topic: string,
  claim?: string,
  evidence?: string,
  reasoning?: string,
  data?: any
) {
  let cScore = 0;
  let eScore = 0;
  let rScore = 0;

  const c = (claim || '').trim().toLowerCase();
  const e = (evidence || '').trim().toLowerCase();
  const r = (reasoning || '').trim().toLowerCase();

  // Evaluate Claim (C)
  if (c.length > 15) {
    if (c.includes('lực đẩy') || c.includes('archimedes') || c.includes('cân bằng') || c.includes('moment') || c.includes('phản xạ') || c.includes('bằng')) {
      cScore = 2;
    } else {
      cScore = 1;
    }
  } else if (c.length > 5) {
    cScore = 1;
  }

  // Evaluate Evidence (E)
  if (e.length > 15 && (e.includes('n') || e.includes('ml') || e.includes('cm') || e.includes('°') || e.includes('độ') || /\d/.test(e))) {
    eScore = 2;
  } else if (e.length > 5) {
    eScore = 1;
  }

  // Evaluate Reasoning (R)
  if (r.length > 25 && (r.includes('vì') || r.includes('do') || r.includes('công thức') || r.includes('định luật') || r.includes('bằng chứng') || r.includes('chất lỏng') || r.includes('trục quay'))) {
    rScore = 2;
  } else if (r.length > 10) {
    rScore = 1;
  }

  const totalScore = cScore + eScore + rScore;

  return {
    claimScore: cScore,
    evidenceScore: eScore,
    reasoningScore: rScore,
    totalScore,
    claimFeedback: cScore === 2
      ? 'Tuyên bố khoa học rõ ràng, trả lời đúng vấn đề nghiên cứu.'
      : 'Tuyên bố cần cụ thể hơn về hiện tượng và kết quả đo được.',
    evidenceFeedback: eScore === 2
      ? 'Rất tốt! Em đã dẫn chứng được số liệu thực nghiệm cụ thể kèm đơn vị đo.'
      : 'Cần bổ sung các số đo cụ thể từ thí nghiệm (kèm đơn vị N, mL, cm hoặc độ).',
    reasoningFeedback: rScore === 2
      ? 'Lập luận logic, vận dụng đúng quy luật vật lí để kết nối số liệu với kết luận.'
      : 'Em cần dùng kiến thức/công thức Vật lí để giải thích vì sao số liệu lại dẫn đến kết luận đó.',
    overallAssessment: `Bài làm đạt ${totalScore}/6 điểm. Em thể hiện tư duy thực nghiệm tốt. Hãy tiếp tục hoàn thiện các luận điểm khoa học.`,
    pedagogicalQuestion: 'Theo em, nếu thay đổi điều kiện thí nghiệm (ví dụ chất lỏng khác hoặc cánh tay đòn khác), kết luận này còn đúng không?'
  };
}

// Attach Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vật Lí Thực Chứng AI] Server running at http://localhost:${PORT}`);
  });
}

startServer();
