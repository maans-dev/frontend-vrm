import { FunctionComponent, useEffect, useState } from 'react';
import VoterTags from './canvassing-tags';
import { Field, PartyTags } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import Spinner from '@components/spinner/spinner';
import { EuiCallOut } from '@elastic/eui';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { shortCodes } from '@components/canvassing-tags';
import { VoterTagsType } from '@lib/domain/voter-tags';

export type Props = {
  fields: Field[];
  onTagChange: (update: PersonUpdate<VoterTagsUpdate>) => void;
};

const Tags: FunctionComponent<Props> = ({ fields, onTagChange }) => {
  const [voterFields, setVoterFields] = useState<Field[]>([]);
  
  useEffect(() => {
    const filteredVoterFields = fields.filter(
      f => !shortCodes.includes(f.field.code)
    );
    setVoterFields(filteredVoterFields);
  }, [fields]);

  return (
    <>
      <VoterTags fields={voterFields} onTagChange={onTagChange} />
    </>
  );
};

export default Tags;
