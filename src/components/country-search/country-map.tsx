import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFieldText,
  EuiFlexItem,
  EuiInputPopover,
  EuiSpacer,
} from '@elastic/eui';
import { Country } from '@lib/domain/country';
import CountryResults from './country-results';

export interface Props {
  countries: Country[];
  handleSearchChange: (searchTerm: string) => void;
  isLoading?: boolean;
  onSelect?: (label: string, country_code: string) => void;
}

const CountryMap: FunctionComponent<Props> = ({
  handleSearchChange,
  countries,
  isLoading,
  onSelect,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>();

  useEffect(() => {
    if (countries) {
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
    }
  }, [countries]);

  const input = (
    <EuiFieldText
      isLoading={isLoading}
      placeholder="Type to search for a country"
      onChange={e => {
        handleSearchChange(e.target.value);
      }}
      onClick={() => {
        setIsPopoverOpen(countries ? true : false);
      }}
      data-test-subj="searchMapInput"
      aria-label="Country search"
    />
  );

  const handleSelectStructure = selected => {
    setIsPopoverOpen(false);

    const inputElement = document.querySelector(
      'input[aria-label="Country search"]'
    ) as HTMLInputElement;

    if (inputElement) {
      inputElement.value = '';
    }

    if (onSelect) {
      const { label, data } = selected;
      onSelect(label, data);
    }
  };

  const handleDelete = () => {
    setSelectedCountry(null);
  };

  return (
    <>
      <EuiInputPopover
        input={input}
        isOpen={isPopoverOpen}
        closePopover={() => setIsPopoverOpen(false)}>
        <CountryResults
          countries={countries}
          onSelect={handleSelectStructure}
        />
      </EuiInputPopover>
      <EuiSpacer size="s" />
      {selectedCountry && (
        <EuiFlexItem>
          <EuiCheckableCard
            css={{
              borderColor: '#155FA2',
            }}
            id={selectedCountry?.country_code}
            label={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{selectedCountry?.country_code}</span>
                <span style={{ marginTop: '4px' }}>
                  {selectedCountry?.country}
                </span>
              </div>
            }
            checkableType="checkbox"
            checked={true}
            onChange={() => {
              handleDelete();
            }}
          />
        </EuiFlexItem>
      )}
    </>
  );
};

export default CountryMap;
