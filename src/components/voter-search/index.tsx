import { FunctionComponent, useState } from 'react';
import SearchResults from './search-results';
import SearchOptionsModal from './search-options-modal';
import SearchOptions from './search-options';
import { PersonSearchParams } from '@lib/domain/person-search';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';

export type Props = {
  prop?: string;
};

const VoterSearch: FunctionComponent<Props> = () => {
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const { results, isLoading, error } = usePersonSearchFetcher(searchParams);

  console.log('results', results);

  const doSearch = (params: Partial<PersonSearchParams>) => {
    if (!params) return;
    // remove empty keys
    for (const key in params) {
      if (!params[key] || params[key] === '') delete params[key];
    }
    setSearchParams(params);
  };

  return (
    <>
      <SearchOptions
        onSubmit={doSearch}
        as={results === null || results === undefined ? 'form' : 'modal'}
      />
      {results ? <SearchResults results={results} /> : null}
    </>
  );
};

export default VoterSearch;
