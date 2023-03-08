import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiPanel,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTextColor,
  EuiTitle,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import PhoneNumbers from '@components/form/phone-numbers';
import EmailAddress from '@components/form/email-address';
import Comments from '@components/comments';
import moment from 'moment';
import CanvassingTags from '@components/canvassing-tags';
import VoterTags from '@components/voter-tags';

const Voter: FunctionComponent = () => {
  const router = useRouter();
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

  const affilitions = [
    {
      label: 'Titan',
    },
    {
      label: 'Enceladus',
    },
    {
      label: 'Mimas',
    },
    {
      label: 'Dione',
    },
    {
      label: 'Iapetus',
    },
    {
      label: 'Phoebe',
    },
    {
      label: 'Rhea',
    },
    {
      label: 'Tethys',
    },
    {
      label: 'Hyperion',
    },
  ];

  const languages = [
    { id: 'Eng', label: 'Eng' },
    { id: 'Afr', label: 'Afr' },
    { id: 'Xho', label: 'Xho' },
    { id: 'Zul', label: 'Zul' },
    { id: 'Sot', label: 'Sot' },
    { id: 'Sep', label: 'Sep' },
    { id: 'Tsn', label: 'Tsn' },
    { id: 'Tso', label: 'Tso' },
    { id: 'Ven', label: 'Ven' },
    { id: 'Nbi', label: 'Nbi' },
    { id: 'Ssw', label: 'Ssw' },
    { id: '?', label: '?' },
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

  const voterDistrict = (
    <EuiFlexItem grow={true} style={{ marginTop: '10px' }}>
      <EuiFlexGroup direction="column" gutterSize="xs">
        <EuiFlexItem>
          <EuiPanel
            paddingSize="s"
            style={{
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}>
            <EuiText size="xs" style={{ fontWeight: 'bold', margin: 'auto' }}>
              District: Capetown CBD
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel
            paddingSize="s"
            style={{ height: '30px', display: 'flex', alignItems: 'center' }}>
            <EuiText size="xs" style={{ fontWeight: 'bold', margin: 'auto' }}>
              Station: Capetown CBD
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexItem>
  );

  const voterInfo = [
    <EuiFlexGroup direction="column" alignItems="flexStart" key={0}>
      <EuiFlexItem style={{ width: '100%' }}>
        <EuiTitle size="l">
          <EuiTextColor color="orange">John Smith (42)</EuiTextColor>
        </EuiTitle>
        <EuiText size="s" style={{ fontWeight: 'bold', marginTop: '1px' }}>
          1988/03/12
        </EuiText>
        <EuiText size="s" style={{ fontWeight: 'bold', marginTop: '3px' }}>
          DARN: 2423232424
        </EuiText>
        <EuiText size="s" style={{ fontWeight: 'bold', marginTop: '3px' }}>
          Last Canvassed: John Doe on Wed, 12 Oct 2022
        </EuiText>
        {voterDistrict}
      </EuiFlexItem>
    </EuiFlexGroup>,
  ];

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <EuiPanel style={{ border: '1px solid rgba(196, 196, 196, 0.5)' }}>
        <EuiFlexGroup
          direction="column"
          alignItems="flexStart"
          justifyContent="spaceBetween">
          <EuiFlexItem style={{ width: '100%' }}>{voterInfo[0]}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
      <EuiSpacer />
      <EuiForm fullWidth>
        <EuiFormFieldset legend={{ children: 'Personal details' }}>
          <EuiFormRow display="rowCompressed" label="Surname">
            <EuiFieldText name="surname" compressed disabled value="DOE" />
          </EuiFormRow>

          <EuiFormRow display="rowCompressed" label="First names">
            <EuiFieldText name="firstNames" compressed disabled value="JOHN" />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Preferred name">
            <EuiFieldText name="preferredName" compressed />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed">
            <EuiSwitch
              label="Deceased?"
              // compressed
              checked={true}
              name="deceased"
              onChange={() => null}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
          <CanvassingTags
            tags={[
              { tag: 'WR', description: 'Will register' },
              { tag: 'ASTREG', description: 'Assisted to register' },
              { tag: 'DR', description: 'Did register' },
              { tag: 'WV', description: "Won't vote" },
              { tag: 'CV', description: "Can't vote" },
              { tag: 'M', description: 'Moved' },
            ]}
          />
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Affiliation' }}>
          <EuiFormRow display="row">
            <EuiCallOut
              title="Have you confirmed this voter's affiliation?"
              size="s"
              iconType="search"
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed">
            <EuiComboBox
              compressed
              isClearable={false}
              aria-label="Select an affiliation"
              placeholder="Select an affiliation"
              singleSelection={{ asPlainText: true }}
              options={affilitions}
              selectedOptions={[affilitions[2]]}
              onChange={() => null}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Contact details' }}>
          <EuiFormRow display="rowCompressed" label="Language">
            <EuiComboBox
              compressed
              isClearable={false}
              aria-label="Select voter language(s)"
              placeholder="Select voter language(s)"
              singleSelection={{ asPlainText: true }}
              options={languages}
              selectedOptions={[languages[2]]}
              onChange={() => null}
            />
          </EuiFormRow>

          <EuiFormRow display="rowCompressed" label="Preferred Name">
            <EuiFieldText name="preferredName" compressed />
          </EuiFormRow>

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
          <></>
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Comments' }}>
          <Comments
            comments={[
              {
                date: moment().subtract(4, 'days').toDate(),
                user: 'John Smith',
                message: 'A short comment.',
              },
              {
                date: moment().subtract(3, 'days').toDate(),
                user: 'John Doe',
                message:
                  'A long comment. A long comment. A long comment. A long comment.',
              },
              {
                date: moment().subtract(2, 'days').toDate(),
                user: 'system',
                message: 'generated an event as a comment',
              },
              {
                date: moment().subtract(1, 'days').toDate(),
                user: 'Mary Smith',
                message: 'Another comment.',
              },
              {
                date: new Date(),
                user: 'Mandy Someone',
                message: 'And yet another comment.',
              },
            ]}
          />
        </EuiFormFieldset>

        <EuiSpacer />

        <EuiFormFieldset legend={{ children: 'Tags' }}>
          <EuiFormRow display="rowCompressed">
            <VoterTags
              tags={[
                {
                  label:
                    'Consectetur, adipisicing elit. Unde quas Consectetur, adipisicing elit.',
                },
                {
                  label:
                    'Dolor sit amet consectetur, adipisicing elit. Unde quas.',
                },
                {
                  label:
                    'Adipisicing elit. Unde quas. Consectetur, adipisicing elit.',
                },
                {
                  label:
                    'Lorem ipsum dolor sit amet consectetur Consectetur, adipisicing elit.',
                },
                {
                  label: 'Lorem isspsum dolor sit amet',
                },
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
