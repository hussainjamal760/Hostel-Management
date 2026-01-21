/**
 * Room Types
 * Room entity and related types
 */

export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'DORMITORY';

export interface IRoom {
  _id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  totalBeds: number;
  occupiedBeds: number;
  rent: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomCreate {
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  totalBeds: number;
  rent: number;
  amenities?: string[];
}

export interface IRoomUpdate {
  floor?: number;
  roomType?: RoomType;
  totalBeds?: number;
  rent?: number;
  amenities?: string[];
  isActive?: boolean;
}
