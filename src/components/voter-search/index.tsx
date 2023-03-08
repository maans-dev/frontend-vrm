import { FunctionComponent } from 'react';
import SearchOptions from './search-options';
import SearchResults from './search-results';

export type Props = {
  prop?: string;
};

const VoterSearch: FunctionComponent<Props> = () => {
  return (
    <>
      {/* <SearchOptions /> */}
      <SearchResults />
    </>
  );
};

export default VoterSearch;
