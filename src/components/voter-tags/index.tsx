import { FunctionComponent } from 'react';
import VoterTags from './canvassing-tags';
import { Field } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';
import { EuiCallOut } from '@elastic/eui';

export type Props = {
  fields: Field[];
};

const Tags: FunctionComponent<Props> = ({ fields }) => {
  const { data, error, isLoading } = useTagFetcher();
  return (
    <>
      {isLoading && <Spinner show={isLoading} />}
      {error && (
        <EuiCallOut
          title="Error"
          color="danger"
          iconType="alert"
          size="s"
          style={{ marginBottom: '1rem' }}>
          Error fetching tags. Please try again later.
        </EuiCallOut>
      )}
      {!isLoading && !error && <VoterTags fields={fields} data={data} />}
    </>
  );
};

export default Tags;
