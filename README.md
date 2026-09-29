# KatalogKu — Universal Interactive E-Catalog & WhatsApp Order Template

A lightning-fast, high-converting digital product catalog template with realtime search, category filtering, persistent shopping cart (`localStorage`), and instant WhatsApp checkout. Built for local MSMEs (UMKM), cafes, boutiques, and creative brands.

![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## Features

- **Data-Driven Architecture:** Products dynamically fetched from decoupled JSON data using modern `async/await` and `fetch()` API.
- **Realtime Live Search & Category Filtering:** Instant multi-condition filtering (`.filter()`, `.includes()`) with responsive empty state handling.
- **Persistent Shopping Cart (`localStorage`):** Slide-over cart drawer that remembers cart items even across page refreshes or device reboots.
- **Interactive Quantity Controls:** Seamless increment (`+`), decrement (`-`), and removal (`🗑`) with live subtotal and grand total recalculations.
- **Instant WhatsApp Checkout:** Generates beautifully formatted order summaries directly into WhatsApp chat without requiring third-party payment gateway fees.

---

## Tech Stack

- **Framework & Build:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Logic:** Vanilla JavaScript (ES6+ Array Methods: `filter`, `find`, `reduce`, `forEach`, DOM Event Delegation, `localStorage` API)

---

## Getting Started

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Biw-id/katalogku.git
   cd katalogku
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Author

**Abiyyu Shiddiq As'ad (KaptenBiu)**
- Portfolio: [abiyyu-portfolio.netlify.app](https://abiyyu-portfolio.netlify.app/)
- GitHub: [@Biw-id](https://github.com/Biw-id)
- Email: abiyyudedev@gmail.com
