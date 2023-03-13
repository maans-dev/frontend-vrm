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
import moment from 'moment';
import { FunctionComponent, useState } from 'react';

export type Props = {
  onSubmit?: (options) => void;
};

const SearchOptions: FunctionComponent<Props> = ({ onSubmit }) => {
  const [state, setState] = useState({
    id: '',
    dob: null,
    surname: '',
    first: '',
    email: '',
    phone: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDOBChange = date => {
    setState(prevState => ({
      ...prevState,
      dob: date,
    }));
  };

  const handleReset = () => {
    setState({
      id: '',
      dob: null,
      surname: '',
      first: '',
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
          onClick={() => onSubmit(state)}>
          Search
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <EuiForm fullWidth style={{ margin: 'auto' }} css={{ maxWidth: '600px' }}>
      <EuiFormRow label="Identity" display="rowCompressed">
        <EuiFieldText
          name="id"
          compressed
          placeholder="ID Number, DARN or Membership number"
          value={state.id}
          onChange={handleChange}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker
          name="dob"
          dateFormat="D MMM YYYY"
          selected={state.dob}
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
          value={state.surname}
          onChange={handleChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="First names">
        <EuiFieldText
          name="first"
          compressed
          append={<AdvancedSearchTooltip />}
          value={state.first}
          onChange={handleChange}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Email">
        <EuiFieldText
          name="email"
          compressed
          append={<AdvancedSearchTooltip />}
          value={state.email}
          onChange={handleChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone">
        <EuiFieldText
          name="phone"
          compressed
          append={<AdvancedSearchTooltip />}
          value={state.phone}
          onChange={handleChange}
        />
      </EuiFormRow>
      <EuiSpacer />
      {onSubmit ? formActions : null}
    </EuiForm>
  );
};

export default SearchOptions;
