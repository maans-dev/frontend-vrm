import {
  EuiAvatar,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiListGroup,
  EuiPopover,
  EuiTextColor,
  useEuiTheme,
} from '@elastic/eui';
import { FunctionComponent, useState } from 'react';
import AddEditEmail from './add-edit-email';
import { GoCircleSlash } from 'react-icons/go';
import { EmailContact } from '@lib/domain/email-address';

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
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { euiTheme } = useEuiTheme();

  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);

  const handleUpdate = (contact: EmailContact) => {
    setIsEditing(false);
    onUpdate(contact);
  };

  const handleRemove = () => {
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

  const renderReadOnlyMode = (
    <EuiFlexGroup
      justifyContent="spaceAround"
      alignItems="center"
      gutterSize="m"
      responsive={false}>
      <EuiFlexItem grow={true} onClick={() => setIsEditing(true)}>
        <EuiFlexGroup responsive={false} alignItems="center" gutterSize="xs">
          <EuiFlexItem
            grow={true}
            css={{ minWidth: '100px' }}
            color={
              emailContact.canContact ? null : euiTheme.colors.disabledText
            }>
            <EuiTextColor
              color={
                emailContact.canContact ? null : euiTheme.colors.disabledText
              }>
              {emailContact.value}
            </EuiTextColor>
          </EuiFlexItem>
          <EuiFlexGroup
            responsive={false}
            justifyContent="flexEnd"
            alignItems="center"
            css={{ maxWidth: '60px' }}
            gutterSize="xs">
            {emailContact.confirmed ? (
              <EuiFlexItem grow={false}>
                <EuiAvatar
                  name="Confirmed"
                  iconType="check"
                  type="space"
                  size="s"
                  color={euiTheme.colors.success}
                />
              </EuiFlexItem>
            ) : null}
            {!emailContact.canContact ? (
              <EuiFlexItem grow={false}>
                <EuiAvatar
                  name="Do not contact"
                  iconType={GoCircleSlash}
                  type="space"
                  size="s"
                  color={euiTheme.colors.warning}
                />
              </EuiFlexItem>
            ) : null}
          </EuiFlexGroup>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexGroup
        responsive={false}
        justifyContent="flexEnd"
        alignItems="flexEnd"
        css={{ maxWidth: '30px' }}
        gutterSize="xs">
        <EuiFlexItem grow={false}>
          <EuiPopover
            panelPaddingSize="s"
            button={
              <EuiButtonIcon
                display="empty"
                aria-label="Actions"
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
                    setIsEditing(true);
                    e.preventDefault();
                  },
                },
                {
                  label: 'Confirm',
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
                {
                  label: emailContact?.canContact ? 'Unset DNC' : 'Set DNC',
                  href: '#',
                  iconType: GoCircleSlash,
                  iconProps: { size: 's' },
                  onClick: e => {
                    hideActions();
                    toggleDNC();
                    e.preventDefault();
                  },
                },
              ]}
            />
          </EuiPopover>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexGroup>
  );

  const renderEditMode = (
    <AddEditEmail emailContact={emailContact} onUpdate={handleUpdate} />
  );

  return (
    <>
      {isEditing ? renderEditMode : renderReadOnlyMode}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default EmailAddressLine;
