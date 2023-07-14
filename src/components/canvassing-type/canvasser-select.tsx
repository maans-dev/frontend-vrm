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
import { appsignal } from '@lib/appsignal';
import { Person } from '@lib/domain/person';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

export type Props = {
  canvasser?: Partial<Person>;
  onChange: (canvasser: Partial<Person>) => void;
};

type CanvasserOption = 'ME' | 'OTHER';

const CanvasserSelect: FunctionComponent<Props> = ({ onChange, canvasser }) => {
  const { data: session } = useSession();
  const [selectedCanvasserOption, setSelectedCanvasserOption] =
    useState<CanvasserOption>(
      canvasser
        ? canvasser.key === session?.user?.darn
          ? 'ME'
          : 'OTHER'
        : null
    );

  const [foundCanvasser, setFoundCanvasser] = useState<Partial<Person>>(
    canvasser?.key === session?.user?.darn ? null : canvasser
  );

  const [canvasserSearchText, setCanvasserSearchText] = useState('');

  const [canvasserSearchError, setCanvasserSearchError] = useState('');

  const generateId = htmlIdGenerator('canvasser');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCanvasserSearchError('');
    setCanvasserSearchText(event.target.value.replaceAll('*', ''));
  };

  const doCanvasserSearch = async () => {
    setCanvasserSearchError('');
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/person?identity=${canvasserSearchText}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    });

    if (!response.ok) {
      const errJson = JSON.parse(await response.clone().text());
      setCanvasserSearchError(`Canvasser not found: ${errJson.message}`);
      appsignal.sendError(
        new Error(`Unable to find canvasser: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            identity: canvasserSearchText,
          });
          span.setTags({ user_darn: session?.user?.darn.toString() });
        }
      );
      return;
    }

    const respPayload = await response.clone().json();

    if (respPayload && respPayload.length === 1) {
      setFoundCanvasser(respPayload[0]);
      onChange(respPayload[0]);
    } else {
      setCanvasserSearchError('Canvasser not found');
      setFoundCanvasser(null);
      onChange(null);
    }
  };

  const handleChange = (option: CanvasserOption) => {
    setCanvasserSearchError('');
    setSelectedCanvasserOption(option);
    onChange({
      key: undefined,
    });

    switch (option) {
      case 'ME':
        setCanvasserSearchText('');
        setFoundCanvasser(null);
        setCanvasserSearchError('');
        onChange({
          key: session?.user?.darn,
          givenName: session?.user?.givenName,
          surname: session?.user?.surname,
          dob: session?.user?.dob.toString(),
        });
        break;
      case 'OTHER':
        // This is handled in doCanvasserSearch()
        break;
    }
  };

  const handleClear = () => {
    setFoundCanvasser(null);
    onChange(null);
    setCanvasserSearchText('');
  };

  useEffect(() => {
    if (canvasserSearchText.length === 13) doCanvasserSearch();
  }, [canvasserSearchText]);

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
            <EuiText
              size="xs"
              css={{ cursor: 'pointer' }}
              onClick={() => handleChange('ME')}>
              {session?.user?.name}
            </EuiText>
          </EuiCheckableCard>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiCheckableCard
            id={generateId()}
            label={<strong>Someone else</strong>}
            value="OTHER"
            checked={selectedCanvasserOption === 'OTHER'}
            onChange={() => handleChange('OTHER')}>
            {!foundCanvasser && (
              <>
                <EuiFlexGroup
                  responsive={false}
                  gutterSize="xs"
                  onClick={() => handleChange('OTHER')}>
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
                    onClick={handleClear}>
                    {' '}
                    Change
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
