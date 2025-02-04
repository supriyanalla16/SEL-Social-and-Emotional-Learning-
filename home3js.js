// Import Firebase libraries
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

// Questionnaire data
const questions = {
  "Academic Questions": [
    "Does your child attend school regularly?",
    "Does your child show a strong interest in certain subjects?",
    "Do you discuss academic goals with your child regularly?",
    "Is your child involved in extracurricular activities?",
    "Do you believe extracurricular activities benefit your child’s overall development?",
    "Do you feel your child understands the importance of completing their education?",
    "Do you believe education will help your child achieve their future goals?",
    "Have you noticed any recent changes in your child’s academic performance?"
  ],
  "Behavioral Questions": [
    "Has your child recently expressed frustration with school?",
    "Are financial challenges affecting your ability to support your child’s education?",
    "Has any recent family situation affected your child’s focus on school?",
    "Has your child experienced any bullying or negative interactions at school?",
    "Do you discuss your child’s future goals and aspirations with them?"
  ],
  "Emotional Intelligence Questions": [
    "Do you feel your child is motivated to engage in school activities?",
    "Do you believe your child receives adequate support from teachers?",
    "Have you noticed that your child feels stressed or anxious about schoolwork?",
    "Does your child have supportive friendships at school?",
    "Do you feel confident in your ability to support your child both academically and emotionally?"
  ],
  "Parent Intimacy Questions": [
    "Do you and your child regularly have open conversations about their day at school?",
    "Does your child share their thoughts and emotions with you willingly?",
    "Does your child seek your guidance when faced with challenges or dilemmas?",
    "Do you feel conflicts with your child are resolved effectively through mutual understanding?",
    "Do you encourage your child to express their feelings openly and listen to their perspective?"
  ]
};

// Render questionnaire dynamically
const form = document.getElementById("parent-questionnaire-form");

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
// Submit form data for parent
document.getElementById("submit-btn").addEventListener("click", async () => {
  const formData = {};
  const rollNumber = document.getElementById("roll-number").value.trim();

  if (!rollNumber) {
    alert("Please enter the roll number.");
    return;
  }

  formData["rollNumber"] = rollNumber;

  // Collect questionnaire responses
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

  // Get the logged-in user
  onAuthStateChanged(auth, async user => {
    if (user) {
      const userId = user.uid; // Firebase Authentication unique user ID

      try {
        // Save responses to Firestore with roll number
        await setDoc(doc(db, "parentquestionnaire", `${rollNumber}_${userId}`), formData);
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
