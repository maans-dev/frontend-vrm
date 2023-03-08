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
import { FunctionComponent } from 'react';

export type Props = {
  onSubmit?: (options) => void;
};

const SearchOptions: FunctionComponent<Props> = ({ onSubmit }) => {
  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty size="m">Reset</EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton size="m" iconType="search" fill onClick={() => onSubmit({})}>
          Search
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <EuiForm fullWidth>
      <EuiFormRow label="Identity" display="rowCompressed">
        <EuiFieldText
          name="id"
          compressed
          placeholder="ID Number, DARN or Membership number"
        />
      </EuiFormRow>

      <EuiSpacer />

      {/* <EuiFormFieldset legend={{ children: 'Personal details' }}> */}
      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker name="dob" />
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
          name="first"
          compressed
          append={<AdvancedSearchTooltip />}
        />
      </EuiFormRow>
      {/* </EuiFormFieldset> */}

      <EuiSpacer />

      {/* <EuiFormFieldset legend={{ children: 'Contact details' }}> */}
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
      {/* </EuiFormFieldset> */}
      <EuiSpacer />
      {onSubmit ? formActions : null}
    </EuiForm>
  );
};

export default SearchOptions;
