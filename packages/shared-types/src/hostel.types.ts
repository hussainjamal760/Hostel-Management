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
