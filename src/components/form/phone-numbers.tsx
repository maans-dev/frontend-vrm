import { FunctionComponent, useState } from 'react';
import {
  EuiButtonIcon,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui';

const PhoneNumbers: FunctionComponent = () => {
  const [selectedPhoneType, setSelectedPhoneType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const phoneTypeOptions = [
    { label: 'Home' },
    { label: 'Work' },
    { label: 'Mobile' },
  ];
  const showSavedPhoneNumbers = true 
  const handlePhoneNumberChange = (e) => {
    // Remove any non-numeric characters from the input
    const input = e.target.value.replace(/\D/g, '');
    setPhoneNumber(input);
  };
  const handleSavePhoneNumber = () => {
    if (selectedPhoneType && phoneNumber) {
      setPhoneNumbersList((prevList) => [...prevList, { phoneType: selectedPhoneType, phoneNumber }]);
      setSelectedPhoneType(null);
      setPhoneNumber('');
    }
  };
  function removeLastPhoneNumber() {
    const newPhoneNumbersList = [...phoneNumbersList];
    newPhoneNumbersList.pop();
    setPhoneNumbersList(newPhoneNumbersList);
  }
    return (
      <>
        <EuiFlexGroup gutterSize="xs" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiFormRow display="rowCompressed">
              <EuiComboBox
                style={{ minWidth: '96px' }}
                compressed
                isClearable={false}
                aria-label="Select phone number type"
                placeholder="Select..."
                singleSelection={{ asPlainText: true }}
                options={phoneTypeOptions}
                selectedOptions={selectedPhoneType ? [selectedPhoneType] : []}
                onChange={selectedOptions => setSelectedPhoneType(selectedOptions[0])}          
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow display="rowCompressed">
              <EuiFieldText
              name="phone"
              compressed
              placeholder="012 456 7890"
              inputMode="numeric"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon display="base" iconType="check" size="s" onClick={handleSavePhoneNumber}/>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon display="base" iconType="cross" size="s" onClick={removeLastPhoneNumber}/>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon display="base" iconType="/icons/dnc.svg" size="s" />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
       {showSavedPhoneNumbers && (
          <div>
            {phoneNumbersList.map((phoneNumberItem) => (
              <EuiFlexGroup key={`${phoneNumberItem.phoneType.label}-${phoneNumberItem.phoneNumber}`} gutterSize="xs" responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiFormRow display="rowCompressed">
                    <EuiComboBox
                      style={{ minWidth: '96px' }}
                      compressed
                      isClearable={false}
                      aria-label="Select phone number type"
                      placeholder="Select..."
                      singleSelection={{ asPlainText: true }}
                      options={phoneTypeOptions}
                      selectedOptions={[phoneNumberItem.phoneType]}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow display="rowCompressed">
                    <EuiFieldText
                      name="phone"
                      compressed
                      placeholder="012 456 7890"
                      inputMode="numeric"
                      value={phoneNumberItem.phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon display="base" iconType="check" size="s"/>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon display="base" iconType="cross" size="s" onClick={removeLastPhoneNumber}/>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon display="base" iconType="/icons/dnc.svg" size="s"/>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
              </EuiFlexGroup>
            ))}
          </div>
        )}
      </>
    );
};

export default PhoneNumbers;
