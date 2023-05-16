import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiFieldText,
  EuiButtonIcon,
  EuiSpacer,
  EuiText,
  EuiButtonEmpty,
} from '@elastic/eui';
import { Person } from '@lib/domain/person';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { FunctionComponent, useState, ChangeEvent } from 'react';

export interface Props {
  handleRecruitedByChange: (key: number) => void;
}
const PersonSearch: FunctionComponent<Props> = ({
  handleRecruitedByChange,
}) => {
  const { data: session } = useSession();
  const [foundPerson, setFoundPerson] = useState<Partial<Person>>();
  const [personSearchError, setPersonSearchError] = useState('');

  const [canvasserSearchText, setCanvasserSearchText] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCanvasserSearchText(event.target.value);
  };

  const doCanvasserSearch = async () => {
    setPersonSearchError('');
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/person?identity=${canvasserSearchText}`,
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );

    if (!response.ok) {
      console.log('something went wrong');
      return;
    }

    const respPayload = await response.json();

    if (respPayload && respPayload.length === 1) {
      setFoundPerson(respPayload[0]);
      const key = respPayload[0].key;
      handleRecruitedByChange(key);
    } else {
      setPersonSearchError('Person not found');
      setFoundPerson(null);
      // onChange(null);
    }

    console.log('[CANVASSER]', respPayload);
  };

  const handleClear = () => {
    setFoundPerson(null);
    //   onChange(null);
    setCanvasserSearchText('');
  };

  const value = `${foundPerson?.salutation ? foundPerson?.salutation : ''} ${
    foundPerson?.givenName
  } ${foundPerson?.surname} (${moment().diff(
    foundPerson?.dob,
    'years',
    false
  )})`;

  return (
    <>
      {!foundPerson && (
        <EuiFlexGroup responsive={false} gutterSize="xs">
          <EuiFlexItem>
            <EuiFormRow
              display="centerCompressed"
              isInvalid={personSearchError !== ''}>
              <EuiFieldText
                name="identity"
                placeholder="ID Number or DARN"
                compressed
                isInvalid={personSearchError !== ''}
                value={canvasserSearchText}
                onChange={handleSearchChange}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow display="centerCompressed">
              <EuiButtonIcon
                iconType="search"
                aria-label="search"
                onClick={doCanvasserSearch}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}

      {personSearchError && (
        <EuiText size="xs" color="danger">
          <EuiSpacer size="s" />
          {personSearchError}
        </EuiText>
      )}
      {foundPerson && (
        <EuiFlexGroup responsive={false} gutterSize="xs" alignItems="center">
          <EuiFlexItem>
            <EuiFieldText icon="user" disabled value={value} />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              iconType="cross"
              aria-label="search-again"
              onClick={handleClear}>
              {' '}
              Change
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </>
  );
};

export default PersonSearch;
