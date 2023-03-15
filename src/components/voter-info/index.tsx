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
  modifiedBy: string;
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
  modifiedBy,
  livingStructure,
  registeredStructure,
}) => {
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
            css={{ color: 'white !important' }} //TODO: Figure out how to get the font colour to invert dynamically based on bg colour.  https://eui.elastic.co/#/theming/colors/utilities
            color={`#${colourCode.colour}`}
            iconType={
              colourCode.name == 'Green' ? 'checkInCircleFilled' : null
            }>
            {colourCode.description}
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
                by <strong>{modifiedBy}</strong>
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
              {livingStructure.votingDistrict.toLowerCase()} (
              {livingStructure.votingDistrict_id})
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel hasBorder={true} paddingSize="xs">
            <EuiText size="xs" css={{ textTransform: 'capitalize' }}>
              <EuiIcon type={MdHowToVote} />{' '}
              {registeredStructure.votingDistrict.toLowerCase()} (
              {registeredStructure.votingDistrict_id})
            </EuiText>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default VoterInfo;
