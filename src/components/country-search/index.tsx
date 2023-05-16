import React, { FunctionComponent, useEffect, useState } from 'react';
import { Country } from '@lib/domain/country';
import CountryMap from './country-map';
import useCountryFetcher from '@lib/fetcher/countries/countries';

export interface Props {
  onSelect?: (label: string, country_code: string) => void;
}

const CountrySearch: FunctionComponent<Props> = ({ onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const { countries } = useCountryFetcher(searchValue);
  const [countriesInternal, setCountriesInternal] =
    useState<Country[]>(countries);

  useEffect(() => {
    const filteredCountries = countries?.filter(
      country =>
        country.country_code !== 'ZA' && country.country_code !== 'south africa'
    );
    setCountriesInternal(filteredCountries);
  }, [countries, searchValue]);

  const handleSearchChange = event => {
    setSearchValue(event);
  };

  return (
    <CountryMap
      handleSearchChange={handleSearchChange}
      countries={countriesInternal}
      onSelect={onSelect}
    />
  );
};

export default CountrySearch;
