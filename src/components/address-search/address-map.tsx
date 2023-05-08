import { FunctionComponent, useEffect, useState } from 'react';
import { EuiFieldText, EuiInputPopover } from '@elastic/eui';
import AddressResults from './address.results';
import { Address } from '@lib/domain/person';
export interface Props {
  address: Partial<Address>[];
  handleSearchChange: (searchTerm: string) => void;
  isLoading: boolean;
  onAddressChange: (selectedAddress: Partial<Address>) => void;
}

const AddressMap: FunctionComponent<Props> = ({
  handleSearchChange,
  address,
  isLoading,
  onAddressChange,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const input = (
    <EuiFieldText
      autoComplete="no"
      fullWidth={true}
      icon="search"
      isLoading={isLoading}
      compressed
      placeholder="E.g. 3 Kloof Street, Gardens"
      onChange={e => {
        handleSearchChange(e.target.value);
        setIsPopoverOpen(e.target.value.length >= 3);
      }}
      data-test-subj="searchMapInput"
      aria-label="Structure search"
    />
  );

  useEffect(() => {
    if (Array.isArray(address) && address.length === 0) {
      setIsPopoverOpen(false);
    }
  }, [address]);

  const handleSelectStructure = selected => {
    setIsPopoverOpen(false);

    const inputElement = document.querySelector(
      'input[aria-label="Structure search"]'
    ) as HTMLInputElement;

    if (inputElement) {
      inputElement.value = '';
    }

    if (selected && selected.label && selected.data) {
      if (onAddressChange) {
        onAddressChange(selected.value);
      }
    }
  };

  return (
    <>
      <EuiInputPopover
        fullWidth={true}
        input={input}
        isOpen={isPopoverOpen}
        closePopover={() => setIsPopoverOpen(false)}>
        {isPopoverOpen && address.length >= 1 && (
          <AddressResults address={address} onSelect={handleSelectStructure} />
        )}
      </EuiInputPopover>
    </>
  );
};

export default AddressMap;
