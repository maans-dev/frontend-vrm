import { FunctionComponent } from 'react';
import {
  EuiAccordion,
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiTitle,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import moment from 'moment';
import {
  CanvassedBy,
  ColourCode,
  LivingStructure,
  Membership,
  RegisteredStructure,
} from '@lib/domain/person';
import { GiHouse } from 'react-icons/gi';
import { MdHowToVote } from 'react-icons/md';
import { renderName } from '@lib/person/utils';
import { useStickyVoterInfo } from '@lib/hooks/useStickyVoterInfo';
import { css } from '@emotion/react';

export type Props = {
  deceased?: boolean;
  darn: number;
  salutation: string;
  givenName: string;
  surname: string;
  dob: Date;
  colourCode: ColourCode;
  modified: Date;
  canvassedBy: CanvassedBy;
  livingStructure: LivingStructure;
  registeredStructure: RegisteredStructure;
  membership: Membership;
};

const VoterInfo: FunctionComponent<Props> = ({
  deceased,
  darn,
  salutation,
  givenName,
  surname,
  dob,
  colourCode,
  modified,
  canvassedBy,
  livingStructure,
  registeredStructure,
  membership,
}) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const { offsetTopRefEl, offsetTop } = useStickyVoterInfo();

  const getBadgeColour = () => {
    if (deceased) return '#cccccc';

    if (colourCode?.colour && colourCode?.colour !== 'FFFFFF')
      return `#${colourCode.colour}`;

    return 'hollow';
  };

  const renderExtraInfo = (
    <>
      <EuiFlexGroup
        justifyContent="spaceBetween"
        gutterSize="xs"
        responsive={true}>
        <EuiFlexItem grow={false}>
          <EuiText size="xs">
            DOB <strong>{moment(dob).format('YYYY/MM/DD')}</strong>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText size="xs">
            DARN <strong>{darn}</strong>
          </EuiText>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
            <EuiFlexItem grow={false}>
              <EuiText size="xs">
                Last Canvassed on{' '}
                <strong>{moment(modified).format('YYYY/MM/DD')}</strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size="xs">
                by <strong>{renderName(canvassedBy)}</strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="s" />

      <EuiFlexGroup gutterSize="xs" justifyContent="spaceBetween">
        <EuiFlexItem>
          <EuiPanel paddingSize="xs" hasBorder={true}>
            <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
              <EuiIcon type={GiHouse} />{' '}
              {livingStructure?.votingDistrict
                ? livingStructure.formatted
                : 'Unknown'}
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel hasBorder={true} paddingSize="xs">
            <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
              <EuiIcon type={MdHowToVote} />{' '}
              {registeredStructure?.votingDistrict
                ? registeredStructure.formatted
                : 'Unknown'}
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );

  const accordion = (
    <EuiAccordion id="extra-info" buttonContent="Show voter details">
      <EuiSpacer size="m" />
      {renderExtraInfo}
    </EuiAccordion>
  );

  return (
    <>
      <div ref={offsetTopRefEl} />
      <div
        style={{
          display: 'block',
          position: 'sticky',
          width: 'auto',
          top: `${offsetTop - 25}px`,
          zIndex: 3,
        }}>
        <EuiPanel>
          <EuiFlexGroup
            justifyContent="spaceBetween"
            alignItems="center"
            gutterSize="xs">
            <EuiFlexGroup alignItems="center" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiTitle size="xs">
                  <EuiTextColor>
                    {renderName({ salutation, givenName, surname })} (
                    {moment().diff(dob, 'years', false)})
                  </EuiTextColor>
                </EuiTitle>
              </EuiFlexItem>
              {['Active', 'Expired'].includes(membership?.status) && !deceased && (
                <EuiFlexItem
                  grow={false}
                  style={{ inlineSize: 'auto', flexBasis: 'auto' }}>
                  <EuiBadge
                    css={{ borderRadius: '10px' }}
                    color={
                      membership?.status === 'Expired' ? '#cccccc' : 'primary'
                    }>
                    Membership <strong>{membership?.status}</strong> (
                    {membership?.expiry})
                  </EuiBadge>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiBadge
                css={
                  isMobile &&
                  css`
                    .euiBadge__text {
                      text-align: right;
                      width: 100%;
                    }
                  `
                }
                color={getBadgeColour()}
                iconType={
                  colourCode?.name == 'Green' ? 'checkInCircleFilled' : null
                }>
                {deceased ? 'Deceased' : colourCode?.description}
              </EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="s" />

          {isMobile ? accordion : renderExtraInfo}
        </EuiPanel>
      </div>
    </>
  );
};

export default VoterInfo;
