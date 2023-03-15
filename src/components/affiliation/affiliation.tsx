import { EuiFormRow, EuiCallOut, EuiComboBox } from '@elastic/eui';
import { Affiliation } from '@lib/domain/person';
import { FunctionComponent } from 'react';
import useAffiliationFetcher from '@lib/fetcher/affiliation/affiliation';

export type Props = {
  affiliation: Affiliation;
};

const Affiliation: FunctionComponent<Props> = ({ affiliation }) => {
  console.log(affiliation.description);
  const { affiliations, isLoading, error } = useAffiliationFetcher();
  if (error) {
    console.log(error);
  }

  const options = affiliations
    ? affiliations.map(affiliation => ({
        label: affiliation.description,
      }))
    : [];

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
          options={options}
          selectedOptions={[{ label: affiliation.description }]}
          onChange={() => null}
        />
      </EuiFormRow>
    </>
  );
};

export default Affiliation;
