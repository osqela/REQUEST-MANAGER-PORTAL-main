import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAAFv9qvvt6QrV-WwUaBD8SS1eOZAhw-hE",
  authDomain: "site-access-contro.firebaseapp.com",
  databaseURL: "https://site-access-contro-default-rtdb.firebaseio.com",
  projectId: "site-access-contro",
  storageBucket: "site-access-contro.appspot.com",
  messagingSenderId: "657592968002",
  appId: "1:657592968002:web:763eb114220653f7addedb",
  measurementId: "G-87RM2Z6F0S"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const sendRequest = async (userId: string, requestCode: string) => {
  const requestRef = ref(database, `requests/${userId}`);
  await set(requestRef, {
    timestamp: Date.now(),
    status: 'pending',
    requestCode
  });
};

export const approveRequest = async (userId: string) => {
  const requestRef = ref(database, `requests/${userId}`);
  await set(requestRef, {
    timestamp: Date.now(),
    status: 'approved'
  });
};

export const denyRequest = async (userId: string) => {
  const requestRef = ref(database, `requests/${userId}`);
  await remove(requestRef);
};

export const checkUserStatus = async (userId: string) => {
  return new Promise((resolve) => {
    const requestRef = ref(database, `requests/${userId}`);
    onValue(requestRef, (snapshot) => {
      const data = snapshot.val();
      resolve(data ? data.status : null);
    });
  });
};

export const getAllRequests = async () => {
  const requestsRef = ref(database, 'requests');
  const snapshot = await get(requestsRef);
  return snapshot.exists() ? snapshot.val() : {};
};