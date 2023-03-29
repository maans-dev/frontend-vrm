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
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';

type Props = {
  affiliation: Affiliation;
  onChange: (update: PersonUpdate<AffiliateUpdate>) => void;
};

type AffliationOption = EuiComboBoxOptionOption<Affiliation>;

const AffiliationComponent: FunctionComponent<Props> = ({
  affiliation,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { affiliations, isLoading, error } = useAffiliationFetcher(true);
  const [selectedOption, setSelectedOption] = useState<AffliationOption>(
    affiliation
      ? {
          label: affiliation?.description || affiliation?.name,
          value: affiliation,
        }
      : null
  );

  const options = useMemo(() => {
    return affiliations?.map(a => ({ label: a.description, value: a }));
  }, [affiliations]);

  const handleChange = (selectedOptions: AffliationOption[]) => {
    if (!selectedOptions?.[0]?.value) return;

    setSelectedOption(selectedOptions[0]);

    let updateData: AffiliateUpdate;
    if (affiliation?.key !== selectedOptions[0]?.value?.key) {
      updateData = {
        key: selectedOptions[0]?.value?.key,
        name: selectedOptions[0]?.value?.name,
      };
    } else {
      updateData = null;
    }
    onChange({
      field: 'affiliation',
      data: updateData,
    });
  };

  useCanvassFormReset(() => {
    setSelectedOption({
      label: affiliation?.description || affiliation?.name,
      value: affiliation,
    });
  });

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
          options={searchValue ? options : []}
          selectedOptions={selectedOption ? [selectedOption] : []}
          onChange={handleChange}
          onSearchChange={value => setSearchValue(value || '')}
        />
      </EuiFormRow>
    </>
  );
};

export default AffiliationComponent;
