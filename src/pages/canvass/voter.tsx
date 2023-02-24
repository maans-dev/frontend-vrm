import { FunctionComponent } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiCallOut,
  EuiCard,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiHorizontalRule,
  EuiSelectable,
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
            title="Voter edit"
            titleSize="xs"
            footer={formActions}>
            <EuiForm>
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

              <EuiHorizontalRule />

              <EuiFormFieldset legend={{ children: 'Affiliation' }}>
                <EuiFormRow display="row">
                  <EuiCallOut
                    title="Have you confirmed this voter's affiliation?"
                    size="s"
                    iconType="search"
                  />
                </EuiFormRow>
                <EuiFormRow display="rowCompressed">
                  <EuiSelectable
                    aria-label="Affiliation"
                    searchable
                    options={[
                      {
                        label: 'Titan',
                      },
                      {
                        label: 'Enceladus',
                      },
                      {
                        label: 'Mimas',
                        checked: 'on',
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
                    ]}
                    onChange={() => null}
                    singleSelection={'always'}
                    listProps={{ bordered: true }}>
                    {(list, search) => (
                      <>
                        {search}
                        {list}
                      </>
                    )}
                  </EuiSelectable>
                </EuiFormRow>
              </EuiFormFieldset>

              <EuiHorizontalRule />

              <EuiFormFieldset legend={{ children: 'Contact details' }}>
                <EuiFormRow display="rowCompressed" label="Language">
                  <EuiButtonGroup
                    legend="Language"
                    name="Language"
                    options={[
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
                    ]}
                    idSelected="Eng"
                    onChange={optionId => null}
                    buttonSize="compressed"
                    isFullWidth
                  />
                </EuiFormRow>
              </EuiFormFieldset>
            </EuiForm>
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default Voter;
