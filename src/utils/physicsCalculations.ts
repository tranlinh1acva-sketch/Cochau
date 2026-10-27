import { ArchimedesData, LeverData, ReflectionData } from '../types/physics';

export const LIQUID_DENSITIES: Record<string, { name: string; rho: number }> = {
  water: { name: 'Nước nguyên chất', rho: 1000 },
  saltwater: { name: 'Nước muối đậm đặc', rho: 1030 },
  oil: { name: 'Dầu hỏa/dầu thực vật', rho: 800 },
  alcohol: { name: 'Cồn y tế (Ethanol)', rho: 790 },
};

/**
 * 1. Archimedes calculation engine
 */
export interface ArchimedesResult {
  FA_exp: number; // Thực nghiệm: P1 - P2 (N)
  FA_theo: number; // Lý thuyết: rho * g * V (N)
  diff: number; // |FA_exp - FA_theo| (N)
  percentDiff: number; // %
  isValid: boolean;
  warnings: string[];
  formulaSteps: string[];
}

export function calculateArchimedes(data: ArchimedesData): ArchimedesResult {
  const warnings: string[] = [];
  const formulaSteps: string[] = [];

  // Validation
  if (data.P1 < 0 || data.P2 < 0 || data.V < 0) {
    warnings.push('Số chỉ lực kế hoặc thể tích không được là số âm.');
  }

  if (data.P2 > data.P1) {
    warnings.push('Cảnh báo: P2 > P1! Số chỉ trong nước không thể lớn hơn ngoài không khí khi chưa có lực tác dụng khác. Vui lòng kiểm tra lại vạch số 0 và dụng cụ.');
  }

  if (!data.isSubmerged) {
    warnings.push('Chú ý: Vật chưa chìm ngập hoàn toàn trong chất lỏng. Lực đẩy thực tế chỉ tính cho phần thể tích bị chìm.');
  }

  if (!data.isNotTouchingWalls) {
    warnings.push('Chú ý: Vật chạm vào đáy hoặc thành bình chia độ sẽ làm sai lệch số chỉ của lực kế.');
  }

  const rho = LIQUID_DENSITIES[data.liquid]?.rho || 1000;
  const g = data.g || 10;

  // Thực nghiệm: FA = P1 - P2
  const FA_exp = +(data.P1 - data.P2).toFixed(3);
  formulaSteps.push(`Lực đẩy Archimedes thực nghiệm: FA = P1 - P2 = ${data.P1} - ${data.P2} = ${FA_exp} N`);

  // Đổi V (mL) sang m3: 1 mL = 10^-6 m3
  const V_m3 = data.V * 1e-6;
  const FA_theo = +(rho * g * V_m3).toFixed(3);
  formulaSteps.push(`Quy đổi thể tích: V = ${data.V} mL = ${V_m3} m³`);
  formulaSteps.push(`Lực đẩy Archimedes lý thuyết: F_lt = d × V = ρ × g × V = ${rho} × ${g} × ${V_m3} = ${FA_theo} N (với g = ${g} N/kg, ρ = ${rho} kg/m³)`);

  const diff = +Math.abs(FA_exp - FA_theo).toFixed(3);
  const percentDiff = FA_theo > 0 ? +((diff / FA_theo) * 100).toFixed(1) : 0;

  formulaSteps.push(`Độ chênh lệch: ΔF = |${FA_exp} - ${FA_theo}| = ${diff} N (${percentDiff}%)`);

  const isValid = data.P1 >= data.P2 && data.P1 >= 0 && data.P2 >= 0 && data.V >= 0;

  return {
    FA_exp,
    FA_theo,
    diff,
    percentDiff,
    isValid,
    warnings,
    formulaSteps,
  };
}

/**
 * 2. Lever & Torque calculation engine
 */
export interface LeverResult {
  M1: number; // F1 * d1 (N.cm)
  M2: number; // F2 * d2 (N.cm)
  diff: number; // |M1 - M2|
  isBalanced: boolean;
  tiltAngle: number; // in degrees (-15 to 15) for SVG rendering
  mechanicalAdvantage: number;
  warnings: string[];
  explanation: string;
}

export function calculateLever(data: LeverData): LeverResult {
  const warnings: string[] = [];

  if (data.F1 < 0 || data.F2 < 0 || data.d1 < 0 || data.d2 < 0) {
    warnings.push('Lực và cánh tay đòn phải là các giá trị không âm.');
  }

  const M1 = +(data.F1 * data.d1).toFixed(2);
  const M2 = +(data.F2 * data.d2).toFixed(2);
  const diff = +Math.abs(M1 - M2).toFixed(2);

  // Equilibrium condition: difference <= 0.5 N.cm
  const isBalanced = diff <= 0.5;

  // Visual tilt angle calculation: positive tilts right (M2 > M1), negative tilts left (M1 > M2)
  const netMoment = M2 - M1;
  const tiltAngle = Math.max(-14, Math.min(14, netMoment * 0.4));

  const mechanicalAdvantage = data.F1 > 0 ? +(data.F2 / data.F1).toFixed(2) : 1;

  let explanation = '';
  if (isBalanced) {
    explanation = `Hệ ở trạng thái CÂN BẰNG NẰM NGANG vì Moment lực làm quay ngược chiều kim đồng hồ (M1 = ${M1} N.cm) xấp xỉ bằng Moment lực làm quay cùng chiều kim đồng hồ (M2 = ${M2} N.cm).`;
  } else if (M1 > M2) {
    explanation = `Đòn bẩy nghiêng về phía TRÁI vì Moment M1 (${M1} N.cm) lớn hơn Moment M2 (${M2} N.cm) một lượng ${diff} N.cm.`;
  } else {
    explanation = `Đòn bẩy nghiêng về phía PHẢI vì Moment M2 (${M2} N.cm) lớn hơn Moment M1 (${M1} N.cm) một lượng ${diff} N.cm.`;
  }

  return {
    M1,
    M2,
    diff,
    isBalanced,
    tiltAngle,
    mechanicalAdvantage,
    warnings,
    explanation,
  };
}

/**
 * 3. Light Reflection calculation engine
 */
export interface ReflectionResult {
  i: number;
  r: number;
  diff: number; // |i - r|
  isValidLaw: boolean;
  warnings: string[];
  angleWithMirrorSurface: number;
  explanation: string;
}

export function calculateReflection(data: ReflectionData): ReflectionResult {
  const warnings: string[] = [];

  if (data.i < 0 || data.i > 90 || data.r < 0 || data.r > 90) {
    warnings.push('Góc tới và góc phản xạ phải nằm trong khoảng từ 0° đến 90°.');
  }

  if (!data.measuredFromNormal) {
    warnings.push('LƯU Ý QUAN TRỌNG: Góc tới i và góc phản xạ r PHẢI được đo so với PHÁP TUYẾN (đường vuông góc với mặt gương), không được đo so với mặt phẳng gương!');
  }

  const diff = +Math.abs(data.i - data.r).toFixed(1);
  const isValidLaw = diff <= 1.0; // 1 degree tolerance for measurement error in middle school lab
  const angleWithMirrorSurface = 90 - data.i;

  let explanation = '';
  if (isValidLaw) {
    explanation = `Kết quả thực nghiệm xác nhận Định luật phản xạ ánh sáng: Góc phản xạ r (${data.r}°) xấp xỉ bằng góc tới i (${data.i}°). Tia phản xạ nằm trong mặt phẳng tới và ở phía đối diện của pháp tuyến.`;
  } else {
    explanation = `Có độ lệch ${diff}° giữa góc phản xạ (${data.r}°) và góc tới (${data.i}°). Trong thí nghiệm thực tế, nguyên nhân thường do: thước chia độ đặt lệch, vệt sáng laser quá dày, hoặc học sinh đọc nhầm vạch đo so với mặt gương thay vì so với pháp tuyến.`;
  }

  return {
    i: data.i,
    r: data.r,
    diff,
    isValidLaw,
    warnings,
    angleWithMirrorSurface,
    explanation,
  };
}
