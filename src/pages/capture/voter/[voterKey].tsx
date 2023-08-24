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
  EuiFormRow,
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
import { GeneralUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { CanvassingSelectionDetails } from '@components/canvassing-type/canvassing-selection-details';
import { useLeavePageConfirmation } from '@lib/hooks/useLeavePageConfirmation';
import QuickEdits from '@components/quick-edits';
import { Salutation } from '@lib/domain/person-enum';
import { useAnalytics } from '@lib/hooks/useAnalytics';
import Head from 'next/head';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
  const { person, isLoading, isValidating, error } = usePersonFetcher(voterKey);
  const [confirmed, setConfirmed] = useState(false);
  const { trackCustomEvent } = useAnalytics();

  const {
    setPerson,
    setUpdatePayload,
    submitUpdatePayload,
    isSubmitting,
    isDirty,
    serverError,
    resetForm,
    data,
    validationError,
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
      text: 'Capturing',
      href: '/capture-type',
      onClick: e => {
        router.push('/capture/capturing-type');
        e.preventDefault();
      },
    },
    {
      text: 'Voter search',
      href: '/capture',
      onClick: e => {
        router.push('/capture/voter-search');
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
          isLoading={isSubmitting || !!validationError}
          onClick={() => {
            trackCustomEvent('Capture Form', 'Capture Form Saved');
            submitUpdatePayload();
          }}>
          Save
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const handleErrorScroll = () => {
    const section = document.getElementById('phoneNumberField');
    if (section) {
      const yOffset = -100;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const validationErrorMessage = (
    <EuiFlexGroup justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiCallOut
          style={{
            textAlign: 'right',
            marginRight: '0',
            minWidth: '250px',
          }}
          title={validationError}
          color="danger"
          iconType="alert"
          onClick={handleErrorScroll}
          size="s"></EuiCallOut>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const affiliationMessage = (
    <EuiFlexGroup justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiCallOut
          title="Affiliation Not Confirmed"
          color="warning"
          iconType="alert"
          style={{ marginRight: '0', textAlign: 'right', minWidth: '250px' }}
          size="s"></EuiCallOut>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const onChange = (update: PersonUpdate<GeneralUpdate>) => {
    setUpdatePayload(update);
  };

  useEffect(() => {
    if (person) setPerson(person);
  }, [person, setPerson]);

  useEffect(() => {
    if (data?.affiliation?.confirmed === true) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  }, [data?.affiliation?.confirmed, data]);

  if (error && !isLoading && !isSubmitting && !isValidating && voterKey) {
    return (
      <>
        <Head>
          <title>VRM | Capture | Voter </title>
        </Head>
        <MainLayout breadcrumb={breadcrumb} panelled={false}>
          <EuiCallOut
            title="Something went wrong"
            color="danger"
            iconType="error">
            {error?.message}
          </EuiCallOut>
        </MainLayout>
      </>
    );
  }

  if (isLoading || isSubmitting || isValidating || !voterKey) {
    return (
      <>
        <Head>
          <title>VRM | Capture | Voter </title>
        </Head>
        <MainLayout
          breadcrumb={breadcrumb}
          showSpinner={isLoading || isSubmitting || isValidating || !voterKey}
          panelled={false}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>VRM | Capture | Voter </title>
      </Head>
      <MainLayout
        breadcrumb={breadcrumb}
        panelled={false}
        showSpinner={isLoading || isSubmitting || isValidating}>
        {error && (
          <>
            <EuiCallOut
              title="Something went wrong"
              color="danger"
              iconType="alert">
              {error?.message || typeof error === 'string'
                ? error
                : 'Unknown error'}
            </EuiCallOut>
            <EuiSpacer />
          </>
        )}
        <VoterInfo
          deceased={person?.deceased}
          darn={person?.key}
          id={person?.idNumber}
          salutation={person?.salutation}
          givenName={person?.givenName}
          firstName={person?.firstName}
          surname={person?.surname}
          dob={moment(person?.dob, 'YYYYMMDD').toDate()}
          colourCode={person?.colourCode}
          canvassedBy={person?.canvassedBy}
          livingStructure={person?.livingStructure}
          registeredStructure={person?.registeredStructure}
          membership={person?.membership}
          pubRep={person?.pubRep}
        />

        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Quick edits' }}>
          <QuickEdits
            deceased={person?.deceased}
            fields={person?.fields}
            onDeceasedChange={onChange}
            onMovedChange={onChange}
            onAddressChange={onChange}
          />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiForm fullWidth isInvalid={serverError !== ''} error={[serverError]}>
          <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
            <CanvassingTags fields={person?.fields} onChange={onChange} />
          </EuiFormFieldset>
          <EuiSpacer />
          <EuiFormFieldset legend={{ children: 'Affiliation' }}>
            <Affiliation
              affiliation={person?.affiliation}
              onChange={onChange}
              affiliationDate={person?.affiliation_date}
            />
          </EuiFormFieldset>
          <EuiSpacer />
          <EuiFormFieldset legend={{ children: 'Contact details' }}>
            <ContactDetails
              deceased={person.deceased}
              givenName={person?.givenName}
              language={person?.language}
              contacts={person?.contacts}
              onLanguageChange={onChange}
              onPhoneChange={onChange}
              onEmailChange={onChange}
              onPersonChange={onChange}
              salutation={person?.salutation as Salutation}
              onSalutationChange={onChange}
            />
          </EuiFormFieldset>
          <EuiSpacer />
          <EuiFormFieldset legend={{ children: 'Living Address' }}>
            <Address address={person?.address} onChange={onChange} />
          </EuiFormFieldset>
          <EuiSpacer />
          <EuiFormFieldset legend={{ children: 'Comments' }}>
            <Comments comments={person?.comments} onCommentChange={onChange} />
          </EuiFormFieldset>
          <EuiSpacer />
          <EuiFormFieldset legend={{ children: 'Tags' }}>
            <EuiFormRow display="rowCompressed">
              <VoterTags fields={person?.fields} onChange={onChange} />
            </EuiFormRow>
          </EuiFormFieldset>
          <EuiSpacer />
          <CanvassingSelectionDetails />
          <EuiSpacer />
          {!confirmed ? affiliationMessage : null}
          <EuiSpacer size="xs" />
          {data.contacts && validationError && validationErrorMessage}
          <EuiSpacer />
          {formActions}
        </EuiForm>
      </MainLayout>
    </>
  );
};

export default Voter;
