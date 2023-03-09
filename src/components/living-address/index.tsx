import { FunctionComponent } from 'react';
import LivingAddress from './living-address';

export type Props = {
  prop?: string;
};

const Address: FunctionComponent<Props> = () => {
  return (
    <>
      <LivingAddress />
    </>
  );
};

export default Address;
