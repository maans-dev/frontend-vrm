import {
  EuiAvatar,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiListGroup,
  EuiPopover,
  EuiTextColor,
  useEuiTheme,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import {
  FaMobileAlt,
  FaRegQuestionCircle,
  FaHome,
  FaGlobe,
} from 'react-icons/fa';
import AddEditNumber from './add-edit-number';
import { GoCircleSlash } from 'react-icons/go';
import { ImUserTie } from 'react-icons/im';
import { PhoneContact } from '@lib/domain/phone-numbers';

export type Props = {
  phoneContact: PhoneContact;
  border?: boolean;
  onUpdate?: (update: PhoneContact) => void;
};

const PhoneNumberLine: FunctionComponent<Props> = ({
  phoneContact,
  border,
  onUpdate,
}) => {
  const [typeIcon, setTypeIcon] = useState<ReactElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { euiTheme } = useEuiTheme();
  const isMobile = useIsWithinBreakpoints(['xs', 's']);

  useEffect(() => {
    switch (phoneContact.type) {
      case 'WORK':
        setTypeIcon(
          <ImUserTie
            color={
              phoneContact.canContact
                ? euiTheme.colors.subduedText
                : euiTheme.colors.disabledText
            }
          />
        );
        break;
      case 'HOME':
        setTypeIcon(
          <FaHome
            color={
              phoneContact.canContact
                ? euiTheme.colors.subduedText
                : euiTheme.colors.disabledText
            }
          />
        );
        break;
      case 'CELL':
        setTypeIcon(
          <FaMobileAlt
            color={
              phoneContact.canContact
                ? euiTheme.colors.subduedText
                : euiTheme.colors.disabledText
            }
          />
        );
        break;
      case 'INTERNATIONAL':
        setTypeIcon(
          <FaGlobe
            color={
              phoneContact.canContact
                ? euiTheme.colors.subduedText
                : euiTheme.colors.disabledText
            }
          />
        );
        break;
      default:
        setTypeIcon(
          <FaRegQuestionCircle
            color={
              phoneContact.canContact
                ? euiTheme.colors.subduedText
                : euiTheme.colors.disabledText
            }
          />
        );
    }
  }, [phoneContact, euiTheme.colors.disabledText, euiTheme.colors.subduedText]);

  const [showActions, setShowActions] = useState(false);

  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);

  const handleUpdate = (contact: PhoneContact) => {
    setIsEditing(false);
    onUpdate(contact);
  };

  const handleRemove = () => {
    onUpdate({ ...phoneContact, deleted: true });
  };

  const toggleConfirm = () => {
    onUpdate({
      ...phoneContact,
      confirmed: phoneContact?.confirmed ? null : true,
    });
  };

  const toggleDNC = () => {
    onUpdate({ ...phoneContact, canContact: !phoneContact?.canContact });
  };

  const renderReadOnlyMode = (
    <EuiFlexGroup
      justifyContent="spaceAround"
      alignItems="center"
      gutterSize="m"
      responsive={false}>
      <EuiFlexItem grow={false}>{typeIcon}</EuiFlexItem>
      <EuiFlexItem grow={true} onClick={() => setIsEditing(true)}>
        <EuiFlexGroup
          responsive={false}
          // justifyContent="flexStart"
          alignItems="center"
          gutterSize="xs">
          <EuiFlexItem
            grow={true}
            css={{ minWidth: '100px' }}
            color={
              phoneContact.canContact ? null : euiTheme.colors.disabledText
            }>
            <EuiTextColor
              color={
                phoneContact.canContact ? null : euiTheme.colors.disabledText
              }>
              {phoneContact.value}
            </EuiTextColor>
          </EuiFlexItem>
          <EuiFlexItem
            grow={true}
            css={{ minWidth: '100px' }}
            color={
              phoneContact.canContact ? null : euiTheme.colors.disabledText
            }>
            <EuiTextColor
              color={
                phoneContact.canContact ? null : euiTheme.colors.disabledText
              }>
              {phoneContact.canContact}
            </EuiTextColor>
          </EuiFlexItem>
          <EuiFlexGroup
            responsive={false}
            justifyContent="flexEnd"
            alignItems="center"
            css={{ maxWidth: '60px' }}
            gutterSize="xs">
            {phoneContact?.confirmed ? (
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
            {!phoneContact?.canContact ? (
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
      {isMobile ? (
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
                      setIsEditing(true);
                      e.preventDefault();
                    },
                  },
                  {
                    label: phoneContact?.confirmed ? 'Unconfirm' : 'Confirm',
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
                    label: phoneContact?.canContact ? 'Set DNC' : 'Unset DNC',
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
        </EuiFlexGroup>
      ) : (
        <EuiFlexGroup
          gutterSize="s"
          alignItems="center"
          justifyContent="flexEnd"
          responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              iconType="pencil"
              onClick={() => {
                hideActions();
                setIsEditing(true);
              }}>
              Edit
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              style={{ width: '95px' }}
              color={phoneContact?.confirmed ? 'success' : 'primary'}
              iconType="check"
              onClick={() => {
                hideActions();
                toggleConfirm();
              }}>
              {phoneContact?.confirmed ? 'Unconfirm' : 'Confirm'}
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              style={{ width: '105px' }}
              color={phoneContact?.canContact ? 'primary' : 'warning'}
              iconType={GoCircleSlash}
              onClick={() => {
                hideActions();
                toggleDNC();
              }}>
              {phoneContact?.canContact ? 'Set DNC' : 'Unset DNC'}
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              iconType="trash"
              onClick={() => {
                hideActions();
                handleRemove();
              }}>
              Remove
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </EuiFlexGroup>
  );

  const renderEditMode = (
    <AddEditNumber phoneContact={phoneContact} onUpdate={handleUpdate} />
  );

  return (
    <>
      {isEditing ? renderEditMode : renderReadOnlyMode}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default PhoneNumberLine;
