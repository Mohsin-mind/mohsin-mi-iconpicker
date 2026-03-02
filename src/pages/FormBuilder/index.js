import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    basic: true,
    contact: true,
    choice: true,
    other: true,
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Organized element types by category
  const elementCategories = [
    {
      id: "basic",
      name: "Basic Components",
      elements: [
        { id: "heading", label: "Heading", icon: "H" },
        { id: "short-text", label: "Short Text", icon: "≡" },
        { id: "paragraph", label: "Paragraph", icon: "≣" },
        { id: "divider", label: "Divider", icon: "•" },
        { id: "spacer", label: "Spacer", icon: "↕" },
        { id: "page-break", label: "Page Break", icon: "⊞" },
      ],
    },
    {
      id: "contact",
      name: "Contact Components",
      elements: [
        { id: "full-name", label: "Full Name", icon: "⊞" },
        { id: "email", label: "E-Mail", icon: "✉" },
        { id: "address", label: "Address", icon: "📍" },
        { id: "number", label: "Number", icon: "#" },
        { id: "phone", label: "Phone Number", icon: "☎" },
        { id: "date", label: "Date Picker", icon: "📅" },
        { id: "time", label: "Time Picker", icon: "🕒" },
        { id: "url", label: "URL", icon: "↻" },
      ],
    },
    {
      id: "choice",
      name: "Choice",
      elements: [
        { id: "radio", label: "Single Choice", icon: "◉" },
        { id: "checkbox", label: "Multiple Choice", icon: "☑" },
        { id: "select", label: "Dropdown", icon: "▼" },
        { id: "toggle", label: "Toggle", icon: "⊙" },
        { id: "range", label: "Range Slider", icon: "⟺" },
        { id: "picture-choice", label: "Picture Choice", icon: "🖼" },
        { id: "rating", label: "Rating Scale", icon: "★" },
        { id: "likert", label: "Likert Scale", icon: "◎" },
      ],
    },
    {
      id: "other",
      name: "Other",
      elements: [
        { id: "image", label: "Image", icon: "🖼" },
        { id: "video", label: "Video", icon: "▶" },
        { id: "file", label: "File Upload", icon: "📎" },
        { id: "submit", label: "Submit", icon: "↗" },
        { id: "captcha", label: "Captcha", icon: "⟳" },
      ],
    },
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId],
    });
  };

  // Filter elements based on search term
  const getFilteredCategories = () => {
    if (!searchTerm) return elementCategories;

    return elementCategories
      .map((category) => ({
        ...category,
        elements: category.elements.filter((element) =>
          element.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.elements.length > 0);
  };

  const addElement = (type) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      label: `New ${type.replace(/-/g, " ")}`,
      placeholder: "",
      required: false,
      options: ["radio", "checkbox", "select", "picture-choice"].includes(type)
        ? [{ label: "Option 1", value: "option1" }]
        : [],
      columns: type === "address" ? 2 : 1,
    };
    setFormElements([...formElements, newElement]);
    setSelectedElement(newElement);
  };

  const handleDragEnd = (result) => {
    console.log("Drag End Result:", result);
    const { source, destination, draggableId } = result;

    if (!destination) {
      console.log("No destination: Element dropped outside a Droppable area.");
      return;
    }

    if (
      source.droppableId.startsWith("sidebar-") &&
      destination.droppableId === "form-elements"
    ) {
      const [, elementId] = draggableId.split("-");
      const elementType = elementCategories
        .flatMap((category) => category.elements)
        .find((element) => element.id === elementId)?.id;

      if (elementType) {
        console.log("Adding element:", elementType);
        addElement(elementType);
      } else {
        console.log("Element type not found for draggableId:", draggableId);
      }
      return;
    }

    if (
      source.droppableId === "form-elements" &&
      destination.droppableId === "form-elements"
    ) {
      const items = Array.from(formElements);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setFormElements(items);
    }
  };

  const updateElement = (id, updates) => {
    const updatedElements = formElements.map((element) =>
      element.id === id ? { ...element, ...updates } : element
    );
    setFormElements(updatedElements);

    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const deleteElement = (id) => {
    setFormElements(formElements.filter((element) => element.id !== id));
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
  };

  const saveForm = () => {
    const formData = { title: formTitle, elements: formElements };
    localStorage.setItem("formBuilderState", JSON.stringify(formData));
    alert("Form saved successfully!");
  };

  const loadForm = () => {
    const savedState = localStorage.getItem("formBuilderState");
    if (savedState) {
      const { title, elements } = JSON.parse(savedState);
      setFormTitle(title);
      setFormElements(elements);
      alert("Form loaded successfully!");
    } else {
      alert("No saved form found.");
    }
  };

  const previewForm = () => {
    if (formElements.length === 0) {
      alert("Please add at least one form element before previewing.");
      return;
    }
    setPreviewMode(true);
  };

  const handlePreviewBack = () => {
    setPreviewMode(false);
  };

  const handleFormSubmit = (formValues) => {
    console.log("Form submitted with values:", formValues);
    alert("Form submitted successfully!");
    setPreviewMode(false);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "#e0f7fa" : "transparent",
    width: isDragging ? "100%" : "",
    ...draggableStyle,
  });

  const renderElementPreview = (element) => {
    switch (element.type) {
      case "short-text":
        return (
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || element.label}
            disabled
          />
        );
      case "paragraph":
        return (
          <textarea
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || element.label}
            disabled
            rows="3"
          />
        );
      case "select":
        return (
          <select className="w-full p-2 border rounded" disabled>
            <option value="">
              {element.placeholder || "Select an option"}
            </option>
            {element.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {element.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input type="checkbox" disabled className="mr-2" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {element.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );
      case "date":
        return (
          <input type="date" className="w-full p-2 border rounded" disabled />
        );
      case "time":
        return (
          <input type="time" className="w-full p-2 border rounded" disabled />
        );
      case "file":
        return (
          <input type="file" className="w-full p-2 border rounded" disabled />
        );
      case "heading":
        return (
          <div className="w-full p-2">
            <h3 className="text-xl font-bold text-gray-800">{element.label}</h3>
            {element.placeholder && (
              <p className="text-sm text-gray-500">{element.placeholder}</p>
            )}
          </div>
        );
      case "divider":
        return <hr className="my-4 border-t border-gray-300" />;
      case "spacer":
        return <div className="h-8"></div>;
      case "number":
        return (
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || element.label}
            disabled
          />
        );
      case "email":
        return (
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || element.label}
            disabled
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || element.label}
            disabled
          />
        );
      case "address":
        return (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Street Address"
              disabled
            />
            <div
              className={`grid ${
                element.columns === 2 ? "grid-cols-2" : "grid-cols-1"
              } gap-2`}
            >
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="City"
                disabled
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="State"
                disabled
              />
            </div>
            <div
              className={`grid ${
                element.columns === 2 ? "grid-cols-2" : "grid-cols-1"
              } gap-2`}
            >
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="ZIP Code"
                disabled
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Country"
                disabled
              />
            </div>
          </div>
        );
      case "url":
        return (
          <input
            type="url"
            className="w-full p-2 border rounded"
            placeholder={element.placeholder || "https://example.com"}
            disabled
          />
        );
      case "toggle":
        return (
          <div className="flex items-center">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" disabled className="sr-only" />
              <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1"></div>
            </div>
            <span>{element.label}</span>
          </div>
        );
      case "range":
        return (
          <input
            type="range"
            className="w-full"
            disabled
            min={element.min || 0}
            max={element.max || 100}
            step={element.step || 1}
          />
        );
      case "rating":
        return (
          <div className="flex space-x-1">
            {Array.from({ length: element.scale || 5 }, (_, i) => (
              <span key={i} className="text-2xl text-gray-400">
                ★
              </span>
            ))}
          </div>
        );
      case "image":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {element.url ? (
              <img
                src={element.url}
                alt="Uploaded"
                className="max-w-full h-auto"
              />
            ) : (
              <p className="text-gray-500">Image placeholder</p>
            )}
          </div>
        );
      case "video":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {element.url ? (
              <video controls className="max-w-full h-auto">
                <source src={element.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-gray-500">Video placeholder</p>
            )}
          </div>
        );
      case "submit":
        return (
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            disabled
          >
            {element.label || "Submit"}
          </button>
        );
      case "captcha":
        return (
          <div className="border rounded p-4 text-center bg-gray-100">
            <p className="text-gray-500">CAPTCHA verification</p>
          </div>
        );
      case "full-name":
        return (
          <div
            className={`grid ${
              element.columns === 2 ? "grid-cols-2" : "grid-cols-1"
            } gap-2`}
          >
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="First Name"
              disabled
            />
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Last Name"
              disabled
            />
          </div>
        );
      case "likert":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-2 text-sm">Strongly Disagree</th>
                  <th className="p-2 text-sm">Disagree</th>
                  <th className="p-2 text-sm">Neutral</th>
                  <th className="p-2 text-sm">Agree</th>
                  <th className="p-2 text-sm">Strongly Agree</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-sm">Statement 1</td>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <td key={val} className="text-center">
                      <input type="radio" disabled />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "picture-choice":
        return (
          <div className="grid grid-cols-2 gap-2">
            {element.options.map((option, idx) => (
              <div key={idx} className="border rounded p-2 text-center">
                <div className="bg-gray-200 h-20 mb-2 flex items-center justify-center">
                  <span className="text-gray-500">{option.label}</span>
                </div>
                <div className="flex items-center justify-center">
                  <input type="radio" disabled className="mr-2" />
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case "page-break":
        return (
          <div className="border-t-2 border-dashed border-gray-300 py-2 text-center">
            <span className="bg-white px-4 text-sm text-gray-500">
              Page Break
            </span>
          </div>
        );
      default:
        return <p>Unknown element type: {element.type}</p>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {previewMode ? (
        <div className="w-full p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">{formTitle}</h2>
            <div>
              {formElements.map((element) => (
                <div key={element.id} className="mb-4">
                  {renderElementPreview(element)}
                </div>
              ))}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviewBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Back to Editor
                </button>
                <button
                  onClick={() => handleFormSubmit(formElements)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="w-64 bg-white shadow-md p-4 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Components</h2>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Components..."
                    className="w-full p-2 pl-8 border rounded text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              {getFilteredCategories().map((category) => (
                <div key={category.id} className="mb-4">
                  <button
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-indigo-700 mb-2"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span>{category.name}</span>
                    <svg
                      className={`h-4 w-4 transform ${
                        expandedCategories[category.id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedCategories[category.id] ? (
                    <Droppable
                      droppableId={`sidebar-${category.id}`}
                      isDropDisabled={true}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          role="presentation"
                          className={`grid grid-cols-3 gap-2 ${
                            snapshot.isDraggingOver ? "bg-gray-100" : ""
                          }`}
                        >
                          {category.elements.map((element, index) => (
                            <Draggable
                              key={`${category.id}-${element.id}`}
                              draggableId={`${category.id}-${element.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                  role="presentation"
                                  className={`flex flex-col items-center p-2 rounded transition cursor-move ${
                                    snapshot.isDragging
                                      ? "bg-indigo-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded flex items-center justify-center mb-1">
                                    {element.icon}
                                  </div>
                                  <span className="text-xs text-center text-gray-700">
                                    {element.label}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg shadow-md p-6 min-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                  <input
                    type="text"
                    className="w-full text-2xl font-bold border-none focus:outline-none focus:ring-0"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Form Title"
                  />
                  <div className="space-x-2">
                    <button
                      onClick={saveForm}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Save Form
                    </button>
                    <button
                      onClick={loadForm}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Load Form
                    </button>
                  </div>
                </div>
                <div className="overflow-auto max-h-[60vh]">
                  <Droppable droppableId="form-elements">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        role="presentation"
                        className={`space-y-4 min-h-[50vh] p-4 rounded-lg transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-50 border-2 border-dashed border-indigo-500"
                            : "border-2 border-dashed border-gray-300"
                        }`}
                      >
                        {formElements.length === 0 ? (
                          <div className="text-center p-8">
                            <p className="text-gray-500">
                              Add form elements from the components panel
                            </p>
                          </div>
                        ) : (
                          formElements.map((element, index) => (
                            <Draggable
                              key={element.id}
                              draggableId={element.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                  role="presentation"
                                  className={`p-4 border rounded-lg flex justify-between items-start transition-colors ${
                                    selectedElement?.id === element.id
                                      ? "border-indigo-500 bg-indigo-50"
                                      : snapshot.isDragging
                                      ? "border-indigo-300 bg-indigo-100"
                                      : "border-gray-200"
                                  }`}
                                  onClick={() => setSelectedElement(element)}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <span className="font-medium">
                                        {element.label}
                                      </span>
                                      {element.required && (
                                        <span className="text-red-500 ml-1">
                                          *
                                        </span>
                                      )}
                                    </div>
                                    {renderElementPreview(element)}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteElement(element.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                {formElements.length > 0 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={previewForm}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                    >
                      Preview Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          </DragDropContext>
          <div className="w-80 bg-white shadow-md p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-4 text-indigo-700">
              Properties
            </h2>
            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={selectedElement.label}
                    onChange={(e) =>
                      updateElement(selectedElement.id, {
                        label: e.target.value,
                      })
                    }
                  />
                </div>
                {![
                  "heading",
                  "divider",
                  "spacer",
                  "page-break",
                  "image",
                  "video",
                  "submit",
                  "captcha",
                ].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedElement.placeholder || ""}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          placeholder: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
                {![
                  "divider",
                  "spacer",
                  "page-break",
                  "image",
                  "video",
                  "submit",
                  "captcha",
                ].includes(selectedElement.type) && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="required"
                      checked={selectedElement.required}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          required: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="required" className="text-sm font-medium">
                      Required
                    </label>
                  </div>
                )}
                {["heading"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={selectedElement.placeholder || ""}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          placeholder: e.target.value,
                        })
                      }
                      rows="3"
                    />
                  </div>
                )}
                {["radio", "checkbox", "select", "picture-choice"].includes(
                  selectedElement.type
                ) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Options
                    </label>
                    {selectedElement.options.map((option, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          className="flex-1 p-2 border rounded-l"
                          value={option.label}
                          onChange={(e) => {
                            const newOptions = [...selectedElement.options];
                            newOptions[index].label = e.target.value;
                            newOptions[index].value = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "-");
                            updateElement(selectedElement.id, {
                              options: newOptions,
                            });
                          }}
                        />
                        <button
                          className="bg-red-500 text-white px-2 rounded-r"
                          onClick={() => {
                            if (selectedElement.options.length > 1) {
                              const newOptions = selectedElement.options.filter(
                                (_, i) => i !== index
                              );
                              updateElement(selectedElement.id, {
                                options: newOptions,
                              });
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="w-full p-2 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition"
                      onClick={() => {
                        const newOptions = [
                          ...selectedElement.options,
                          {
                            label: `Option ${
                              selectedElement.options.length + 1
                            }`,
                            value: `option${
                              selectedElement.options.length + 1
                            }`,
                          },
                        ];
                        updateElement(selectedElement.id, {
                          options: newOptions,
                        });
                      }}
                    >
                      Add Option
                    </button>
                  </div>
                )}
                {["address", "full-name"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Columns
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedElement.columns}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          columns: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={1}>1 Column</option>
                      <option value={2}>2 Columns</option>
                    </select>
                  </div>
                )}
                {["short-text", "paragraph", "email", "url"].includes(
                  selectedElement.type
                ) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Validation
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedElement.validation || "none"}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          validation: e.target.value,
                        })
                      }
                    >
                      <option value="none">None</option>
                      <option value="email">Email</option>
                      <option value="url">URL</option>
                      <option value="numeric">Numeric</option>
                      <option value="alphanumeric">Alphanumeric</option>
                    </select>
                  </div>
                )}
                {["short-text", "paragraph", "number"].includes(
                  selectedElement.type
                ) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min Length
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selectedElement.minLength || ""}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            minLength: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Length
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selectedElement.maxLength || ""}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            maxLength: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
                {["range"].includes(selectedElement.type) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min Value
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selectedElement.min || 0}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            min: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Value
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selectedElement.max || 100}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            max: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Step
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selectedElement.step || 1}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            step: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
                {["rating"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Scale
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={selectedElement.scale || 5}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          scale: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value={3}>3 Stars</option>
                      <option value={5}>5 Stars</option>
                      <option value={10}>10 Stars</option>
                    </select>
                  </div>
                )}
                {["image", "video"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedElement.url || ""}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}
                {["submit"].includes(selectedElement.type) && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={selectedElement.label}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          label: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                Select an element to edit its properties
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FormBuilder;
