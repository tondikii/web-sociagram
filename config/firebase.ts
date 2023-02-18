import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAvLEAJMHUKCuz0jYXQAcj_09m_TgDQgsw",
  authDomain: "sociagram-2630.firebaseapp.com",
  databaseURL: "https://sociagram-2630-default-rtdb.firebaseio.com",
  projectId: "sociagram-2630",
  storageBucket: "sociagram-2630.appspot.com",
  messagingSenderId: "471468999640",
  appId: "1:471468999640:web:aa9740451fa81d5c4fa8ad",
  measurementId: "G-23NSML66C3",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
