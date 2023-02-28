import { FunctionComponent, useState } from 'react';
import {
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from '@elastic/eui';

const EmailAddress: FunctionComponent = () => {
  const [emailsList, setEmailsList] = useState([]);
  const [email, setEmail] = useState('');

  const showSavedEmails = true;

  const handleChange = e => {
    const input = e.target.value;
    const hasNumbers = /\d/.test(input); // check if input contains any numbers
    if (!hasNumbers) {
      setEmail(input);
    }
  };

  const handleSaveEmail = () => {
    if (email.includes('@')) {
      setEmailsList(prevList => [...prevList, email]);
      setEmail('');
    }
  };

  function removeLastEmail() {
    const newEmailList = [...emailsList];
    newEmailList.pop();
    setEmailsList(newEmailList);
  }

  return (
    <>
      <EuiFlexGroup
        gutterSize="xs"
        responsive={true}
        style={{ paddingBottom: '8px' }}>
        <EuiFlexItem>
          <EuiFormRow display="rowCompressed">
            <EuiFieldText
              name="email"
              compressed
              placeholder="example@gmail.com"
              style={{ width: '400px' }}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon display="base" iconType="check" size="s" />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonIcon display="base" iconType="cross" size="s" />
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

      {showSavedEmails && (
        <div>
          {emailsList.map((email, index) => (
            <EuiFlexGroup
              key={index}
              gutterSize="xs"
              responsive={false}
              style={{ paddingBottom: '8px' }}>
              <EuiFlexItem>
                <EuiFormRow display="rowCompressed">
                  <EuiFieldText
                    name="email"
                    compressed
                    placeholder="example@gmail.com"
                    style={{ width: '400px' }}
                    value={email}
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
                      onClick={removeLastEmail}
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
          ))}
        </div>
      )}

      <div>
        <EuiFlexGroup
          gutterSize="xs"
          responsive={true}
          style={{ paddingBottom: '8px' }}>
          <EuiFlexItem>
            <EuiFormRow display="rowCompressed">
              <EuiFieldText
                name="email"
                compressed
                inputMode="email"
                placeholder="dave@example.com"
                style={{ width: '400px' }}
                value={email}
                onChange={handleChange}
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
                  onClick={handleSaveEmail}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  );
};

export default EmailAddress;
