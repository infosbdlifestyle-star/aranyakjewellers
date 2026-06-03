# Aranyak Jewellers — Official Website

Premium gold, diamond, and silver jewellery website for **Aranyak Jewellers**, Tripura's most trusted jewellery brand with 25+ years of excellence and multiple showrooms.

## 🏗️ Tech Stack

| Layer | Technology | Deployment |
|-------|-----------|------------|
| **Frontend** | Next.js 16, React 19, TailwindCSS v4, Framer Motion | Vercel |
| **Backend** | NestJS, Prisma ORM, MongoDB | VPS |

## 📁 Project Structure

```
aranyakjewellers/
├── frontend/          → Next.js showcase website
│   ├── src/
│   │   ├── app/       → Pages (Home, About, Stores, Collections, Gold Rate, Contact)
│   │   ├── components/→ Reusable UI components
│   │   ├── constants/ → Category data
│   │   └── ...
│   └── public/        → Images and static assets
├── backend/           → NestJS API (for future e-commerce features)
│   ├── src/           → Modules (Auth, Products, Cart, Orders, etc.)
│   ├── prisma/        → Database schema and seeds
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend (Development)

```bash
cd backend
cp .env.example .env    # Configure your MongoDB URL
npm install
npx prisma generate
npm run start:dev
```

Open [http://localhost:3001/api](http://localhost:3001/api)

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, categories, bridal showcase, showroom CTA |
| About | `/about` | Company story, MD message, certifications |
| Collections | `/collections` | All jewellery categories overview |
| Category | `/category/[slug]` | Individual category with subcategories |
| Stores | `/stores` | All showroom locations |
| Gold Rate | `/gold-rate` | Today's gold prices (22K, 18K, 24K) |
| Contact | `/contact` | Contact form, phone, WhatsApp |

## 🎨 Design

- **Color Palette**: Deep Burgundy (#4A0404) + Royal Gold (#D4AF37)
- **Typography**: Cormorant Garamond (serif) + Geist Sans
- **Effects**: Glassmorphism, gold gradients, shimmer animations, silk textures

## 📝 License

© 2025 Aranyak Jewellers. All rights reserved.
