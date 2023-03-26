import { FunctionComponent, useMemo } from 'react';
import VoterTags from './canvassing-tags';
import { Field } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';
import { EuiCallOut } from '@elastic/eui';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { shortCodes } from '@components/canvassing-tags';

export type Props = {
  fields: Field[];
  onTagChange: (update: PersonUpdate<VoterTagsUpdate>) => void;
};

const Tags: FunctionComponent<Props> = ({ fields, onTagChange }) => {
  //Voter fields exclude shortCodes
  const voterFields = useMemo(() => {
    return fields.filter(f => !shortCodes.includes(f.field.code));
  }, [fields]);

  const { data: partyTags, error, isLoading } = useTagFetcher();

  if (isLoading) {
    return <Spinner show={isLoading} />;
  }

  if (error) {
    return (
      <EuiCallOut
        title="Error"
        color="danger"
        iconType="alert"
        size="s"
        style={{ marginBottom: '1rem' }}>
        Error fetching tags. Please try again later.
      </EuiCallOut>
    );
  }

  return (
    <VoterTags
      fields={voterFields}
      onTagChange={onTagChange}
      partyTags={partyTags}
    />
  );
};

export default Tags;
