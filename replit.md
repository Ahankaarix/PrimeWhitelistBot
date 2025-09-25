# Overview

This is a Discord-integrated whitelist application management system for Prime City RP (a roleplay gaming server). The application allows users to submit whitelist applications through a web interface, while administrators can review and approve/reject applications. The system features Discord bot integration that handles application submissions and provides automated responses with visa-style approval/rejection messages.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite Build System**: Fast development server and optimized production builds
- **Routing**: Wouter for client-side routing with dashboard and applications pages
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom Discord-inspired theming and CSS variables
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Express.js Server**: RESTful API with TypeScript support
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon database integration)
- **Storage Interface**: Abstract storage interface with in-memory implementation for development
- **API Endpoints**: CRUD operations for applications with status filtering
- **Error Handling**: Centralized error middleware with proper HTTP status codes

## Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Applications Table**: Comprehensive whitelist applications with fields for:
  - User information (Discord ID, Steam ID, username)
  - Character details (name, age, nationality, backstory)
  - Roleplay experience and server history
  - Application status (pending, approved, rejected)
  - Review metadata (reviewer, reason, timestamps)

## Discord Bot Integration
- **Discord.js v14**: Modern Discord bot with slash commands and interactive components
- **Application Flow**: 
  - Users submit applications via `/whitelist` command
  - Modal forms collect application data
  - Admin approval/rejection system with button interactions
  - Automated visa-style response messages
- **Admin Controls**: Role-based permissions for application review
- **Channel Management**: Separate channels for applications and admin actions

## External Dependencies

- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Discord API**: Bot integration for application submission and management
- **Radix UI**: Accessible component primitives for the user interface
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **TanStack React Query**: Server state management and data fetching
- **React Hook Form**: Performance-focused form library with validation
- **Zod**: Runtime type validation for form data and API schemas