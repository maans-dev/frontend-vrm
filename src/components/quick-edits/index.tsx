import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCheckableCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
} from '@elastic/eui';
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

interface Props {
  deceased: boolean;
  fields: Field[];
  hideMoved?: boolean;
  onDeceasedChange: (update: PersonUpdate<DeceasedUpdate>) => void;
  onMovedChange: (update: PersonUpdate<MovedUpdate>) => void;
  onAddressChange: (update: PersonUpdate<AddressUpdate>) => void;
}

export const MovedTagCode = ['MVD'];

const DeceasedOrMoved: FunctionComponent<Props> = ({
  deceased,
  fields,
  hideMoved,
  onDeceasedChange,
  onMovedChange,
}) => {
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

  const phoneNumberFromUrl = router.query['phone-number'];

  const handleDeceasedModalChange = () => {
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
    setIsDeceasedModalVisible(false);
    submitUpdatePayload(true);
  };

  const handleContinueDeceased = () => {
    setIsDeceasedModalVisible(false);
    const update: PersonUpdate<DeceasedUpdate> = {
      field: 'deceased',
      data: true,
    };
    onDeceasedChange(update);
  };

  const handleMovedModalChange = () => {
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
    setIsMovedModalVisible(false);
    submitUpdatePayload(true);
  };

  const handleWrongNumberChange = () => {
    if (numberExistOnPerson.length === 1 && !wrongNumberContinue) {
      setIsWrongNumberModalVisible(true);
      setWrongNumberContinue(true);
      const update = {
        field: 'contacts',
        data: { deleted: true, key: numberExistOnPerson[0].key },
      };
      setUpdatePayload(update);
    }
    if (wrongNumberContinue) {
      setWrongNumberContinue(false);
      setIsWrongNumberModalVisible(false);
      const update = {
        field: 'contacts',
        data: { deleted: false, key: numberExistOnPerson?.[0]?.key },
      };
      setUpdatePayload(update);
    }
    if (numberExistOnPerson.length < 1) {
      setIsWrongNumberModalVisible(true);
      setPhoneDoesNotExist(true);
    }
  };

  const deceasedModal = (
    <EuiModal
      onClose={() => setIsDeceasedModalVisible(false)}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Save now or continue?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          Voter is deceased, so no additional changes are required.
        </EuiText>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={handleContinueDeceased}>
          Continue
        </EuiButtonEmpty>
        <EuiButton onClick={handleSaveDeceased} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  const movedModal = (
    <EuiModal
      onClose={() => setIsMovedModalVisible(false)}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Save now or continue?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          Voter has moved, so no additional changes are required.
        </EuiText>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty
          onClick={() => {
            setIsMovedModalVisible(false);
          }}>
          Continue
        </EuiButtonEmpty>
        <EuiButton onClick={handleSaveMoved} fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  const wrongNumberModal = (
    <EuiModal
      onClose={() => {
        if (phoneDoesNotExist) {
          setPhoneDoesNotExist(false);
          setIsWrongNumberModalVisible(false);
        } else {
          setIsWrongNumberModalVisible(false);
          setWrongNumberContinue(false);
          //Restore Phone Number
          const update = {
            field: 'contacts',
            data: { deleted: false, key: numberExistOnPerson?.[0]?.key },
          };
          setUpdatePayload(update);
        }
      }}
      initialFocus="[name=popswitch]">
      <EuiModalHeader>
        <EuiModalHeaderTitle>Save now or continue?</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiText>
          Number does not belong to voter, remove number and save, no additional
          changes required.
        </EuiText>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty
          onClick={() => {
            if (phoneDoesNotExist) {
              setPhoneDoesNotExist(false);
              setIsWrongNumberModalVisible(false);
            }
            setIsWrongNumberModalVisible(false);
          }}>
          Continue
        </EuiButtonEmpty>
        <EuiButton
          fill
          onClick={() => {
            if (phoneDoesNotExist) {
              setPhoneDoesNotExist(false);
              setIsWrongNumberModalVisible(false);
            } else {
              setIsWrongNumberModalVisible(false);
              setWrongNumberContinue(false);
              //Restore Phone Number
              const update = {
                field: 'contacts',
                data: { deleted: false, key: numberExistOnPerson?.[0]?.key },
              };
              setUpdatePayload(update);
            }
          }}>
          Cancel
        </EuiButton>
        <EuiButton
          onClick={() => {
            submitUpdatePayload(true);
          }}
          fill>
          Save
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );

  useEffect(() => {
    setMovedField(movedTag);
    if (!isMovedInternalExist) {
      const updatedMovedInternal = data?.fields?.filter(
        f => f.field?.key === movedTag[0].key
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
      console.log({ tagUpdateKey }, data.fields);
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
    if (person?.contacts) {
      const phoneNumberExists = person.contacts.filter(
        contact => contact.value === phoneNumberFromUrl
      );
      setNumberExistOnPerson(phoneNumberExists);
    } else {
      setNumberExistOnPerson([]);
    }
  }, [person?.contacts, router.query['phone-number']]);

  return (
    <>
      {isDeceasedModalVisible ? (
        <EuiOverlayMask>{deceasedModal}</EuiOverlayMask>
      ) : null}

      {isMovedModalVisible ? (
        <EuiOverlayMask>{movedModal}</EuiOverlayMask>
      ) : null}

      {isWrongNumberModalVisible ? (
        <EuiOverlayMask>{wrongNumberModal}</EuiOverlayMask>
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

        {canvassPage && phoneNumberFromUrl && (
          <EuiFlexItem>
            <EuiCheckableCard
              id="wrong-number-modal"
              checked={wrongNumberContinue || phoneDoesNotExist}
              css={{ height: '100%' }}
              label="Number does not belong to voter?"
              checkableType="checkbox"
              onChange={handleWrongNumberChange}
            />
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </>
  );
};

export default DeceasedOrMoved;