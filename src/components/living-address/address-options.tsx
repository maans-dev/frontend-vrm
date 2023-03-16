import { EuiForm, EuiFormRow, EuiFieldText, EuiSpacer } from '@elastic/eui';
import { Address } from '@lib/domain/person';
import { FunctionComponent } from 'react';

export type Props = {
  address: Address;
  onSubmit?: (options) => void;
};

const AddressOptions: FunctionComponent<Props> = ({ address }) => {
  return (
    <EuiForm fullWidth>
      <EuiFormRow label="Building Number" display="rowCompressed">
        <EuiFieldText name="Building Number" compressed />
      </EuiFormRow>
      <EuiFormRow label="Building Name" display="rowCompressed">
        <EuiFieldText name="Building Name" compressed />
      </EuiFormRow>
      <EuiFormRow label="Street Number" display="rowCompressed">
        <EuiFieldText
          name="Street Number"
          compressed
          value={address?.streetNo}
        />
      </EuiFormRow>
      <EuiFormRow label="Street Name" display="rowCompressed">
        <EuiFieldText
          name="Street Name"
          compressed
          value={address?.streetName}
        />
      </EuiFormRow>
      <EuiFormRow label="Suburb" display="rowCompressed">
        <EuiFieldText name="Suburb" compressed value={address?.suburb} />
      </EuiFormRow>
      <EuiFormRow label="City" display="rowCompressed">
        <EuiFieldText name="City" compressed value={address?.city} />
      </EuiFormRow>
      <EuiFormRow label="Postal code" display="rowCompressed">
        <EuiFieldText
          name="Postal code"
          compressed
          value={address?.postalCode}
        />
      </EuiFormRow>
      <EuiFormRow label="Province" display="rowCompressed">
        <EuiFieldText name="Province" compressed value={address?.province} />
      </EuiFormRow>
      <EuiSpacer />
    </EuiForm>
  );
};

export default AddressOptions;
