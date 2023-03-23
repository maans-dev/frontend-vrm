import { FunctionComponent, useEffect, useState } from 'react';
import SearchResults from './search-results';
import SearchOptions from './search-options';
import { PersonSearchParams } from '@lib/domain/person-search';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';
import { useRouter } from 'next/router';
import MainLayout from '@layouts/main';
import { EuiBreadcrumb } from '@elastic/eui';

export type Props = {
  breadcrumb: EuiBreadcrumb[];
};

const VoterSearch: FunctionComponent<Props> = ({ breadcrumb }) => {
  const router = useRouter();
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const { results, isLoading } = usePersonSearchFetcher(searchParams);

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
    <MainLayout
      breadcrumb={breadcrumb}
      panelled={true}
      restrictWidth={true}
      showSpinner={isLoading || results?.length === 1}>
      <SearchOptions
        onSubmit={doSearch}
        as={results === null || results === undefined ? 'form' : 'modal'}
        isLoading={isLoading}
      />
      {results && !isLoading && results.length > 1 ? (
        <SearchResults results={results} />
      ) : null}
    </MainLayout>
  );
};

export default VoterSearch;
