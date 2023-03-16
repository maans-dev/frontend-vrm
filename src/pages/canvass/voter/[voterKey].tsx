import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiLoadingSpinner,
  EuiPanel,
  EuiSpacer,
  EuiSwitch,
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

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
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

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <EuiLoadingSpinner size="xxl" />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

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

  return (
    <MainLayout breadcrumb={breadcrumb}>
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
      <EuiForm fullWidth>
        <EuiFormFieldset legend={{ children: 'Personal details' }}>
          <EuiFormRow display="rowCompressed" label="First names">
            <EuiFieldText
              name="firstNames"
              compressed
              disabled
              value={person.firstName}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Surname">
            <EuiFieldText
              name="surname"
              compressed
              disabled
              value={person.surname}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Preferred name">
            <EuiFieldText
              name="preferredName"
              compressed
              value={person.givenName}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed">
            <EuiSwitch
              label="Deceased?"
              checked={person.deceased}
              name="deceased"
              onChange={() => null}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
          <CanvassingTags fields={person.fields} />
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Affiliation' }}>
          <Affiliation affiliation={person.affiliation} />
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Contact details' }}>
          <ContactDetails
            language={person.language}
            contacts={person.contacts}
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
            <VoterTags
              existingTags={[
                { label: 'Tag 1' },
                { label: 'Tag 2' },
                { label: 'Tag 3' },
                { label: 'Tag 4' },
              ]}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />
        {/* <EuiFormFieldset legend={{ children: 'Custom fields' }}>
          <></>
        </EuiFormFieldset> */}
      </EuiForm>
      <EuiSpacer />
      {formActions}
    </MainLayout>
  );
};

export default Voter;
