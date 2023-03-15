import { AdvancedSearchTooltip } from '@components/form/advanced-search-tooltip';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiDatePicker,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { PersonSearchParams } from '@lib/domain/person-search';
import moment, { Moment } from 'moment';
import { FormEvent, FunctionComponent, useState } from 'react';

export type Props = {
  showFormActions?: boolean;
  onSubmit?: (params: Partial<PersonSearchParams>) => void;
  onChange?: (params: Partial<PersonSearchParams>) => void;
};

const SearchOptions: FunctionComponent<Props> = ({
  showFormActions,
  onSubmit,
  onChange,
}) => {
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>(null);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLFormElement;
    const name = target.name;
    const value = target.value;
    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
        [name]: value,
      };

      if (onChange) onChange(newValue);

      return newValue;
    });
  };

  const handleDOBChange = (date: Moment) => {
    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
        dob: date?.isValid ? date.format('YYYYMMDD') : '',
      };

      if (onChange) onChange(newValue);

      console.log('dob', newValue);

      return newValue;
    });
  };

  const handleReset = () => {
    setSearchParams({
      identity: '',
      dob: null,
      surname: '',
      firstName: '',
      email: '',
      phone: '',
    });
  };

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty size="m" onClick={handleReset}>
          Reset
        </EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          size="m"
          iconType="search"
          fill
          onClick={() => onSubmit(searchParams)}>
          Search
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <EuiForm fullWidth component="form" onChange={handleChange}>
      <EuiFormRow label="Identity" display="rowCompressed">
        <EuiFieldText
          name="identity"
          compressed
          placeholder="ID Number, DARN or Membership number"
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker
          name="dob"
          dateFormat={['DD MMM YYYY', 'YYYYMMDD']}
          adjustDateOnChange={false}
          selected={
            searchParams?.dob ? moment(searchParams.dob, 'YYYYMMDD') : null
          }
          maxDate={moment().subtract(17, 'year')}
          yearDropdownItemNumber={120}
          onSelect={handleDOBChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Surname">
        <EuiFieldText
          name="surname"
          compressed
          append={<AdvancedSearchTooltip />}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="First names">
        <EuiFieldText
          name="firstName"
          compressed
          append={<AdvancedSearchTooltip />}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Email">
        <EuiFieldText
          name="email"
          compressed
          append={<AdvancedSearchTooltip />}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone">
        <EuiFieldText
          name="phone"
          compressed
          append={<AdvancedSearchTooltip />}
        />
      </EuiFormRow>

      <EuiSpacer />
      {showFormActions ? formActions : null}
    </EuiForm>
  );
};

export default SearchOptions;
