import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EuiCheckableCard, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import {
  PersonUpdate,
  DeceasedUpdate,
  MovedUpdate,
  AddressUpdate,
} from '@lib/domain/person-update';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { Contact, Field, FieldMetaData } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import router from 'next/router';
import { PhoneContact } from '@lib/domain/phone-numbers';
import DeceasedModal from './deceased-modal';
import MovedModal from './moved-modal';
import WrongNumberModal from './wrong-number/wrong-number-modal';
import { useAnalytics } from '@lib/hooks/useAnalytics';

interface Props {
  deceased: boolean;
  fields: Field[];
  hideMoved?: boolean;
  contacts?: Contact[];
  onDeceasedChange: (update: PersonUpdate<DeceasedUpdate>) => void;
  onMovedChange: (update: PersonUpdate<MovedUpdate>) => void;
  onAddressChange: (update: PersonUpdate<AddressUpdate>) => void;
}

export const MovedTagCode = ['MVD'];

const QuickEdits: FunctionComponent<Props> = ({
  deceased,
  fields,
  hideMoved,
  contacts,
  onDeceasedChange,
  onMovedChange,
}) => {
  const [phoneContacts] = useState<PhoneContact[]>(
    contacts
      ?.filter(contact => contact.category !== 'EMAIL')
      .map(contact => ({
        key: contact.key,
        value: contact?.value,
        type: contact.type,
        category: contact.category,
        canContact: contact.canContact,
      }))
  );
  const { nextId, person, submitUpdatePayload, setUpdatePayload, data } =
    useContext(CanvassingContext);
  const { data: movedTag } = useTagFetcher('MVD');
  const [movedField, setMovedField] = useState<FieldMetaData[]>();
  const [isDeceasedModalVisible, setIsDeceasedModalVisible] = useState(false);
  const [deceasedInternal, setDeceasedInternal] = useState<boolean>(deceased);
  const [numberExistOnPerson, setNumberExistOnPerson] = useState<Contact[]>();
  const [isWrongNumberModalVisible, setIsWrongNumberModalVisible] =
    useState(false);
  const [wrongNumberContinue, setWrongNumberContinue] = useState(false);
  const canvassPage = router.asPath.includes('/canvass');
  const [isMovedModalVisible, setIsMovedModalVisible] = useState(false);
  const [movedInternal, setMovedInternal] = useState<Field[]>(
    fields?.filter(f => MovedTagCode.includes(f.field.code))
  );
  const [isMovedInternalExist, setIsMovedInternalExist] = useState<boolean>(
    Boolean(movedInternal && movedInternal.length > 0)
  );
  const [phoneDoesNotExist, setPhoneDoesNotExist] = useState<boolean>();
  const { trackCustomEvent } = useAnalytics();
  const callCenterMode = router.query['phone-number'];

  const handleDeceasedModalChange = () => {
    trackCustomEvent('Quick Edits', 'Deceased Modal Clicked');

    // Deceased is true, so deselect & update payload
    if (deceasedInternal) {
      setDeceasedInternal(false);
      const update: PersonUpdate<DeceasedUpdate> = {
        field: 'deceased',
        data: false,
      };
      setUpdatePayload(update);
    }
    // Deceased is false, so select & show modal
    if (!deceasedInternal) {
      setIsDeceasedModalVisible(true);
      setDeceasedInternal(true);
      const update: PersonUpdate<DeceasedUpdate> = {
        field: 'deceased',
        data: true,
      };
      setUpdatePayload(update);
    }
  };

  const handleSaveDeceased = () => {
    trackCustomEvent('Quick Edits', 'Saved Deceased');

    setIsDeceasedModalVisible(false);
    submitUpdatePayload(true);
  };

  const handleContinueDeceased = () => {
    trackCustomEvent('Quick Edits', 'Continue Deceased');

    setIsDeceasedModalVisible(false);
    const update: PersonUpdate<DeceasedUpdate> = {
      field: 'deceased',
      data: true,
    };
    onDeceasedChange(update);
  };

  const handleMovedModalChange = () => {
    trackCustomEvent('Quick Edits', 'Moved Modal Clicked');

    if (isMovedInternalExist) {
      setIsMovedInternalExist(false);
      setIsMovedModalVisible(false);
      //Moved Tag Update
      if (movedInternal?.length > 0) {
        const tagUpdate = {
          key: movedInternal[0]?.key,
          deleted: true,
        } as Partial<Field>;
        onMovedChange({
          field: 'fields',
          data: tagUpdate,
        });
      }
      //Restore Address
      const addressUpdate: PersonUpdate<AddressUpdate> = {
        field: 'address',
        data: {
          key: person?.address?.key,
          deleted: false,
        },
      };
      setUpdatePayload(addressUpdate);
    }
    if (!isMovedInternalExist) {
      setIsMovedInternalExist(true);
      setIsMovedModalVisible(true);
      //Address Update Moved
      const addressUpdate: PersonUpdate<AddressUpdate> = {
        field: 'address',
        data: {
          key: person?.address?.key,
          deleted: true,
        },
      };
      setUpdatePayload(addressUpdate);
      //Moved Tag Update, only set to true if Address is deleted
      if (addressUpdate) {
        const tagUpdate = {
          key: nextId(),
          value: true,
          field: { key: movedField[0].key },
        } as Partial<Field>;
        onMovedChange({
          field: 'fields',
          data: tagUpdate,
        });
      }
    }
  };

  const handleSaveMoved = () => {
    trackCustomEvent('Quick Edits', 'Saved Moved');

    setIsMovedModalVisible(false);
    submitUpdatePayload(true);
  };

  const handleWrongNumberChange = () => {
    trackCustomEvent('Quick Edits', 'Wrong Number Modal Clicked');

    if (numberExistOnPerson.length === 1 && !wrongNumberContinue) {
      setIsWrongNumberModalVisible(true);
      const update = {
        field: 'contacts',
        data: { deleted: true, key: numberExistOnPerson[0].key },
      };
      setUpdatePayload(update);
    }
    if (numberExistOnPerson.length < 1) {
      setIsWrongNumberModalVisible(true);
      setPhoneDoesNotExist(true);
    }
  };

  useEffect(() => {
    setMovedField(movedTag);
    if (!isMovedInternalExist) {
      const updatedMovedInternal = data?.fields?.filter(
        f => f.field?.key === movedTag?.[0].key
      );
      setMovedInternal(updatedMovedInternal);
      setIsMovedInternalExist(
        Boolean(updatedMovedInternal && updatedMovedInternal.length > 0)
      );
    }
  }, [data?.fields, isMovedInternalExist, fields, movedTag]);

  useEffect(() => {
    //User had Moved Disabled, entered an address, so remove from update payload
    if (data?.address?.deleted === false) {
      setIsMovedInternalExist(false);
      const tagUpdateKey = data?.fields?.filter(
        f => f?.field?.key === movedTag[0].key
      );
      if (!tagUpdateKey?.[0]?.field?.key) return;
      const tagUpdate = {
        key: tagUpdateKey?.[0]?.key,
      } as Partial<Field>;
      onMovedChange({
        field: 'fields',
        data: tagUpdate,
      });
    }
  }, [data?.address?.deleted, movedField, movedInternal]);

  useEffect(() => {
    //User has Moved Enabled but selects address, so remove & update tag
    if (!movedInternal?.[0]?.key) return;
    if (data?.address?.deleted === false) {
      const tagUpdateI = {
        key: movedInternal?.[0]?.key,
        deleted: true,
      } as Partial<Field>;
      onMovedChange({
        field: 'fields',
        data: tagUpdateI,
      });
    }
  }, [data?.address?.deleted, movedField, movedInternal]);

  //Update state if URL with phone-number exist on Person
  useEffect(() => {
    const phoneNumberFromUrl = router.query['phone-number'];
    if (person?.contacts && router.query['phone-number']) {
      const phoneNumberExists = person.contacts.filter(
        contact => contact.value === phoneNumberFromUrl
      );
      setNumberExistOnPerson(phoneNumberExists);
    } else {
      setNumberExistOnPerson([]);
    }
  }, [person?.contacts, callCenterMode]);

  return (
    <>
      {isDeceasedModalVisible ? (
        <DeceasedModal
          handleSaveDeceased={handleSaveDeceased}
          handleContinueDeceased={handleContinueDeceased}
          setIsDeceasedModalVisible={setIsDeceasedModalVisible}
        />
      ) : null}

      {isMovedModalVisible ? (
        <MovedModal
          setIsMovedModalVisible={setIsMovedModalVisible}
          handleSaveMoved={handleSaveMoved}
        />
      ) : null}

      {isWrongNumberModalVisible ? (
        <WrongNumberModal
          phoneContacts={phoneContacts}
          phoneDoesNotExist={phoneDoesNotExist}
          setPhoneDoesNotExist={setPhoneDoesNotExist}
          setIsWrongNumberModalVisible={setIsWrongNumberModalVisible}
          setWrongNumberContinue={setWrongNumberContinue}
          numberExistOnPerson={numberExistOnPerson}
        />
      ) : null}

      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem grow={hideMoved ? false : true}>
          <EuiCheckableCard
            id="deceased-modal"
            checked={deceasedInternal}
            css={{ height: '100%' }}
            label="Deceased?"
            checkableType="checkbox"
            onChange={handleDeceasedModalChange}
          />
        </EuiFlexItem>

        {!hideMoved && (
          <EuiFlexItem>
            <EuiCheckableCard
              id="moved-modal"
              checked={isMovedInternalExist}
              css={{ height: '100%' }}
              label="Moved?"
              checkableType="checkbox"
              onChange={handleMovedModalChange}
            />
          </EuiFlexItem>
        )}

        {canvassPage && (
          <EuiFlexItem>
            <EuiCheckableCard
              id="wrong-number-modal"
              checked={wrongNumberContinue || phoneDoesNotExist}
              css={{ height: '100%' }}
              label="Wrong number?"
              checkableType="checkbox"
              onChange={handleWrongNumberChange}
            />
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </>
  );
};

export default QuickEdits;
