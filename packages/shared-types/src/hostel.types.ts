/**
 * Hostel Types
 * Hostel entity and related types
 */

export interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IHostel {
  _id: string;
  name: string;
  code: string;
  ownerId: string;
  address: IAddress;
  totalRooms: number;
  totalBeds: number;
  amenities: string[];
  images: string[];
  monthlyRent: number;
  securityDeposit: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHostelCreate {
  name: string;
  code?: string;
  address: IAddress;
  amenities?: string[];
  monthlyRent: number;
  securityDeposit: number;
}

export interface IHostelUpdate {
  name?: string;
  address?: Partial<IAddress>;
  amenities?: string[];
  images?: string[];
  monthlyRent?: number;
  securityDeposit?: number;
  isActive?: boolean;
}
