import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import '@fortawesome/fontawesome-svg-core/styles.css';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fab, fas, far);

const IconPickerTest = ({
  icons = {},
  value = '',
  onChange = () => {},
  adjustPosition = { top: 0, left: 0 },
  showCategory = true,
  showSearch = true,
  closeOnSelect = true,
  isMulti = false,
  noSelectedPlaceholder,
  buttonStyle = `flex items-center justify-center h-[35px] w-[35px] rounded-l-[8px] border border-[#eaecf0]`,
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
  const [popupPosition, setPopupPosition] = useState({
    top: adjustPosition?.top || 0,
    left: adjustPosition?.left || 0,
  });
  const [selectedIcons, setSelectedIcons] = useState([value]);

  const buttonRef = useRef(null);
  const popupRef = useRef(null);
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
    // Check if the popup will fit below the viewport
    if (buttonRect.bottom + popupRect.height > windowHeight + window?.scrollY) {
      // Move popup to above the button if it goes out of view
      newPosition.top =
        buttonRect.top +
        window?.scrollY -
        popupRect.height -
        (adjustPosition?.top || 0);
      // hide the popup if the click element out of the viewport.
      if (buttonRect.bottom > windowHeight + window?.scrollY) {
        setIsPopupVisible(false);
        setIsPositionSet(false);

        return;
      }
    }
    if (buttonRect.right + popupRect.width > windowWidth + window?.scrollX) {
      // Move popup on the button's left if no view space on the right.
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
    setIsPositionSet(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event?.target) &&
        !event.target.closest('.popup-container')
      ) {
        handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Update popup position when scrolling
    if (!isPopupVisible) return;

    updatePopupPosition();
    window.addEventListener('wheel', handleClosePopup, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleClosePopup);
    };
  }, [isPopupVisible]);

  const categories = Object.keys(icons);

  const filterIcons = (searchQuery, selectedCategory) => {
    const allIcons =
      selectedCategory === 'All'
        ? Object.values(icons).flat()
        : icons[selectedCategory] || [];

    return allIcons.filter((icon) =>
      icon?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = filterIcons(searchQuery, selectedCategory);
  const totalPages = Math.ceil(filteredIcons.length / IconsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) =>
      Math.max(1, Math.min(totalPages, prevPage + direction))
    );
  };

  const startIdx = (currentPage - 1) * IconsPerPage;
  const endIdx = startIdx + IconsPerPage;
  const iconsToDisplay = filteredIcons.slice(startIdx, endIdx);

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
  const classNames = (...classes) => classes.filter(Boolean).join(' ');
  // Portal popup rendering function
  const renderPopup = () => (
    <div
      ref={popupRef}
      className={classNames(
        `absolute ${popupStyle} ${isPositionSet ? "" : "invisible"}`
      )}
      style={{
        top: `${popupPosition?.top}px`,
        left: `${popupPosition?.left}px`,
        zIndex: zIndexPopup,
      }}
    >
      <div className="flex flex-col items-center p-4">
        <div className="flex flex-col mb-5 w-full">
          {showSearch && (
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="mb-2 py-2 text-base border-gray-300 border-b outline-none"
            />
          )}
          {showCategory && (
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 text-base border-gray-300 border-b bg-transparent outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
        {iconsToDisplay?.length > 0 && (
          <div className="w-full flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="border-gray-300 border-b w-8 text-right">
                {currentPage}
              </span>
              <span>/ {totalPages}</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1}
                className="border-none bg-gray-200 text-gray-600 rounded cursor-pointer mx-2 px-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50 outline-none"
                type="button"
              >
                <FontAwesomeIcon icon="angle-left" />
              </button>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === totalPages}
                className="border-none bg-gray-200 text-gray-600 rounded cursor-pointer px-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50 outline-none"
                type="button"
              >
                <FontAwesomeIcon icon="angle-right" />
              </button>
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
                   hover:bg-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-gray-500 hover:rounded-[10px] ${
                     selectedIcons?.includes(icon)
                       ? iconSelectedBgColor
                       : iconBgColor
                   }`)}
                style={{ height: `${iconHeight}px`, width: `${iconWidth}px` }}
                onClick={() => handleIconClick(icon)}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={classNames(
                    `text-[20px] transform transition duration-200 group-hover:text-gray-600 group-hover:scale-200 ${
                      selectedIcons?.includes(icon)
                        ? "text-blue-800"
                        : "text-gray-800"
                    }`
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='relative'>
      <button
        onClick={() => setIsPopupVisible(!isPopupVisible)}
        className={buttonStyle}
        style={{outline: 'none'}}
        ref={buttonRef}
        type='button'
      >
        <FontAwesomeIcon
          icon={
            selectedIcons[0] || noSelectedPlaceholder || 'arrow-up-from-bracket'
          }
          size='lg'
          className='text-gray-800'
        />
      </button>
      {isPopupVisible && ReactDOM.createPortal(renderPopup(), document.body)}
    </div>
  );
};

IconPickerTest.propTypes = {
  icons: PropTypes.object,
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

export default IconPickerTest;
