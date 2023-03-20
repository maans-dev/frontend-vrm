import {
  EuiFormRow,
  EuiCallOut,
  EuiComboBox,
  EuiComboBoxOptionOption,
} from '@elastic/eui';
import { Affiliation } from '@lib/domain/person';
import { FunctionComponent, useMemo, useState } from 'react';
import useAffiliationFetcher from '@lib/fetcher/affiliation/affiliation';
import { AffiliateUpdate, PersonUpdate } from '@lib/domain/person-update';

type Props = {
  affiliation: Affiliation;
  onChange: (update: PersonUpdate<AffiliateUpdate>) => void;
};

type AffliationOption = EuiComboBoxOptionOption<Affiliation>;

const AffiliationComponent: FunctionComponent<Props> = ({
  affiliation,
  onChange,
}) => {
  const { affiliations, isLoading, error } = useAffiliationFetcher();
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<AffliationOption>({
    label: affiliation.description,
    value: affiliation,
  });

  const filteredOptions = useMemo(() => {
    return (
      affiliations?.filter(
        affiliation => affiliation.description.indexOf(searchValue) !== -1
      ) || []
    );
  }, [affiliations, searchValue]);

  const options = searchValue ? filteredOptions : [];

  const handleChange = (selectedOptions: AffliationOption) => {
    setSelectedOption(selectedOptions);

    let updateData: AffiliateUpdate;
    if (affiliation.key !== selectedOptions?.[0]?.value?.key) {
      updateData = {
        key: selectedOptions?.[0]?.value?.key,
        name: selectedOptions?.[0]?.value?.name,
      };
    } else {
      updateData = null;
    }
    onChange({
      field: 'affiliation',
      data: updateData,
    });
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
          options={options.map(item => ({
            label: item.description,
            value: item,
          }))}
          selectedOptions={[selectedOption]}
          onChange={selectedOptions => handleChange(selectedOptions[0])}
          onSearchChange={value => setSearchValue(value)}
        />
      </EuiFormRow>
    </>
  );
};

export default AffiliationComponent;
