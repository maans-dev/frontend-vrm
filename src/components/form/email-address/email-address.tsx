import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiListGroup,
  EuiPopover,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FunctionComponent, useContext, useState } from 'react';
import { EmailContact } from '@lib/domain/email-address';
import { isEmail } from '../form-utils';
import { GoCircleSlash } from 'react-icons/go';
import { CanvassingContext } from '@lib/context/canvassing.context';

export type Props = {
  emailContact: EmailContact;
  border?: boolean;
  onUpdate: (data: EmailContact) => void;
};

const EmailAddressLine: FunctionComponent<Props> = ({
  emailContact,
  border,
  onUpdate,
}) => {
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const [showActions, setShowActions] = useState(false);
  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);
  const { setValidationError } = useContext(CanvassingContext);

  const handleRemove = () => {
    setValidationError('');
    onUpdate({ ...emailContact, deleted: true });
  };

  const toggleConfirm = () => {
    onUpdate({
      ...emailContact,
      confirmed: emailContact?.confirmed ? null : true,
    });
  };

  const toggleDNC = () => {
    onUpdate({ ...emailContact, canContact: !emailContact?.canContact });
  };

  const committedEmailAddress = (
    <EuiFlexGroup responsive={false} gutterSize="xs">
      <EuiFlexItem>
        <EuiFormRow
          display="rowCompressed"
          isInvalid={!isEmail(emailContact.value)}
          error="Enter a valid email address">
          <EuiFieldText
            compressed
            append={
              isMobile ? (
                <EuiFlexItem grow={false}>
                  <EuiPopover
                    panelPaddingSize="s"
                    button={
                      <EuiButtonIcon
                        aria-label="Actions"
                        display="empty"
                        iconType="boxesHorizontal"
                        size="xs"
                        onClick={onActionsClick}
                      />
                    }
                    isOpen={showActions}
                    closePopover={hideActions}>
                    <EuiListGroup
                      size="xs"
                      flush={true}
                      listItems={[
                        {
                          label: 'Edit',
                          href: '#',
                          iconType: 'pencil',
                          iconProps: { size: 's' },
                          onClick: e => {
                            hideActions();
                            e.preventDefault();
                          },
                        },
                        {
                          label: emailContact?.confirmed
                            ? 'Unconfirm'
                            : 'Confirm',
                          href: '#',
                          iconType: 'check',
                          iconProps: { size: 's' },
                          onClick: e => {
                            hideActions();
                            toggleConfirm();
                            e.preventDefault();
                          },
                        },
                        {
                          label: emailContact?.canContact
                            ? 'Set DNC'
                            : 'Unset DNC',
                          href: '#',
                          iconType: GoCircleSlash,
                          iconProps: { size: 's' },
                          onClick: e => {
                            hideActions();
                            toggleDNC();
                            e.preventDefault();
                          },
                        },
                        {
                          label: 'Remove',
                          href: '#',
                          iconType: 'trash',
                          iconProps: { size: 's' },
                          onClick: e => {
                            hideActions();
                            handleRemove();
                            e.preventDefault();
                          },
                        },
                      ]}
                    />
                  </EuiPopover>
                </EuiFlexItem>
              ) : (
                <div>
                  <EuiButtonEmpty
                    size="xs"
                    iconType="trash"
                    css={{ minWidth: '50px' }}
                    onClick={handleRemove}>
                    Remove
                  </EuiButtonEmpty>
                  {emailContact.category && (
                    <>
                      <EuiButtonEmpty
                        size="xs"
                        iconType={
                          emailContact?.canContact
                            ? 'minusInCircle'
                            : 'plusInCircle'
                        }
                        color={emailContact?.canContact ? 'warning' : 'primary'}
                        css={{ minWidth: '50px' }}
                        onClick={e => {
                          toggleDNC();
                          e.preventDefault();
                        }}>
                        {emailContact?.canContact ? 'Set DNC' : 'Unset DNC'}
                      </EuiButtonEmpty>
                      <EuiButtonEmpty
                        size="xs"
                        iconType="check"
                        color={emailContact?.confirmed ? 'success' : 'primary'}
                        css={{ minWidth: '50px' }}
                        onClick={e => {
                          toggleConfirm();
                          e.preventDefault();
                        }}>
                        {emailContact?.confirmed ? 'Unconfirm' : 'Confirm'}
                      </EuiButtonEmpty>
                    </>
                  )}
                </div>
              )
            }
            placeholder="Enter a email address"
            value={emailContact.value}
            isInvalid={!isEmail(emailContact.value)}
            inputMode="numeric"
            onChange={e => {
              const updatedValue = e.target.value.slice(0, 100);
              const updatedEmailContact = {
                ...emailContact,
                value: updatedValue,
              };
              onUpdate(updatedEmailContact);
            }}
          />
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  return (
    <>
      {committedEmailAddress}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default EmailAddressLine;
