import { FunctionComponent, useContext, useEffect } from 'react';
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
import { GeneralUpdate, PersonUpdate } from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const voterKey = router.query.voterKey as string;
  const { person, isLoading } = usePersonFetcher(voterKey);

  const {
    setPerson,
    setUpdatePayload,
    submitUpdatePayload,
    isSubmitting,
    isDirty,
    serverError,
    resetForm,
  } = useContext(CanvassingContext);

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

  if (isLoading) {
    return <MainLayout breadcrumb={breadcrumb} showSpinner={isLoading} />;
  }

  // if (error) {
  //   return (
  //     <EuiCallOut title="Error" color="danger" iconType="alert">
  //       {error}
  //     </EuiCallOut>
  //   );
  // }

  return (
    <MainLayout breadcrumb={breadcrumb} showSpinner={isSubmitting}>
      {/* {isComplete && successModal} */}
      <EuiPanel>
        <VoterInfo
          darn={person.key}
          salutation={person.salutation}
          givenName={person.givenName || person.firstName}
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
      <EuiForm fullWidth isInvalid={serverError !== ''} error={[serverError]}>
        <EuiFormFieldset legend={{ children: 'Canvassing tags' }}>
          <CanvassingTags fields={person.fields} onChange={onChange} />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Affiliation' }}>
          <Affiliation affiliation={person.affiliation} onChange={onChange} />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Contact details' }}>
          <ContactDetails
            language={person.language}
            contacts={person.contacts}
            onLanguageChange={onChange}
            onPhoneChange={onChange}
            onEmailChange={onChange}
          />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Living Address' }}>
          <Address address={person.address} />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Comments' }}>
          <Comments comments={person.comments} onCommentChange={onChange} />
        </EuiFormFieldset>
        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Tags' }}>
          <EuiFormRow display="rowCompressed">
            <VoterTags fields={person.fields} onChange={onChange} />
          </EuiFormRow>
        </EuiFormFieldset>
        <EuiSpacer />
        {formActions}
      </EuiForm>
    </MainLayout>
  );
};

export default Voter;
