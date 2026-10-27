import { Question } from '../types/physics';

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // CHỦ ĐỀ 1: LỰC ĐẨY ARCHIMEDES (KHTN LỚP 8) - 10 CÂU
  // ==========================================
  {
    id: 'arch-01',
    grade: 8,
    topic: 'archimedes',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Lực đẩy Archimedes tác dụng lên một vật nhúng trong chất lỏng có phương và chiều như thế nào?',
    options: [
      'Phương thẳng đứng, chiều từ dưới lên trên',
      'Phương thẳng đứng, chiều từ trên xuống dưới',
      'Phương nằm ngang, chiều từ trái sang phải',
      'Phương bất kì tùy thuộc vào hình dạng của vật'
    ],
    correctIndex: 0,
    explanation: 'Theo định luật Archimedes, một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên.',
    relatedConcept: 'Phương và chiều của lực đẩy Archimedes'
  },
  {
    id: 'arch-02',
    grade: 8,
    topic: 'archimedes',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Độ lớn của lực đẩy Archimedes được tính bằng công thức nào dưới đây?',
    options: [
      'FA = d × V (trong đó d là trọng lượng riêng chất lỏng, V là thể tích phần chất lỏng bị chiếm chỗ)',
      'FA = m × V (trong đó m là khối lượng của vật, V là thể tích vật)',
      'FA = P1 + P2 (trong đó P1, P2 là số chỉ lực kế)',
      'FA = d × h (trong đó d là trọng lượng riêng, h là độ sâu)'
    ],
    correctIndex: 0,
    explanation: 'Công thức tính lực đẩy Archimedes: FA = d × V = ρ × g × V, trong đó d là trọng lượng riêng của chất lỏng và V là thể tích phần chất lỏng bị vật chiếm chỗ.',
    relatedConcept: 'Công thức định lượng lực đẩy Archimedes'
  },
  {
    id: 'arch-03',
    grade: 8,
    topic: 'archimedes',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Móc một vật nặng vào lực kế ngoài không khí, lực kế chỉ P1 = 2,0 N. Nhúng chìm hoàn toàn vật vào trong cốc nước, lực kế chỉ P2 = 1,6 N. Lực đẩy của nước tác dụng lên vật là:',
    options: [
      '0,4 N',
      '3,6 N',
      '1,6 N',
      '0,8 N'
    ],
    correctIndex: 0,
    explanation: 'Lực đẩy Archimedes thực nghiệm được xác định bằng độ giảm số chỉ lực kế: FA = P1 - P2 = 2,0 - 1,6 = 0,4 N.',
    relatedConcept: 'Xác định lực đẩy bằng lực kế'
  },
  {
    id: 'arch-04',
    grade: 8,
    topic: 'archimedes',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Hai vật A và B có thể tích bằng nhau (VA = VB). Nhúng chìm hoàn toàn A vào nước và B vào dầu hỏa (biết d_nước > d_dầu). Lực đẩy Archimedes tác dụng lên vật nào lớn hơn?',
    options: [
      'Vật A chịu lực đẩy lớn hơn vì trọng lượng riêng của nước lớn hơn dầu hỏa',
      'Vật B chịu lực đẩy lớn hơn vì dầu hỏa nhẹ hơn',
      'Hai vật chịu lực đẩy bằng nhau vì thể tích bằng nhau',
      'Không so sánh được vì chưa biết khối lượng của hai vật'
    ],
    correctIndex: 0,
    explanation: 'Vì FA = d × V, cả hai vật đều chìm hoàn toàn nên V chiếm chỗ bằng nhau. Do d_nước > d_dầu nên lực đẩy của nước lên vật A lớn hơn lực đẩy của dầu lên vật B.',
    relatedConcept: 'Các yếu tố ảnh hưởng đến độ lớn lực đẩy Archimedes'
  },
  {
    id: 'arch-05',
    grade: 8,
    topic: 'archimedes',
    level: 'Vận dụng',
    type: 'multiple_choice',
    question: 'Một thỏi nhôm có thể tích V = 50 mL được nhúng chìm hoàn toàn trong nước (trọng lượng riêng của nước d = 10000 N/m³). Lực đẩy Archimedes tác dụng lên thỏi nhôm là:',
    options: [
      '0,5 N',
      '5 N',
      '500 N',
      '0,05 N'
    ],
    correctIndex: 0,
    explanation: 'Đổi đơn vị: V = 50 mL = 50 × 10^-6 m³ = 0,00005 m³. Lực đẩy Archimedes: FA = d × V = 10000 × 0,00005 = 0,5 N.',
    relatedConcept: 'Vận dụng tính toán kèm đổi đơn vị SI'
  },
  {
    id: 'arch-06',
    grade: 8,
    topic: 'archimedes',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Khi thả một vật vào nước, nếu lực đẩy Archimedes nhỏ hơn trọng lượng của vật (FA < P) thì hiện tượng gì sẽ xảy ra?',
    options: [
      'Vật sẽ chìm xuống đáy',
      'Vật sẽ nổi lên mặt nước',
      'Vật sẽ lơ lửng trong nước',
      'Vật sẽ biến dạng và vỡ ra'
    ],
    correctIndex: 0,
    explanation: 'Hợp lực tác dụng lên vật theo phương thẳng đứng hướng xuống dưới (P > FA), làm vật chuyển động chìm xuống đáy bình.',
    relatedConcept: 'Điều kiện chìm, nổi và lơ lửng của vật'
  },
  {
    id: 'arch-07',
    grade: 8,
    topic: 'archimedes',
    level: 'Vận dụng',
    type: 'multiple_choice',
    question: 'Khi một quả cầu bằng gỗ nổi yên trên mặt nước, khẳng định nào sau đây là ĐÚNG?',
    options: [
      'Độ lớn lực đẩy Archimedes bằng đúng trọng lượng P của quả cầu gỗ',
      'Độ lớn lực đẩy Archimedes lớn hơn trọng lượng P của quả cầu gỗ',
      'Lực đẩy Archimedes bằng 0 vì vật không chìm hoàn toàn',
      'Thể tích nước bị chiếm chỗ bằng đúng toàn bộ thể tích quả cầu'
    ],
    correctIndex: 0,
    explanation: 'Khi vật nổi cân bằng trên mặt nước, hai lực tác dụng lên vật (trọng lực và lực đẩy Archimedes) là hai lực cân bằng: FA = P.',
    relatedConcept: 'Trạng thái cân bằng khi vật nổi'
  },
  {
    id: 'arch-08',
    grade: 8,
    topic: 'archimedes',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Trong thí nghiệm đo lực đẩy Archimedes, khi nhúng vật vào cốc nước, tại sao ta cần lưu ý không để vật chạm vào đáy hoặc chạm thành cốc?',
    options: [
      'Vì khi chạm đáy hoặc thành cốc, sẽ có thêm lực đỡ cơ học làm số chỉ lực kế bị sai lệch',
      'Vì lực đẩy Archimedes sẽ biến mất khi chạm thành cốc',
      'Vì thể tích chất lỏng dâng lên sẽ giảm đi',
      'Vì cốc nước sẽ bị nứt vỡ ngay lập tức'
    ],
    correctIndex: 0,
    explanation: 'Nếu vật chạm đáy, đáy cốc sẽ tác dụng một phản lực nâng phụ, khiến số chỉ lực kế P2 nhỏ hơn thực tế, dẫn đến tính sai FA.',
    relatedConcept: 'Kỹ năng thực hành và kiểm soát sai số thí nghiệm'
  },
  {
    id: 'arch-09',
    grade: 8,
    topic: 'archimedes',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Một chiếc đinh sắt bị chìm khi thả vào nước, nhưng một con tàu bằng thép nặng hàng vạn tấn lại nổi được trên biển. Dựa vào công thức lực đẩy Archimedes và cấu tạo con tàu, em hãy giải thích hiện tượng này.',
    sampleAnswer: 'Con tàu thép có kích thước khổng lồ và bên trong có rất nhiều khoang rỗng chứa không khí. Nhờ đó, thể tích chất lỏng bị con tàu chiếm chỗ (V) rất lớn, tạo ra lực đẩy Archimedes FA = d × V khổng lồ đủ để cân bằng với trọng lượng P của toàn bộ con tàu. Ngược lại, chiếc đinh sắt đặc có thể tích nhỏ nên FA < P, khiến đinh chìm.',
    explanation: 'Bản chất sự nổi phụ thuộc vào khối lượng riêng trung bình của toàn bộ vật thể so với chất lỏng (nhờ các khoang rỗng) chứ không phải khối lượng nặng hay nhẹ.',
    relatedConcept: 'Ứng dụng thực tiễn của sự nổi trong chế tạo tàu thuyền'
  },
  {
    id: 'arch-10',
    grade: 8,
    topic: 'archimedes',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Một học sinh khi làm thí nghiệm đo lực đẩy Archimedes thu được kết quả: FA_thực_nghiệm = 0,42 N, trong khi FA_lý_thuyết = 0,40 N. Em hãy nêu ít nhất 2 nguyên nhân dẫn đến sự chênh lệch này trong điều kiện phòng học thông thường.',
    sampleAnswer: '1) Sai số đọc dụng cụ: vạch chia lực kế có độ chia nhỏ nhất (ĐCNN) là 0,1 N hoặc bình chia độ đọc lệch vạch mặt khum; 2) Vật chưa nhúng chìm hoàn toàn hoặc có bọt khí bám vào bề mặt vật; 3) Khối lượng riêng của nước thực tế khác 1000 kg/m³ do nhiệt độ hoặc tạp chất.',
    explanation: 'Khoa học thực nghiệm luôn có sai số do dụng cụ, kỹ thuật thao tác của người đo và điều kiện môi trường.',
    relatedConcept: 'Phân tích sai số thực nghiệm và tư duy phê phán'
  },

  // ==========================================
  // CHỦ ĐỀ 2: ĐÒN BẨY VÀ MOMENT LỰC (KHTN LỚP 8) - 10 CÂU
  // ==========================================
  {
    id: 'lever-01',
    grade: 8,
    topic: 'lever',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Moment lực đối với một trục quay là đại lượng đặc trưng cho tác dụng nào của lực?',
    options: [
      'Tác dụng làm quay của lực',
      'Tác dụng làm biến dạng vật',
      'Tác dụng làm vật chuyển động thẳng nhanh dần',
      'Tác dụng ép nén vật'
    ],
    correctIndex: 0,
    explanation: 'Moment lực đối với một trục quay là đại lượng đặc trưng cho tác dụng làm quay của lực quanh trục đó.',
    relatedConcept: 'Khái niệm Moment lực'
  },
  {
    id: 'lever-02',
    grade: 8,
    topic: 'lever',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Công thức tính moment lực M là gì (với F là lực tác dụng, d là cánh tay đòn)?',
    options: [
      'M = F × d',
      'M = F / d',
      'M = F + d',
      'M = d / F'
    ],
    correctIndex: 0,
    explanation: 'Độ lớn của moment lực được tính bằng tích của độ lớn lực tác dụng với cánh tay đòn: M = F × d. Đơn vị thường dùng là N.m hoặc N.cm.',
    relatedConcept: 'Công thức tính Moment lực'
  },
  {
    id: 'lever-03',
    grade: 8,
    topic: 'lever',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Quy tắc moment lực phát biểu rằng: Một vật có trục quay cố định sẽ ở trạng thái cân bằng khi nào?',
    options: [
      'Tổng các moment lực có xu hướng làm vật quay theo chiều kim đồng hồ bằng tổng các moment lực có xu hướng làm vật quay ngược chiều kim đồng hồ',
      'Độ lớn của hai lực tác dụng vào vật bằng nhau bất kể khoảng cách',
      'Cánh tay đòn của hai lực bằng nhau bất kể lực lớn hay nhỏ',
      'Tổng độ lớn hai lực bằng trọng lượng của vật'
    ],
    correctIndex: 0,
    explanation: 'Quy tắc moment lực (điều kiện cân bằng): Tổng các moment lực làm quay theo chiều kim đồng hồ bằng tổng các moment lực làm quay ngược chiều kim đồng hồ.',
    relatedConcept: 'Quy tắc cân bằng moment'
  },
  {
    id: 'lever-04',
    grade: 8,
    topic: 'lever',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Cánh tay đòn (d) của lực đối với trục quay được định nghĩa chính xác là gì?',
    options: [
      'Khoảng cách vuông góc từ trục quay đến giá của lực',
      'Khoảng cách từ trục quay đến điểm đặt của lực trên thanh',
      'Chiều dài toàn bộ của thanh đòn bẩy',
      'Khoảng cách giữa hai điểm đặt lực'
    ],
    correctIndex: 0,
    explanation: 'Cánh tay đòn d là khoảng cách vuông góc hạ từ trục quay đến đường thẳng mang vectơ lực (giá của lực).',
    relatedConcept: 'Định nghĩa cánh tay đòn của lực'
  },
  {
    id: 'lever-05',
    grade: 8,
    topic: 'lever',
    level: 'Vận dụng',
    type: 'multiple_choice',
    question: 'Một thanh đòn bẩy nhẹ có trục quay ở chính giữa O. Treo một quả nặng F1 = 4 N ở vị trí cách trục quay d1 = 10 cm. Để thanh cân bằng, cần treo một lực F2 = 2 N ở khoảng cách d2 bằng bao nhiêu?',
    options: [
      '20 cm',
      '5 cm',
      '10 cm',
      '40 cm'
    ],
    correctIndex: 0,
    explanation: 'Áp dụng điều kiện cân bằng moment: M1 = M2 <=> F1 × d1 = F2 × d2 <=> 4 × 10 = 2 × d2 => d2 = 40 / 2 = 20 cm.',
    relatedConcept: 'Tính toán cân bằng đòn bẩy'
  },
  {
    id: 'lever-06',
    grade: 8,
    topic: 'lever',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Dụng cụ nào sau đây là ví dụ về đòn bẩy cho ta "lợi về lực" (lực tác dụng nhỏ hơn trọng lượng vật)?',
    options: [
      'Chiếc xà beng dùng để bẩy tảng đá nặng',
      'Chiếc kẹp gắp đá trong tủ lạnh',
      'Cần câu cá khi đang giật cần',
      'Đôi đũa ăn cơm'
    ],
    correctIndex: 0,
    explanation: 'Xà beng có cánh tay đòn từ tay đến trục quay lớn hơn nhiều khoảng cách từ trục quay đến hòn đá, nên giúp ta tác dụng một lực nhỏ mà vẫn tạo ra moment lớn để nâng đá.',
    relatedConcept: 'Phân loại đòn bẩy và lợi thế cơ học'
  },
  {
    id: 'lever-07',
    grade: 8,
    topic: 'lever',
    level: 'Vận dụng',
    type: 'multiple_choice',
    question: 'Một người dùng cờ-lê có chiều dài 25 cm để vặn ốc với một lực F = 40 N vuông góc với thân cờ-lê. Moment lực tác dụng lên đai ốc là bao nhiêu?',
    options: [
      '10 N.m',
      '1000 N.m',
      '1,6 N.m',
      '160 N.m'
    ],
    correctIndex: 0,
    explanation: 'Đổi cánh tay đòn: d = 25 cm = 0,25 m. Moment lực: M = F × d = 40 × 0,25 = 10 N.m.',
    relatedConcept: 'Tính moment cờ-lê trong đời sống'
  },
  {
    id: 'lever-08',
    grade: 8,
    topic: 'lever',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Khi mở một cánh cửa phòng, tại sao tay nắm cửa luôn được bố trí ở mép ngoài xa bản lề nhất?',
    options: [
      'Để tăng cánh tay đòn d, từ đó chỉ cần lực đẩy F nhỏ vẫn tạo đủ moment quay mở cửa',
      'Để giảm lực ma sát của bản lề',
      'Để cửa trông cân đối và đẹp mắt hơn',
      'Để giảm chiều dài của cánh cửa'
    ],
    correctIndex: 0,
    explanation: 'Bản lề là trục quay. Đặt tay nắm ở xa bản lề làm tăng cánh tay đòn d, do đó chỉ cần lực nhỏ F ta vẫn tạo được moment M = F × d đủ lớn để quay cánh cửa.',
    relatedConcept: 'Ứng dụng quy tắc moment trong thiết kế đồ vật'
  },
  {
    id: 'lever-09',
    grade: 8,
    topic: 'lever',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Một bạn học sinh khẳng định: "Dùng đòn bẩy giúp ta được lợi cả về lực và lợi cả về đường đi". Khẳng định này có đúng theo định luật bảo toàn công cơ học không? Em hãy dùng bằng chứng khoa học để phản biện.',
    sampleAnswer: 'Khẳng định của bạn là SAI. Theo định luật bảo toàn công: "Không một máy cơ đơn giản nào cho ta lợi về công. Được lợi bao nhiêu lần về lực thì thiệt bấy nhiêu lần về đường đi và ngược lại". Khi dùng đòn bẩy có d1 > d2 để giảm lực F1 < F2, thì quãng đường tay di chuyển s1 phải lớn hơn quãng đường vật nâng s2 theo đúng tỉ lệ.',
    explanation: 'Đòn bẩy chỉ biến đổi độ lớn lực và hướng tác dụng, không thể sinh ra công cơ học dư thừa.',
    relatedConcept: 'Định luật bảo toàn công và nguyên lý máy cơ'
  },
  {
    id: 'lever-10',
    grade: 8,
    topic: 'lever',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Một người bố nặng 60 kg và đứa con nhỏ nặng 20 kg muốn chơi trò bập bênh (thanh dài 3 m, trục quay ở giữa). Bố và con phải ngồi ở vị trí nào cách trục quay để bập bênh có thể thăng bằng?',
    sampleAnswer: 'Trọng lượng bố P1 = 600 N, con P2 = 200 N (P1 = 3 × P2). Để bập bênh thăng bằng nằm ngang: P1 × d1 = P2 × d2 <=> 600 × d1 = 200 × d2 <=> d2 = 3 × d1. Do thanh dài 3 m, mỗi bên dài tối đa 1,5 m. Người con ngồi ở mép ngoài cùng (d2 = 1,5 m), thì người bố phải ngồi cách trục quay d1 = 1,5 / 3 = 0,5 m.',
    explanation: 'Vận dụng điều kiện cân bằng moment lực vào hệ thực tế có tỉ lệ trọng lượng 3:1.',
    relatedConcept: 'Giải quyết vấn đề thực tế bằng mô hình moment lực'
  },

  // ==========================================
  // CHỦ ĐỀ 3: SỰ PHẢN XẠ ÁNH SÁNG (KHTN LỚP 7) - 10 CÂU
  // ==========================================
  {
    id: 'refl-01',
    grade: 7,
    topic: 'reflection',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Theo Định luật phản xạ ánh sáng, góc phản xạ r có mối quan hệ như thế nào với góc tới i?',
    options: [
      'Góc phản xạ bằng góc tới (r = i)',
      'Góc phản xạ luôn lớn hơn góc tới (r > i)',
      'Góc phản xạ luôn nhỏ hơn góc tới (r < i)',
      'Tổng góc phản xạ và góc tới luôn bằng 90°'
    ],
    correctIndex: 0,
    explanation: 'Nội dung Định luật phản xạ ánh sáng: Tia phản xạ nằm trong mặt phẳng tới và ở bên kia pháp tuyến so với tia tới; góc phản xạ bằng góc tới (r = i).',
    relatedConcept: 'Nội dung Định luật phản xạ ánh sáng'
  },
  {
    id: 'refl-02',
    grade: 7,
    topic: 'reflection',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Trong hiện tượng phản xạ ánh sáng trên gương phẳng, "Pháp tuyến" tại điểm tới là đường thẳng như thế nào?',
    options: [
      'Đường thẳng vuông góc với mặt gương tại điểm tới',
      'Đường thẳng song song với mặt gương',
      'Đường thẳng tạo với mặt gương góc 45°',
      'Đường nối giữa mắt người quan sát và ngọn đèn'
    ],
    correctIndex: 0,
    explanation: 'Pháp tuyến (ký hiệu NN\') là đường thẳng vuông góc với bề mặt gương tại điểm tới I.',
    relatedConcept: 'Khái niệm Pháp tuyến và Điểm tới'
  },
  {
    id: 'refl-03',
    grade: 7,
    topic: 'reflection',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Chiếu một tia sáng tới gương phẳng với góc tới i = 40° (đo so với pháp tuyến). Góc phản xạ r có giá trị là bao nhiêu?',
    options: [
      '40°',
      '50°',
      '80°',
      '20°'
    ],
    correctIndex: 0,
    explanation: 'Theo định luật phản xạ ánh sáng: r = i, do đó góc phản xạ r = 40°.',
    relatedConcept: 'Xác định góc phản xạ từ góc tới'
  },
  {
    id: 'refl-04',
    grade: 7,
    topic: 'reflection',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Chiếu một tia sáng SI tới mặt gương phẳng sao cho tia sáng hợp với mặt phẳng gương một góc 30°. Hỏi góc tới i bằng bao nhiêu độ?',
    options: [
      '60° (vì góc tới được đo so với pháp tuyến: 90° - 30° = 60°)',
      '30° (bằng góc hợp với mặt gương)',
      '150° (bằng 180° - 30°)',
      '90° (luôn bằng 90°)'
    ],
    correctIndex: 0,
    explanation: 'LỖI THƯỜNG GẶP: Góc tới i là góc giữa tia tới và PHÁP TUYẾN. Vì pháp tuyến vuông góc với mặt gương (90°) nên i = 90° - 30° = 60°.',
    relatedConcept: 'Phân biệt góc đo với mặt gương và góc đo với pháp tuyến'
  },
  {
    id: 'refl-05',
    grade: 7,
    topic: 'reflection',
    level: 'Vận dụng',
    type: 'multiple_choice',
    question: 'Chiếu tia sáng SI tới gương phẳng với góc tới i = 35°. Góc hợp bởi tia tới và tia phản xạ là bao nhiêu?',
    options: [
      '70° (vì bằng i + r = 35° + 35°)',
      '35°',
      '110°',
      '55°'
    ],
    correctIndex: 0,
    explanation: 'Tia tới và tia phản xạ nằm ở hai phía của pháp tuyến. Góc hợp bởi tia tới và tia phản xạ là: i + r = 35° + 35° = 70°.',
    relatedConcept: 'Góc tạo bởi tia tới và tia phản xạ'
  },
  {
    id: 'refl-06',
    grade: 7,
    topic: 'reflection',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Khi chiếu tia sáng vuông góc với bề mặt gương phẳng (tia tới trùng với pháp tuyến), tia phản xạ sẽ như thế nào?',
    options: [
      'Bật ngược trở lại theo đúng phương của tia tới (góc tới i = 0°, r = 0°)',
      'Lệch sang một góc 90°',
      'Đi xuyên thẳng qua mặt gương',
      'Bị mặt gương hấp thụ hoàn toàn không phản xạ'
    ],
    correctIndex: 0,
    explanation: 'Khi tia tới vuông góc mặt gương thì góc tới i = 0°, do đó góc phản xạ r = 0°, tia phản xạ trùng với tia tới và truyền ngược lại.',
    relatedConcept: 'Trường hợp tia sáng chiếu vuông góc mặt gương'
  },
  {
    id: 'refl-07',
    grade: 7,
    topic: 'reflection',
    level: 'Nhận biết',
    type: 'multiple_choice',
    question: 'Ảnh của một vật tạo bởi gương phẳng có tính chất nào dưới đây?',
    options: [
      'Là ảnh ảo, không hứng được trên màn chắn, có độ lớn bằng vật',
      'Là ảnh thật, hứng được trên màn chắn, lớn hơn vật',
      'Là ảnh ảo, nhỏ hơn vật',
      'Là ảnh thật, ngược chiều với vật'
    ],
    correctIndex: 0,
    explanation: 'Ảnh tạo bởi gương phẳng là ảnh ảo, không hứng được trên màn chắn, cùng chiều và có độ lớn bằng đúng vật.',
    relatedConcept: 'Tính chất ảnh tạo bởi gương phẳng'
  },
  {
    id: 'refl-08',
    grade: 7,
    topic: 'reflection',
    level: 'Thông hiểu',
    type: 'multiple_choice',
    question: 'Trong giờ thực hành Quang học với đèn chiếu laser hoặc nguồn sáng hẹp, quy tắc an toàn quan trọng nhất là gì?',
    options: [
      'Tuyệt đối không nhìn trực tiếp vào chùm laser hoặc chiếu vào mắt người khác',
      'Phải đeo găng tay cách điện bằng cao su dày',
      'Không được chạm tay vào mặt kính bảo vệ thước đo',
      'Thí nghiệm chỉ được làm trong phòng kín không có thông gió'
    ],
    correctIndex: 0,
    explanation: 'Tia laser có mật độ năng lượng cao tập trung vào một điểm hẹp, nếu chiếu vào mắt có thể làm tổn thương vĩnh viễn võng mạc.',
    relatedConcept: 'An toàn phòng thí nghiệm quang học'
  },
  {
    id: 'refl-09',
    grade: 7,
    topic: 'reflection',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Một học sinh đo được góc tới i = 45°, nhưng góc phản xạ r lại đọc được là 42° trên đĩa quang học. Hãy phân tích các nguyên nhân gây ra sai lệch 3° này và đề xuất giải pháp cải tiến thí nghiệm.',
    sampleAnswer: 'Nguyên nhân sai số: 1) Đĩa chia độ chưa được căn chỉnh để tâm trùng khớp với điểm tới I; 2) Bề mặt gương phẳng không vuông góc hoàn hảo với mặt đĩa quang học; 3) Vệt sáng đèn laser có độ dày đáng kể (1-2 mm) khiến việc xác định tâm vệt sáng bị lệch 1-2 vạch chia; 4) Mắt người đọc nhìn nghiêng (sai số thị sai). Giải pháp: Căn chỉnh lại vị trí tâm đĩa, dùng nguồn laser hội tụ nét mảnh, và đặt mắt vuông góc với vạch chia độ.',
    explanation: 'Rèn luyện năng lực thực nghiệm, nhận diện nguyên nhân sai số vật lí và tư duy cải tiến phương pháp đo.',
    relatedConcept: 'Phân tích sai số thực nghiệm quang học'
  },
  {
    id: 'refl-10',
    grade: 7,
    topic: 'reflection',
    level: 'Vận dụng cao',
    type: 'open_ended',
    question: 'Tại sao biển báo giao thông hoặc mắt mèo phản quang trên cọc tiêu đường ban đêm lại sáng rực lên khi đèn pha ô tô rọi vào, dù chúng không hề gắn bóng điện bên trong?',
    sampleAnswer: 'Biển báo phản quang được phủ các hạt vi lăng kính hoặc cấu trúc gương góc vuông 90° (phản xạ toàn phần/phản xạ ngược). Khi ánh sáng từ đèn pha xe rọi vào, ánh sáng phản xạ hai lần trên các mặt vuông góc và bật ngược trở lại gần như song song về phía người lái xe, giúp biển báo sáng rõ mà không cần nguồn điện.',
    explanation: 'Ứng dụng định luật phản xạ ánh sáng nhiều lần trong vật liệu phản quang an toàn giao thông.',
    relatedConcept: 'Ứng dụng định luật phản xạ trong công nghệ an toàn'
  }
];
