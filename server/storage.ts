import { type User, type InsertUser, type Application, type InsertApplication, type UpdateApplication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getApplication(id: string): Promise<Application | undefined>;
  getApplications(): Promise<Application[]>;
  getApplicationsByStatus(status: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: UpdateApplication): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, Application>;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplicationsByStatus(status: string): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.status === status);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      ...insertApplication,
      id,
      status: "pending",
      reviewedBy: null,
      reviewReason: null,
      createdAt: new Date(),
      reviewedAt: null,
      contentCreation: insertApplication.contentCreation || null,
      previousServers: insertApplication.previousServers || null,
      rulesRead: insertApplication.rulesRead ?? false,
      cfxLinked: insertApplication.cfxLinked ?? false,
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: string, updates: UpdateApplication): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;

    const updatedApplication: Application = {
      ...application,
      ...updates,
      reviewedAt: new Date(),
    };
    
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }
}

export const storage = new MemStorage();
