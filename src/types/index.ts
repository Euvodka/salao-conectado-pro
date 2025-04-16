
export type UserRole = 'client' | 'professional';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  profileImage?: string;
  cpf?: string;
  cnpj?: string;
  address?: Address;
}

export interface Professional extends User {
  role: 'professional';
  services: Service[];
  followers: number;
  posts: Post[];
  cnpj: string;
  address: Address;
  rating: number;
}

export interface Client extends User {
  role: 'client';
  savedPosts: string[];
  following: string[];
  cpf: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
}

export interface Post {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalImage?: string;
  content: string;
  image: string;
  linkedService?: Service;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
