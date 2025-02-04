// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbBd_x2CBbXnr_IYqIWEXX0Uyi0KrVgeE",
  authDomain: "socialemotional-60ae4.firebaseapp.com",
  projectId: "socialemotional-60ae4",
  storageBucket: "socialemotional-60ae4.appspot.com",
  messagingSenderId: "869691683450",
  appId: "1:869691683450:web:625a9bacebab34a41581c3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // Sign-Up Logic
  document.getElementById('submitSignUp')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPassword').value.trim();
    const role = localStorage.getItem('role');

    if (!email || !password || !fName || !lName) {
      alert("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: fName,
        lastName: lName,
        email,
        role,
      });

      alert("Sign Up Successful!");
      window.location.href = role === "teacher" ? "enterRollNumber.html" : "enterparent.html";
    } catch (error) {
      console.error("Sign-Up Error:", error);
      alert("Error: " + error.message);
    }
  });

  // Sign-In Logic
  document.getElementById('submitSignIn')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = localStorage.getItem('role');

    if (!email || !password) {
      alert("Email and Password are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === role) {
          alert("Sign In Successful!");
          window.location.href = role === "teacher" ? "enterRollNumber.html" : "enterparent.html";
        } else {
          alert("Role mismatch. Please check your role.");
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Sign-In Error:", error);
      alert("Error: " + error.message);
    }
  });

  // Submit Roll Number Logic (Updated for Parent Role)
  document.getElementById('submitRollNumber')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const rollNumber = document.getElementById("rollNumber").value.trim();
    if (rollNumber === "") {
      alert("Please enter a valid roll number.");
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email; // Retrieve the parent's email
        const role = localStorage.getItem('role'); // Retrieve the role (either "parent" or "teacher")

        try {
          if (role === "parent") {
            const parentRef = doc(db, "parentsUnderStudent", email); // Create reference to "parentsUnderStudent" collection
            
            // Store the roll number as a key under the parent's email in Firestore
            await setDoc(parentRef, {
              [`students.${rollNumber}`]: new Date().toISOString() // Store roll number as key under "students"
            }, { merge: true });

            // Save roll number in sessionStorage for later use
            sessionStorage.setItem("rollNumber", rollNumber);
            
            alert("Roll number submitted successfully!");
            window.location.href = "home3.html"; // Redirect to home page
          } else {
            alert("You must be a parent to submit roll numbers.");
          }
        } catch (error) {
          console.error("Error storing roll number:", error);
          alert("Error saving roll number. Please try again.");
        }
      } else {
        alert("You need to log in to submit your roll number.");
      }
    });
  });
});