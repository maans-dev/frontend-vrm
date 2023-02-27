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
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiSpacer,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';
import { AdvancedSearchTooltip } from '@components/form/advanced-search-tooltip';

const Index: FunctionComponent = () => {
  const router = useRouter();
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
          <EuiButton
            size="m"
            fill
            onClick={() => router.push('/canvass/voter')}>
            Search
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );

  return (
    <MainLayout breadcrumb={breadcrumb}>
      <EuiFlexGroup direction="row" justifyContent="center">
        <EuiFlexItem grow={true} css={{ maxWidth: '800px' }}>
          <EuiForm fullWidth>
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
            </EuiCard>
          </EuiForm>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default Index;
