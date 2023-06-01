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
import { appsignal, redactObject } from '@lib/appsignal';
import { Person } from '@lib/domain/person';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { FunctionComponent, useState, ChangeEvent, useEffect } from 'react';

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
    setCanvasserSearchText(event.target.value.replaceAll('*', ''));
  };

  const doCanvasserSearch = async () => {
    setPersonSearchError('');
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/person?identity=${canvasserSearchText}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!response.ok) {
      const errJson = JSON.parse(await response.text());
      appsignal.sendError(
        new Error(`Unable to find person by identity: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      return;
    }

    const respPayload = await response.json();

    if (respPayload && respPayload.length === 1) {
      setFoundPerson(respPayload[0]);
      const key = respPayload[0].key;
      handleRecruitedByChange(key);
    } else {
      setPersonSearchError('Person not found');
      appsignal.sendError(
        new Error(`Unable to find person by identity: ${canvasserSearchText}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            response: redactObject(respPayload),
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
      setFoundPerson(null);
      // onChange(null);
    }
  };

  const handleClear = () => {
    setFoundPerson(null);
    //   onChange(null);
    setCanvasserSearchText('');
  };

  useEffect(() => {
    if (canvasserSearchText.length === 13) doCanvasserSearch();
  }, [canvasserSearchText]);

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
