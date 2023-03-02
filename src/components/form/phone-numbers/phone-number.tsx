import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiListGroup,
  EuiPopover,
  useEuiTheme,
} from '@elastic/eui';
import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { Phone } from './types';
import {
  FaMobileAlt,
  FaRegQuestionCircle,
  FaHome,
  FaGlobe,
  FaUserTie,
} from 'react-icons/fa';
import { ImUserTie } from 'react-icons/im';

export type Props = {
  phone: Phone;
  border?: boolean;
};

const PhoneNumberLine: FunctionComponent<Props> = ({ phone, border }) => {
  const [typeIcon, setTypeIcon] = useState<ReactElement>(null);
  const { euiTheme } = useEuiTheme();

  useEffect(() => {
    switch (phone.type) {
      case 'Mobile':
        setTypeIcon(<FaMobileAlt color={euiTheme.colors.subduedText} />);
        break;
      case 'Home':
        setTypeIcon(<FaHome color={euiTheme.colors.subduedText} />);
        break;
      case 'International':
        setTypeIcon(<FaGlobe color={euiTheme.colors.subduedText} />);
        break;
      case 'Work':
        setTypeIcon(<ImUserTie color={euiTheme.colors.subduedText} />);
        break;
      default:
        setTypeIcon(
          <FaRegQuestionCircle color={euiTheme.colors.subduedText} />
        );
    }
  }, [euiTheme.colors.subduedText, phone]);

  const [showActions, setShowActions] = useState(false);

  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);

  return (
    <>
      <EuiFlexGroup
        justifyContent="spaceAround"
        alignItems="center"
        gutterSize="m"
        responsive={false}>
        <EuiFlexItem grow={false}>{typeIcon}</EuiFlexItem>
        <EuiFlexItem grow={false}>{phone.number}</EuiFlexItem>
        <EuiFlexGroup
          responsive={false}
          justifyContent="flexEnd"
          alignItems="flexEnd"
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
                    iconType: '/icons/dnc.svg',
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
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default PhoneNumberLine;
