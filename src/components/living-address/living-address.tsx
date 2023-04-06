import { FunctionComponent, useState } from 'react';
import {
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
} from '@elastic/eui';
import {
  FaHouseUser,
  FaUndo,
  FaThumbtack,
  FaStoreAltSlash,
} from 'react-icons/fa';
import SearchAddressModal from './search-address-modal';
import { Address } from '@lib/domain/person';

export type Props = {
  address: Address;
  onSubmit?: (options) => void;
};

const LivingAddress: FunctionComponent<Props> = ({ address }) => {
  const [value, setValue] = useState('');

  const onChange = e => {
    setValue(e.target.value);
  };

  return (
    <>
      <EuiFlexGroup direction="column">
        <EuiFlexGroup
          direction="row"
          alignItems="center"
          responsive={false}
          gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButton iconType={FaHouseUser} iconSide="left">
              On Premise
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFieldText
              placeholder="Search address"
              value={value}
              onChange={e => onChange(e)}
              aria-label="Use aria labels when no actual label is in use"
              append={<EuiIcon type="search" />}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup
          direction="row"
          alignItems="center"
          responsive={true}
          gutterSize="s">
          <EuiFlexItem>
            <SearchAddressModal address={address} />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton iconType={FaStoreAltSlash}>Moved</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButton iconType={FaUndo}>Reset</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexItem>
          <EuiFormRow display="rowCompressed" label="Building Number">
            <EuiFieldText name="Building Number" compressed />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Building Name">
            <EuiFieldText name="Building Name" compressed />
          </EuiFormRow>
          <EuiFormRow display="rowCompressed" label="Address on File">
            <EuiFieldText
              compressed
              readOnly
              disabled
              value={address?.formatted || 'Unknown'}
            />
          </EuiFormRow>
        </EuiFlexItem>
        {address?.latitude && (
          <EuiFormRow display="rowCompressed" label="Address Geocoded">
            <EuiButton type="submit" iconType={FaThumbtack} size="s">
              {address?.latitude} {address?.longitude}
            </EuiButton>
          </EuiFormRow>
        )}
      </EuiFlexGroup>
    </>
  );
};

export default LivingAddress;
