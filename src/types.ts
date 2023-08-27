// DB
export type User = {
   id: string;
   conversationId: number;
   firstName: string;
   lastName: string;
   verified: boolean;
   isAdmin?: boolean;
};

export type City = {
   name: string;
   bounds: [LatLon, LatLon];
   participants: string[];
};

// Server Response
export interface Accommodation {
   id: number;
   medias: Media[];
   area: Area;
   bedCount: number;
   bedroomCount: number;
   beds: Bed[];
   roomCount: number;
   bookingData: BookingData;
   code: number;
   occupationModes: OccupationMode[];
   label: string;
   reference: string;
   studyLevel: StudyLevel;
   equipments: Equipment[];
   residence: Residence;
   inUnavailabilityPeriod: boolean;
   unavailabilityMessage: any;
   description: string;
   specialConditions: any;
   available: boolean;
   highDemand: boolean;
   lowStock: boolean;
}

export interface Media {
   src: string;
   description?: string;
}

export interface Area {
   min: number;
   max: number;
}

export interface Bed {
   count: number;
   type: string;
}

export interface BookingData {
   amount: number;
   free: boolean;
}

export interface OccupationMode {
   type: string;
   rent: Rent;
}

export interface Rent {
   min: number;
   max: number;
}

export interface StudyLevel {
   min: any;
   max: any;
}

export interface Equipment {
   id: string;
   category: string;
   label: string;
}

export interface Residence {
   id: string;
   label: string;
   address: string;
   code: number;
   medias: Media[];
   description: string;
   location: LatLon;
   transports: Transport[];
   uairne: string;
   sector: Sector;
   allocationMinimumDuration: number;
}

export interface LatLon {
   lat: number;
   lon: number;
}

export interface Transport {
   label: string;
   description: string;
   distance?: number;
   unitOfMeasure?: string;
}

export interface Sector {
   id: string;
   label: string;
}
