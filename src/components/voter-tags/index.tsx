import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import VoterTags from './canvassing-tags';
import { Field } from '@lib/domain/person';
import useTagFetcher from '@lib/fetcher/tags/tags';
import { PersonUpdate, VoterTagsUpdate } from '@lib/domain/person-update';
import { shortCodes } from '@components/canvassing-tags';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';

export type Props = {
  fields: Field[];
  onTagChange: (update: PersonUpdate<VoterTagsUpdate>) => void;
};

const Tags: FunctionComponent<Props> = ({ fields, onTagChange }) => {
  const voterFields = useMemo(() => {
    return fields.filter(f => !shortCodes.includes(f.field.code));
  }, [fields]);

  const [searchValue, setSearchValue] = useState('');
  const { data: partyTags } = useTagFetcher(searchValue);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // const [voterFields, setVoterFields] = useState<Field[]>([]);

  // useCanvassFormReset(() => {
  //   setVoterFields(fields.filter(f => !shortCodes.includes(f.field.code)));
  // });

  // useEffect(() => {
  //   const filteredVoterFields = fields.filter(
  //     f => !shortCodes.includes(f.field.code)
  //   );
  //   setVoterFields(filteredVoterFields);

  return (
    <VoterTags
      fields={voterFields}
      onTagChange={onTagChange}
      partyTags={partyTags}
      handleSearchChange={handleSearchChange}
      searchValue={searchValue}
    />
  );
};

export default Tags;
