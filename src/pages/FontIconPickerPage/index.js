import React from 'react';
import { icons } from '../../utils/social-icons';
import IconPickerTest from '../../Components/IconPickerTest';
import IconPicker from '@mohsin-mi/iconpicker';

const FontIconPickerPage = () => {
  const handleIconClick = (icon) => {
    console.log("Selected icon:", icon);
  };

  return (
    <div className="App">
      <header className="App-header relative">
        <h1 className="App-title mb-[997px]">Font Picker Page</h1>
        <div className='flex w-[30%] mb-[997px]'>

        <IconPickerTest
          icons={icons}
          onChange={handleIconClick}
          closeOnSelect={true}
          showCategory={true}
          showSearch={true}
          isMulti={false}
          adjustPosition={{ top: 36, left: 0 }}
        />
        </div>
      </header>
    </div>
  );
};

export default FontIconPickerPage;
