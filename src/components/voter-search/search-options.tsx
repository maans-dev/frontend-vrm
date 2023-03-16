import { AdvancedSearchTooltip } from '@components/form/advanced-search-tooltip';
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiDatePicker,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
} from '@elastic/eui';
import { PersonSearchParams } from '@lib/domain/person-search';
import moment, { Moment } from 'moment';
import { FormEvent, FunctionComponent, useState } from 'react';

export type Props = {
  onSubmit?: (params: Partial<PersonSearchParams>) => void;
  as: 'form' | 'modal';
};

const SearchOptions: FunctionComponent<Props> = ({ onSubmit, as }) => {
  const [searchParams, setSearchParams] =
    useState<Partial<PersonSearchParams>>();

  const [dob, setDob] = useState<Moment>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    console.log(event);
    const target = event.target as HTMLFormElement;
    const name = target.name;

    if (target.name === 'dob') return;

    const value = target.value;
    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
        [name]: value,
      };

      for (const key in newValue) {
        if (!newValue[key] || newValue[key] === '') delete newValue[key];
      }

      return newValue;
    });
  };

  const handleDOBChange = (date: Moment) => {
    setDob(date);
    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
        dob: date?.isValid ? date.format('YYYYMMDD') : null,
      };

      for (const key in newValue) {
        if (!newValue[key] || newValue[key] === '') delete newValue[key];
      }

      return newValue;
    });
  };

  const handleSubmit = () => {
    onSubmit(searchParams);
    // handleReset();
  };

  const handleReset = () => {
    // setSearchParams({
    //   identity: '',
    //   dob: null,
    //   surname: '',
    //   firstName: '',
    //   email: '',
    //   phone: '',
    // });
    setDob(null);
  };

  const formActions = (
    <EuiFlexGroup direction="row" responsive={false} justifyContent="flexEnd">
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty size="m" onClick={handleReset}>
          Reset
        </EuiButtonEmpty>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButton
          size="m"
          iconType="search"
          fill
          onClick={() => handleSubmit()}
          disabled={!searchParams || !Object.keys(searchParams).length}>
          Search
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const form = (
    <EuiForm fullWidth component="form" onChange={handleChange}>
      <EuiFormRow label="Identity" display="rowCompressed">
        <EuiFieldText
          name="identity"
          compressed
          placeholder="ID Number, DARN or Membership number"
          value={searchParams?.identity}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker
          name="dob"
          dateFormat={['D MMM YYYY']}
          selected={dob}
          maxDate={moment().subtract(17, 'year')}
          yearDropdownItemNumber={120}
          onChange={handleDOBChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Surname">
        <EuiFieldText
          name="surname"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.surname}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="First names">
        <EuiFieldText
          name="firstName"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.firstName}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Email">
        <EuiFieldText
          name="email"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.email}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone">
        <EuiFieldText
          name="phone"
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.phone}
        />
      </EuiFormRow>

      <EuiSpacer />
    </EuiForm>
  );

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal} initialFocus="[name=popswitch]">
        <EuiModalHeader>
          <EuiModalHeaderTitle size="s">Search for a voter</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>{form}</EuiModalBody>

        <EuiModalFooter>{formActions}</EuiModalFooter>
      </EuiModal>
    );
  }

  const renderAsModal = (
    <>
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFlexItem grow={false}>
          <EuiButton iconType="search" onClick={showModal} size="s">
            Search again
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer />
      {modal}
    </>
  );

  const renderAsForm = (
    <>
      {form}
      {formActions}
    </>
  );

  return as === 'modal' ? renderAsModal : renderAsForm;
};

export default SearchOptions;
