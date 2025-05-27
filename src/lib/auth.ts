import { User } from '@/types';

const USER_STORAGE_KEY = 'authUser';

/**
 * Get the current user from local storage
 */
export const getUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user from localStorage', error);
    localStorage.removeItem(USER_STORAGE_KEY); // Clear corrupted data
    return null;
  }
};

/**
 * Save user to local storage
 */
export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage', error);
  }
};

/**
 * Clear user from local storage
 */
export const clearUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
