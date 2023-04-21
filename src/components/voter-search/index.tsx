import { FunctionComponent, useEffect, useState } from 'react';
import SearchResults from './search-results';
import SearchOptions from './search-options';
import { PersonSearchParams } from '@lib/domain/person-search';
import usePersonSearchFetcher from '@lib/fetcher/person/person-search.fetcher';
import { useRouter } from 'next/router';
import MainLayout from '@layouts/main';
import { EuiBreadcrumb, EuiCallOut, EuiSpacer } from '@elastic/eui';

export type Props = {
  breadcrumb: EuiBreadcrumb[];
};

const VoterSearch: FunctionComponent<Props> = ({ breadcrumb }) => {
  const router = useRouter();
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const { results, isLoading, mutate, error } =
    usePersonSearchFetcher(searchParams);

  const doSearch = (params: Partial<PersonSearchParams>) => {
    if (!params) return;
    mutate();
    // remove empty keys
    for (const key in params) {
      if (!params[key] || params[key] === '') delete params[key];
    }
    setSearchParams(params);
  };

  useEffect(() => {
    if (results?.length === 1) {
      const redirectUrl = `voter/${results[0].key}`;
      router.push(redirectUrl);
    }
  }, [results, router, router.pathname]);

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      panelled={false}
      restrictWidth={results === null || results === undefined ? true : false}
      showSpinner={isLoading || results?.length === 1}>
      {error && (
        <>
          <EuiCallOut color="danger" title="Something went wrong">
            <p>{error.message}</p>
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
      {!isLoading || results?.length > 1 ? (
        <SearchOptions
          onSubmit={doSearch}
          as={results === null || results === undefined ? 'form' : 'modal'}
          isLoading={isLoading}
        />
      ) : null}
      {!isLoading && (results?.length > 1 || results?.length === 0) ? (
        <SearchResults results={results} />
      ) : null}
    </MainLayout>
  );
};

export default VoterSearch;
