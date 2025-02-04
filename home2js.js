// Firebase and other imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Firebase configuration (replace with your Firebase config)
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
const auth = getAuth(app);

// Teacher questionnaire data
const questions = {
  "Academic Questions": [
    "How regularly does the student attend classes?",
    "Does the student actively participate in class discussions?",
    "How does the student perform academically compared to their peers?",
    "Does the student complete assignments and projects on time?",
    "Have you noticed any recent changes in the student's academic performance?",
    "Does the student participate in any extracurricular activities? (This could also be seen as related to academic engagement depending on context)",
    "Does the student regularly participate in sports or physical activities? (Depending on context, this could overlap with extracurricular involvement)"
  ],
  "Behavioral Questions": [
    "Has the student demonstrated any leadership qualities in extracurricular activities?",
    "Does the student seek help from teachers or staff when facing challenges?",
    "Have you observed any instances where the student was involved in or affected by bullying?",
    "Do you feel the student is at risk of dropping out or showing signs of academic disengagement?"
  ],
  "Emotional Intelligence Questions": [
    "Does the student have a group of friends or a support network at school?",
    "Have you observed any signs of stress, anxiety, or frustration in the student related to academics or other issues?",
    "Do you feel the student is motivated and confident about their future goals?",
    "How would you rate the student’s enthusiasm and engagement in extracurricular activities?"
  ]
};

// Render questionnaire dynamically
const form = document.getElementById("teacher-questionnaire-form");

Object.keys(questions).forEach(section => {
  const sectionDiv = document.createElement("div");
  sectionDiv.classList.add("section");
  const sectionHeader = document.createElement("h2");
  sectionHeader.textContent = section;
  sectionDiv.appendChild(sectionHeader);

  questions[section].forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    const questionLabel = document.createElement("label");
    questionLabel.textContent = question;

    const yesInput = document.createElement("input");
    yesInput.type = "radio";
    yesInput.name = `${section}_${index}`;
    yesInput.value = "Yes";

    const noInput = document.createElement("input");
    noInput.type = "radio";
    noInput.name = `${section}_${index}`;
    noInput.value = "No";

    questionDiv.appendChild(questionLabel);
    questionDiv.appendChild(yesInput);
    questionDiv.appendChild(document.createTextNode(" Yes "));
    questionDiv.appendChild(noInput);
    questionDiv.appendChild(document.createTextNode(" No "));

    sectionDiv.appendChild(questionDiv);
  });

  form.appendChild(sectionDiv);
});

// Submit form data
// Submit form data for teacher
document.getElementById("submit-btn").addEventListener("click", async () => {
  const formData = {};
  const rollNumber = document.getElementById("roll-number").value;

  if (!rollNumber) {
    alert("Roll number is required!");
    return;
  }

  // Collect form data and maintain order
  Object.keys(questions).forEach(section => {
    formData[section] = [];
    questions[section].forEach((question, index) => {
      const answer = document.querySelector(`input[name="${section}_${index}"]:checked`);
      formData[section].push({
        question: question,
        answer: answer ? answer.value : null
      });
    });
  });

  // Add roll number to the form data
  formData["rollNumber"] = rollNumber;

  // Get the current logged-in user
  onAuthStateChanged(auth, async user => {
    if (user) {
      const userId = user.uid; // Use the unique user ID from Firebase Authentication

      try {
        // Save responses to Firestore along with roll number
        await setDoc(doc(db, "teacherquestionnaire", `${userId}_${rollNumber}`), formData);
        alert("Your responses have been submitted successfully!");
      } catch (error) {
        console.error("Error saving responses:", error);
        alert("An error occurred while submitting your responses. Please try again.");
      }
    } else {
      alert("You need to log in to submit your responses.");
    }
  });
});
