import { AdvancedSearchTooltip } from '@components/form/advanced-search-tooltip';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiFormFieldset,
  EuiDatePicker,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import router from 'next/router';
import { FunctionComponent } from 'react';

export type Props = {
  prop?: string;
};

const SearchOptions: FunctionComponent<Props> = () => {
  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty size="m">Reset</EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          size="m"
          iconType="search"
          fill
          onClick={() => router.push('/canvass/voter')}>
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

      <EuiFormFieldset legend={{ children: 'Personal details' }}>
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
      </EuiFormFieldset>

      <EuiSpacer />

      <EuiFormFieldset legend={{ children: 'Contact details' }}>
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
      </EuiFormFieldset>
      <EuiSpacer />
      {formActions}
    </EuiForm>
  );
};

export default SearchOptions;
