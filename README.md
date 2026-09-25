SD Fashion App

A modern mobile fashion shopping application built with React Native and Expo, designed to provide customers with a simple and seamless way to discover fashion products, manage their cart, place orders, and manage their account.

SD Fashion focuses entirely on the customer shopping experience. Unlike StyleIQ, the application does not include an administrative dashboard.

⸻

📱 About SD Fashion

SD Fashion is a mobile e-commerce application for browsing and purchasing fashion products.

The application provides customers with:

* Product discovery
* Product categories
* Product recommendations
* Product details
* Shopping cart
* Checkout flow
* Customer profiles
* Order history
* Account settings
* Social media connections
* User authentication

The application is organized around four main tabs:

Home
General
Cart
Account

⸻

✨ Features

🏠 Home

The Home tab is the main product discovery area of the application.

Products are organized into several sections to help users discover items quickly.

New Arrivals

Displays recently added products.

Trending

Displays products currently highlighted as trending.

Collections

Allows customers to discover products grouped into collections.

Recommended for You

Provides personalized or curated product recommendations for customers.

Users can tap any product to open its product details page.

From the product details page, users can:

* View product information
* View product images
* Review available product options
* Add products to their cart
* Continue shopping

⸻

🛍️ General

The General tab provides access to the complete product catalog.

Unlike the Home tab, which focuses on curated sections and recommendations, General allows customers to browse all available products.

Users can:

* Browse the full catalog
* Open individual products
* View product details
* Add products to their cart

⸻

🛒 Cart

The Cart tab allows customers to review the products they have selected before completing their purchase.

Customers can:

* View selected products
* Review quantities
* Review cart items
* Adjust their shopping selection
* Proceed toward checkout

The cart provides the final step before completing an order.

⸻

👤 Account

The Account tab contains the customer’s personal and account-related features.

It includes:

My Profile

Customers can view and manage their personal profile information.

Order History

Customers can view their previous orders and review their purchase history.

Settings

Provides access to application and account settings.

Connect With Us

Customers can access the brand’s social media platforms and connect with SD Fashion through its social networks.

Log Out

Customers can securely sign out of their account.

⸻

🛍️ Shopping Flow

The main shopping experience follows a simple flow:

Home
  │
  ▼
Browse Products
  │
  ▼
Select Product
  │
  ▼
Product Details
  │
  ▼
Add to Cart
  │
  ▼
Cart
  │
  ▼
Checkout
  │
  ▼
Order

This keeps the shopping journey straightforward and allows customers to move from product discovery to checkout with minimal friction.

⸻

🧭 Application Navigation

SD Fashion uses four primary navigation tabs:

┌──────────┬──────────┬──────────┬──────────┐
│   Home   │ General  │   Cart   │ Account  │
└──────────┴──────────┴──────────┴──────────┘

Home

Product discovery, categories, trending products, collections, and recommendations.

General

Complete product catalog.

Cart

Selected products and checkout.

Account

Profile, orders, settings, social connections, and logout.

⸻

🛠️ Technology Stack

SD Fashion uses the same core technology stack and development approach used for the StyleIQ mobile application.

Mobile

* React Native
* Expo
* TypeScript
* Expo Router

Backend & Services

* Firebase Authentication
* Firebase Firestore
* Supabase Storage

Development

* JavaScript / TypeScript
* React Native
* Git
* GitHub
* Expo Go

⸻

🗄️ Application Architecture

The application separates customer authentication, application data, and product image storage.

                 SD Fashion App
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 Firebase Auth    Firestore      Supabase Storage
        │              │              │
        │              │              │
   User accounts   Product data    Product images
   Authentication  Orders         Image files
                   Profiles
                   Cart data

Firebase is responsible for authentication and application data, while Supabase Storage is used for product images.

⸻

🔐 Authentication

Firebase Authentication is used to manage customer accounts.

Authentication allows customers to:

* Create accounts
* Sign in
* Maintain authenticated sessions
* Access their profile
* Access their order history
* Sign out

Account-specific information is associated with the authenticated user.

⸻

🔥 Firebase Firestore

Firestore is used as the application’s database for structured application data.

It can store information such as:

* Products
* Categories
* Collections
* User profiles
* Orders
* Cart information
* Customer-related data

The application retrieves this information dynamically rather than relying entirely on hardcoded product data.

⸻

🖼️ Supabase Storage

Supabase Storage is used specifically for product images.

The general product-image architecture is:

Product Image
     │
     ▼
Supabase Storage
     │
     ▼
Public Image URL
     │
     ▼
Firestore Product Record

Firestore stores the product information and corresponding image URL, while Supabase Storage handles the actual image files.

This keeps product metadata and image storage separated.

⸻

🛒 Cart & Orders

The application supports a complete customer shopping flow.

Customers can:

1. Browse products.
2. Open product details.
3. Add products to their cart.
4. Review their cart.
5. Proceed to checkout.
6. Place an order.
7. View the order later through Order History.

The account area gives customers a central location for accessing their previous orders.

⸻

👤 Customer Account

Each customer has an account area containing:

My Profile
     │
     ├── Personal information
     │
     ├── Order History
     │
     ├── Settings
     │
     ├── Connect With Us
     │
     └── Log Out

This provides a dedicated space for customers to manage their relationship with the application.

⸻

📱 Responsive Mobile Experience

SD Fashion is built specifically as a mobile application using React Native.

The interface is designed around mobile interactions including:

* Bottom-tab navigation
* Product cards
* Scrollable product sections
* Product detail screens
* Shopping cart interactions
* Account management screens

⸻

🧩 Application Structure

A simplified application structure:

SD Fashion
│
├── Home
│   ├── New Arrivals
│   ├── Trending
│   ├── Collections
│   └── Recommended for You
│
├── General
│   └── All Products
│
├── Cart
│   └── Checkout
│
└── Account
    ├── My Profile
    ├── Order History
    ├── Settings
    ├── Connect With Us
    └── Log Out

⸻

🔄 Product Discovery Flow

                  Home
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
 New Arrivals    Trending    Collections
       │            │            │
       └────────────┼────────────┘
                    ▼
          Recommended For You
                    │
                    ▼
               Product
                    │
                    ▼
           Product Details
                    │
                    ▼
               Add to Cart
⸻

🔐 Security Considerations

The application uses Firebase Authentication to ensure account-specific functionality is associated with authenticated users.

Customer-specific information such as profiles and orders should be protected using appropriate Firestore security rules so users can only access data they are authorized to access.

Supabase Storage access should also be configured according to the intended visibility of product images.

⸻

🚀 Getting Started

Requirements

Before running the application, install:

* Node.js
* npm
* Expo CLI / Expo tooling
* Git

You will also need:

* A Firebase project
* Firebase Authentication configured
* Firestore configured
* A Supabase project
* Supabase Storage configured

⸻

Clone the Repository

git clone https://github.com/ogumsamuel/SDFashion.git

Navigate into the project:

cd SDFashion

Install dependencies:

npm install

⸻

🔑 Environment Configuration

Create the appropriate environment configuration for the project and provide the required Firebase and Supabase credentials.

Do not commit private credentials or secret keys to GitHub.

⸻

▶️ Run the Application

Start the Expo development server:

npx expo start

The application can then be opened using:

* Expo Go
* Android emulator
* iOS simulator
* Development build

depending on the project’s configured environment.

⸻

🧪 Testing

Important areas to test include:

Authentication

* Account creation
* Login
* Logout
* Authenticated sessions

Products

* Product loading
* Categories
* Product details
* Product images
* Recommendations

Cart

* Adding products
* Removing products
* Quantity changes
* Checkout flow

Orders

* Creating orders
* Order history
* Viewing previous orders

Account

* Profile
* Settings
* Social links
* Logout

⸻

📂 Project Development

The application was developed as a customer-facing mobile commerce project, with emphasis on:

* Reusable React Native components
* Structured navigation
* Firebase authentication
* Firestore data management
* Supabase image storage
* Mobile-first user experience
* Product discovery
* Shopping cart functionality
* Customer account management

⸻

👨‍💻 Developer

Ogum Samuel Boniface

Software Developer

GitHub:

https://github.com/ogumsamuel

LinkedIn:

https://www.linkedin.com/in/ogumsamuel

⸻

📄 License

This project was developed as a mobile fashion e-commerce application.

The source code and associated assets should not be reused, redistributed, or commercially modified without appropriate permission from the project owner.

⸻

📌 Project Status

SD Fashion is a customer-focused mobile fashion shopping application featuring product discovery, product details, cart management, checkout, customer accounts, order history, settings, and social connections.

Core Features

* ✅ React Native mobile application
* ✅ Expo
* ✅ TypeScript
* ✅ Expo Router
* ✅ Firebase Authentication
* ✅ Firebase Firestore
* ✅ Supabase Storage
* ✅ Product catalog
* ✅ New Arrivals
* ✅ Trending products
* ✅ Collections
* ✅ Recommended products
* ✅ Product details
* ✅ Shopping cart
* ✅ Checkout flow
* ✅ Customer profiles
* ✅ Order history
* ✅ Settings
* ✅ Social media connections
* ✅ Logout
