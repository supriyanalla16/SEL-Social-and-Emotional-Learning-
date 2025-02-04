// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbBd_x2CBbXnr_IYqIWEXX0Uyi0KrVgeE",
  authDomain: "socialemotional-60ae4.firebaseapp.com",
  projectId: "socialemotional-60ae4",
  storageBucket: "socialemotional-60ae4.appspot.com",
  messagingSenderId: "869691683450",
  appId: "1:869691683450:web:625a9bacebab34a41581c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit Roll Number Logic
document.getElementById("submitRollNumber").addEventListener("click", async (e) => {
  e.preventDefault();

  const rollNumber = document.getElementById("rollNumber").value;

  try {
    // Store roll number in Firestore under a "rollNumbers" collection
    await setDoc(doc(db, "rollNumbers", rollNumber), {
      rollNumber: rollNumber,
      timestamp: new Date().toISOString()
    });

    document.getElementById("rollMessage").textContent = "Roll Number Saved Successfully!";
    document.getElementById("rollMessage").style.display = "block";

    // Redirect to home2.html
    setTimeout(() => {
      window.location.href = "home2.html";
    }, 1000);
  } catch (error) {
    document.getElementById("rollMessage").textContent = "Error: " + error.message;
    document.getElementById("rollMessage").style.display = "block";
  }
});
