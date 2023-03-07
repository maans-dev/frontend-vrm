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
import { EmailTypes } from './types';
import { GoCircleSlash } from 'react-icons/go';

export type Props = {
  email: EmailTypes;
  border?: boolean;
};

const EmailAddressLine: FunctionComponent<Props> = ({ email, border }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { euiTheme } = useEuiTheme();

  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);

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
            color={email?.isDnc ? euiTheme.colors.disabledText : null}>
            <EuiTextColor
              color={email?.isDnc ? euiTheme.colors.disabledText : null}>
              {email.email}
            </EuiTextColor>
          </EuiFlexItem>
          <EuiFlexGroup
            responsive={false}
            justifyContent="flexEnd"
            alignItems="center"
            css={{ maxWidth: '60px' }}
            gutterSize="xs">
            {email.isConfirmed ? (
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
            {email.isDnc ? (
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
    <AddEditEmail item={email} onUpdate={() => setIsEditing(false)} />
  );

  return (
    <>
      {isEditing ? renderEditMode : renderReadOnlyMode}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default EmailAddressLine;
