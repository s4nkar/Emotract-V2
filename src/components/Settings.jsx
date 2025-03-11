import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Sun, Moon, Bell, User, Lock, LogOut } from "lucide-react";
import "./Settings.css";

export default function Settings({ onNavigate }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-6 dark:bg-gray-800">
        {/* Back Button */}
        <button onClick={onNavigate} className="back-button mb-4">
          ⬅ Back to Chat
        </button>

        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        {/* Profile Section */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              <img
                src={profilePhoto || "https://via.placeholder.com/150"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">John Doe</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">john.doe@example.com</span>
            </div>
          </div>
          <button className="text-blue-500 hover:underline">
            Edit
          </button>
        </div>

        {/* Upload Profile Photo */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <span>Change Profile Photo</span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="text-sm text-blue-500 cursor-pointer"
          />
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </div>
          <Switch
            checked={notifications}
            onChange={setNotifications}
            className={`${notifications ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable notifications</span>
            <span className={`${notifications ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`} />
          </Switch>
        </div>

        {/* Privacy */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <span>Privacy</span>
          </div>
          <button className="text-blue-500 hover:underline">Manage</button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>Dark Mode</span>
          </div>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? "bg-blue-500" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span className={`${darkMode ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`} />
          </Switch>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-red-500">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
          <button className="text-red-500 hover:underline">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
