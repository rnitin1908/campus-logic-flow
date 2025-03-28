
export interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  status: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  address?: string;
  parentInfo?: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
  emergencyContacts?: {
    name: string;
    phone: string;
    relation: string;
  }[];
  healthInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
  };
  admissionDate?: string;
  previousSchool?: string;
  documents?: {
    type: string;
    name: string;
    url: string;
    uploadDate: string;
  }[];
  class?: string;
  section?: string;
  academicYear?: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  address?: string;
  status: string;
}
