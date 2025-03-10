const ImageWidget = ({ config, preview }) => {
  return (
    <div className={`p-4 border rounded ${preview ? "bg-gray-100" : ""}`}>
      {config.url ? <img src={config.url} alt="Preview" className="w-full h-auto" /> : "Image Preview"}
    </div>
  );
};

export default ImageWidget;
