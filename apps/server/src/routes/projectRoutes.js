const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = (app) => {
  // READ - Leggi tutti i progetti dell'utente
  app.get("/api/projects", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      // Leggi tutti i progetti di tutti gli utenti
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: "asc" },
      });

      res.status(200).json(projects);
    } catch (error) {
      console.error("Errore nel recupero dei progetti:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // CREATE - Crea un nuovo progetto
  app.post("/api/projects", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { name, description, color } = req.body;

      // Validazione
      if (!name) {
        return res
          .status(400)
          .json({ message: "Il nome del progetto è obbligatorio" });
      }

      // Crea il progetto
      const project = await prisma.project.create({
        data: {
          name,
          description: description || null,
          color: color || "#3b82f6",
          creatorId: req.user.id,
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Errore nella creazione del progetto:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // READ - Leggi un singolo progetto by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;

      // Leggi il progetto
      const project = await prisma.project.findUnique({
        where: { id: parseInt(id) },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Errore nel recupero del progetto:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // UPDATE - Aggiorna un progetto
  app.put("/api/projects/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;
      const { name, description, color } = req.body;

      // Recupera il progetto
      const project = await prisma.project.findUnique({
        where: { id: parseInt(id) },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }

      // Aggiorna il progetto
      const updatedProject = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          name: name || project.name,
          description:
            description !== undefined ? description : project.description,
          color: color || project.color,
        },
      });

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Errore nell'aggiornamento del progetto:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // DELETE - Elimina un progetto
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;

      // Recupera il progetto
      const project = await prisma.project.findUnique({
        where: { id: parseInt(id) },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }

      // Elimina il progetto (le task verranno eliminate automaticamente per il onDelete: Cascade)
      await prisma.project.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Progetto eliminato con successo" });
    } catch (error) {
      console.error("Errore nell'eliminazione del progetto:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });
};
