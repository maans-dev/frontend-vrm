import { Address } from '@lib/domain/person';
import { FunctionComponent } from 'react';
import LivingAddress from './living-address';

export type Props = {
  address: Address;
};

const Address: FunctionComponent<Props> = ({ address }) => {
  return (
    <>
      <LivingAddress address={address} />
    </>
  );
};

export default Address;
