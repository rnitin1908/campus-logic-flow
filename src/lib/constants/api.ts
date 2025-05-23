/**
 * API Constants
 * Contains API endpoints and configuration
 */

// Base URL for API requests
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  BASE: `${API_BASE_URL}/students`,
  GET_ALL: `${API_BASE_URL}/students`,
  CREATE: `${API_BASE_URL}/students`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/students/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/students/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/students/${id}`,
};

// School endpoints
export const SCHOOL_ENDPOINTS = {
  BASE: `${API_BASE_URL}/schools`,
  GET_ALL: `${API_BASE_URL}/schools`,
  CREATE: `${API_BASE_URL}/schools`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/schools/${id}`,
  GET_BY_CODE: (code: string) => `${API_BASE_URL}/schools/code/${code}`,
  UPDATE: (id: string) => `${API_BASE_URL}/schools/${id}`,
  UPDATE_CONFIG: (code: string) => `${API_BASE_URL}/schools/code/${code}/configuration`,
  DELETE: (id: string) => `${API_BASE_URL}/schools/${id}`,
};

// Tenant endpoints
export const TENANT_ENDPOINTS = {
  BASE: `${API_BASE_URL}/tenants`,
  REGISTER: `${API_BASE_URL}/tenants/register`,
  GET_ALL: `${API_BASE_URL}/tenants`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/tenants/${id}`,
  GET_BY_SLUG: (slug: string) => `${API_BASE_URL}/tenants/slug/${slug}`,
};

// Class endpoints
export const CLASS_ENDPOINTS = {
  BASE: `${API_BASE_URL}/classes`,
  GET_ALL: `${API_BASE_URL}/classes`,
  CREATE: `${API_BASE_URL}/classes`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/classes/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/classes/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/classes/${id}`,
};

// Subject endpoints
export const SUBJECT_ENDPOINTS = {
  BASE: `${API_BASE_URL}/subjects`,
  GET_ALL: `${API_BASE_URL}/subjects`,
  CREATE: `${API_BASE_URL}/subjects`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/subjects/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/subjects/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/subjects/${id}`,
};

// Staff endpoints
export const STAFF_ENDPOINTS = {
  BASE: `${API_BASE_URL}/staff`,
  GET_ALL: `${API_BASE_URL}/staff`,
  CREATE: `${API_BASE_URL}/staff`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/staff/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/staff/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/staff/${id}`,
};

// Attendance endpoints
export const ATTENDANCE_ENDPOINTS = {
  BASE: `${API_BASE_URL}/attendance`,
  GET_ALL: `${API_BASE_URL}/attendance`,
  CREATE: `${API_BASE_URL}/attendance`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/attendance/${id}`,
  UPDATE: (id: string) => `${API_BASE_URL}/attendance/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/attendance/${id}`,
};
