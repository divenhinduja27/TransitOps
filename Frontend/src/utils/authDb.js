// Virtual Database for Local Offline Simulation (transitops_users_db)

const STORAGE_KEY = 'transitops_users_db';

// Initial pre-seeded admin user matching backend DataInitializer
const SEED_USERS = [
  {
    email: 'admin@transitops.com',
    password: 'admin123',
    firstName: 'Default',
    lastName: 'Admin',
    role: 'ROLE_FLEET_MANAGER'
  },
  {
    email: 'Raven.k@transitops.in',
    password: 'password',
    firstName: 'Raven',
    lastName: 'K',
    role: 'ROLE_DRIVER' // Maps to Dispatcher in the UI
  }
];

export const initAuthDb = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
  }
};

export const getAuthUsers = () => {
  initAuthDb();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Error parsing virtual auth database', e);
    return SEED_USERS;
  }
};

export const authenticateLocalUser = (email, password) => {
  const users = getAuthUsers();
  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  
  if (!matchedUser) {
    return { success: false, error: 'User does not exist in local secure registry.' };
  }

  if (matchedUser.password !== password) {
    return { success: false, error: 'Invalid security key.' };
  }

  return { 
    success: true, 
    user: {
      email: matchedUser.email,
      role: matchedUser.role,
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName
    }
  };
};

export const registerLocalUser = (email, password, firstName, lastName, role) => {
  const users = getAuthUsers();
  const alreadyExists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (alreadyExists) {
    return { success: false, error: 'Email identifier is already registered.' };
  }

  const newUser = {
    email: email.trim(),
    password,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    role
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return { success: true, user: newUser };
};
