import { EuiForm, EuiFormRow, EuiFieldText, EuiSpacer } from '@elastic/eui';
import { FunctionComponent } from 'react';

export type Props = {
  onSubmit?: (options) => void;
};

const AddressOptions: FunctionComponent<Props> = () => {
  return (
    <EuiForm fullWidth>
      <EuiFormRow label="Building Number" display="rowCompressed">
        <EuiFieldText name="Building Number" compressed />
      </EuiFormRow>
      <EuiFormRow label="Building Name" display="rowCompressed">
        <EuiFieldText name="Building Name" compressed />
      </EuiFormRow>
      <EuiFormRow label="Street Number" display="rowCompressed">
        <EuiFieldText name="Street Number" compressed />
      </EuiFormRow>
      <EuiFormRow label="Street Name" display="rowCompressed">
        <EuiFieldText name="Street Name" compressed />
      </EuiFormRow>
      <EuiFormRow label="Suburb" display="rowCompressed">
        <EuiFieldText name="Suburb" compressed />
      </EuiFormRow>
      <EuiFormRow label="City" display="rowCompressed">
        <EuiFieldText name="City" compressed />
      </EuiFormRow>
      <EuiFormRow label="Postal code" display="rowCompressed">
        <EuiFieldText name="Postal code" compressed />
      </EuiFormRow>
      <EuiFormRow label="Province" display="rowCompressed">
        <EuiFieldText name="Province" compressed />
      </EuiFormRow>
      <EuiSpacer />
    </EuiForm>
  );
};

export default AddressOptions;
