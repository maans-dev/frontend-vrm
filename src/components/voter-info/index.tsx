import { FunctionComponent, useContext, useEffect, useState } from 'react';
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
import { Names, renderName } from '@lib/person/utils';
import { useStickyVoterInfo } from '@lib/hooks/useStickyVoterInfo';
import { css } from '@emotion/react';
import { CanvassingContext } from '@lib/context/canvassing.context';
import { useSession } from 'next-auth/react';
import { appsignal } from '@lib/appsignal';

export type Props = {
  deceased?: boolean;
  darn: number;
  salutation: string;
  givenName: string;
  firstName: string;
  surname: string;
  dob: Date;
  colourCode: ColourCode;
  canvassedBy: CanvassedBy;
  livingStructure: LivingStructure;
  registeredStructure: RegisteredStructure;
  membership: Membership;
  pubRep: string;
};

const VoterInfo: FunctionComponent<Props> = ({
  deceased,
  darn,
  salutation,
  givenName,
  firstName,
  surname,
  dob,
  colourCode,
  canvassedBy,
  livingStructure,
  registeredStructure,
  membership,
  pubRep,
}) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const { offsetTopRefEl, offsetTop } = useStickyVoterInfo();
  const [hasUpdatedAddress, setHasUpdatedAddress] = useState(false);
  const [updatedColorCode, setUpdatedColorCode] = useState<ColourCode>(null);
  const { data: session } = useSession();

  const { data: contextData, votingDistrict } = useContext(CanvassingContext);

  const renderFullName = (names: Names) => {
    const title = names?.salutation ? `${names?.salutation} ` : '';
    if (names?.givenName && names?.firstName && names?.surname)
      return `${title} ${names.firstName} (${names.givenName}) ${names.surname}`;
    if (!names?.surname) return 'Unknown';
    return `${title}${names.firstName} ${names.surname}`;
  };

  const getBadgeColour = () => {
    if (deceased) return '#cccccc';

    if (getColourCode?.colour && getColourCode?.colour !== 'FFFFFF')
      return `#${getColourCode.colour}`;

    return 'hollow';
  };

  const getColourCode = updatedColorCode ?? colourCode;

  const renderLivingAddress = () => {
    if (hasUpdatedAddress) return votingDistrict;

    if (livingStructure?.votingDistrict && livingStructure?.formatted)
      return livingStructure.formatted;

    return 'Unknown';
  };

  useEffect(() => {
    if (!contextData?.address) {
      setHasUpdatedAddress(false);
      return;
    }

    if (
      livingStructure.votingDistrict_id !==
      contextData.address?.votingDistrict_id
    ) {
      setHasUpdatedAddress(true);
    }
  }, [contextData?.address, livingStructure?.votingDistrict_id]);

  // update colourCode when VD is changed
  useEffect(() => {
    if (!contextData?.address) {
      setUpdatedColorCode(null);
    }

    if (!contextData?.address || !registeredStructure?.votingDistrict_id)
      return;

    const getColourCode = async () => {
      const lvd =
        contextData.address?.structure?.deleted || contextData.address?.deleted
          ? 0
          : contextData.address?.structure?.votingDistrict_id;
      const rvd = registeredStructure?.votingDistrict_id;
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE
      }/address/colourcode?livingVotingDistrict_id=${
        lvd || 0
      }&registeredVotingDistrict_id=${rvd || 0}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        method: 'GET',
      });

      if (!response.ok) {
        // throw 'Unable to load Voting District for this address';
        const errMsg = await response.text();
        appsignal.sendError(
          new Error(
            `Unable to load Voting District for this address: ${errMsg}`
          ),
          span => {
            span.setAction('api-call');
            span.setParams({
              route: url,
              user: session.user.darn,
            });
            span.setTags({ user_darn: session.user.darn.toString() });
          }
        );
        return;
      }

      const colourCode = await response.json();
      if (colourCode.length) setUpdatedColorCode(colourCode[0]);
    };

    getColourCode();
  }, [
    session?.accessToken,
    session.user.darn,
    registeredStructure?.votingDistrict_id,
    contextData.address,
  ]);

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
                <strong>
                  {moment(canvassedBy?.date)?.format('YYYY/MM/DD') || 'Unknown'}
                </strong>
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
              <EuiIcon type={GiHouse} /> {renderLivingAddress()}
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
                    {renderFullName({
                      salutation,
                      firstName,
                      givenName,
                      surname,
                    })}{' '}
                    ({moment().diff(dob, 'years', false)})
                  </EuiTextColor>
                </EuiTitle>
              </EuiFlexItem>
              {pubRep ? (
                <EuiFlexItem
                  grow={false}
                  style={{ inlineSize: 'auto', flexBasis: 'auto' }}>
                  <EuiBadge css={{ borderRadius: '10px' }} color="primary">
                    Public Representative <strong>({pubRep})</strong>
                  </EuiBadge>
                </EuiFlexItem>
              ) : (
                ['Active', 'Expired'].includes(membership?.status) &&
                !deceased && (
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
                )
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
                  getColourCode?.name == 'Green' ? 'checkInCircleFilled' : null
                }>
                {deceased ? 'Deceased' : getColourCode?.description}
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
