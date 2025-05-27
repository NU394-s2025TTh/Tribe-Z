import { initializeApp } from 'firebase/app';
// import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
//! import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyBJFIiLksXi-5ukwqPx-Dwo-sI3g4KMXgY',
  authDomain: 'pizza-app-394.firebaseapp.com',
  projectId: 'pizza-app-394',
  storageBucket: 'pizza-app-394.firebasestorage.app',
  messagingSenderId: '878560050030',
  appId: '1:878560050030:web:a8447c3fe1c1378db31f7f',
};

const app = initializeApp(firebaseConfig);

//! Before uncommenting this, debug ReCAPTCHA and enforce App Check in console
// if (typeof window !== 'undefined') {
//   initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider(
//       '6Lf4QEorAAAAAImuiakpfDm2iqbxfCmeALL9XeBt'
//     ),
//     isTokenAutoRefreshEnabled: true,
//   });
// }

// Initialize Firebase service SDKs *AFTER* App Check successfully attests your app
// const auth = getAuth(app);
const db = getFirestore(app);

// export { app, auth, db };
export { app, db };
