// SUBSTITUIR PELA CONFIGURAÇÃO DO Firebase do seu aplicativo Web
const firebaseConfig = {
  apiKey: "SUA API",
  authDomain: "SEU-DOMINIO.firebaseapp.com",
  databaseURL: "https://SEU-DOMINIO-default-rtdb.firebaseio.com",
  projectId: "NOME-DO-PROJETO",
  storageBucket: "SEU-DOMINIO.appspot.com",
  messagingSenderId: "0000000000000",
  appId: "SEU APPID",
  measurementId: "G-0000000000"
};

// Inicializa o firebase
firebase.initializeApp(firebaseConfig);

// Fazer referências de autenticação e banco de dados
const auth = firebase.auth();
const db = firebase.database();
// ----------------------------- Fim -----------------------------------

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    
    console.log("usuário entrou");
    console.log(user);
    setupUI(user);
    var uid = user.uid;
    console.log(uid);

  } else {
    console.log("usuário saiu");
    setupUI();
  }
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginForm['input-email'].value;
  const password = loginForm['input-password'].value;
  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the login modal & reset form
    loginForm.reset();
    console.log(email);
  })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("error-message").innerHTML = errorMessage;
      console.log(errorMessage);
    });
});

// logout
const logout = document.querySelector('#logout-link');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});
