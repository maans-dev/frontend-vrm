import React, { FunctionComponent, useEffect, useState } from 'react';
import { EuiConfirmModal, EuiText, EuiTitle } from '@elastic/eui';
import { signOut, useSession } from 'next-auth/react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';

const DisclosureNoticeModal: FunctionComponent = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const isFeatureEnabled = session?.features?.includes('disclosure');
  const [shouldModalRender, setShouldModalRender] = useState(false); //This avoids flashing the modal after user has already accepted

  const handleConfirm = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/event/user-agreement/`;
    const data = {
      accepted: true,
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    // const respPayload = await response.clone().json();
    if (!response.ok) {
      const errJson = JSON.parse(await response.clone().text());
      console.log(errJson);
      return;
    }
    await update({ disclosureAccepted: true });
  };

  const handleCancel = () => {
    signOut({ callbackUrl: 'https://login.voteda.org/logout' });
  };

  useEffect(() => {
    if (!session) return;
    setShouldModalRender(true);

    if (
      isFeatureEnabled &&
      !session.disclosureAccepted &&
      router.asPath !== '/'
    ) {
      router.push('/'); // Navigate back to the home screen
    }
  }, [session, session?.disclosureAccepted, isFeatureEnabled]);

  return shouldModalRender &&
    isFeatureEnabled &&
    !session?.disclosureAccepted ? (
    <EuiConfirmModal
      css={css`
        .euiButtonIcon--xSmall {
          display: none;
        }
      `}
      style={{ width: 800 }}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      cancelButtonText="Decline"
      confirmButtonText="Accept"
      defaultFocusedButton="confirm">
      <EuiTitle size="s" css={{ paddingTop: '10px' }}>
        <h3>Authorized Users and Access</h3>
      </EuiTitle>
      <EuiText size="s">
        Access to the DA’s Voter Relations Management (VRM) system is restricted
        to authorized users only. The User agrees to not share their username
        and password with anyone, including members of staff, volunteers, or any
        other person. To maintain the security of VRM, each user has been given
        unique login details that can be monitored.
      </EuiText>
      <EuiTitle size="xs">
        <h3>Confidentiality and Use of Materials</h3>
      </EuiTitle>
      <EuiText size="s">
        By accessing this database, the User agrees and acknowledges that they
        are accessing highly confidential information central to the business
        practices of the DA and as such is bound by strict confidentiality. The
        User agrees not to disseminate or otherwise provide any material
        obtained from VRM to any person not authorised to receive the
        information. Prohibited dissemination includes, but is not limited to
        accessing, using, publishing, posting or sending VRM content over any
        medium electronic or hardcopy. The User shall not, directly or
        indirectly, use for his own benefit or the benefit of any other person,
        firm, company, or corporation and shall keep confidential and not
        disclose, any trade secrets or confidential VRM information of the
        Party, or any information concerning the organisation, functions,
        transactions or affairs of the Party and shall not use such information
        in a manner which may injure or cause loss, either directly or
        indirectly, to the Party. The User may use VRM only in connection with
        their official duties assigned to them by the Party. Use for any other
        purpose is strictly prohibited. The User will cease use of VRM and
        destroy any materials in the User’s possession the moment the
        relationship with the DA ceases or your VRM access has been revoked.
      </EuiText>
      <EuiTitle size="xs">
        <h3>Breach</h3>
      </EuiTitle>
      <EuiText size="s">
        In the event that the User should breach the provisions of this
        undertaking, then the Party shall be entitled to invoke all remedies
        available to it in law including the institution of urgent interim
        proceedings and/or an action for damages.
      </EuiText>
      <EuiTitle size="xs">
        <h3>Revocation of Access</h3>
      </EuiTitle>
      <EuiText size="s">
        Failure to abide by any of these terms will result in the immediate
        revocation of your access and other actions as may be deemed necessary
        to ensure the continuing confidentiality of materials and security of
        VRM. The DA reserves the right to revoke any user’s access for any
        reason without advance warning.
      </EuiText>
    </EuiConfirmModal>
  ) : (
    <></>
  );
};

export default DisclosureNoticeModal;
