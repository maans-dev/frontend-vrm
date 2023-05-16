import React, { useState } from 'react';
import { EuiSelectable, EuiSelectableOption, EuiText } from '@elastic/eui';
import { Country } from '@lib/domain/country';

interface Props {
  countries?: Country[];
  onSelect?: (country: Country) => void;
}

export interface OptionData {
  country_code?: string;
  value: Country;
}

const CountryResults = ({ countries, onSelect }: Props) => {
  const [options, setOptions] = useState<
    Array<EuiSelectableOption<OptionData>>
  >(
    countries && Array.isArray(countries)
      ? countries.map(
          (country): EuiSelectableOption<OptionData> => ({
            label: country.country,
            data: {
              country_code: country.country_code,
            },
            isGroupLabel: false,
            value: country,
          })
        )
      : []
  );

  const renderOption = (option: EuiSelectableOption<OptionData>) => {
    return (
      <>
        <EuiText size="xs" className="eui-displayBlock">
          {option.label}
        </EuiText>
        <EuiText size="xs" color="subdued" className="eui-displayBlock">
          <small>{option.country_code}</small>
        </EuiText>
      </>
    );
  };

  const handleSelect = options => {
    setOptions(options);

    const selectedCountry = options.find(option => option.checked === 'on');
    onSelect(selectedCountry);
  };

  return (
    <>
      <EuiSelectable
        options={options}
        singleSelection="always"
        allowExclusions={false}
        onChange={handleSelect}
        renderOption={renderOption}
        listProps={{
          rowHeight: 50,
          showIcons: false,
        }}
        height={150}>
        {(list, search) => (
          <>
            {search}
            {list}
          </>
        )}
      </EuiSelectable>
    </>
  );
};

export default CountryResults;
