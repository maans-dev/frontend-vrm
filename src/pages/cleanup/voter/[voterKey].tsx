import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiPanel,
  EuiSpacer,
  EuiTab,
  EuiTabs,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import moment from 'moment';
import VoterTags from '@components/voter-tags';
import Address from '@components/living-address';
import usePersonFetcher from '@lib/fetcher/person/person.fetcher';
import VoterInfo from '@components/voter-info';
import CanvassingTags from '@components/canvassing-tags';
import Affiliation from '@components/affiliation/affiliation';
import ContactDetails from '@components/contact-details/contact-details';
import { GeneralUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { css } from '@emotion/react';
import PersonHistory from '@components/person-history';
import { useLeavePageConfirmation } from '@lib/hooks/useLeavePageConfirmation';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
  const { person, isLoading, isValidating, error } = usePersonFetcher(voterKey);
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    setPerson,
    setUpdatePayload,
    submitUpdatePayload,
    isSubmitting,
    isDirty,
    serverError,
    resetForm,
  } = useContext(CanvassingContext);
  useLeavePageConfirmation(isDirty);

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
      text: 'Data Cleanup',
    },
    {
      text: 'Voter search',
      href: '/voter-search',
      onClick: e => {
        router.push('/cleanup/voter-search');
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
    setUpdatePayload(update);
  };

  useEffect(() => {
    if (person) setPerson(person);
  }, [person, setPerson]);

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

  if (error && !isLoading && !isSubmitting && !isValidating && voterKey) {
    return (
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <EuiCallOut
          title="Something went wrong"
          color="danger"
          iconType="error">
          {error?.message}
        </EuiCallOut>
      </MainLayout>
    );
  }

  if (isLoading || isSubmitting || isValidating || !voterKey) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        showSpinner={isLoading || isSubmitting || isValidating || !voterKey}
        restrictWidth="1400px"
        panelled={false}
      />
    );
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      showSpinner={isLoading || isSubmitting || isValidating}
      restrictWidth="1400px"
      panelled={false}>
      <VoterInfo
        deceased={person?.deceased}
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

      <EuiSpacer />
      <EuiForm fullWidth isInvalid={serverError !== ''} error={[serverError]}>
        <EuiFlexGroup direction="row" gutterSize="xs">
          <EuiFlexItem>
            <EuiTabs css={tabsStyle} size="s">
              <EuiTab
                onClick={() => setSelectedTab(0)}
                isSelected={selectedTab === 0}>
                Basic & Contact
              </EuiTab>
              <EuiTab
                onClick={() => setSelectedTab(1)}
                isSelected={selectedTab === 1}>
                Address & Location
              </EuiTab>
              <EuiTab
                onClick={() => setSelectedTab(2)}
                isSelected={selectedTab === 2}>
                Tags & Custom fields
              </EuiTab>
              <EuiTab
                onClick={() => setSelectedTab(3)}
                isSelected={selectedTab === 3}>
                History
              </EuiTab>
            </EuiTabs>
            <EuiSpacer />

            <div style={{ display: selectedTab === 0 ? 'block' : 'none' }}>
              <EuiFormFieldset legend={{ children: 'Contact Details' }}>
                <ContactDetails
                  deceased={person.deceased}
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
              <EuiFormFieldset legend={{ children: 'Affiliation' }}>
                <Affiliation
                  affiliation={person?.affiliation}
                  onChange={onChange}
                  affiliationDate={person?.affiliation_date}
                />
              </EuiFormFieldset>
            </div>

            <div style={{ display: selectedTab === 1 ? 'block' : 'none' }}>
              <EuiFormFieldset
                legend={{ children: 'Living Address & Location' }}>
                <Address address={person?.address} onChange={onChange} />
              </EuiFormFieldset>
            </div>

            <div style={{ display: selectedTab === 2 ? 'block' : 'none' }}>
              <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
                <CanvassingTags fields={person.fields} onChange={onChange} />
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Voter tags' }}>
                <VoterTags fields={person?.fields} onChange={onChange} />
              </EuiFormFieldset>
            </div>

            <div style={{ display: selectedTab === 3 ? 'block' : 'none' }}>
              <EuiFormFieldset
                css={{ position: 'relative', minHeight: '300px' }}
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
