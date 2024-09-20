import React from 'react';
import { icons } from '../../utils/social-icons';
import IconPickerTest from '../../Components/IconPickerTest';
import IconPicker from '@mohsin-mi/iconpicker';

const FontIconPickerPage = () => {
  return (
    <div className="App">
      <header className="App-header relative">
        <h1 className="App-title mb-[997px]">Font Picker Page</h1>
        <div className='flex w-[30%] mb-[997px]'>

        <IconPickerTest
            icons={icons}
            value={''}
            onChange={(e) => console.log(e)}
            closeOnSelect={true}
            showCategory={true}
            showSearch={true}
            isMulti={false}
            adjustPosition={{ top: 10, left: 0 }}
            buttonStyle={`flex items-center justify-center min-h-[35px] min-w-[35px] rounded-l-[8px] border border-[#eaecf0]`}
            noSelectedPlaceholder={'arrow-up-from-bracket'}
            zIndexPopup={9999}
            popupStyle='bg-white border border-gray-300 shadow-lg rounded popup-container min-w-[280px]'
            gridColumns = {5}
            gridRows = {4}
            iconBgColor = {`bg-gray-200`}
            iconSelectedBgColor = {`bg-blue-200`}
            iconHeight = {65}
            iconWidth = {65}
          />
        </div>
      </header>
    </div>
  );
};

export default FontIconPickerPage;
