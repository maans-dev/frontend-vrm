import { FunctionComponent, useState } from 'react';
import {
  EuiButtonIcon,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from '@elastic/eui';

const PhoneNumbers: FunctionComponent = () => {
  const [phoneNumbersList, setPhoneNumbersList] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPhoneType, setSelectedPhoneType] = useState<{
    label: string;
  } | null>(null);

  const phoneTypeOptions = [
    { label: 'Mobile' },
    { label: 'Home' },
    { label: 'Work' },
    { label: 'International' },
    { label: 'Other' },
  ];
  const showSavedPhoneNumbers = true;

  const handlePhoneNumberChange = e => {
    // Remove any non-numeric characters from the input
    const input = e.target.value.replace(/\D/g, '');
    setPhoneNumber(input);
  };
  const handleSavePhoneNumber = () => {
    if (selectedPhoneType && phoneNumber) {
      setPhoneNumbersList(prevList => [
        ...prevList,
        { phoneType: selectedPhoneType, phoneNumber },
      ]);
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
      <EuiFlexGroup
        gutterSize="xs"
        responsive={false}
        style={{ minWidth: '96px', paddingBottom: '8px' }}>
        <EuiFlexItem grow={false}>
          <EuiFormRow display="rowCompressed">
            <EuiComboBox
              style={{ minWidth: '96px' }}
              compressed
              isClearable={false}
              aria-label="Select phone number type"
              placeholder="Select..."
              singleSelection={{ asPlainText: true }}
              selectedOptions={[{ label: 'Home' }]}
              onChange={selectedOptions =>
                setSelectedPhoneType(selectedOptions[0])
              }
              inputRef={inputElement => {
                if (inputElement) {
                  inputElement.disabled = true;
                }
              }}
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
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="base"
                iconType="check"
                size="s"
                onClick={() => {
                  null;
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="base"
                iconType="cross"
                size="s"
                onClick={() => {
                  null;
                }}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon
                display="base"
                iconType="/icons/dnc.svg"
                size="s"
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      {showSavedPhoneNumbers && (
        <div>
          {phoneNumbersList.map(phoneNumberItem => (
            <EuiFlexGroup
              key={`${phoneNumberItem.phoneType.label}-${phoneNumberItem.phoneNumber}`}
              gutterSize="xs"
              responsive={false}
              style={{ paddingBottom: '8px' }}>
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
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFlexGroup
                  gutterSize="xs"
                  alignItems="center"
                  responsive={false}>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      display="base"
                      iconType="check"
                      size="s"
                      onClick={() => {
                        null;
                      }}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      display="base"
                      iconType="cross"
                      size="s"
                      onClick={removeLastPhoneNumber}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      display="base"
                      iconType="/icons/dnc.svg"
                      size="s"
                      onClick={() => {
                        null;
                      }}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          ))}
        </div>
      )}

      <div>
        <EuiFlexGroup
          gutterSize="xs"
          responsive={false}
          style={{ paddingBottom: '8px' }}>
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
                onChange={selectedOptions =>
                  setSelectedPhoneType(selectedOptions[0])
                }
                inputRef={inputElement => {
                  if (inputElement) {
                    inputElement.disabled = true;
                  }
                }}
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
            <EuiFlexGroup
              gutterSize="xs"
              alignItems="center"
              responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  display="base"
                  iconType="importAction"
                  size="s"
                  onClick={handleSavePhoneNumber}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  );
};

export default PhoneNumbers;
