import { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import Settings from "./components/Settings";

export default function App() {
  const [view, setView] = useState("chat"); // "chat" or "settings"

  return (
    <div className="app-container">
      {view === "chat" ? (
        <ChatInterface onNavigate={() => setView("settings")} />
      ) : (
        <Settings onNavigate={() => setView("chat")} />
      )}
    </div>
  );
}
