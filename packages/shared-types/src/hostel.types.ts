export interface IAddress {
  street: string;
  city: string;


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
  phoneNumber: string;
  address: IAddress;
  totalRooms: number;
  totalBeds: number;
  amenities: string[];
  images: string[];
  monthlyRent: number;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
