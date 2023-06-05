import { FormEvent, FunctionComponent, useEffect, useState } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiCheckableCard,
  EuiDatePicker,
  EuiEmptyPrompt,
  EuiFieldText,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiLoadingChart,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiText,
  useGeneratedHtmlId,
} from '@elastic/eui';
import { AiOutlineUserAdd } from 'react-icons/ai';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { isValidRSAIDnumber } from '@lib/validation/idValidation';
import { useSession } from 'next-auth/react';
import { appsignal, redactObject } from '@lib/appsignal';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';

export type Props = {
  notFound?: boolean;
};

export interface IValidationErrors {
  firstName: string;
  surname: string;
  idNumber: string;
  dob: string;
}

const VoterAdd: FunctionComponent<Props> = ({ notFound }) => {
  const { data: session } = useSession();
  const [dob, setDob] = useState<Moment>();
  const [id, setId] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<IValidationErrors>
  >({});
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [searchId, setSearchId] = useState(null);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<'dob' | 'id'>();
  const { results, isLoading, error } = usePersonSearchFetcher(searchId);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => {
    setIsModalVisible(true);
    setValidationErrors({});
    setDob(null);
    setId('');
    setIsSubmitting(false);
    setServerError('');
  };

  const validate = (formData: FormData): boolean => {
    setValidationErrors({});
    const data = Object.fromEntries(formData);

    const errors: Partial<IValidationErrors> = {};

    if (!data.firstName) errors.firstName = 'First names is required';
    if (!data.surname) errors.surname = 'Surname is required';
    if (!data.idNumber && !data.dob) {
      errors.idNumber = 'Either ID or date of birth is required';
      errors.dob = 'Either ID or date of birth is required';
    }
    if (data?.idNumber) {
      const isValidId = isValidRSAIDnumber(data.idNumber);
      if (typeof isValidId === 'object') {
        errors.idNumber = isValidId.reason;
      } else if (!isValidId) {
        errors.idNumber = 'Enter a valid South African ID';
      }
    }
    if (Object.values(errors).length > 0) setValidationErrors(errors);

    return Object.values(errors).length === 0;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    const formData = new FormData(e.target as HTMLFormElement);
    if (!validate(formData)) return;

    setIsSubmitting(true);

    const reqPayload = Object.fromEntries(formData);
    if (reqPayload.dob === '') delete reqPayload.dob;
    if (reqPayload.idNumber === '') delete reqPayload.idNumber;

    (reqPayload as any).username = session.user.darn;
    console.log('[PERSON CREATE REQUEST]', reqPayload);
    appsignal.addBreadcrumb({
      category: 'Log',
      action: 'PERSON CREATE REQUEST',
      metadata: {
        request: redactObject(reqPayload),
      },
    });

    const url = `${process.env.NEXT_PUBLIC_API_BASE}/event/personcreate/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(reqPayload),
    });

    const respPayload = await response.json();

    if (response.ok) {
      const newPersonKey = respPayload.data.person.key;
      if (router.pathname.includes('/canvass/')) {
        router.push(`/canvass/voter/${newPersonKey}`);
      } else if (router.pathname.includes('/capture/')) {
        router.push(`/capture/voter/${newPersonKey}`);
      }
      closeModal();
    } else {
      setServerError(respPayload?.message || 'Something went wrong');
      const errJson = JSON.parse(await response.text());
      appsignal.sendError(
        new Error(`Unable to create person: ${errJson.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            body: redactObject(reqPayload),
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
    }
    setIsSubmitting(false);
    console.log('[PERSON CREATE RESPONSE]', respPayload);
    appsignal.addBreadcrumb({
      category: 'Log',
      action: 'PERSON CREATE RESPONSE',
      metadata: {
        response: redactObject(respPayload),
      },
    });
  };

  const handleDOBChange = (date: Moment) => {
    setDob(date);
    setUserExists(false);
  };

  const addFormId = useGeneratedHtmlId({ prefix: 'addVoterForm' });

  const form = (
    <div css={{ position: 'relative' }}>
      {isSubmitting && (
        <div
          className="modalSpinner"
          css={{
            width: '100%',
            height: '100%',
            background: '#ffffff90',
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
          }}>
          <EuiLoadingChart mono size="xl" />
        </div>
      )}
      <EuiForm
        id={addFormId}
        component="form"
        onSubmit={handleFormSubmit}
        isInvalid={serverError !== ''}
        error={[serverError]}>
        <EuiCallOut
          color="primary"
          size="s"
          title={
            <EuiText size="s">
              <ul>
                <li>Only add a person if you&apos;ve searched properly.</li>
                <li>Only add SA citizens</li>
              </ul>
            </EuiText>
          }
        />

        <EuiSpacer />

        <EuiFormFieldset
          legend={{ children: 'First names and surname (As on ID document)' }}>
          <EuiFormRow
            label="First name(s)"
            isInvalid={'firstName' in validationErrors}
            error={validationErrors?.firstName}>
            <EuiFieldText
              compressed
              id="firstName"
              name="firstName"
              autoComplete="off"
              onChange={e => {
                const uppercaseValue = e.target.value.toUpperCase();
                e.target.value = uppercaseValue;
              }}
            />
          </EuiFormRow>

          <EuiFormRow
            label="Surname"
            isInvalid={'surname' in validationErrors}
            error={validationErrors?.surname}>
            <EuiFieldText
              compressed
              id="surname"
              name="surname"
              autoComplete="off"
              onChange={e => {
                const uppercaseValue = e.target.value.toUpperCase();
                e.target.value = uppercaseValue;
              }}
            />
          </EuiFormRow>
        </EuiFormFieldset>

        <EuiSpacer />
        <EuiFormFieldset legend={{ children: 'Either SA ID or Date of birth' }}>
          <EuiCheckableCard
            id="IdNumber"
            label={
              <EuiText size="xs" style={{ marginTop: '-10px' }}>
                <strong>South African ID number</strong>
              </EuiText>
            }
            value={id}
            checked={selectedOption === 'id'}
            onChange={() => {
              setDob(null);
              setSelectedOption('id');
            }}>
            <EuiFormRow
              isInvalid={'idNumber' in validationErrors}
              error={validationErrors?.idNumber}>
              <EuiFieldText
                compressed
                style={{
                  marginTop: '-10px',
                }}
                id="idNumber"
                disabled={selectedOption === 'dob'}
                name="idNumber"
                autoComplete="off"
                value={id}
                isLoading={isLoading}
                maxLength={13}
                onChange={e => {
                  const idValue = e.target.value.replace(/[^0-9,+]/g, '');
                  setId(idValue);
                  setValidationErrors({});
                  setUserExists(false);
                  setSelectedOption('id');
                }}
              />
            </EuiFormRow>
          </EuiCheckableCard>

          <EuiSpacer />

          <EuiCheckableCard
            id="dob"
            label={
              <EuiText size="xs" style={{ marginTop: '-10px' }}>
                <strong>Date of birth</strong>
              </EuiText>
            }
            value="dob"
            checked={selectedOption === 'dob'}
            onChange={() => {
              setSelectedOption('dob');
              setValidationErrors({});
              setId('');
            }}>
            <EuiFormRow
              isInvalid={'dob' in validationErrors}
              error={validationErrors?.dob}>
              <EuiDatePicker
                css={{ marginTop: '-10px', maxHeight: '32px' }}
                disabled={selectedOption === 'id'}
                id="dob"
                name="dob"
                autoComplete="off"
                dateFormat={['YYYY-MM-DD']}
                selected={dob}
                maxDate={moment().subtract(17, 'year')}
                yearDropdownItemNumber={120}
                onChange={handleDOBChange}
              />
            </EuiFormRow>
          </EuiCheckableCard>
        </EuiFormFieldset>
      </EuiForm>
    </div>
  );

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="s">Add a new voter</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>{form}</EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={closeModal}>Cancel</EuiButtonEmpty>

          <EuiButton
            type="submit"
            form={addFormId}
            fill
            disabled={userExists || isLoading}>
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  useEffect(() => {
    if (id && id.length === 13) {
      setSearchId({ idNumber: id });
    } else {
      setSearchId(null);
    }
  }, [id]);

  useEffect(() => {
    if (results && id.length === 13) {
      if (results.length > 0) {
        // User exists
        setUserExists(true);
        setValidationErrors({ idNumber: 'This ID already exists' });
        setId('');
      } else {
        // User does not exist
        setUserExists(false);
        setValidationErrors({});
      }
    }
  }, [results, error, id.length]);

  return (
    <>
      {error && (
        <>
          <EuiCallOut color="danger" title="Something went wrong">
            <p>{error.message}</p>
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
      <EuiEmptyPrompt
        iconType={AiOutlineUserAdd}
        iconColor="primary"
        paddingSize="m"
        title={
          notFound ? (
            <h2>
              No voters found. <br /> Search again or add a new voter.
            </h2>
          ) : (
            <h2>Can&apos;t find the voter you&apos;re looking for?</h2>
          )
        }
        titleSize="xs"
        hasBorder={!notFound}
        body={
          <p>
            Only add a new voter if you&apos;re absolutely sure they don&apos;t
            already exist.
          </p>
        }
        hasShadow={true}
        actions={[
          <EuiButton key={2} size="s" color="primary" onClick={showModal}>
            Add a new voter
          </EuiButton>,
        ]}
      />
      {modal}
    </>
  );
};

export default VoterAdd;
