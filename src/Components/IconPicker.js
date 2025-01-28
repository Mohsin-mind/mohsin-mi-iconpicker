import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import "../css/iconpicker/iconpicker.css";
import "../css/iconpicker/index.css";

const IconPicker = ({
  value = "",
  onChange = () => {},
  adjustPosition = { top: 0, left: 0 },
  showSearch = true,
  closeOnSelect = true,
  isMulti = false,
  buttonStyle = `flex items-center justify-center h-[35px] w-[35px] rounded-[8px] border border-[#eaecf0]`,
  zIndexPopup = 50,
  popupStyle = `bg-white border border-gray-300 shadow-lg rounded popup-container min-w-[367px]`,
  gridColumns = 5,
  gridRows = 4,
  iconBgColor = `bg-gray-200`,
  iconSelectedBgColor = `bg-blue-200`,
  iconHeight = 65,
  iconWidth = 65,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPositionSet, setIsPositionSet] = useState(false);
  const [icons, setIcons] = useState([]);
  const [popupPosition, setPopupPosition] = useState({
    top: adjustPosition?.top || 0,
    left: adjustPosition?.left || 0,
  });
  const [selectedIcons, setSelectedIcons] = useState([value]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const inputRef = useRef(null);

  const colors = [
    { textColor: "text-black", bgColor: "bg-black" },
    { textColor: "text-red-500", bgColor: "bg-red-500" },
    { textColor: "text-blue-500", bgColor: "bg-blue-500" },
    { textColor: "text-green-500", bgColor: "bg-green-500" },
    { textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
    { textColor: "text-purple-500", bgColor: "bg-purple-500" },
    { textColor: "text-pink-500", bgColor: "bg-pink-500" },
    { textColor: "text-orange-500", bgColor: "bg-orange-500" },
    { textColor: "text-teal-500", bgColor: "bg-teal-500" },
    { textColor: "text-gray-500", bgColor: "bg-gray-500" },
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const IconsPerPage = gridColumns * gridRows;
  // Function to update the popup position based on button's position
  const updatePopupPosition = () => {
    if (!buttonRef?.current) {
      return;
    }
    const buttonRect = buttonRef?.current?.getBoundingClientRect();
    const popupRect = popupRef?.current?.getBoundingClientRect();
    const windowHeight = window?.innerHeight;
    const windowWidth = window?.innerWidth;

    let newPosition = {
      top: buttonRect.bottom + window.scrollY + (adjustPosition?.top || 0),
      left: buttonRect.left + window.scrollX + (adjustPosition?.left || 0),
    };

    if (!popupRect || !buttonRect || !windowHeight || !windowWidth) {
      return;
    }
    if (buttonRect.bottom + popupRect.height > windowHeight + window?.scrollY) {
      newPosition.top =
        buttonRect.top +
        window?.scrollY -
        popupRect.height -
        (adjustPosition?.top || 0);

      if (buttonRect.bottom > windowHeight + window?.scrollY) {
        setIsPopupVisible(false);
        setIsPositionSet(false);
        return;
      }
    }
    if (buttonRect.right + popupRect.width > windowWidth + window?.scrollX) {
      newPosition.left =
        buttonRect.left +
        window?.scrollX -
        popupRect.width -
        (adjustPosition?.left || 0);
    }

    setPopupPosition(newPosition);
    setIsPositionSet(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setShowColorPicker(false);
    setIsPositionSet(false);
  };

  useEffect(() => {
    if (value) {
      const parts = value.split(" ");
      const iconName = parts[0] || "";
      const iconColor = parts[1] || "text-black";
        setSelectedColor(colors.find((color) => color.textColor === iconColor) || colors[0]);
        setSelectedIcons(Array.isArray(iconName) ? iconName : [iconName]);
      }
  }, [value]);

  useEffect(() => {
    if (!isPopupVisible) return;
    // Update popup position initially
    updatePopupPosition();

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  
    // Handle scroll event
    const handleScroll = () => {
      updatePopupPosition();
    };
  
    // Handle wheel event
    const handleWheel = () => {
      handleClosePopup();
    };

    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event?.target) &&
        !event.target.closest(".popup-container")
      ) {
        handleClosePopup();
        setSearchQuery(""); // Clear search input on outside click
      }
    };
  
    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  // Filter icons based on search query
  const filterIcons = (query) =>
    icons &&
    icons
      .map((iconName) => {
        // Check if the icon name contains the query
        const iconMatch = iconName
          .toLowerCase()
          .includes("mi-icon-" + query.toLowerCase());

        if (iconMatch) {
          return iconName;
        }

        return null; // Return null if no match
      })
      .filter((icon) => icon !== null); // Filter out null values

  const extractIconPaths = () => {
    const iconsMap = [];

    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        Array.from(sheet.cssRules || []).forEach((rule) => {
          if (rule.selectorText?.startsWith(".mi-icon-")) {
            const iconClass = rule?.selectorText.split("::")[0]?.split(".")[1]; // Getting the icon name

            if (!iconClass) return; // Skip if no icon class
            iconsMap.push(iconClass);
          }
        });
      } catch (err) {
        console.warn("Error accessing stylesheet rules:", err);
      }
    });

    // Convert iconsMap to an array of icons
    return iconsMap && iconsMap.length > 0 ? iconsMap : null;
  };

  useEffect(() => {
    setTimeout(() => {
      const icons = extractIconPaths();
      setIcons(icons);
    }, 1000); // Delay to ensure stylesheets are loaded
  }, []);

  const filteredIcons = filterIcons(searchQuery);
  const totalPages = Math.ceil(filteredIcons.length / IconsPerPage);
  const startIdx = (currentPage - 1) * IconsPerPage;
  const endIdx = startIdx + IconsPerPage;
  const iconsToDisplay = filteredIcons.slice(startIdx, endIdx);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) =>
      Math.max(1, Math.min(totalPages, prevPage + direction))
    );
  };

  const handleIconClick = (icon) => {
    if (isMulti) {
      const updatedSelection = selectedIcons?.includes(icon)
        ? selectedIcons.filter((i) => i !== icon)
        : [...selectedIcons, icon];

      setSelectedIcons(updatedSelection);
      onChange(updatedSelection);
    } else {
      const isSelected = selectedIcons?.includes(icon);
      const updatedSelection = isSelected ? [] : [icon];

      setSelectedIcons(updatedSelection);
      onChange(updatedSelection[0] || null);

      if (closeOnSelect) {
        setIsPopupVisible(false);
      }
    }
  };


  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const classNames = (...classes) => classes.filter(Boolean).join(" ");
  // Portal popup rendering function
  const renderPopup = () => (
    <div
      ref={popupRef}
      className={classNames(
        `absolute ${popupStyle} ${
          isPositionSet ? "" : "invisible"
        } fadeInAnimation`
      )}
      style={{
        top: `${popupPosition?.top}px`,
        left: `${popupPosition?.left}px`,
        zIndex: zIndexPopup,
      }}
    >
      <div className="flex flex-col items-center p-4">
        <div className="relative flex mb-5 w-full">
          {showSearch && (
            <>
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="mb-2 py-2 text-base border-gray-300 border-b outline-none w-full"
              ref={inputRef}
            />
            {searchQuery && (
              <button
                onClick={handleSearchClear}
                className="absolute -right-1 top-1/2 transform -translate-y-1/2 text-gray-500"
                type="button"
              >
                <span className="mi-icon-x-close"></span>
              </button>
            )}
            </>
          )}
        </div>
        {iconsToDisplay?.length > 0 && (
          <div className="w-full flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2">
              <span>
                {currentPage} / {totalPages}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center border-none bg-gray-200 text-gray-600 rounded cursor-pointer px-2 py-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50 outline-none"
                type="button"
              >
                <span className="mi-icon-arrow-narrow-left"></span>
              </button>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center border-none bg-gray-200 text-gray-600 rounded cursor-pointer px-2 py-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50 outline-none"
                type="button"
              >
                <span className="mi-icon-arrow-narrow-right"></span>
              </button>

              <div className="relative">
                <div
                  className={classNames(
                    "w-6 h-6 rounded-full border cursor-pointer flex items-center justify-center",
                    selectedColor.bgColor
                  )}
                  onClick={() => setShowColorPicker((prev) => !prev)}
                ></div>
                {showColorPicker && (
                  <div className="absolute min-w-[165px] top-9 left-[-70px] bg-white shadow-2xl rounded-lg p-2 grid grid-cols-5 gap-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className={classNames("w-6 h-6 rounded-full cursor-pointer", color.bgColor)}
                        onClick={() => handleColorSelect(color)}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {iconsToDisplay?.length === 0 ? (
          <div className="text-gray-500">No icons found</div>
        ) : (
          <div
            className={`grid gap-[2px] w-fit`}
            style={{
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            }}
          >
            {iconsToDisplay.map((icon, index) => (
              <div
                key={index}
                className={classNames(`flex justify-center items-center cursor-pointer group overflow-hidden rounded-[4px]
                   hover:bg-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-gray-500 ${
                     selectedIcons?.includes(
                       `${icon} ${selectedColor.textColor}`
                     )
                       ? iconSelectedBgColor
                       : iconBgColor
                   } hover:bg-gray-300 group`)}
                style={{ height: `${iconHeight}px`, width: `${iconWidth}px` }}
                onClick={() =>
                  handleIconClick(icon + " " + selectedColor.textColor)
                }
                title={icon?.replace('mi-icon-', '')}
              >
                <span
                  className={classNames(
                    icon,
                    selectedColor.textColor,
                    "text-center text-xl group-hover:scale-150 transition-all duration-500",
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (isMulti) {
      const updatedIcons = selectedIcons.map((icon) => {
        const [iconName] = icon.split(" ");
        return `${iconName} ${color.textColor}`;
      });
  
      setSelectedIcons(updatedIcons);
      onChange(updatedIcons);
    } else if (selectedIcons.length > 0) {
      const [iconName] = selectedIcons[0].split(" ");
      const updatedIcon = `${iconName} ${color.textColor}`;
      setSelectedIcons([updatedIcon]);
      onChange(updatedIcon);
    }
    setShowColorPicker(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsPopupVisible(!isPopupVisible)}
        className={
          buttonStyle +
          `${
            selectedIcons.length && selectedIcons[0]
              ? "border-transparent border-none"
              : ""
          }`
        }
        style={{ outline: "none" }}
        ref={buttonRef}
        type="button"
      >
        {selectedIcons && selectedIcons[0] ? (
          <span
            className={`${
              selectedIcons[0] ? selectedIcons[0] : selectedIcons[0]
            }
            ${selectedColor.textColor}
             text-xl`}
          />
        ) : (
          <span className={`mi-icon-upload-01 text-xl ${selectedColor.textColor}`} />
        )}
      </button>
      {isPopupVisible && ReactDOM.createPortal(renderPopup(), document.body)}
    </div>
  );
};

IconPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  adjustPosition: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  showCategory: PropTypes.bool,
  showSearch: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  isMulti: PropTypes.bool,
  noSelectedPlaceholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  buttonStyle: PropTypes.string,
  zIndex: PropTypes.number,
};

export default IconPicker;
