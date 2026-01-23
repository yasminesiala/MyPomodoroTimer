# Pomodoro Timer

<p align="center">
  <img src="https://github.com/user-attachments/assets/99d2e8fc-49ff-44f3-af78-844737234da5"
       alt="Timer screen"
       height="420" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/73743a80-f7ac-440e-b4da-bef84c3c4058"
       alt="Subject tracking screen"
       height="420" />
</p>

<p align="center">
A 50/10 Miffy-themed Pomodoro timer with subject tracking.<br />
Threw this together quickly, still a work in progress.
It stores the study stats now & there's a weekly/monthly view. 
</p>

## Built With
- **React 19**: Frontend framework
- **TypeScript**: Logic
- **Tailwind CSS**: UI design
- **Recharts**: Weekly progress visualization
- **Lucide/FontAwesome**: UI iconography

## How to Run (Local Development)

### 1. Requirements
You don't need a heavy setup! Just a simple web server.
- **VS Code** with the **Live Server** extension (recommended).
- Or **Node.js** installed on your machine.

### 2. Setup
1. Download the project files into a folder.
2. Open the folder in **VS Code**.
3. Run 'npx vite', click the link, and your browser will open the app.

---

## How to add as an Application

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

