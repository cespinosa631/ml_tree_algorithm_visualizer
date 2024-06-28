import React, { useState } from "react";
import "../guiCanvas.css";
import "./setting.css";
const PopupWindow = ({ onClose }) => {
  // State variables for point settings
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [pointSize, setPointSize] = useState(4); // Default point size
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // Default background color

  // Function to handle saving the settings and closing the popup
  const handleSaveSettings = () => {
    // Save the settings here (e.g., pass them to a function in the parent component)
    // You can access red, green, blue, pointSize, and backgroundColor here
    // For simplicity, I'm just closing the popup in this example
    onClose();
  };

  return (
    <div className="popup">
      <h2>Point Settings</h2>
      {/* RGB sliders for point color */}
      <label>Point Color:</label>
      <div>
        <label>Red:</label>
        <input
          type="range"
          min="0"
          max="255"
          value={red}
          onChange={(e) => setRed(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Green:</label>
        <input
          type="range"
          min="0"
          max="255"
          value={green}
          onChange={(e) => setGreen(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Blue:</label>
        <input
          type="range"
          min="0"
          max="255"
          value={blue}
          onChange={(e) => setBlue(parseInt(e.target.value))}
        />
      </div>

      {/* Slider for point size */}
      <label>Point Size:</label>
      <input
        type="range"
        min="1"
        max="10"
        value={pointSize}
        onChange={(e) => setPointSize(parseInt(e.target.value))}
      />

      {/* Color picker for background color */}
      <label>Background Color:</label>
      <input
        type="color"
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
      />

      {/* Button to save settings */}
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

// Export PopupWindow component
export { PopupWindow };

export default PopupWindow;
