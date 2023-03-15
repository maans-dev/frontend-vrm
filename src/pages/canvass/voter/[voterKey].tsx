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
  EuiPanel,
  EuiSpacer,
  EuiSwitch,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import PhoneNumbers from '@components/form/phone-numbers';
import EmailAddress from '@components/form/email-address';
import Comments from '@components/comments';
import moment from 'moment';
// import CanvassingTags from '@components/canvassing-tags';
import VoterTags from '@components/voter-tags';
import Address from '@components/living-address';
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';
import VoterInfo from '@components/voter-info';
import CanvassingTags from '@components/canvassing-tags';
import Affiliation from '@components/affiliation/affiliation';
// import ContactDetails from '@components/contact-details/contact-details';

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
    return <div>Loading...</div>;
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
          modified={person.modified}
          modifiedBy={person.modifiedBy}
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
          {/* <ContactDetails language={person.language} /> */}

          <EuiFormRow display="rowCompressed" label="Phone Numbers">
            <PhoneNumbers
              items={[
                { type: 'Mobile', number: '123 456 7890' },
                {
                  type: 'Home',
                  number: '123 456 7890',
                  isConfirmed: true,
                },
                { type: 'Work', number: '123 456 7890', isDnc: true },
                { type: 'International', number: '+27 123 456 7890' },
                {
                  type: 'Other',
                  number: '123 456 7890',
                  isConfirmed: true,
                  isDnc: true,
                },
              ]}
            />
          </EuiFormRow>

          <EuiFormRow display="rowCompressed" label="Email Addresses">
            <EmailAddress
              items={[
                {
                  email: 'example@gmail.com',
                },
                { email: 'example@gmail.com', isConfirmed: true },
                { email: 'example@gmail.com', isDnc: true },
              ]}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Living Address' }}>
          <Address />
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Comments' }}>
          <Comments
            comments={[
              {
                date: moment().subtract(4, 'days').toDate(),
                type: 'user',
                user: 'John Smith',
                message: 'A short comment.',
              },
              {
                date: moment().subtract(3, 'days').toDate(),
                user: 'John Doe',
                type: 'member',
                message: 'Another comment',
              },
              {
                date: moment().subtract(2, 'days').toDate(),
                user: 'system',
                type: 'system',
                message: 'a system event happened',
              },
            ]}
          />
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
