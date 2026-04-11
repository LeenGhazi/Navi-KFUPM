# 📍 Navi-KFUPM

Navi-KFUPM is a web-based campus navigation and information system designed to support the KFUPM community, including students, faculty members, visitors, and university administrators. The primary goal of the system is to simplify navigation across the university campus and provide centralized access to essential campus services and information.


Navi-KFUPM aims to simplify navigation inside the KFUPM campus by offering:

- Interactive campus map include search and filter for building and facilities
- Route generation between locations
- Detailed information about campus facilities
- Bus routes integration especifically for female students
- Light/Dark mode support
- User accounts: login and signup

This project is developed as part of the SWE363 Web Engineering course.


# Web Overview
### 🏠 Home Page
Entry point of the application where all the pages are visible in the navigation bar. The user can also select the login pop-up page to login and signup. Additionally, a theme toggle is added for more personalized experience.

### 👤 Account / User Page
Displays a user-specific features, access to navigation tools especifically in the map page. More personalized experience

### 🗺️ Map Page
This is the core feature of the system where the user can display campus buildings, restaurants, cafes, parking, etc. It provides a filtering service and path navigation displayed on the map.

### 🛠️ Admin Page
For KFUPM administrators, they can manage locations, services, and complaints related to the content displayed on the web.

### ⚙️ Technical Team Page
For developers/maintainers, they can monitor, update the system, mand communicate with the KFUPM Administrators.

### ℹ️ About Page
Provides information about the project idea and detailed information about the purpsose of the system.

# ⚙️ Installation & Setup
Follow these steps to run the project locally:

1️⃣ Clone the Repository

```
git clone https://github.com/LeenGhazi/Navi-KFUPM.git
```
```
cd Navi-KFUPM/navi-kfupm-react
```

2️⃣ Install Dependencies
```
npm install
```
```
npm install -D tailwindcss @tailwindcss/vite
```
```
npm install @radix-ui/react-dialog
```
3️⃣ Run the Development Server
```
npm run dev
```
4️⃣ Open in Browser
```
Open http://localhost:PORT
```

# ▶️ Usage Instructions & Examples

### 🔹 How to Use the Application

1. Open the application in your browser using:
```
http://localhost:5173
```

2. From the Home Page:
- Use the navigation bar to explore different pages  
- Click login to access your account or sign up  

3. Use the Map Page:
- View campus buildings and services  
- Apply filters to find specific locations  
- Select locations to view details  

4. Explore additional features:
- Admin and Technical pages (restricted access)  
- About page for project details  

---

### 💡 Example Use Cases

**📍 Finding a Building**
- Open the Map Page  
- Use search or filters  
- Click on the building to view details  

**🚌 Using Bus Routes**
- Open the Bus Routes page  
- Select a route  
- View route details and stops on the map  

**👤 Using the System as a Registered User**
- Login or signup  
- Access personalized features  

---

# 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| Leen AlMjnouni | Frontend Developer | Developed map features and UI components, implemented About page, and handled admin/technical interface updates |
| Asma Alghamdi | Frontend Developer | Implemented bus routes, announcements, complaints, authentication (login/signup), and user profile features |
| Rawan Alzahrani | Frontend Developer | Developed admin and technical dashboards including requests, complaints management, path approvals, filters, and user management |