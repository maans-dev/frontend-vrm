import {
  EuiFormRow,
  EuiCallOut,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexItem,
  EuiText,
  EuiCheckbox,
  htmlIdGenerator,
  EuiSpacer,
  EuiFlexGrid,
} from '@elastic/eui';
import { Affiliation } from '@lib/domain/person';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import useAffiliationFetcher from '@lib/fetcher/affiliation/affiliation';
import { AffiliateUpdate, PersonUpdate } from '@lib/domain/person-update';
import { useCanvassFormReset } from '@lib/hooks/use-canvass-form-reset';
import { debounce } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';

type Props = {
  affiliation: Affiliation;
  affiliationDate: string;
  onChange: (update: PersonUpdate<AffiliateUpdate>) => void;
};

type AffliationOption = EuiComboBoxOptionOption<Affiliation>;

const AffiliationComponent: FunctionComponent<Props> = ({
  affiliation,
  affiliationDate,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const { affiliations, isLoading, error } = useAffiliationFetcher();
  const [selectedOption, setSelectedOption] = useState<AffliationOption>(
    affiliation &&
      (affiliation?.description !== null || affiliation?.name !== null)
      ? {
          label: affiliation?.description || affiliation?.name,
          value: affiliation,
        }
      : null
  );
  const [checkBox, setCheckBox] = useState(false);
  const [disabled, setDisabled] = useState<boolean>();
  const router = useRouter();
  const isDataCleanupPage = router.pathname.includes('/cleanup');

  const options = useMemo(() => {
    return affiliations?.map(a => ({
      label: `${a.description} (${a.name})`,
      value: a,
    }));
  }, [affiliations]);

  const handleChange = (selectedOptions: AffliationOption[]) => {
    if (!selectedOptions?.[0]?.value) return;

    setSelectedOption(selectedOptions[0]);
    let updateData: AffiliateUpdate;
    if (affiliation?.key !== selectedOptions[0]?.value?.key) {
      setCheckBox(true);
      setDisabled(true);
      updateData = {
        key: selectedOptions[0]?.value?.key,
        name: selectedOptions[0]?.value?.name,
        confirmed: true,
      };
    } else {
      setDisabled(false);
      updateData = {
        confirmed: true,
        key: selectedOptions[0]?.value?.key,
        name: selectedOptions[0]?.value?.name,
      };
    }
    onChange({
      field: 'affiliation',
      data: updateData,
    });
  };

  useCanvassFormReset(() => {
    setSelectedOption(
      affiliation &&
        (affiliation?.description !== null || affiliation?.name !== null)
        ? {
            label: affiliation?.description || affiliation?.name,
            value: affiliation,
          }
        : null
    );
  });

  const debouncedSearch = debounce(value => {
    setSearchValue(value || '');
  }, 300);

  const formattedDate = moment(affiliationDate).format('DD MMM YYYY');
  const daysAgo = moment(affiliationDate).fromNow(true);

  const handleCheckableCardChange = () => {
    let updateData: AffiliateUpdate;
    if (affiliation?.key === selectedOption.value.key) {
      if (checkBox) {
        setCheckBox(false);
        updateData = {
          confirmed: false,
          key: affiliation.key,
          name: affiliation.name,
        };
      } else {
        setCheckBox(true);
        updateData = {
          confirmed: true,
          key: affiliation.key,
          name: affiliation.name,
        };
      }
    }
    onChange({
      field: 'affiliation',
      data: updateData,
    });
  };

  useEffect(() => {
    if (
      affiliation &&
      (affiliation.description !== null || affiliation.name !== null)
    ) {
      setSelectedOption({
        label: affiliation.description || affiliation.name,
        value: affiliation,
      });
    } else {
      setSelectedOption(null);
    }
  }, [affiliation]);

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
      {!isDataCleanupPage && (
        <>
          <EuiCallOut
            title="Affiliation Confirmation Required"
            color="warning"
            iconType="alert"
            size="s"></EuiCallOut>
          <EuiSpacer size="m" />
        </>
      )}

      <EuiFlexGrid direction="row" alignItems="center" columns={2}>
        <EuiFormRow display="rowCompressed">
          <EuiComboBox
            compressed
            style={{ width: '350px' }}
            isClearable={false}
            isLoading={isLoading}
            aria-label="Select an affiliation"
            placeholder="Select an affiliation"
            singleSelection={{ asPlainText: true }}
            options={options}
            selectedOptions={selectedOption ? [selectedOption] : []}
            onChange={handleChange}
            onSearchChange={debouncedSearch}
          />
        </EuiFormRow>
        <EuiFlexItem>
          {selectedOption && (
            <EuiCheckbox
              id={htmlIdGenerator()()}
              label={
                !disabled ? (
                  <EuiText size="s">
                    Confirm the affiliation{' '}
                    <strong>{selectedOption?.label}</strong>
                  </EuiText>
                ) : (
                  <EuiText size="s">
                    Save to confirm the affiliation{' '}
                    <strong>{selectedOption?.label}</strong>
                  </EuiText>
                )
              }
              disabled={disabled}
              checked={checkBox}
              onChange={handleCheckableCardChange}
            />
          )}
        </EuiFlexItem>
      </EuiFlexGrid>

      <EuiSpacer size="m" />

      <EuiFlexItem>
        <EuiFlexItem>
          {affiliationDate ? (
            <EuiText size="xs">
              Last confirmed on{' '}
              <strong>
                {formattedDate} ({daysAgo} ago)
              </strong>
            </EuiText>
          ) : null}
        </EuiFlexItem>
      </EuiFlexItem>
    </>
  );
};

export default AffiliationComponent;
