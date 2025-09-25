import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, updateApplicationSchema } from "@shared/schema";
import { startDiscordBot } from "./discord-bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start Discord bot
  startDiscordBot();

  // Get all applications
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get applications by status
  app.get("/api/applications/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const applications = await storage.getApplicationsByStatus(status);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get single application
  app.get("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Create new application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });

  // Update application (approve/reject)
  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateApplicationSchema.parse(req.body);
      
      const updatedApplication = await storage.updateApplication(id, validatedData);
      if (!updatedApplication) {
        return res.status(404).json({ message: "Application not found" });
      }

      res.json(updatedApplication);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update application" });
      }
    }
  });

  // Delete application
  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteApplication(id);
      if (!deleted) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
