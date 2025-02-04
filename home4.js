import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elements
const studentCountElement = document.getElementById("student-count");
const teacherCountElement = document.getElementById("teacher-count");
const studentListElement = document.getElementById("student-list");
const teacherListElement = document.getElementById("teacher-list");

// Fetch user data
const fetchUserData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let studentCount = 0;
      let teacherCount = 0;
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.role === "student") {
          studentCount++;
          const listItem = document.createElement("li");
          listItem.textContent = `Roll Number: ${userData.rollNumber}`;
          studentListElement.appendChild(listItem);
        } else if (userData.role === "teacher") {
          teacherCount++;
          const listItem = document.createElement("li");
          listItem.textContent = `Name: ${userData.firstName} ${userData.lastName}`;
          teacherListElement.appendChild(listItem);
        }
      });
  
      studentCountElement.textContent = studentCount;
      teacherCountElement.textContent = teacherCount;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

// Ensure only admins can access
onAuthStateChanged(auth, (user) => {
  if (user) {
    user.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.admin) {
        fetchUserData();
      } else {
        alert("Access denied. Admins only.");
        window.location.href = "unauthorized.html";
      }
    });
  } else {
    alert("You need to log in to access this page.");
  
  }
});