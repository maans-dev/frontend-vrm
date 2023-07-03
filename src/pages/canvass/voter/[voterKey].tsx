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

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query['voterKey'] as string;
  const { person, isLoading, isValidating, error } = usePersonFetcher(voterKey);
  const [confirmed, setConfirmed] = useState(false);

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
    canvassUrlError,
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

  const onChange = (update: PersonUpdate<GeneralUpdate>) => {
    setUpdatePayload(update);
  };

  const onMovedOrDeceasedChange = (update: PersonUpdate<GeneralUpdate>) => {
    setUpdatePayload(update);
  };

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

  const formActions = (
    <>
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
            disabled={!isDirty || confirmed === false || !!validationError}
            isLoading={isSubmitting}
            onClick={() => submitUpdatePayload()}>
            Save
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );

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

  if (
    canvassUrlError ||
    (error && !isLoading && !isSubmitting && !isValidating && voterKey)
  ) {
    return (
      <MainLayout breadcrumb={breadcrumb} panelled={false}>
        <EuiCallOut
          title="Something went wrong"
          color="danger"
          iconType="error">
          {error?.message} {canvassUrlError}
        </EuiCallOut>
      </MainLayout>
    );
  }

  if (isLoading || isSubmitting || isValidating || !voterKey) {
    return (
      <MainLayout
        breadcrumb={breadcrumb}
        showSpinner={isLoading || isSubmitting || isValidating || !voterKey}
        panelled={false}
      />
    );
  }

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      showSpinner={isLoading || isSubmitting || isValidating}
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
        livingStructure={person?.livingStructure}
        registeredStructure={person?.registeredStructure}
        membership={person?.membership}
      />

      <EuiSpacer />
      <EuiFormFieldset legend={{ children: 'Quick edits' }}>
        <QuickEdits
          deceased={person?.deceased}
          fields={person?.fields}
          onDeceasedChange={onMovedOrDeceasedChange}
          onMovedChange={onMovedOrDeceasedChange}
          onAddressChange={onMovedOrDeceasedChange}
          onPhoneChange={onChange}
          contacts={person?.contacts}
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
            affiliationDate={person?.affiliation_date}
            onChange={onChange}
          />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Contact details' }}>
          <ContactDetails
            deceased={person?.deceased}
            givenName={person?.givenName}
            language={person?.language}
            contacts={person?.contacts}
            onLanguageChange={onChange}
            onPhoneChange={onChange}
            onEmailChange={onChange}
            onPersonChange={onChange}
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
        {data.contacts && validationError ? validationErrorMessage : null}
        <EuiSpacer />
        {formActions}
      </EuiForm>
    </MainLayout>
  );
};

export default Voter;
