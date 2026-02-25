/** MediaPipe Pose のランドマーク型（CDN読み込みなので自前定義） */
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

/** 3点から角度(度)を計算。bが頂点 */
export function calcAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/** MediaPipe Poseの主要なランドマークインデックス */
export const POSE = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
} as const;

/** スケルトン描画の接続線定義 */
export const SKELETON_CONNECTIONS: [number, number][] = [
  [11, 12], // 肩
  [11, 13], [13, 15], // 左腕
  [12, 14], [14, 16], // 右腕
  [11, 23], [12, 24], // 体幹
  [23, 24], // 腰
  [23, 25], [25, 27], // 左脚
  [24, 26], [26, 28], // 右脚
];
