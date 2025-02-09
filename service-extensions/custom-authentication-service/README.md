# Custom Authentication Service

This repository contains a **sample custom authentication service** designed to work with WSO2 Identity Server. It provides **PIN-based authentication** and can be used for **federated authentication, internal user authentication, or second-factor authentication**.

## 📂 Project Structure

```
custom-authentication-service/
│── express/       # Contains the Express.js-based authentication service
│── data/          # Stores user data for authentication
│── README.md      # Documentation for the root repository
│── .gitignore     # Git ignore file
```

## 🚀 Authentication Service

A Node.js Express-based sample implementation of the custom authentication service is located inside the [`express/`](express/) folder.

### 🔹 Features

- PIN-based authentication mechanism
- Session persistence using an **in-memory map**
- Supports **federated**, **internal**, and **second-factor** authentication
- Compatible with **Vercel** and **local environments**

### 📖 Setup & Usage

To set up and run the service locally, follow the **detailed instructions** provided in the [`express/README.md`](express/README.md) file.
