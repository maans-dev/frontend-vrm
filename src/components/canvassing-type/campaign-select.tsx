import { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiAccordion,
  EuiButtonEmpty,
  EuiCheckableCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from '@elastic/eui';
import { css, Global } from '@emotion/react';
import { Campaign } from '@lib/domain/person';

export type Props = {
  campaigns: Campaign[];
  selectedKey?: string;
  onChange: (campaign: Campaign) => void;
};

const CampaignSelect: FunctionComponent<Props> = ({
  campaigns,
  selectedKey,
  onChange,
}) => {
  const [selected, setSelected] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const handleChange = (campaign: Campaign) => {
    setSelected(campaign.key);
    onChange(campaign);
  };

  useEffect(() => {
    const c = JSON.parse(sessionStorage.getItem('campaign')) || null;
    if (c && c?.type?.name) {
      setOpenAccordionId(c.type.name);
    }
  }, []);

  useEffect(() => {
    if (selectedKey) setSelected(selectedKey);
  }, [campaigns, selectedKey]);

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  type GroupedCampaigns = Record<string, Campaign[]>;

  const groupedCampaigns: GroupedCampaigns = campaigns?.reduce(
    (acc, campaign) => {
      if (!acc[campaign.type.name]) {
        acc[campaign.type.name] = [];
      }
      acc[campaign.type.name].push(campaign);
      return acc;
    },
    {}
  );

  if (groupedCampaigns.hasOwnProperty('current')) {
    const currentCampaignIndex = groupedCampaigns['current'].findIndex(
      campaign => campaign.key === 'current'
    );
    if (currentCampaignIndex !== -1) {
      const [currentCampaign] = groupedCampaigns['current'].splice(
        currentCampaignIndex,
        1
      );
      groupedCampaigns['current'].unshift(currentCampaign);
    }
  }

  return (
    <>
      <Global
        styles={css`
          .campaign-selector .euiCheckableCard__label {
            font-weight: bold;
            padding-bottom: 7px;
            font-size: 12px;
          }
          .campaign-selector .euiSplitPanel__inner {
            padding: 7px;
          }
        `}
      />

      {Object.keys(groupedCampaigns).map((campaignType, index) => {
        return (
          <EuiAccordion
            buttonElement="button"
            key={campaignType}
            style={{ borderBottomColor: '#155fa2' }}
            extraAction={
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  size="s"
                  onClick={() => {
                    if (openAccordionId !== campaignType) {
                      setOpenAccordionId(
                        openAccordionId === campaignType ? null : campaignType
                      );
                    }
                  }}>
                  {openAccordionId === campaignType ||
                  (!openAccordionId && index === 0)
                    ? 'Hide'
                    : 'Show'}
                </EuiButtonEmpty>
              </EuiFlexItem>
            }
            id={campaignType}
            forceState={
              openAccordionId === campaignType ||
              (!openAccordionId && index === 0)
                ? 'open'
                : 'closed'
            }
            onToggle={() => {
              if (openAccordionId !== campaignType) {
                setOpenAccordionId(
                  openAccordionId === campaignType ? null : campaignType
                );
              }
            }}
            buttonContent={
              <EuiText size="s">
                <strong>
                  {groupedCampaigns[campaignType][0].type.description}
                </strong>
              </EuiText>
            }
            paddingSize="s">
            <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
              {groupedCampaigns[campaignType].map(campaign => (
                <EuiFlexItem key={campaign.key} grow={true}>
                  <EuiCheckableCard
                    id={campaign.key}
                    label={campaign.name}
                    checked={selected === campaign.key}
                    onChange={() => handleChange(campaign)}
                  />
                </EuiFlexItem>
              ))}
            </EuiFlexGroup>
          </EuiAccordion>
        );
      })}
    </>
  );
};

export default CampaignSelect;
