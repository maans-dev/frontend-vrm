import { FunctionComponent, useMemo } from 'react';
import VoterTags from './canvassing-tags';
import { Field } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';
import { EuiCallOut } from '@elastic/eui';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { shortCodes } from '@components/canvassing-tags';
import { VoterTagsType } from '@lib/domain/voter-tags';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';

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

  // const [voterFields, setVoterFields] = useState<Field[]>([]);

  // useCanvassFormReset(() => {
  //   setVoterFields(fields.filter(f => !shortCodes.includes(f.field.code)));
  // });

  // useEffect(() => {
  //   const filteredVoterFields = fields.filter(
  //     f => !shortCodes.includes(f.field.code)
  //   );
  //   setVoterFields(filteredVoterFields);

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
