// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Sign-Up Logic
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const rollNumber = document.getElementById('rRollNumber').value.trim();
    const password = document.getElementById('rPassword').value.trim();
    const signUpMessage = document.getElementById("signUpMessage");

    if (!fName || !lName || !rollNumber || !password) {
        signUpMessage.textContent = "All fields are required.";
        signUpMessage.style.display = "block";
        return;
    }

    try {
        // Use roll number as email
        const userCredential = await createUserWithEmailAndPassword(auth, `${rollNumber}@example.com`, password);

        // Save user details in Firestore
        await setDoc(doc(db, "students", rollNumber), {
            firstName: fName,
            lastName: lName,
            rollNumber: rollNumber
        });

        signUpMessage.textContent = "Registration Successful!";
        signUpMessage.style.display = "block";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    } catch (error) {
        signUpMessage.textContent = "Error: " + error.message;
        signUpMessage.style.display = "block";
    }
});

// Sign-In Logic
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const rollNumber = document.getElementById('rollNumber').value.trim();
    const password = document.getElementById('password').value.trim();
    const signInMessage = document.getElementById("signInMessage");

    if (!rollNumber || !password) {
        signInMessage.textContent = "All fields are required.";
        signInMessage.style.display = "block";
        return;
    }

    try {
        // Sign in user using roll number as email
        const userCredential = await signInWithEmailAndPassword(auth,`${rollNumber}@example.com`, password);

        // Check if the user exists in Firestore
        const docRef = doc(db, "students", rollNumber);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            signInMessage.textContent = "Login Successful!";
            signInMessage.style.display = "block";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            signInMessage.textContent = "User not found in database.";
            signInMessage.style.display = "block";
        }
    } catch (error) {
        signInMessage.textContent = "Error: " + error.message;
        signInMessage.style.display = "block";
    }
});

// Switch between forms
document.getElementById('signUpButton').addEventListener('click', () => {
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
});

document.getElementById('signInButton').addEventListener('click', () => {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('signIn').style.display = 'block';
});