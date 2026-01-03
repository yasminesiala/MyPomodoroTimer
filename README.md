# Pomodoro Timer

A 50/10 Miffy-themed Pomodoro widget with a 50/10 split and detailed subject tracking.

## Built With
- **React 19**: Frontend framework
- **TypeScript**: Logic
- **Tailwind CSS**: UI design
- **Recharts**: Weekly progress visualization
- **Lucide/FontAwesome**: UI iconography

## ow to Run (Local Development)

### 1. Requirements
You don't need a heavy setup! Just a simple web server.
- **VS Code** with the **Live Server** extension (recommended).
- Or **Node.js** installed on your machine.

### 2. Setup
1. Download the project files into a folder.
2. Open the folder in **VS Code**.
3. Run 'npx vite', click the link, and your browser will open the app.

---

## How to add as a Mac App 

To make this feel like a real desktop app:
1. Open **Safari** and go to the address where your app is running (e.g., `http://127.0.0.1:5500`).
2. In the Safari menu bar, go to **File** > **Add to Dock...**.
3. **The App is now in your Dock!** 
   - It will open in its own separate window without the URL bar.
   - You can resize it to be small and keep it in the corner of your screen while you work.

---

## Project Structure
- `App.tsx`: The main timer and logic engine.
- `components/MiffyBunny.tsx`: The mascot display component.
- `components/StatsBoard.tsx`: The Recharts logic for your weekly stats.
- `index.html`: The entry point and styling definitions.
- `types.ts`: Data structures for subjects and sessions.

