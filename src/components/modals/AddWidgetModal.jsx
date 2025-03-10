import { useState } from "react";
import WidgetMockList from "../widgets/WidgetMockList";
import WidgetEditor from "../widgets/WidgetEditor";

const AddWidgetModal = ({ profileId, onClose, onWidgetAdded }) => {
  const [step, setStep] = useState("select"); // "select" or "customize"
  const [selectedWidgetType, setSelectedWidgetType] = useState(null);

  const handleSelectWidget = (type) => {
    setSelectedWidgetType(type);
    setStep("customize");
  };

  const handleSave = (config) => {
    const newWidget = { type: selectedWidgetType, config, profile_id: profileId };
    onWidgetAdded(newWidget);
    onClose();
  };

return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-2">
        <div className="flex items-center mb-2">
            <button onClick={onClose} className="text-red-500 mr-2">Close</button>
            {step === "select" ? (
                <h2 className="text-xl font-bold">Select a Widget</h2>
            ) : (
                <h2 className="text-xl font-bold">Customize Your Widget</h2>
            )}
        </div>
        {step === "select" ? (
            <WidgetMockList onSelect={handleSelectWidget} />
        ) : (
            <WidgetEditor
                widgetType={selectedWidgetType}
                onSave={handleSave}
                onBack={() => setStep("select")}
            />
        )}
    </div>
);
};

export default AddWidgetModal;
