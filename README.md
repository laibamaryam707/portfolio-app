# Portfolio Vault

A full-stack Portfolio Management System for developers and creatives. Manage your skills, projects, experience, and certificates through a clean admin dashboard — then share your portfolio with a single link.

🔗 **Live Demo:** https://portfolio-vault-five.vercel.app  
📁 **GitHub:** https://github.com/laibamaryam707/portfolio-app

---

## Overview

Portfolio Vault is a personal CMS that lets you manage all your portfolio content in one place and publish it as a polished public-facing website. It includes a full analytics dashboard, role-based access, real-time activity tracking, and five distinct portfolio themes.

---

## Features

- 🔐 JWT authentication with edge middleware route protection
- 📊 Analytics dashboard with custom SVG charts
- 🗂️ Full CRUD for projects, skills, experience, certificates and categories
- 🖼️ Image uploads with client-side compression
- 🔍 Search and filtering across all content
- 🔔 Real-time notifications and audit trail
- ♻️ Soft delete with Trash and restore
- 🌐 Public portfolio with 5 layout themes
- 👀 Live preview with desktop/mobile toggle
- 🔑 Forgot password with secure token flow
- 📱 Fully responsive

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Tailwind CSS |
| Deployment | Vercel + MongoDB Atlas |

---

## Database Design

Seven collections, all linked to a User via `userId`:

**User** — email, password (hashed), username, role (admin/viewer), reset token

**Profile** — fullName, title, about, avatar, email, location, social links

**Project** — title, description, image, technologies, tags, category, status, featured, soft delete fields

**Skill** — name, category, level (0–100), proficiency, icon, soft delete fields

**Category** — name, color

**ActivityLog** — action, entityType, entityName, timestamp

**Experience / Certificate / CustomCard** — standard content fields + userId

---

## API Overview

| Area | Endpoints |
|---|---|
| Auth | register, login, logout, me, change-password, forgot-password, reset-password |
| Projects | CRUD + search, filter, pagination, soft delete |
| Skills | CRUD + search, filter, soft delete |
| Categories | CRUD |
| Experience | CRUD |
| Certificates | CRUD |
| Dashboard | analytics, activity, profile, trash, restore |
| Public | `/api/portfolio/[username]` — no auth required |

---

## Security

- Passwords hashed with bcrypt 
- JWT stored in httpOnly cookies
- Edge middleware blocks unauthorized access
- Rate limiting on login (5 attempts per minute)
- Input validation on all write endpoints
- Reset tokens expire after 1 hour



## License

MIT