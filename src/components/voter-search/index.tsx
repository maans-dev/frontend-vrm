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

  const [activePage, setActivePage] = useState(0);
  const [rowSize, setRowSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  const { results, count, isLoading, mutate, error } = usePersonSearchFetcher(
    searchParams,
    rowSize,
    rowSize * activePage
  );

  const onChangeItemsPerPage = (pageSize: number) => {
    setPageCount(Math.ceil(count / pageSize));
    setRowSize(pageSize);
    setActivePage(0);
  };

  const onChangePage = (page: number) => {
    setActivePage(page);
  };

  useEffect(() => {
    if (count) setPageCount(Math.ceil(count / rowSize));
  }, [rowSize, count]);

  const doSearch = (params: Partial<PersonSearchParams>) => {
    if (!params) return;
    mutate();
    // remove empty keys
    for (const key in params) {
      if (!params[key] || params[key] === '') delete params[key];
    }
    setActivePage(0);
    setPageCount(0);
    setSearchParams(params);
  };

  useEffect(() => {
    if (count === 1) {
      const redirectUrl = `voter/${results[0].key}`;
      router.push(redirectUrl);
    }
  }, [count, results, router, router.pathname]);

  return (
    <MainLayout
      breadcrumb={breadcrumb}
      panelled={false}
      restrictWidth={results === null || results === undefined ? true : false}
      showSpinner={isLoading || count === 1}>
      {error && (
        <>
          <EuiCallOut color="danger" title="Something went wrong">
            <p>{error.message}</p>
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
      {!isLoading || count > 1 ? (
        <SearchOptions
          onSubmit={doSearch}
          as={results === null || results === undefined ? 'form' : 'modal'}
          isLoading={isLoading}
        />
      ) : null}
      {!isLoading && (count > 1 || count === 0) ? (
        <SearchResults
          results={results}
          pageCount={pageCount}
          activePage={activePage}
          itemsPerPage={rowSize}
          onChangeItemsPerPage={onChangeItemsPerPage}
          onChangePage={onChangePage}
        />
      ) : null}
    </MainLayout>
  );
};

export default VoterSearch;
