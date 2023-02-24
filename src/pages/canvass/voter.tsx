import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiCard,
  EuiComboBox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';

const Voter: FunctionComponent = () => {
  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
    {
      text: 'Voter search',
      href: '/canvass',
      onClick: e => {
        router.push('/canvass');
        e.preventDefault();
      },
    },
    {
      text: 'Voter edit',
    },
  ];

  const affilitions = [
    {
      label: 'Titan',
    },
    {
      label: 'Enceladus',
    },
    {
      label: 'Mimas',
    },
    {
      label: 'Dione',
    },
    {
      label: 'Iapetus',
    },
    {
      label: 'Phoebe',
    },
    {
      label: 'Rhea',
    },
    {
      label: 'Tethys',
    },
    {
      label: 'Hyperion',
    },
  ];

  const languages = [
    { id: 'Eng', label: 'Eng' },
    { id: 'Afr', label: 'Afr' },
    { id: 'Xho', label: 'Xho' },
    { id: 'Zul', label: 'Zul' },
    { id: 'Sot', label: 'Sot' },
    { id: 'Sep', label: 'Sep' },
    { id: 'Tsn', label: 'Tsn' },
    { id: 'Tso', label: 'Tso' },
    { id: 'Ven', label: 'Ven' },
    { id: 'Nbi', label: 'Nbi' },
    { id: 'Ssw', label: 'Ssw' },
    { id: '?', label: '?' },
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
        <EuiFlexItem grow={true} css={{ maxWidth: '800px' }}>
          <EuiCard
            textAlign="left"
            title="Voter edit"
            titleSize="xs"
            footer={formActions}>
            <EuiForm fullWidth>
              <EuiFormFieldset legend={{ children: 'Personal details' }}>
                <EuiFormRow display="rowCompressed" label="Surname">
                  <EuiFieldText
                    name="surname"
                    compressed
                    disabled
                    value="DOE"
                  />
                </EuiFormRow>

                <EuiFormRow display="rowCompressed" label="First names">
                  <EuiFieldText
                    name="firstNames"
                    compressed
                    disabled
                    value="JOHN"
                  />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed" label="Preferred name">
                  <EuiFieldText name="preferredName" compressed />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed">
                  <EuiSwitch
                    label="Deceased?"
                    // compressed
                    checked={true}
                    name="deceased"
                    onChange={() => null}
                  />
                </EuiFormRow>
              </EuiFormFieldset>

              <EuiSpacer />

              <EuiFormFieldset legend={{ children: 'Affiliation' }}>
                <EuiFormRow display="row">
                  <EuiCallOut
                    title="Have you confirmed this voter's affiliation?"
                    size="s"
                    iconType="search"
                  />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed">
                  <EuiComboBox
                    compressed
                    isClearable={false}
                    aria-label="Select an affiliation"
                    placeholder="Select an affiliation"
                    singleSelection={{ asPlainText: true }}
                    options={affilitions}
                    selectedOptions={[affilitions[2]]}
                    onChange={() => null}
                  />
                </EuiFormRow>
              </EuiFormFieldset>

              <EuiSpacer />

              <EuiFormFieldset legend={{ children: 'Contact details' }}>
                <EuiFormRow display="rowCompressed" label="Language">
                  <EuiComboBox
                    compressed
                    isClearable={false}
                    aria-label="Select voter language(s)"
                    placeholder="Select voter language(s)"
                    // singleSelection={{ asPlainText: true }}
                    options={languages}
                    selectedOptions={[languages[2], languages[4]]}
                    onChange={() => null}
                  />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed" label="Preferred name">
                  <EuiFieldText name="preferredName" compressed />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed" label="Phone numbers">
                  <></>
                </EuiFormRow>
                <EuiFormRow display="rowCompressed" label="Email addresses">
                  <></>
                </EuiFormRow>
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Living address' }}>
                <></>
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Comments' }}>
                <></>
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Tags' }}>
                <></>
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset legend={{ children: 'Custom fields' }}>
                <></>
              </EuiFormFieldset>
            </EuiForm>
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default Voter;
