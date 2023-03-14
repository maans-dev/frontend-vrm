import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiBadge,
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
  EuiIcon,
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
// import CanvassingTags from '@components/canvassing-tags';
import VoterTags from '@components/voter-tags';
import { MdHowToVote } from 'react-icons/md';
import { GiHouse } from 'react-icons/gi';
import Address from '@components/living-address';
import { useVoterData } from './useVoterData';
import { ITags } from '@components/canvassing-tags/types';

const Voter: FunctionComponent = () => {
  const { voterData, error, isLoading } = useVoterData();
  // const [formData, setFormData] = useState({
  //   surname: voterData[0].surname,
  //   firstNames: voterData[0].firstName,
  //   preferredName: voterData[0].givenName,
  //   deceased: voterData[0].deceased,
  // });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  function formatDate(dob: number) {
    const date = new Date(
      dob.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
    );
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  function calculateAge(dob: number): number {
    const year = Number(String(dob).substring(0, 4));
    const month = Number(String(dob).substring(4, 6)) - 1;
    const day = Number(String(dob).substring(6, 8));

    const birthDate = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  function capitalizeWords(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '); // join the array back into a string
  }

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

  const tagsFromApi: ITags = {
    fields:
      voterData?.[0]?.fields?.map(field => ({
        field: {
          category: field?.field?.category,
          code: field?.field?.code,
          description: field?.field?.description,
          active: field?.field?.active,
        },
      })) || [],
  };

  console.log(tagsFromApi);

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
    <EuiFlexGroup gutterSize="xs" justifyContent="spaceBetween">
      <EuiFlexItem>
        <EuiPanel paddingSize="xs" hasBorder={true}>
          <EuiText size="xs">
            <EuiIcon type={GiHouse} />{' '}
            {capitalizeWords(voterData[0].livingStructure.votingDistrict)} (
            {voterData[0].livingStructure.votingDistrict_id})
          </EuiText>
        </EuiPanel>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiPanel hasBorder={true} paddingSize="xs">
          <EuiText size="xs">
            <EuiIcon type={MdHowToVote} />{' '}
            {capitalizeWords(voterData[0].registeredStructure.votingDistrict)} (
            {voterData[0].registeredStructure.votingDistrict_id})
          </EuiText>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const voterInfo = (
    <>
      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiTitle size="xs">
            <EuiTextColor>
              {voterData[0].salutation} {voterData[0].firstName} (
              {calculateAge(voterData[0].dob)})
            </EuiTextColor>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiBadge color="green" iconType="checkInCircleFilled">
            {voterData[0].colourCode.description}
          </EuiBadge>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="s" />

      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiText size="xs">
            DOB <strong>{formatDate(voterData[0].dob)}</strong>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="xs">
            DARN <strong>{voterData[0].key}</strong>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
            <EuiFlexItem grow={false}>
              <EuiText size="xs">
                Last Canvassed on{' '}
                <strong>{formatDate(voterData[0].modified)}</strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                by <strong>John Doe</strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="s" />
      {voterDistrict}
    </>
  );

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <EuiPanel>{voterInfo}</EuiPanel>
      <EuiSpacer />
      <EuiForm fullWidth>
        <EuiFormFieldset legend={{ children: 'Personal details' }}>
          <EuiFormRow display="rowCompressed" label="First names">
            <EuiFieldText
              name="firstNames"
              compressed
              disabled
              value={voterData[0].firstName}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Surname">
            <EuiFieldText
              name="surname"
              compressed
              disabled
              value={voterData[0].surname}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Preferred name">
            <EuiFieldText
              name="preferredName"
              compressed
              value={voterData[0].givenName}
            />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed">
            <EuiSwitch
              label="Deceased?"
              checked={voterData[0].deceased}
              name="deceased"
              onChange={() => null}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
          <CanvassingTags fields={tagsFromApi} />
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
