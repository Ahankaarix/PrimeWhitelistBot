import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, updateApplicationSchema } from "@shared/schema";
import { startDiscordBot, getDiscordUserInfo } from "./discord-bot";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
  ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
  : 'http://localhost:5000';

// Configure Discord OAuth strategy
if (DISCORD_CLIENT_ID && DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/discord/callback`,
    scope: ['identify', 'guilds.members.read']
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Get enhanced user info from Discord bot
      const discordUserInfo = await getDiscordUserInfo(profile.id);
      
      const userData = {
        id: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        email: profile.email,
        verified: profile.verified,
        ...discordUserInfo
      };
      
      return done(null, userData);
    } catch (error) {
      return done(error, null);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Authentication middleware
  function isAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Authentication required' });
  }
  
  function isAdmin(req: any, res: any, next: any) {
    if (req.isAuthenticated() && req.user?.isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'Admin access required' });
  }
  
  // Start Discord bot
  startDiscordBot();
  
  // Authentication routes
  app.get('/auth/discord', passport.authenticate('discord'));
  
  app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
      // Successful authentication
      res.redirect('/?auth=success');
    }
  );
  
  app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

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

  // Create new application (requires authentication)
  app.post("/api/applications", isAuthenticated, async (req, res) => {
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

  // Update application (approve/reject) - Admin only
  app.patch("/api/applications/:id", isAdmin, async (req, res) => {
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

  // Delete application - Admin only
  app.delete("/api/applications/:id", isAdmin, async (req, res) => {
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
