import { FunctionComponent, useState } from 'react';
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormFieldset,
  EuiFormRow,
  EuiSpacer,
  EuiIcon,
  useGeneratedHtmlId,
  EuiText,
} from '@elastic/eui';
import MainLayout from '@layouts/main';
import { useRouter } from 'next/router';

const CanvassingType: FunctionComponent = () => {
  const [contactMethod, setContactMethod] = useState('face-to-face');
  const [selectedCards, setSelectedCards] = useState(null);

  const router = useRouter();
  const breadcrumb: EuiBreadcrumb[] = [
    {
      text: 'Canvass',
    },
    {
      text: 'Canvassing Type',
    },
  ];

  const handleCardClick = card => {
    setSelectedCards(card === selectedCards ? null : card);
  };

  const renderCheckIcon = card => {
    if (card === selectedCards) {
      return (
        <EuiIcon
          type="check"
          size="m"
          color="primary"
          style={{
            position: 'absolute',
            right: '0',
            lineHeight: '0',
          }}
        />
      );
    }
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
            Continue
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
            title="Canvassing Type"
            titleSize="xs"
            footer={formActions}>
            <EuiFormFieldset legend={{ children: 'Campaigns' }}>
              <EuiFlexGroup
                gutterSize="l"
                direction="column"
                alignItems="stretch">
                <EuiCard
                  textAlign="left"
                  titleSize="xs"
                  title="Red/Pink registration calling"
                  icon={renderCheckIcon('Card 1')}
                  onClick={() => handleCardClick('Card 1')}
                  footer={
                    <EuiFlexGroup
                      alignItems="flexStart"
                      justifyContent="flexStart">
                      <EuiFlexItem>
                        <EuiText size="xs">
                          <p>Cape Town</p>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  }
                />
                <EuiCard
                  textAlign="left"
                  titleSize="xs"
                  icon={renderCheckIcon('Card 2')}
                  title="Campaign 2024 Registration"
                  onClick={() => handleCardClick('Card 2')}
                  footer={
                    <EuiFlexGroup
                      alignItems="flexStart"
                      justifyContent="flexStart">
                      <EuiFlexItem>
                        <EuiText size="xs">
                          <p>Hermanus</p>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  }
                />
                <EuiCard
                  textAlign="left"
                  titleSize="xs"
                  icon={renderCheckIcon('Card 3')}
                  title="Campaign 2024 DAFor Confirm"
                  onClick={() => handleCardClick('Card 3')}
                  footer={
                    <EuiFlexGroup
                      alignItems="center"
                      justifyContent="flexStart">
                      <EuiFlexItem>
                        <EuiText size="xs">
                          <p>Struisbaai</p>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  }
                />
                <EuiCard
                  textAlign="left"
                  titleSize="xs"
                  icon={renderCheckIcon('Card 4')}
                  title="Comprehensive Telephone Canvassing"
                  onClick={() => handleCardClick('Card 4')}
                  footer={
                    <EuiFlexGroup
                      alignItems="center"
                      justifyContent="flexStart">
                      <EuiFlexItem>
                        <EuiText size="xs">
                          <p>Area</p>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  }
                />
                <EuiCard
                  textAlign="left"
                  titleSize="xs"
                  icon={renderCheckIcon('Card 5')}
                  title="Registration telephone and foot"
                  onClick={() => handleCardClick('Card 5')}
                  footer={
                    <EuiFlexGroup
                      alignItems="center"
                      justifyContent="flexStart">
                      <EuiFlexItem>
                        <EuiText size="xs">
                          <p>Area</p>
                        </EuiText>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  }
                />
              </EuiFlexGroup>
            </EuiFormFieldset>
            <EuiSpacer />
            <EuiFormFieldset
              legend={{ children: 'How was this voter canvassed?' }}>
              <EuiFormRow fullWidth>
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
        </EuiFlexItem>
      </EuiFlexGroup>
    </MainLayout>
  );
};

export default CanvassingType;
