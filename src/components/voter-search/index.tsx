import { FunctionComponent, useEffect, useState } from 'react';
import SearchResults from './search-results';
import SearchOptions from './search-options';
import { PersonSearchParams } from '@lib/domain/person-search';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';
import { useRouter } from 'next/router';
import Spinner from '@components/spinner/spinner';

export type Props = {
  prop?: string;
};

const VoterSearch: FunctionComponent<Props> = () => {
  const router = useRouter();
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const { results, isLoading } = usePersonSearchFetcher(searchParams);

  console.log('results', results);

  const doSearch = (params: Partial<PersonSearchParams>) => {
    if (!params) return;
    // remove empty keys
    for (const key in params) {
      if (!params[key] || params[key] === '') delete params[key];
    }
    setSearchParams(params);
  };

  useEffect(() => {
    if (results?.length === 1) router.push(`/canvass/voter/${results[0].key}`);
  }, [results, router]);

  return (
    <>
      <Spinner show={isLoading || results?.length === 1} />
      <SearchOptions
        onSubmit={doSearch}
        as={results === null || results === undefined ? 'form' : 'modal'}
        isLoading={isLoading}
      />
      {results && !isLoading && results.length > 1 ? (
        <SearchResults results={results} />
      ) : null}
    </>
  );
};

export default VoterSearch;
