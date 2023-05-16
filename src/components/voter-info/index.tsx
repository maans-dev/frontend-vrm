import { FunctionComponent } from 'react';
import {
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTextColor,
  EuiTitle,
} from '@elastic/eui';
import moment from 'moment';
import {
  CanvassedBy,
  ColourCode,
  LivingStructure,
  RegisteredStructure,
} from '@lib/domain/person';
import { GiHouse } from 'react-icons/gi';
import { MdHowToVote } from 'react-icons/md';

export type Props = {
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
};

const VoterInfo: FunctionComponent<Props> = ({
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
}) => {
  const getBadgeColour = () => {
    if (colourCode?.colour && colourCode?.colour !== 'FFFFFF')
      return `#${colourCode.colour}`;

    return 'hollow';
  };

  return (
    <>
      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiTitle size="xs">
            <EuiTextColor>
              {salutation} {givenName} {surname} (
              {moment().diff(dob, 'years', false)})
            </EuiTextColor>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiBadge
            color={getBadgeColour()}
            iconType={
              colourCode?.name == 'Green' ? 'checkInCircleFilled' : null
            }>
            {colourCode?.description}
          </EuiBadge>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer size="s" />

      <EuiFlexGroup justifyContent="spaceBetween" gutterSize="xs">
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
                by{' '}
                <strong>
                  {canvassedBy?.key
                    ? `${canvassedBy?.firstName} ${canvassedBy?.surname}`
                    : 'Unknown'}
                </strong>
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
              {livingStructure?.votingDistrict || 'Unknown'}{' '}
              {livingStructure
                ? `(${livingStructure?.votingDistrict_id})`
                : null}
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel hasBorder={true} paddingSize="xs">
            <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
              <EuiIcon type={MdHowToVote} />{' '}
              {registeredStructure?.votingDistrict || 'Unknown'}{' '}
              {registeredStructure
                ? `(${registeredStructure?.votingDistrict_id})`
                : null}
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default VoterInfo;
