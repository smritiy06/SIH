import localforage from 'localforage';
import bcrypt from 'bcryptjs';

// Simulated database key
const DB_KEY = 'travelmate_users';
const SESSION_KEY = 'user_session';

/**
 * Helper to get all users
 */
const getUsers = async () => {
  const users = await localforage.getItem(DB_KEY);
  return users || [];
};

/**
 * Registers a new user with hashed password
 * @param {Object} userData - { name, email, password }
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  
  if (!name || !email || !password) {
    throw new Error('All fields are required.');
  }

  const users = await getUsers();
  
  // Check if email already exists
  const existing = users.find(u => u.email === email);
  if (existing) {
    throw new Error('Email is already registered.');
  }

  // Hash password securely
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  await localforage.setItem(DB_KEY, users);

  // Auto-login after registration
  const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
  await localforage.setItem(SESSION_KEY, sessionUser);
  return sessionUser;
};

/**
 * Authenticates a user by checking the hashed password
 * @param {string} email 
 * @param {string} password 
 */
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const users = await getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Compare provided password with stored hash
  const isValid = bcrypt.compareSync(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid email or password.');
  }

  // Create session
  const sessionUser = { id: user.id, name: user.name, email: user.email };
  await localforage.setItem(SESSION_KEY, sessionUser);
  return sessionUser;
};

/**
 * Logs out the current user
 */
export const logoutUser = async () => {
  await localforage.removeItem(SESSION_KEY);
};

/**
 * Gets the currently authenticated user
 */
export const getCurrentUser = async () => {
  return await localforage.getItem(SESSION_KEY);
};
