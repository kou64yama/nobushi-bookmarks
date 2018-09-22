export const auth = {
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
};

export default {
  initializeApp: () => ({
    auth: () => auth,
  }),
};
