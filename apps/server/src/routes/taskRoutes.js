const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = (app) => {
  // READ - Leggi tutti i task di un progetto
  app.get("/api/tasks/project/:projectId", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { projectId } = req.params;

      // Recupera il progetto per verificare che l'utente sia il creatore
      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }

      // Leggi tutti i task del progetto
      const tasks = await prisma.task.findMany({
        where: {
          projectId: parseInt(projectId),
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Errore nel recupero dei task:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // CREATE - Crea un nuovo task
  app.post("/api/tasks", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { projectId, title, description, status, dueDate } = req.body;

      // Validazione
      if (!projectId || !title) {
        return res
          .status(400)
          .json({ message: "L'ID del progetto e il titolo sono obbligatori" });
      }

      // Recupera il progetto per verificare che l'utente sia il creatore
      const project = await prisma.project.findUnique({
        where: { id: parseInt(projectId) },
      });

      if (!project) {
        return res.status(404).json({ message: "Progetto non trovato" });
      }

      // Crea il task
      const task = await prisma.task.create({
        data: {
          projectId: parseInt(projectId),
          title,
          description: description || null,
          status: status || "todo",
          createdAt: new Date(),
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      console.error("Errore nella creazione del task:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // READ - Leggi un singolo task by ID
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;

      // Leggi il task
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
      });

      if (!task) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error("Errore nel recupero del task:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // UPDATE - Aggiorna un task
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;
      const { title, description, status, dueDate } = req.body;

      // Recupera il task
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
      });

      if (!task) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      // Aggiorna il task
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          title: title || task.title,
          description:
            description !== undefined ? description : task.description,
          status: status || task.status,
          dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Errore nell'aggiornamento del task:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });

  // DELETE - Elimina un task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      // Verifica autenticazione
      if (!req.user) {
        return res.status(401).json({ message: "Utente non autenticato" });
      }

      const { id } = req.params;

      // Recupera il task
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
      });

      if (!task) {
        return res.status(404).json({ message: "Task non trovato" });
      }

      // Elimina il task
      await prisma.task.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "Task eliminato con successo" });
    } catch (error) {
      console.error("Errore nell'eliminazione del task:", error);
      res.status(500).json({ message: "Errore del server" });
    }
  });
};
