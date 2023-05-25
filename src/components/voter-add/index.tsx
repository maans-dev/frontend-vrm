import { FormEvent, FunctionComponent, useState } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
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
import { appsignal } from '@lib/appsignal';

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
        request: JSON.stringify(reqPayload),
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
            body: JSON.stringify(reqPayload),
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
        response: JSON.stringify(respPayload),
      },
    });
  };

  const handleDOBChange = (date: Moment) => {
    setDob(date);
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
          <EuiFormRow
            label="South African ID number"
            isInvalid={'idNumber' in validationErrors}
            error={validationErrors?.idNumber}>
            <EuiFieldText
              id="idNumber"
              name="idNumber"
              autoComplete="off"
              value={id}
              maxLength={13}
              minLength={13}
              onChange={e => setId(e.target.value.replace(/[^0-9,+]/g, ''))}
            />
          </EuiFormRow>

          <EuiFormRow
            label="Date of birth"
            isInvalid={'dob' in validationErrors}
            error={validationErrors?.dob}>
            <EuiDatePicker
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

          <EuiButton type="submit" form={addFormId} fill>
            Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  return (
    <>
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
