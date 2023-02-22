import { FunctionComponent } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiSelect,
  EuiSplitPanel,
} from '@elastic/eui';
import MainLayout from '@layouts/main';

const Index: FunctionComponent = () => {
  return (
    <MainLayout>
      <EuiSplitPanel.Outer>
        <EuiSplitPanel.Inner>
          <EuiForm component="form">
            <EuiFormRow
              display="rowCompressed"
              label="ID search"
              helpText="ID Number, DARN or Membership number">
              <EuiFieldText name="id" compressed />
            </EuiFormRow>
            <EuiHorizontalRule />
            <EuiFormRow display="rowCompressed" label="Date of birth">
              <EuiDatePicker name="dob" />
            </EuiFormRow>

            <EuiFormRow display="rowCompressed" label="Surname">
              <EuiFlexGroup gutterSize="xs" responsive={false}>
                <EuiFlexItem>
                  <EuiFieldText name="surname" compressed />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    compressed
                    options={[
                      {
                        value: 'auto',
                        text: 'Auto',
                      },
                      {
                        value: 'contains',
                        text: 'Contains',
                      },
                      {
                        value: 'equals',
                        text: 'Equals',
                      },
                      {
                        value: 'startwith',
                        text: 'Starts with',
                      },
                      {
                        value: 'endswith',
                        text: 'Ends with',
                      },
                    ]}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFormRow>

            <EuiFormRow display="rowCompressed" label="First names">
              <EuiFlexGroup gutterSize="xs" responsive={false}>
                <EuiFlexItem>
                  <EuiFieldText name="first" compressed />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    compressed
                    options={[
                      {
                        value: 'auto',
                        text: 'Auto',
                      },
                      {
                        value: 'contains',
                        text: 'Contains',
                      },
                      {
                        value: 'equals',
                        text: 'Equals',
                      },
                      {
                        value: 'startwith',
                        text: 'Starts with',
                      },
                      {
                        value: 'endswith',
                        text: 'Ends with',
                      },
                    ]}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFormRow>

            <EuiHorizontalRule />

            <EuiFormRow display="rowCompressed" label="Email">
              <EuiFlexGroup gutterSize="xs" responsive={false}>
                <EuiFlexItem>
                  <EuiFieldText name="email" compressed />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    compressed
                    options={[
                      {
                        value: 'auto',
                        text: 'Auto',
                      },
                      {
                        value: 'contains',
                        text: 'Contains',
                      },
                      {
                        value: 'equals',
                        text: 'Equals',
                      },
                      {
                        value: 'startwith',
                        text: 'Starts with',
                      },
                      {
                        value: 'endswith',
                        text: 'Ends with',
                      },
                    ]}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFormRow>

            <EuiFormRow display="rowCompressed" label="Phone">
              <EuiFlexGroup gutterSize="xs" responsive={false}>
                <EuiFlexItem>
                  <EuiFieldText name="phone" compressed />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    compressed
                    options={[
                      {
                        value: 'auto',
                        text: 'Auto',
                      },
                      {
                        value: 'contains',
                        text: 'Contains',
                      },
                      {
                        value: 'equals',
                        text: 'Equals',
                      },
                      {
                        value: 'startwith',
                        text: 'Starts with',
                      },
                      {
                        value: 'endswith',
                        text: 'Ends with',
                      },
                    ]}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFormRow>
          </EuiForm>
        </EuiSplitPanel.Inner>
        <EuiSplitPanel.Inner color="subdued">
          <EuiButtonEmpty>Reset</EuiButtonEmpty>
          <EuiButton color="primary">Search</EuiButton>
        </EuiSplitPanel.Inner>
      </EuiSplitPanel.Outer>
    </MainLayout>
  );
};

export default Index;
