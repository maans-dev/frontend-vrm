import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import Comments from '@components/comments';
import moment from 'moment';
import VoterTags from '@components/voter-tags';
import Address from '@components/living-address';
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';
import VoterInfo from '@components/voter-info';
import CanvassingTags from '@components/canvassing-tags';
import Affiliation from '@components/affiliation/affiliation';
import ContactDetails from '@components/contact-details/contact-details';
import Spinner from '@components/spinner/spinner';
import { PersonUpdate } from '@lib/domain/person-update';
import { Person } from '@lib/domain/person';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
  const [updatePayload, setUpdatePayload] = useState<Partial<Person>>();
  const { person, error, isLoading } = usePersonFetcher(voterKey);
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
      href: '/canvassing-type',
      onClick: e => {
        router.push('/canvass/canvassing-type');
        e.preventDefault();
      },
    },
    {
      text: 'Voter search',
      href: '/canvass',
      onClick: e => {
        router.push('/canvass/voter-search');
        e.preventDefault();
      },
    },
    {
      text: 'Voter',
    },
  ];

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty size="m">Reset</EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton size="m" fill iconType="save">
          Save
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const onChange = (update: PersonUpdate<unknown>) => {
    // data is not an object and must be deleted
    if (!update.data) {
      setUpdatePayload(prev => {
        delete prev[update.field];
        return prev;
      });
      return;
    }

    // data is an object so scan it's fields for deletions
    if (
      typeof update.data === 'object' &&
      !Array.isArray(update.data) &&
      update.data !== null
    ) {
      for (const key in update.data as any) {
        if (update.data[key] === null) delete update.data[key];
      }
    }

    setUpdatePayload(prev => ({
      ...prev,
      [update.field]: update.data,
    }));
  };

  useEffect(() => {
    console.log('UPDATE_PAYLOAD', updatePayload);
  }, [updatePayload]);

  return (
    <>
      {error && <div>{error}</div>}
      {isLoading && <Spinner show={isLoading} />}
      {!error && !isLoading && (
        <MainLayout breadcrumb={breadcrumb}>
          <EuiSpacer />
          <EuiForm fullWidth>
            <EuiPanel>
              <VoterInfo
                darn={person.key}
                salutation={person.salutation}
                givenName={person.givenName}
                surname={person.surname}
                dob={moment(person.dob, 'YYYYMMDD').toDate()}
                colourCode={person.colourCode}
                canvassedBy={person.canvassedBy}
                modified={person.modified}
                livingStructure={person.livingStructure}
                registeredStructure={person.registeredStructure}
              />
            </EuiPanel>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
              <CanvassingTags fields={person.fields} />
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Affiliation' }}>
              <Affiliation
                affiliation={person.affiliation}
                onChange={onChange}
              />
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Contact details' }}>
              <ContactDetails
                language={person.language}
                contacts={person.contacts}
                onLanguageChange={onChange}
              />
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Living Address' }}>
              <Address address={person.address} />
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Comments' }}>
              <Comments comments={person.comments} />
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset legend={{ children: 'Tags' }}>
              <EuiFormRow display="rowCompressed">
                <VoterTags fields={person.fields} />
              </EuiFormRow>
            </EuiFormFieldset>
            <EuiSpacer />
            {formActions}
          </EuiForm>
        </MainLayout>
      )}
    </>
  );
};

export default Voter;
