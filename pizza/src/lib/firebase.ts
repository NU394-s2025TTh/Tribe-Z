import { initializeApp } from 'firebase/app';
// import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBJFIiLksXi-5ukwqPx-Dwo-sI3g4KMXgY',
  authDomain: 'pizza-app-394.firebaseapp.com',
  projectId: 'pizza-app-394',
  storageBucket: 'pizza-app-394.firebasestorage.app',
  messagingSenderId: '878560050030',
  appId: '1:878560050030:web:a8447c3fe1c1378db31f7f',
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const db = getFirestore(app);

// export { app, auth, db };
export { app, db };
