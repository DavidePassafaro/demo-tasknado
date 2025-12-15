const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

// Import Prisma Client
const prisma = new PrismaClient();

module.exports = (app) => {
  // Google OAuth route
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  // Google OAuth callback route
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:4200/projects",
      failureRedirect: "http://localhost:4200/",
    })
  );

  // Get current user info based on session
  app.get("/api/user/current", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      // Fetch user from database using the ID from session
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Errore nel recupero dell'utente:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("http://localhost:4200/"); // Redirect to homepage or login page after logout
    });
  });
};
