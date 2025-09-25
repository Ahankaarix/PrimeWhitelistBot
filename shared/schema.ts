import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  discordId: text("discord_id").notNull(),
  steamId: text("steam_id").notNull(),
  aboutYourself: text("about_yourself").notNull(),
  rpExperience: text("rp_experience").notNull(),
  characterName: text("character_name").notNull(),
  characterAge: text("character_age").notNull(),
  characterNationality: text("character_nationality").notNull(),
  characterBackstory: text("character_backstory").notNull(),
  contentCreation: text("content_creation"),
  previousServers: text("previous_servers"),
  rulesRead: boolean("rules_read").notNull().default(false),
  cfxLinked: boolean("cfx_linked").notNull().default(false),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: text("reviewed_by"),
  reviewReason: text("review_reason"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
}).extend({
  aboutYourself: z.string().min(50, "Please provide at least 50 words about yourself"),
  rpExperience: z.string().min(50, "Please provide at least 50 words about your RP experience"),
  characterBackstory: z.string().min(100, "Please provide a detailed character backstory (minimum 3-4 sentences)"),
  characterAge: z.string().min(1, "Character age is required"),
  discordId: z.string().min(1, "Discord ID is required"),
  steamId: z.string().min(1, "Steam Hex ID is required"),
  characterName: z.string().min(1, "Character name is required"),
  characterNationality: z.string().min(1, "Character nationality is required"),
  contentCreation: z.string().optional(),
  previousServers: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  reviewedBy: z.string(),
  reviewReason: z.string().optional(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type UpdateApplication = z.infer<typeof updateApplicationSchema>;
