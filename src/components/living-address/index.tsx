import { CanvassingContext } from '@lib/context/canvassing.context';
import { Address } from '@lib/domain/person';
import {
  AddressUpdate,
  FieldsUpdate,
  PersonUpdate,
} from '@lib/domain/person-update';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import LivingAddress from './living-address';
import useTagFetcher from '@lib/fetcher/tags/tags';

export type Props = {
  address: Address;
  onChange: (
    address: PersonUpdate<AddressUpdate> | PersonUpdate<FieldsUpdate>
  ) => void;
};

const Address: FunctionComponent<Props> = ({ address, onChange }) => {
  const { nextId } = useContext(CanvassingContext);
  const { data: movedTag } = useTagFetcher('MVD');
  const [movedKey, setMovedKey] = useState<string>();

  const doChange = (address: Partial<Address>) => {
    const trimmedUpdate = {};

    Object.keys(address).forEach(key => {
      if (typeof address[key] === 'string') {
        trimmedUpdate[key] = address[key].trim();
      } else {
        trimmedUpdate[key] = address[key];
      }
    });
    onChange({
      field: 'address',
      data: trimmedUpdate,
      replace: true,
    });

    if (address?.deleted === true) {
      onChange({
        field: 'fields',
        data: {
          key: nextId(),
          value: true,
          field: {
            key: movedKey,
          },
        },
      });
    }
  };

  useEffect(() => {
    //Get Moved Tag Key
    if (movedTag) {
      const updatemovedKey = movedTag.map(tag => tag.key);
      setMovedKey(updatemovedKey[0]);
    }
  }, [movedTag]);

  return (
    <>
      <LivingAddress address={address} onChange={doChange} />
    </>
  );
};

export default Address;
