# 🏭 Catalogue Website

A full-stack **e-commerce catalogue platform** for showcasing and managing **factory products**.  
The project is divided into two parts:  
- **ClientSideFrontend** → customer-facing product catalogue.  
- **AdminDashbord** → admin panel to manage products and categories.  

Built with **Next.js**, **Prisma**, **MongoDB Atlas**, and **Cloudinary**, deployed on **Vercel**.  

## 🚀 Features
- 🛍️ **Product Browsing** – Explore all factory products in a clean UI.  
- 🔍 **Search & Filtering** – Find products quickly with smart filters.  
- 👤 **Client Frontend** – Responsive UI for customers.  
- 🛠️ **Admin Dashboard** – Manage products, categories, and images.  

## 🛠️ Tech Stack
- **Next.js** – React framework for building fast full-stack apps.  
- **Prisma** – ORM for easy database access.  
- **MongoDB Atlas** – Cloud NoSQL database.  
- **Cloudinary** – Image storage and optimization.  
- **Vercel** – Hosting and deployment for Next.js. 

# Project Structure
```
/AdminDashbord        → Admin panel code
/ClientSideFrontend   → Client-facing frontend code
```

### 🌐 Deployment
Deployed on Vercel → [Live Demo](https://catalogue-website-pink.vercel.app/)
### 📌 Future Improvements

✅ User authentication (login/register)

✅ invoice generation

✅ Role-based access control

# ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Yranshevare/Catalogue_website.git
cd Catalogue_website
```
### 2. Setup Client Frontend
```bash
cd ClientSideFrontend
npm install
npx prisma generate
```
**Create a `.env` file in ClientSideFrontend:**
```env
DATABASE_URL="your_db_Url"
```
**Run:**
```bash
npm run dev
```
### 3. Setup Admin Dashboard
```bash
cd AdminDashbord
npm install
npx prisma generate
```
**Create a `.env` file in AdminDashbord:**

```env
ADMIN_EMAIL=abc@gmail.com
ADMIN_PASSWORD=abc123
REFRESH_TOKEN_SECRET=hbhhjbhuhkdhsghkjdhfkdhfkjkshfkjkh
DATABASE_URL=your_db_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_API_key
CLOUDINARY_API_SECRETE=your_API_secrete
```
**Run:**
```bash
npm run dev
```
**Both apps will now be available locally (usually at `http://localhost:3000` but you can configure ports).**


