import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiCheckableCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui';
import { css } from '@emotion/react';
import { Person } from '@lib/domain/person';
import moment from 'moment';
import { ChangeEvent, FunctionComponent, useState } from 'react';

export type Props = {
  lastCapturer?: Partial<Person>;
  onChange: (canvasser: Partial<Person>) => void;
};

type CanvasserOption = 'ME' | 'LAST' | 'OTHER';

const CanvasserSelect: FunctionComponent<Props> = ({
  onChange,
  lastCapturer,
}) => {
  const [selectedCanvasserOption, setSelectedCanvasserOption] =
    useState<CanvasserOption>(null);

  const [foundCanvasser, setFoundCanvasser] = useState<Partial<Person>>(null);

  const [canvasserSearchText, setCanvasserSearchText] = useState('');

  const [canvasserSearchError, setCanvasserSearchError] = useState('');

  const generateId = htmlIdGenerator('canvasser');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCanvasserSearchText(event.target.value);
  };

  const doCanvasserSearch = async () => {
    setCanvasserSearchError('');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/person?identity=${canvasserSearchText}`
    );

    if (!response.ok) {
      console.log('something went wrong');
      return;
    }

    const respPayload = await response.json();

    if (respPayload && respPayload.length === 1) {
      setFoundCanvasser(respPayload[0]);
      onChange(respPayload[0]);
    } else {
      setCanvasserSearchError('Canvasser not found');
    }

    console.log('[CANVASSER]', respPayload);
  };

  const handleChange = (option: CanvasserOption) => {
    setSelectedCanvasserOption(option);

    if (option !== 'OTHER') {
      setCanvasserSearchText('');
      setFoundCanvasser(null);
      setCanvasserSearchError('');
    }

    switch (option) {
      case 'ME':
        onChange({
          key: 123456789,
          givenName: 'JOHN',
          surname: 'SMITH',
          dob: 19740830,
        });
        break;
      case 'LAST':
        // TODO: not implemented yet
        break;
    }
  };

  return (
    <>
      <EuiFlexGroup
        css={css`
          .euiCheckableCard__label {
            font-weight: bold;
            padding-bottom: 7px;
            font-size: 12px;
          }
          .euiSplitPanel__inner {
            padding: 7px;
          }
          .euiPanel {
            height: 100%;
          }
        `}
        gutterSize="s"
        responsive={true}>
        <EuiFlexItem grow={true}>
          <EuiCheckableCard
            id={generateId()}
            label={<strong>Me</strong>}
            value="ME"
            checked={selectedCanvasserOption === 'ME'}
            onChange={() => handleChange('ME')}>
            <EuiText size="xs" css={{ cursor: 'pointer' }}>
              {/* TODO: Get this from currently logged in user, once Auth is done */}
              MR JOHN SMITH (42){' '}
            </EuiText>
          </EuiCheckableCard>
        </EuiFlexItem>
        {lastCapturer && (
          <EuiFlexItem grow={true}>
            <EuiCheckableCard
              id={generateId()}
              label={<strong>Same as last capture</strong>}
              value="LAST"
              checked={selectedCanvasserOption === 'LAST'}
              onChange={() => handleChange('LAST')}>
              <EuiText size="xs" css={{ cursor: 'pointer' }}>
                MR JOHN SMITH (42)
              </EuiText>
            </EuiCheckableCard>
          </EuiFlexItem>
        )}
        <EuiFlexItem grow={true}>
          <EuiCheckableCard
            id={generateId()}
            label={<strong>Someone else</strong>}
            value="OTHER"
            checked={selectedCanvasserOption === 'OTHER'}
            onChange={() => handleChange('OTHER')}>
            {!foundCanvasser && (
              <>
                <EuiFlexGroup responsive={false} gutterSize="xs">
                  <EuiFlexItem>
                    <EuiFormRow
                      display="centerCompressed"
                      isInvalid={canvasserSearchError !== ''}>
                      <EuiFieldText
                        name="identity"
                        placeholder="ID Number or DARN"
                        compressed
                        isInvalid={canvasserSearchError !== ''}
                        disabled={selectedCanvasserOption !== 'OTHER'}
                        value={canvasserSearchText}
                        // isClearable={true}
                        onChange={handleSearchChange}
                      />
                    </EuiFormRow>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiFormRow display="centerCompressed">
                      <EuiButtonIcon
                        // display="base"
                        iconType="search"
                        aria-label="search"
                        disabled={
                          selectedCanvasserOption !== 'OTHER' ||
                          !canvasserSearchText
                        }
                        onClick={doCanvasserSearch}
                      />
                    </EuiFormRow>
                  </EuiFlexItem>
                </EuiFlexGroup>
                {canvasserSearchError && (
                  <EuiText size="xs" color="danger">
                    <EuiSpacer size="s" />
                    {canvasserSearchError}
                  </EuiText>
                )}
              </>
            )}
            {foundCanvasser && (
              <EuiFlexGroup
                responsive={false}
                gutterSize="xs"
                alignItems="center">
                <EuiFlexItem>
                  <EuiText size="xs">
                    {foundCanvasser.salutation} {foundCanvasser.givenName}{' '}
                    {foundCanvasser.surname} (
                    {moment().diff(foundCanvasser.dob, 'years', false)})
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    size="xs"
                    iconType="cross"
                    aria-label="search-again"
                    disabled={selectedCanvasserOption !== 'OTHER'}
                    onClick={() => setFoundCanvasser(null)}>
                    {' '}
                    Clear
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            )}
          </EuiCheckableCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default CanvasserSelect;
