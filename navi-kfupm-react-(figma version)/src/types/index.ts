export type UserRole = 'student' | 'admin' | 'maintenance_staff' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
}

export type LocationCategory = 
  | 'academic'
  | 'restaurant'
  | 'cafe'
  | 'dorm'
  | 'parking'
  | 'study_room'
  | 'prayer_room'
  | 'restroom'
  | 'library'
  | 'admin_building'
  | 'sports';

export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: { x: number; y: number };
  description: string;
  image?: string;
  capacity?: number;
  openHours?: string;
  amenities?: string[];
  services?: Array<{ name: string; hours: string }>;
  buildingShape?: { width: number; height: number };
  facilities?: {
    labs?: string[];
    printers?: number;
    prayerRooms?: number;
    bathrooms?: number;
    studyRooms?: number;
  };
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  locationId: string;
  title: string;
  text: string;
  likes: string[]; // Array of user IDs who liked it
  createdAt: string;
}

export interface BusRoute {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
    coordinates: { x: number; y: number };
    arrivalTimes: string[];
  }>;
  color: string;
  path: Array<{ x: number; y: number }>;
}

export interface MainPath {
  id: string;
  name: string;
  description: string;
  path: Array<{ x: number; y: number }>;
  color: string;
}

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  locationId: string;
  locationName: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  locationId: string;
  text: string;
  rating: number;
  createdAt: string;
  hidden?: boolean; // Comments can be hidden by maintenance staff
  verified?: boolean; // Comments can be verified by KFUPM administrators
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'event' | 'maintenance' | 'general';
  date: string;
  priority: 'high' | 'medium' | 'low';
}