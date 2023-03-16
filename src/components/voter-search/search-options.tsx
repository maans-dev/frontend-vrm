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
    useState<Partial<PersonSearchParams>>();

  const [dob, setDob] = useState<Moment>();

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    console.log(event);
    const target = event.target as HTMLFormElement;
    const name = target.name;

    if (target.name === 'dob') return;

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
    setDob(date);
    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
        dob: date?.isValid ? date.format('YYYYMMDD') : null,
      };

      if (onChange) onChange(newValue);

      return newValue;
    });
  };

  const handleSubmit = () => {
    onSubmit(searchParams);
    handleReset();
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
    setDob(null);
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
          onClick={() => handleSubmit()}
          disabled={!searchParams}>
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
          value={searchParams?.identity}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker
          name="dob"
          dateFormat={['D MMM YYYY']}
          selected={dob}
          maxDate={moment().subtract(17, 'year')}
          yearDropdownItemNumber={120}
          onChange={handleDOBChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Surname">
        <EuiFieldText
          name="surname"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.surname}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="First names">
        <EuiFieldText
          name="firstName"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.firstName}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Email">
        <EuiFieldText
          name="email"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.email}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone">
        <EuiFieldText
          name="phone"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.phone}
        />
      </EuiFormRow>

      <EuiSpacer />
      {showFormActions ? formActions : null}
    </EuiForm>
  );
};

export default SearchOptions;
