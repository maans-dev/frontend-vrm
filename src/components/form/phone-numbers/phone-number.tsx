import {
  EuiAvatar,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHorizontalRule,
  EuiListGroup,
  EuiPopover,
  EuiTextColor,
  useEuiTheme,
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
import { Contact } from '@lib/domain/person';

export type Props = {
  contact: Contact;
  border?: boolean;
};

const PhoneNumberLine: FunctionComponent<Props> = ({ contact, border }) => {
  console.log(contact, 'single object withn another object inside');
  const [typeIcon, setTypeIcon] = useState<ReactElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { euiTheme } = useEuiTheme();

  useEffect(() => {
    switch (contact.type) {
      case 'WORK':
        setTypeIcon(
          <FaMobileAlt
            color={
              contact.canContact
                ? euiTheme.colors.disabledText
                : euiTheme.colors.subduedText
            }
          />
        );
        break;
      case 'HOME':
        setTypeIcon(
          <FaHome
            color={
              contact.canContact
                ? euiTheme.colors.disabledText
                : euiTheme.colors.subduedText
            }
          />
        );
        break;
      case 'CELL':
        setTypeIcon(
          <FaGlobe
            color={
              contact.canContact
                ? euiTheme.colors.disabledText
                : euiTheme.colors.subduedText
            }
          />
        );
        break;
      default:
        setTypeIcon(
          <FaRegQuestionCircle
            color={
              contact.canContact
                ? euiTheme.colors.disabledText
                : euiTheme.colors.subduedText
            }
          />
        );
    }
  }, [contact, euiTheme.colors.disabledText, euiTheme.colors.subduedText]);

  const [showActions, setShowActions] = useState(false);

  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);

  function getContactValue(contact) {
    const value = contact?.contact?.value;
    if (value && !isNaN(value)) {
      return value;
    } else {
      return null;
    }
  }

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
          <EuiFormRow>
            <EuiFieldText
              compressed
              readOnly={true}
              disabled
              value={getContactValue(contact)}
            />
          </EuiFormRow>

          <EuiFlexItem
            grow={true}
            css={{ minWidth: '100px' }}
            color={contact.canContact ? euiTheme.colors.disabledText : null}>
            <EuiTextColor
              color={contact.canContact ? euiTheme.colors.disabledText : null}>
              {contact.canContact}
            </EuiTextColor>
          </EuiFlexItem>
          <EuiFlexGroup
            responsive={false}
            justifyContent="flexEnd"
            alignItems="center"
            css={{ maxWidth: '60px' }}
            gutterSize="xs">
            {/* {phone.isConfirmed ? (
              <EuiFlexItem grow={false}>
                <EuiAvatar
                  name="Confirmed"
                  iconType="check"
                  type="space"
                  size="s"
                  color={euiTheme.colors.success}
                />
              </EuiFlexItem>
            ) : null} */}
            {contact.canContact ? (
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
                    e.preventDefault();
                  },
                },
                {
                  label: 'Remove',
                  href: '#',
                  iconType: 'trash',
                  iconProps: { size: 's' },
                  onClick: e => {
                    e.preventDefault();
                  },
                },
                {
                  label: 'DNC',
                  href: '#',
                  iconType: GoCircleSlash,
                  iconProps: { size: 's' },
                  onClick: e => {
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
    <AddEditNumber contact={contact} onUpdate={() => setIsEditing(false)} />
  );

  return (
    <>
      {isEditing ? renderEditMode : renderReadOnlyMode}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default PhoneNumberLine;
