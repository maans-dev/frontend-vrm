import React, { FunctionComponent, useContext } from 'react';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiText,
  EuiModalFooter,
  EuiButton,
  EuiSpacer,
} from '@elastic/eui';
import { PhoneContact } from '@lib/domain/phone-numbers';
import PhoneNumberList from './phone-number-list';
import { CanvassingContext } from '@lib/context/canvassing.context';
import router from 'next/router';
import { useAnalytics } from '@lib/hooks/useAnalytics';

interface Props {
  setPhoneDoesNotExist: (value: boolean) => void;
  setIsWrongNumberModalVisible: (value: boolean) => void;
  setWrongNumberContinue: (value: boolean) => void;
  phoneContacts: PhoneContact[];
  phoneDoesNotExist: boolean;
  numberExistOnPerson?: { key: string }[] | null;
}

const WrongNumberModal: FunctionComponent<Props> = ({
  setPhoneDoesNotExist,
  setIsWrongNumberModalVisible,
  setWrongNumberContinue,
  phoneDoesNotExist,
  numberExistOnPerson,
  phoneContacts,
}) => {
  const { data, submitUpdatePayload } = useContext(CanvassingContext);
  const { trackCustomEvent } = useAnalytics();
  return (
    <EuiModal
      onClose={() => {
        if (phoneDoesNotExist) {
          setPhoneDoesNotExist(false);
          setIsWrongNumberModalVisible(false);
        } else {
          setIsWrongNumberModalVisible(false);
          setWrongNumberContinue(false);
          // Restore Phone Number
          delete data.contacts;
        }
      }}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Remove wrong number?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          {phoneContacts.length < 1
            ? 'No phone numbers to remove, select continue'
            : 'Select the number that you would like to remove.'}
        </EuiText>
        <EuiSpacer size="m" />
        {phoneContacts?.map(phoneContact => (
          <>
            <PhoneNumberList
              phoneContact={phoneContact}
              numberExistOnPerson={numberExistOnPerson}
            />
          </>
        ))}
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButton
          onClick={() => {
            if (phoneDoesNotExist) {
              setPhoneDoesNotExist(false);
              setIsWrongNumberModalVisible(false);
            } else {
              setIsWrongNumberModalVisible(false);
              setWrongNumberContinue(false);
              // Restore Phone Numbers
              delete data.contacts;
            }
          }}>
          Cancel
        </EuiButton>
        <EuiButton
          onClick={() => {
            if (phoneContacts.length < 1) {
              router.push('/canvass/canvassing-type');
              trackCustomEvent(
                'Quick Edits',
                'Saved but No wrong number selected'
              );
            } else {
              submitUpdatePayload(true);
              trackCustomEvent('Quick Edits', 'Saved a Wrong number');
            }
          }}
          fill>
          {phoneContacts.length < 1 ? 'Continue' : 'Save'}
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};

export default WrongNumberModal;
