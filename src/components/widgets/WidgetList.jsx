import React from "react";
import WidgetRenderer from "./WidgetRenderer";

const WidgetList = ({ widgets }) => {
  return (
    <div className="mt-4 space-y-4">
      {widgets.map((widget, index) => (
        <div key={widget.id || index} className="border p-2 rounded">
          <WidgetRenderer widgetType={widget.type} config={widget.config} />
        </div>
      ))}
    </div>
  );
};

export default WidgetList;
