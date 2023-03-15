import { FunctionComponent, useState } from 'react';
import SearchResults from './search-results';
import { VoterSearchResult } from './types';
import SearchOptionsModal from './search-options-modal';
import SearchOptions from './search-options';
import { faker } from '@faker-js/faker';
import { PersonSearchParams } from '@lib/domain/person-search';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';

export type Props = {
  prop?: string;
};

const VoterSearch: FunctionComponent<Props> = () => {
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const { results, isLoading, error } = usePersonSearchFetcher(searchParams);

  const doSearch = (params: Partial<PersonSearchParams>) => {
    setSearchParams(params);
  };

  return (
    <>
      {!results ? <SearchOptions onSubmit={doSearch} /> : null}
      {results ? <SearchOptionsModal onSubmit={doSearch} /> : null}
      {results ? <SearchResults results={results} /> : null}
    </>
  );
};

export default VoterSearch;
