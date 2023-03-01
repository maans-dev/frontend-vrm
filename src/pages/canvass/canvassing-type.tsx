import { FunctionComponent, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormFieldset,
  EuiFormRow,
  EuiSpacer,
  EuiIcon,
  useGeneratedHtmlId,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';

const CanvassingType: FunctionComponent = () => {
  const [contactMethod, setContactMethod] = useState('face-to-face');
  const [card1Selected, setCard1] = useState(true);

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
    {
      text: 'Canvassing Type',
    },
  ];

  const card1Clicked = () => {
    setCard1(true);
  };

  const onContactMethodChange = id => {
    setContactMethod(id);
  };
  const basicButtonGroupPrefix = useGeneratedHtmlId({
    prefix: 'basicButtonGroup',
  });

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
            onClick={() => router.push('/canvass/voter-search')}>
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
              title="Canvassing Type"
              titleSize="xs"
              footer={formActions}>
              <EuiFormFieldset>
                <EuiFlexGroup gutterSize="s">
                  <EuiCard
                    icon={<EuiIcon size="xxl" type="graphApp" />}
                    title="Campaign 1"
                    selectable={{
                      onClick: card1Clicked,
                      isSelected: card1Selected,
                    }}
                  />
                  <EuiCard
                    icon={<EuiIcon size="xxl" type="graphApp" />}
                    title="Campaign 2"
                    selectable={{
                      onClick: () => {
                        null;
                      },
                    }}
                  />
                  <EuiCard
                    icon={<EuiIcon size="xxl" type="graphApp" />}
                    title="Campaign 3"
                    selectable={{
                      onClick: () => {
                        null;
                      },
                    }}
                  />
                  <EuiCard
                    icon={<EuiIcon size="xxl" type="graphApp" />}
                    title="Campaign 4"
                    selectable={{
                      onClick: () => {
                        null;
                      },
                    }}
                  />
                  <EuiCard
                    icon={<EuiIcon size="xxl" type="graphApp" />}
                    title="Campaign 5"
                    selectable={{
                      onClick: () => {
                        null;
                      },
                    }}
                  />
                </EuiFlexGroup>
              </EuiFormFieldset>
              <EuiSpacer />
              <EuiFormFieldset>
                <EuiFormRow label="How was the voter canvassed?">
                  <EuiButtonGroup
                    legend="Canvassing type"
                    color="primary"
                    options={[
                      {
                        id: 'face-to-face',
                        label: 'Face to Face',
                      },
                      {
                        id: 'telephone',
                        label: 'Telephone',
                      },
                    ]}
                    idSelected={contactMethod}
                    onChange={onContactMethodChange}
                    name={`${basicButtonGroupPrefix}-contact-method`}
                  />
                </EuiFormRow>
              </EuiFormFieldset>
              <EuiSpacer />
            </EuiCard>
          </EuiForm>
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default CanvassingType;
