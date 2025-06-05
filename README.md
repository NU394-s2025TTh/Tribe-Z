# DoughJo: Your One-Stop Shop for Crafting World-Class Pizza at Home

## Project Overview
Tired of mediocre pizza? **Perfect the art of homemade pizza** with **DoughJo**, your all-in-one web app for crafting pizzeria-quality pies with ease. No more guesswork—just perfect, homemade pizza every time. 
- **Curated Recipes & Tools** – Easily access delicious recipes, vetted - equipment, and consolidated ingredient lists
- **Effortless Shopping** – Find and purchase the best tools and ingredients with just a few clicks
- **Step-by-Step Mastery** – Learn foolproof techniques to stretch, top, and bake like a pro

![Screenshot of DoughJo home page](pizza/public/ui/DoughJo-Home-Page-Screenshot.png)

## Application Link
Visit DoughJo at [pizza-app-394.web.app](https://pizza-app-394.web.app/). 

In order to be able to view and buy fresh ingredients or pizza-making equipment, you'll need to log in with Google using the "Sign In" button in the top left corner of our website. Otherwise, all other site features are available even without log in.

## Project Management
Click [here](https://github.com/orgs/NU394-s2025TTh/projects/6/views/1) to access our project backlog. The backlog is split into 2 different boards, the ["User Story Backlog"](https://github.com/orgs/NU394-s2025TTh/projects/6/views/1) and the ["Task Backlog"](https://github.com/orgs/NU394-s2025TTh/projects/6/views/7). 

The User Story backlog contains user scenarios and stories as issues. Issues for scenarios have their corresponding stories listed as sub-issues. Issues for stories display a prime number representing the size of the story.   

The Task backlog contains any technical work items completed by team members and identifies the primary tribe member who was responsible for implementing that work item. Any non-technical work items (such as client communication, product research, UI design, etc.) were instead communicated between tribe members and in written tribe meeting notes. See the subheading 'Additional Information and Documentation' below for where to find these meeting notes. 

## Build & Deployment

### 🧱 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase CLI**:  
  ```bash
  npm install -g firebase-tools
  ```
- **Nx CLI** (optional but helpful):  
  ```bash
  npm install -g nx
  ```
- **Google account** with access to the Firebase project

---

### 📦 Software Dependencies

From the root of the monorepo, install all dependencies:

```bash
npm install
```

Key libraries include:

- `@nrwl/react`
- `firebase`
- `react-router-dom`
- `@mui/material`
- `dotenv` (optional for env variables)
- `@nrwl/node` (for Firebase functions if integrated with Nx)

---

### 🧪 Run the App Locally (Frontend + Functions)

#### 1. Serve the Frontend (`pizza`)

```bash
nx serve pizza
```

The app will be available at: [http://localhost:4200](http://localhost:4200)

#### 2. Watch and Build Cloud Functions

**If using raw Firebase setup:**

```bash
cd functions
npm run build:watch
```

> Add this script to `functions/package.json`:
> ```json
> "scripts": {
>   "build:watch": "tsc --watch"
> }
> ```

**If using Nx-managed functions:**

```bash
nx build functions --watch
```

This will recompile functions on every code change.

#### 3. Run Firebase Emulators

To emulate backend functions (and optionally hosting):

```bash
firebase emulators:start
```

Make sure your `firebase.json` includes:

```json
{
  "hosting": {
    "public": "dist/apps/pizza",
    "rewrites": [{ "source": "**", "function": "yourFunctionName" }]
  },
  "functions": {
    "source": "functions"
  }
}
```

---

### 🏗 Build for Production

#### Frontend

```bash
nx build pizza --configuration=production
```

Output: `dist/apps/pizza`

#### Functions

**If using plain Firebase:**

```bash
cd functions
npm run build
```

**If using Nx-managed:**

```bash
nx build functions
```

Ensure `functions/package.json` includes:

```json
"main": "lib/index.js"
```

---

### 🚀 Deploy to Firebase Hosting and Functions

Deploy both frontend and backend to Firebase:

```bash
firebase deploy --only hosting,functions
```

---

### ✅ Quick Command Reference

| Task                        | Command                                      |
|-----------------------------|----------------------------------------------|
| Serve frontend              | `nx serve pizza`                             |
| Watch & build functions     | `nx build functions --watch` or `npm run build:watch` |
| Run Firebase locally        | `firebase emulators:start`                   |
| Build frontend for prod     | `nx build pizza --configuration=production`  |
| Build backend functions     | `nx build functions`                         |
| Deploy frontend + backend   | `firebase deploy --only hosting,functions`   |


## Additional Information and Documentation
You can learn more about the behind-the-scenes design and development process of DoughJo throughout the following documentation found in this repository:

[Documentation Overview](docs/Home.md)\
[Architecture Overview](docs/Architecture-Overview.md)\
[Organizational Practices](docs/Organizational-Practices.md)\
[Development Practices](docs/Development-Practices.md)\
[Client Information](docs/Client-Information.md)\
[Backlog](docs/Backlog.md)

You can access our day-to-day meeting notes and documents at the following Google Drive links:

[Tribe Google Drive Folder](https://drive.google.com/drive/folders/1_gJ4Z9EAXGhxvh53fvZtDEVC9etsvMdk?usp=sharing)\
[Tribe Meeting Notes](https://docs.google.com/document/d/1Uqcr_zaJSmKHLNT8eJ4DopKrVTxgoCXqTyZuMeAjSwU/edit?tab=t.0#heading=h.l8i64pgdxonv)\
[Client Meeting Notes](https://drive.google.com/drive/folders/1ECqC5RHikWsLMxAY9um4lr84YafrYQIv?usp=drive_link)

## Acknowledgements
Big thanks to:
- Our teaching staff, Prof. Todd Warren and TA Paula Kayongo, for their constant guidance and support
- Our clients, Bob Rapp and Ian Gibbs, for their great communication and mentorship

## Attribution
Two teams, Team Green and Team Purple, worked together as a tribe to develop this project. 

### Product Owners
| Team   | Name           |
| ------ | -------------- |
| Purple | Eric Polanski  |
| Green  | Joanna Soltys  |

### Architects
| Team   | Name           |
| ------ | -------------- |
| Purple | Ashwin Baluja  |
| Green  | Anthony Behery |

### Developers

| Team   | Name           |
| ------ | -------------- |
| Green  | Ludi Yu        |
| Purple | Aanand Patel   |
| Purple | Laura Felix    |
| Green  | David Park     |
| Green  | Aidan Goodrow  |
