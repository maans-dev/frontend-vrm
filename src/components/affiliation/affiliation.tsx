import { EuiFormRow, EuiCallOut, EuiComboBox } from '@elastic/eui';
import { Affiliation } from '@lib/domain/person';
import { FunctionComponent, useMemo, useState } from 'react';
import useAffiliationFetcher from '@lib/fetcher/affiliation/affiliation';

type Props = {
  affiliation: Affiliation;
};

const AffiliationComponent: FunctionComponent<Props> = ({ affiliation }) => {
  const { affiliations, isLoading, error } = useAffiliationFetcher();
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<any[]>([
    { label: affiliation.description },
  ]);

  const filteredOptions = useMemo(() => {
    return (
      affiliations?.filter(
        affiliation => affiliation.description.indexOf(searchValue) !== -1
      ) || []
    );
  }, [affiliations, searchValue]);

  const options = searchValue ? filteredOptions : [];

  const handleChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
  };

  return (
    <>
      {error && (
        <EuiCallOut
          title="Error"
          color="danger"
          iconType="alert"
          size="s"
          style={{ marginBottom: '1rem' }}>
          {error.message}
        </EuiCallOut>
      )}
      <EuiFormRow display="row">
        <EuiCallOut
          title="Have you confirmed this voter's affiliation?"
          size="s"
          iconType="search"
        />
      </EuiFormRow>
      <EuiFormRow display="rowCompressed">
        <EuiComboBox
          compressed
          isClearable={false}
          isLoading={isLoading}
          aria-label="Select an affiliation"
          placeholder="Select an affiliation"
          singleSelection={{ asPlainText: true }}
          options={options.map(({ description }) => ({ label: description }))}
          selectedOptions={selectedOptions}
          onChange={selectedOptions => handleChange(selectedOptions)}
          onSearchChange={value => setSearchValue(value)}
        />
      </EuiFormRow>
    </>
  );
};

export default AffiliationComponent;
