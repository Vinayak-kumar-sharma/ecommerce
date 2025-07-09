# 🛒 E-Commerce Backend 

This is the backend of a complete e-commerce application built with **Node.js**, **Express**, and **MongoDB**. It handles user authentication, product management, order processing, payment integration via **Stripe**, and more.

> 🔧 Frontend is currently under development and will be integrated soon.

---

## 🚀 Features

- User registration and login (with JWT & hashed passwords)
- Role-based access control (Admin / User)
- Product and category management
- Cart and order functionality
- Stripe payment gateway integration
- Cloudinary for image upload
- Redis (ioredis) for caching/session management
- Environment variable support via `.env`
- Cookie-based authentication

---

## 🔮 Upcoming Features

- Delivery system tracking & management
- Complete frontend integration

---

## 🧰 Tech Stack

| Technology     | Description                    |
|----------------|--------------------------------|
| Node.js        | JavaScript runtime             |
| Express.js     | Web framework                  |
| MongoDB        | NoSQL database                 |
| Mongoose       | ODM for MongoDB                |
| Stripe         | Payment processing             |
| Cloudinary     | Media storage & delivery       |
| bcryptjs       | Password hashing               |
| JWT            | Authentication tokens          |
| ioredis        | Caching / session management   |
| dotenv         | Environment config             |
| cookie-parser  | Cookie handling middleware     |

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vinayak-kumar-sharma/ecommerce.git
   cd ecommerce/be
2. Install dependencies
   ```bash
    npm install

3. Set up environment variables
   ```ini
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    STRIPE_SECRET_KEY=your_stripe_secret
    REDIS_URL=your_redis_url

4. Run the server
   ```bash
    npm start
