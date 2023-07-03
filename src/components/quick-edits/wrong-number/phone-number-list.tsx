import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { EuiCheckableCard, EuiSpacer, useGeneratedHtmlId } from '@elastic/eui';
import React from 'react';
import { PhoneContact } from '@lib/domain/phone-numbers';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  phoneContact: PhoneContact;
  numberExistOnPerson?: { key: string }[] | null;
};

const PhoneNumberList: FunctionComponent<Props> = ({
  phoneContact,
  numberExistOnPerson,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(
    numberExistOnPerson.some(item => item.key === phoneContact.key)
  );
  const checkboxCardId = useGeneratedHtmlId({ prefix: 'checkboxCard' });
  const { setUpdatePayload } = useContext(CanvassingContext);

  useEffect(() => {
    setIsSelected(
      numberExistOnPerson.some(item => item.key === phoneContact.key)
    );
  }, [numberExistOnPerson, phoneContact]);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);

    if (isSelected) {
      // Handle deselection
      const update = {
        field: 'contacts',
        data: { deleted: false, key: phoneContact.key },
      };
      setUpdatePayload(update);
    } else {
      // Handle selection
      const update = {
        field: 'contacts',
        data: { deleted: true, key: phoneContact.key },
      };
      setUpdatePayload(update);
    }
  };

  return (
    <>
      <EuiCheckableCard
        css={{ height: '100%' }}
        id={checkboxCardId}
        label={`(${phoneContact.type.charAt(0).toUpperCase()}${phoneContact.type
          .slice(1)
          .toLowerCase()}) ${phoneContact.value}`}
        checkableType="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
      />
      <EuiSpacer size="xs" />
    </>
  );
};

export default PhoneNumberList;
