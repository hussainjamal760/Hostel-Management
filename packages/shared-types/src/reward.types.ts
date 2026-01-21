/**
 * Reward Types
 * Reward/Points entity and related types
 */

export type RewardCategory =
  | 'CLEANLINESS'
  | 'PUNCTUALITY'
  | 'BEHAVIOR'
  | 'PARTICIPATION'
  | 'PENALTY';

export interface IReward {
  _id: string;
  studentId: string;
  hostelId: string;

  points: number; // Can be negative for deductions
  reason: string;
  category: RewardCategory;

  awardedBy: string;
  awardedAt: Date;

  createdAt: Date;
}

export interface IRewardCreate {
  studentId: string;
  points: number;
  reason: string;
  category: RewardCategory;
}
