import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBq1siTeEmQvsKHmeB7yQvbp4ffcvpktxU",
  authDomain: "blogpost-40.firebaseapp.com",
  projectId: "blogpost-40",
  storageBucket: "blogpost-40.firebasestorage.app",
  messagingSenderId: "557492464647",
  appId: "1:557492464647:web:249028a58b747d6ee9cea2"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


document.getElementById("signup-btn").addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign-Up Successful!");
      window.location.href = "mainPage.html";
    })
    .catch((error) => {
      alert("Email is already in use");
    });
});


document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login Successful!");
      window.location.href = "mainPage.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});


document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged Out Successfully!");
      document.getElementById("logout-btn").style.display = "none";
    })
    .catch((error) => {
      alert(error.message);
    });
});

document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
  });

  document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
  });
