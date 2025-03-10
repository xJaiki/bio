import React from "react";

const availableWidgets = [
  { type: "text", name: "Text Widget" },
  { type: "image", name: "Image Widget" },
  { type: "link", name: "Link Widget" },
];

const WidgetMockList = ({ onSelect }) => {
  return (
    <div className="space-y-4">
      {availableWidgets.map((widget) => (
        <button key={widget.type} onClick={() => onSelect(widget.type)} className="w-full p-4 border rounded">
          {widget.name}
        </button>
      ))}
    </div>
  );
};

export default WidgetMockList;
