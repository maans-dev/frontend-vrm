import { CanvassingContext } from '@lib/context/canvassing.context';
import { Address } from '@lib/domain/person';
import {
  AddressUpdate,
  FieldsUpdate,
  PersonUpdate,
} from '@lib/domain/person-update';
import { FunctionComponent, useContext } from 'react';
import LivingAddress from './living-address';

export type Props = {
  address: Address;
  onChange: (
    address: PersonUpdate<AddressUpdate> | PersonUpdate<FieldsUpdate>
  ) => void;
};

const Address: FunctionComponent<Props> = ({ address, onChange }) => {
  const { nextId } = useContext(CanvassingContext);

  const doChange = (address: Partial<Address>) => {
    onChange({
      field: 'address',
      data: address,
    });

    if (address && 'deleted' in address) {
      onChange({
        field: 'fields',
        data: {
          key: nextId(),
          value: true,
          field: {
            key: 'd615d744-3e66-6bf6-fa37-455c40dbb098',
          },
        },
      });
    }
  };

  return (
    <>
      <LivingAddress address={address} onChange={doChange} />
    </>
  );
};

export default Address;
