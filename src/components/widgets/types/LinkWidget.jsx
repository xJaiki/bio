import React from "react";

const LinkWidget = ({ config, preview }) => {
  return (
    <div className={`p-4 border rounded ${preview ? "bg-gray-100" : ""}`}>
      {config.url ? <a href={config.url}>{config.url}</a> : "Link Preview"}
    </div>
  );
};

export default LinkWidget;
