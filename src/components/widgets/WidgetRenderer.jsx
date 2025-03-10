import TextWidget from "./types/TextWidget";
import ImageWidget from "./types/ImageWidget";
import LinkWidget from "./types/LinkWidget";

const WidgetRenderer = ({ widgetType, config }) => {
  switch(widgetType) {
    case "text":
      return <TextWidget config={config} preview />;
    case "image":
      return <ImageWidget config={config} preview />;
    case "link":
      return <LinkWidget config={config} preview />;
    default:
      return <div>Preview not available</div>;
  }
};

export default WidgetRenderer;
