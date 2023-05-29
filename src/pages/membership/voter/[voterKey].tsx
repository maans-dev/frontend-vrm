import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import moment from 'moment';
import VoterTags from '@components/voter-tags';
import Address from '@components/living-address';
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';
import VoterInfo from '@components/voter-info';
import CanvassingTags from '@components/canvassing-tags';
import ContactDetails from '@components/contact-details/contact-details';
import {
  GeneralUpdate,
  MembershipUpdate,
  PersonUpdate,
} from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { css } from '@emotion/react';
import Membership from '@components/membership';
import PersonHistory from '@components/person-history';
import useCountryFetcher from '@lib/fetcher/countries/countries';
import { useLeavePageConfirmation } from '@lib/hooks/useLeavePageConfirmation';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
  const { person, isLoading } = usePersonFetcher(voterKey);
  const [searchValue, setSearchValue] = useState('');
  const { countries } = useCountryFetcher(searchValue);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    data,
    setPerson,
    setUpdatePayload,
    submitUpdatePayload,
    isSubmitting,
    isDirty,
    serverError,
    resetForm,
  } = useContext(CanvassingContext);
  useLeavePageConfirmation(isDirty);

  const handleTabChange = (tab: number) => {
    setSelectedTab(tab);
  };

  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Home',
      href: '/',
      onClick: e => {
        router.push('/');
        e.preventDefault();
      },
    },
    {
      text: 'Membership',
    },
    {
      text: 'Voter search',
      href: '/voter-search',
      onClick: e => {
        router.push('/membership/voter-search');
        e.preventDefault();
      },
    },
    {
      text: 'Voter edit',
    },
  ];

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty
          size="m"
          disabled={isSubmitting}
          onClick={() => resetForm()}>
          Reset
        </EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          size="m"
          fill
          iconType="save"
          disabled={!isDirty}
          isLoading={isSubmitting}
          onClick={() => submitUpdatePayload()}>
          Save
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const onChange = (update: PersonUpdate<GeneralUpdate>) => {
    // Inject person.address.structure as membership branch if it exists
    // and no other branch has already been added.
    if (
      update?.field === 'membership' &&
      (update.data as MembershipUpdate)?.type === 'membership-new'
    ) {
      if (!data?.membership?.structure?.votingDistrict_id) {
        if (
          !person?.membership?.structure?.votingDistrict_id &&
          person?.address?.structure?.votingDistrict_id
        ) {
          update.data['structure'] = {
            votingDistrict_id: person?.address?.structure?.votingDistrict_id,
          };
        }
      }
    }
    setUpdatePayload(update);
  };

  useEffect(() => {
    if (person) setPerson(person);
    if (person?.membership?.structure?.country_code)
      setSearchValue(person.membership.structure.country_code);
  }, [person, setPerson]);

  if (isLoading) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        showSpinner={isLoading}
        panelled={false}
      />
    );
  }

  const tabsStyle = css`
    .euiTab {
      position: relative;
      display: inline-block;
      left: 10px;
      padding: 0px 10px;
      margin-right: -1px;
      color: #333;
      text-align: center;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: 5px 5px 0 0;
      &:last-child {
        margin-right: 0;
      }
      &.euiTab-isSelected {
        border-color: #d3dae6;
        background-color: #fff;
        box-shadow: none;
        border-bottom: none;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 1) 0%,
          rgba(245, 241, 241, 1) 100%
        ) !important;
        &:after {
          position: absolute;
          content: '';
          display: block;
          width: 100%;
          height: 3px;
          bottom: -1px;
          left: 0;
          background-color: transparent;
          display: none;
        }
      }
      &:hover:not(.euiTab-isSelected) {
        background: rgb(211, 218, 230, 0.5);
        border-color: transparent;
      }
    }
    .euiTab.euiTab-isSelected:after {
      background-color: transparent;
      display: none;
    }
  `;

  function handleGoToAddress() {
    handleTabChange(1);
  }

  if (isLoading || !voterKey) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        showSpinner={isLoading}
        panelled={false}
      />
    );
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      showSpinner={isSubmitting}
      panelled={false}
      restrictWidth="1400px">
      <EuiPanel>
        <VoterInfo
          darn={person?.key}
          salutation={person?.salutation}
          givenName={person?.givenName || person?.firstName}
          surname={person?.surname}
          dob={moment(person?.dob, 'YYYYMMDD').toDate()}
          colourCode={person?.colourCode}
          canvassedBy={person?.canvassedBy}
          modified={person?.modified}
          livingStructure={person?.livingStructure}
          registeredStructure={person?.registeredStructure}
          membership={person?.membership}
        />
      </EuiPanel>
      <EuiSpacer />
      <EuiForm fullWidth isInvalid={serverError !== ''} error={[serverError]}>
        <EuiFlexGroup direction="row" gutterSize="xs">
          <EuiFlexItem>
            <EuiTabs css={tabsStyle} size="s">
              <EuiTab
                onClick={() => handleTabChange(0)}
                isSelected={selectedTab === 0}>
                Basic & Contact
              </EuiTab>
              <EuiTab
                onClick={() => handleTabChange(1)}
                isSelected={selectedTab === 1}>
                Address & Location
              </EuiTab>
              <EuiTab
                onClick={() => handleTabChange(2)}
                isSelected={selectedTab === 2}>
                Tags & Custom fields
              </EuiTab>
              <EuiTab
                onClick={() => handleTabChange(3)}
                isSelected={selectedTab === 3}>
                {person?.membership?.structure?.key === null &&
                person?.membership?.status !== 'NotAMember' ? (
                  <EuiText size="xs" color="warning">
                    <EuiIcon type="alert" color="warning" />{' '}
                    <strong>Membership</strong>
                  </EuiText>
                ) : (
                  'Membership'
                )}
              </EuiTab>
              <EuiTab
                onClick={() => handleTabChange(4)}
                isSelected={selectedTab === 4}>
                History
              </EuiTab>
            </EuiTabs>
            <EuiSpacer />

            <div style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
              <EuiFormFieldset legend={{ children: 'Contact Details' }}>
                <ContactDetails
                  deceased={person?.deceased}
                  givenName={person?.givenName}
                  language={person?.language}
                  contacts={person?.contacts}
                  onLanguageChange={onChange}
                  onPhoneChange={onChange}
                  onEmailChange={onChange}
                  onPersonChange={onChange}
                  onDeceasedChange={onChange}
                />
              </EuiFormFieldset>
              <EuiSpacer />
            </div>

            <div style={{ display: selectedTab === 1 ? 'block' : 'none' }}>
              <EuiFormFieldset
                legend={{ children: 'Living Address & Location' }}>
                <Address address={person?.address} onChange={onChange} />
              </EuiFormFieldset>
            </div>

            <div style={{ display: selectedTab === 2 ? 'block' : 'none' }}>
              <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
                <CanvassingTags fields={person?.fields} onChange={onChange} />
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Voter tags' }}>
                <VoterTags fields={person?.fields} onChange={onChange} />
              </EuiFormFieldset>
            </div>

            <div style={{ display: selectedTab === 3 ? 'block' : 'none' }}>
              <Membership
                abroadCountry={countries ? countries[0].country : null}
                membershipStructure={person?.membership?.structure}
                id_number={person?.idNumber}
                darn={person?.key}
                status={person?.membership?.status}
                selectAddress={handleGoToAddress}
                daAbroad={person?.membership?.daAbroad}
                daYouth={person?.membership?.daYouth}
                dawnOptOut={
                  person?.membership?.dawnOptOut !== null
                    ? person?.membership?.dawnOptOut
                    : false
                }
                expired={person?.membership?.expiry}
                initialJoin={person?.membership?.initialJoin}
                newRenewal={person?.membership?.payment?.date}
                membershipNumber={person?.membership?.payment?.membershipNumber}
                comments={person?.comments}
                onMembershipChange={onChange}
                gender={person?.gender}
                dob={person?.dob}
                branchOverride={
                  person?.membership?.branchOverride
                    ? person?.membership?.branchOverride
                    : false
                }
              />
            </div>

            <div style={{ display: selectedTab === 4 ? 'block' : 'none' }}>
              <EuiFormFieldset
                css={{
                  position: 'relative',
                  minHeight: '300px',
                }}
                legend={{ children: 'History' }}>
                <PersonHistory personKey={person.key} />
              </EuiFormFieldset>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer />
        {formActions}
      </EuiForm>
    </MainLayout>
  );
};

export default Voter;
