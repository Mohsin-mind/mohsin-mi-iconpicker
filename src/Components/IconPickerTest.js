import React, { useEffect, useRef, useState } from 'react';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fab, fas, far);

const IconsPerPage = 20;

const IconPickerTest = ({
  icons = {},
  onChange = () => {},
  adjustPosition = { top: 36, left: 0 },
  showCategory = true,
  showSearch = true,
  closeOnSelect = true,
  isMulti = false,
  noSelectedPlaceholder = ['fa-arrow-up-from-bracket'],
  buttonStyle = `flex items-center justify-center h-[35px] w-[35px] rounded-l-[8px] border border-[#eaecf0]`,
  zIndex = 50,
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState(adjustPosition);
  const [selectedIcons, setSelectedIcons] = useState(noSelectedPlaceholder);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const handleOpenPopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !event.target.closest('.popup-container')
      ) {
        handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buttonRef]);

  useEffect(() => {
    if (isPopupVisible && buttonRef.current && popupRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            const windowHeight = window?.innerHeight;
            const popupRect = popupRef.current?.getBoundingClientRect();

            const newPosition = {
              ...adjustPosition,
              top:
                popupRect?.bottom > windowHeight
                  ? -popupRef.current?.offsetHeight
                  : adjustPosition.top,
            };

            setPopupPosition(newPosition);
          }
        },
        {
          threshold: 1.0,
        }
      );

      if (popupRef.current && isPopupVisible) {
        observer.observe(popupRef.current); // Observe the popup if it's shown
      }

      return () => {
        if (buttonRef.current) {
          observer.unobserve(buttonRef.current);
        }
      };
    }
  }, [isPopupVisible, adjustPosition]);

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

  return (
    <div className='relative'>
      <button
        onClick={handleOpenPopup}
        className={buttonStyle}
        ref={buttonRef}
        type='button'
      >
        <FontAwesomeIcon
          icon={selectedIcons[0] || 'arrow-up-from-bracket'}
          size='lg'
          className='text-gray-800'
        />
      </button>
      {isPopupVisible && (
        <div
          ref={popupRef}
          className={`absolute bg-white border border-gray-300 shadow-lg rounded z-${zIndex} popup-container min-w-[367px]`}
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <div className='flex flex-col items-center p-4'>
            <div className='flex flex-col mb-5 w-full'>
              {showSearch && (
                <input
                  type='text'
                  placeholder='Search icons...'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='mb-2 py-2 text-base border-gray-300 border-b outline-none'
                />
              )}
              {showCategory && (
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className='py-2 text-base border-gray-300 border-b bg-transparent outline-none'
                >
                  <option value='All'>All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {iconsToDisplay.length > 0 && (
              <div className='w-full flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='border-gray-300 border-b w-8 text-right'>
                    {currentPage}
                  </span>
                  <span>/ {totalPages}</span>
                </div>
                <div className='flex items-center'>
                  <button
                    onClick={() => handlePageChange(-1)}
                    disabled={currentPage === 1}
                    className='bg-transparent border-none bg-gray-200 text-gray-600 rounded cursor-pointer mx-2 px-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50'
                    type='button'
                  >
                    <FontAwesomeIcon icon='angle-left' />
                  </button>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === totalPages}
                    className='bg-transparent border-none bg-gray-200 text-gray-600 rounded cursor-pointer px-2 transition-colors duration-300 hover:bg-gray-200 disabled:opacity-50'
                    type='button'
                  >
                    <FontAwesomeIcon icon='angle-right' />
                  </button>
                </div>
              </div>
            )}

            {iconsToDisplay.length === 0 ? (
              <div className='text-gray-500'>No icons found</div>
            ) : (
              <div className='grid grid-cols-5 grid-rows-4 gap-[2px] w-fit'>
                {iconsToDisplay.map((icon, index) => (
                  <div
                    key={index}
                    className={`w-[65px] h-[65px] flex justify-center items-center cursor-pointer group overflow-hidden ${
                      selectedIcons?.includes(icon)
                        ? 'bg-blue-200'
                        : 'bg-gray-200'
                    } hover:bg-gray-300`}
                    onClick={() => handleIconClick(icon)}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className={`text-[20px] transform transition duration-200 group-hover:text-gray-600 group-hover:scale-200 ${
                        selectedIcons?.includes(icon)
                          ? 'text-blue-800'
                          : 'text-gray-800'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

IconPickerTest.propTypes = {
  icons: PropTypes.object,
  onChange: PropTypes.func,
  adjustPosition: PropTypes.object,
  showCategory: PropTypes.bool,
  showSearch: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  isMulti: PropTypes.bool,
  noSelectedPlaceholder: PropTypes.array,
  buttonStyle: PropTypes.string,
  zIndex: PropTypes.number,
};

export default IconPickerTest;
