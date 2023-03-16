import { EuiFormRow, EuiCallOut, EuiComboBox } from '@elastic/eui';
import { Affiliation } from '@lib/domain/person';
import { FunctionComponent, useState } from 'react';
import useAffiliationFetcher from '@lib/fetcher/affiliation/affiliation';

export type Props = {
  affiliation: Affiliation;
};

const Affiliation: FunctionComponent<Props> = ({ affiliation }) => {
  // console.log(affiliation.description);
  const { affiliations, isLoading, error } = useAffiliationFetcher();
  const [searchValue, setSearchValue] = useState('');
  if (error) {
    console.log(error);
  }

  const filteredOptions = affiliations
    ? affiliations.filter(
        affiliation =>
          affiliation.description
            .toLowerCase()
            .indexOf(searchValue.toLowerCase()) !== -1
      )
    : [];

  const options = searchValue ? filteredOptions : [];

  return (
    <>
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
          options={options.map(affiliation => ({
            label: affiliation.description,
          }))}
          selectedOptions={[{ label: affiliation.description }]}
          onChange={() => null}
          onSearchChange={value => setSearchValue(value)}
        />
      </EuiFormRow>
    </>
  );
};

export default Affiliation;
