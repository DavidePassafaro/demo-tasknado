const express = require("express");
const session = require("express-session");
const passport = require("passport");
const keys = require("./config/keys");

// Initialize Passport configuration
require("./services/passport");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
  // 1. SPECIFICA L'ORIGINE ESATTA
  const allowedOrigin = 'http://localhost:4200';
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin); 
  
  // 2. AGGIUNGI L'HEADER ESSENZIALE PER I COOKIE
  res.setHeader("Access-Control-Allow-Credentials", "true"); // <-- AGGIUNGI QUESTO

  // Header rimanenti (come nel tuo codice)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Se stai gestendo richieste OPTIONS (preflight requests)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Middleware to handle sessions
app.use(
  session({
    secret: keys.cookieKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Use authentication routes
require("./routes/authRoutes")(app);

// Use project routes
require("./routes/projectRoutes")(app);

// Use task routes
require("./routes/taskRoutes")(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
