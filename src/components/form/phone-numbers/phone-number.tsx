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
  EuiSuperSelect,
  EuiText,
  useEuiTheme,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import {
  FunctionComponent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  FaMobileAlt,
  FaRegQuestionCircle,
  FaHome,
  FaGlobe,
} from 'react-icons/fa';
import { ImUserTie } from 'react-icons/im';
import { PhoneContact } from '@lib/domain/phone-numbers';
import { usePhoneValidation } from './usePhoneValidation';
import { GoCircleSlash } from 'react-icons/go';
import { CanvassingContext } from '@lib/context/canvassing.context';

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
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const phoneTypeOptions = [
    {
      value: 'CELL',
      dropdownDisplay: (
        <EuiText size="s">
          <FaMobileAlt /> Mobile
        </EuiText>
      ),
      inputDisplay: isMobile ? (
        <FaMobileAlt />
      ) : (
        <EuiText size="s">
          <FaMobileAlt /> Mobile
        </EuiText>
      ),
    },
    {
      value: 'WORK',
      dropdownDisplay: (
        <EuiText size="s">
          <ImUserTie /> Work
        </EuiText>
      ),
      inputDisplay: isMobile ? (
        <ImUserTie />
      ) : (
        <EuiText size="s">
          <ImUserTie /> Work
        </EuiText>
      ),
    },
    {
      value: 'HOME',
      dropdownDisplay: (
        <EuiText size="s">
          <FaHome /> Home
        </EuiText>
      ),
      inputDisplay: isMobile ? (
        <FaHome />
      ) : (
        <EuiText size="s">
          <FaHome /> Home
        </EuiText>
      ),
    },
    {
      value: 'INTERNATIONAL',
      dropdownDisplay: (
        <EuiText size="s">
          <FaGlobe /> International
        </EuiText>
      ),
      inputDisplay: isMobile ? (
        <FaGlobe />
      ) : (
        <EuiText size="s">
          <FaGlobe /> International
        </EuiText>
      ),
    },
    {
      value: 'CUSTOM',
      dropdownDisplay: (
        <EuiText size="s">
          <FaRegQuestionCircle /> Other
        </EuiText>
      ),
      inputDisplay: isMobile ? (
        <FaRegQuestionCircle />
      ) : (
        <EuiText size="s">
          <FaRegQuestionCircle /> Other
        </EuiText>
      ),
    },
  ];
  const { setValidationError, person, data } = useContext(CanvassingContext);
  const { euiTheme } = useEuiTheme();
  const [phoneType, setPhoneType] = useState(phoneContact?.type);
  const [typeIcon, setTypeIcon] = useState<ReactElement>(null);
  const [showActions, setShowActions] = useState(false);
  const onActionsClick = () => setShowActions(showActions => !showActions);
  const hideActions = () => setShowActions(false);
  const { isValid, validationError } = usePhoneValidation(
    phoneContact.value,
    phoneType,
    data?.contacts,
    person?.contacts
  );

  const onChangePhoneType = (value: string) => {
    setPhoneType(value);
    const updatedPhoneContact = { ...phoneContact, type: value };
    onUpdate(updatedPhoneContact);
  };

  const handleRemove = () => {
    setValidationError('');
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

  const committedPhoneNumbers = (
    <EuiFlexGroup responsive={false} gutterSize="xs" id="phoneNumberField">
      <EuiFlexItem grow={false} css={{ minWidth: isMobile ? '40px' : '130px' }}>
        <EuiFormRow display="rowCompressed">
          <EuiSuperSelect
            compressed
            fullWidth
            aria-label="Select phone number type"
            placeholder="Select..."
            options={phoneTypeOptions}
            valueOfSelected={phoneType}
            onChange={onChangePhoneType}
            popoverProps={{
              panelStyle: { minWidth: '140px' },
            }}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow
          display="rowCompressed"
          isInvalid={!isValid}
          error={validationError}>
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
                          label: phoneContact?.confirmed
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
                          label: phoneContact?.canContact
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
                  {phoneContact.category && (
                    <>
                      <EuiButtonEmpty
                        size="xs"
                        iconType={
                          phoneContact?.canContact
                            ? 'plusInCircle'
                            : 'minusInCircle'
                        }
                        color={phoneContact?.canContact ? 'primary' : 'warning'}
                        onClick={e => {
                          toggleDNC();
                          e.preventDefault();
                        }}>
                        {phoneContact?.canContact ? 'Set DNC' : 'Unset DNC'}
                      </EuiButtonEmpty>
                      <EuiButtonEmpty
                        size="xs"
                        iconType="check"
                        color={phoneContact?.confirmed ? 'success' : 'primary'}
                        css={{ minWidth: '50px' }}
                        onClick={e => {
                          toggleConfirm();
                          e.preventDefault();
                        }}>
                        {phoneContact?.confirmed ? 'Unconfirm' : 'Confirm'}
                      </EuiButtonEmpty>
                    </>
                  )}
                </div>
              )
            }
            placeholder="Enter a phone number"
            value={phoneContact.value}
            isInvalid={!isValid}
            inputMode="numeric"
            onChange={e => {
              const updatedValue = e.target.value
                .replace(/[^0-9+]/g, '')
                .slice(0, 15);
              const updatedPhoneContact = {
                ...phoneContact,
                value: updatedValue,
              };
              onUpdate(updatedPhoneContact);
            }}
          />
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

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
  }, [
    phoneContact,
    euiTheme.colors.disabledText,
    euiTheme.colors.subduedText,
    data?.contacts,
  ]);

  return (
    <>
      {committedPhoneNumbers}
      {border ? <EuiHorizontalRule margin="xs" /> : null}
    </>
  );
};

export default PhoneNumberLine;
