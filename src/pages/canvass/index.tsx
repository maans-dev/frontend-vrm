import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiCard,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiFormRow,
  EuiHorizontalRule,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { AdvancedSearchTooltip } from '@components/advanced-search-tooltip';

const Index: FunctionComponent = () => {
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
    {
      text: 'Voter search',
    },
  ];

  const formActions = (
    <>
      <EuiFlexGroup
        direction="row"
        responsive={false}
        justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty size="m">Reset</EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton size="m" fill>
            Search
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <EuiFlexGroup direction="row" justifyContent="center">
        <EuiFlexItem grow={true} css={{ maxWidth: '400px' }}>
          <EuiCard
            textAlign="left"
            title="Voter search"
            titleSize="xs"
            footer={formActions}>
            <EuiFormRow label="Identity" display="rowCompressed">
              <EuiFieldText
                name="id"
                compressed
                placeholder="ID Number, DARN or Membership number"
              />
            </EuiFormRow>

            <EuiHorizontalRule />

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

            <EuiHorizontalRule />

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
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default Index;
