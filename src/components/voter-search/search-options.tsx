import { AdvancedSearchTooltip } from '@components/form/advanced-search-tooltip';
import Structres from '@components/structure-search';
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
  EuiComboBoxOptionOption,
  EuiCheckbox,
} from '@elastic/eui';
import { Structure } from '@lib/domain/person';
import { PersonSearchParams } from '@lib/domain/person-search';
import moment, { Moment } from 'moment';
import { FormEvent, FunctionComponent, useState } from 'react';

export type Props = {
  onSubmit?: (
    params: Partial<PersonSearchParams>,
    persistedStructureOption: EuiComboBoxOptionOption<Partial<Structure>>
  ) => void;
  as: 'form' | 'modal';
  isLoading: boolean;
  persistedSearchParams: Partial<PersonSearchParams>;
  persistedStructureOption: EuiComboBoxOptionOption<Partial<Structure>>;
};

const SearchOptions: FunctionComponent<Props> = ({
  onSubmit,
  as,
  isLoading,
  persistedSearchParams,
  persistedStructureOption,
}) => {
  const [searchParams, setSearchParams] = useState<Partial<PersonSearchParams>>(
    () => {
      if (!persistedSearchParams) {
        return { eligible: true };
      }
      return persistedSearchParams;
    }
  );
  const [selectedStructureOption, setSelectedStructureOption] = useState<
    EuiComboBoxOptionOption<Partial<Structure>>
  >(persistedStructureOption);

  const [dob, setDob] = useState<Moment>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allowedStructureTypes] = useState([
    'ward',
    'votingdistrict',
    'region',
    'municipality',
    'constituency',
    'province',
  ]);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLFormElement;
    const name = target.name;

    if (target.name === '' || target.name === 'dob') return;

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

  const handleSelectStructure = (data: Partial<Structure>) => {
    let structure;

    if (data) {
      const structureCodeMap = {
        municipality: 'municipalityCatB',
        region: 'region_code',
        constituency: 'constituency_code',
        ward: 'ward',
        votingdistrict: 'votingDistrict_id',
      };

      structure = {
        values: [
          {
            [data.type]: data[structureCodeMap[data.type.toLowerCase()]],
            in: ['living', 'registered'],
            inAnd: false,
            // out: ['living', 'registered'],
            outAnd: false,
            and: false,
          },
        ],
      };
    }

    setSearchParams(previousValue => {
      const newValue = {
        ...previousValue,
      };

      if (structure) {
        newValue['structure'] = JSON.stringify(structure);
      } else {
        if (newValue['structure']) delete newValue['structure'];
      }

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
        dob: date?.isValid ? date.format('YYYY-MM-DD') : null,
      };

      for (const key in newValue) {
        if (!newValue[key] || newValue[key] === '') delete newValue[key];
      }

      return newValue;
    });
  };

  const handleEligibleChange = e => {
    setSearchParams(prev => {
      return { ...prev, eligible: e?.target?.checked };
    });
  };

  const handleSubmit = () => {
    if ('eligible' in searchParams && !searchParams.eligible) {
      // don't send through eligible=false to search endpoint
      delete searchParams.eligible;
    }
    if ('eligible' in searchParams && searchParams?.identity) {
      // don't send through eligible if identity search
      delete searchParams.eligible;
    }
    onSubmit(searchParams, selectedStructureOption);
    if (isModalVisible) closeModal();
  };

  const handleReset = () => {
    setSearchParams({ eligible: true });
    setDob(null);
    setSelectedStructureOption(undefined);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
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
          isLoading={isLoading}
          disabled={
            !searchParams ||
            !Object.keys(searchParams).length ||
            isLoading ||
            (Object.keys(searchParams)?.length === 1 &&
              selectedStructureOption !== undefined)
          }>
          Search
        </EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const form = (
    <EuiForm fullWidth component="form" onChange={handleChange}>
      <EuiFormRow label="ID Number or DARN" display="rowCompressed">
        <EuiFieldText
          name="identity"
          compressed
          onKeyDown={handleKeyDown}
          placeholder="ID Number, DARN"
          value={
            searchParams?.identity?.replaceAll('*', '')?.replaceAll(' ', '') ||
            ''
          }
          onChange={() => null}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Date of birth">
        <EuiDatePicker
          name="dob"
          autoComplete="off"
          onKeyDown={handleKeyDown}
          dateFormat={['D MMM YYYY', 'YYYY-MM-DD', 'YYYYMMDD']}
          selected={dob}
          maxDate={moment().subtract(17, 'year')}
          yearDropdownItemNumber={120}
          onChange={handleDOBChange}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Surname">
        <EuiFieldText
          name="surname"
          onKeyDown={handleKeyDown}
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.surname || ''}
          onChange={() => null}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="First names">
        <EuiFieldText
          name="firstName"
          onKeyDown={handleKeyDown}
          compressed
          append={<AdvancedSearchTooltip />}
          value={searchParams?.firstName || ''}
          onChange={() => null}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed" label="Email">
        <EuiFieldText
          name="email"
          onKeyDown={handleKeyDown}
          compressed
          value={searchParams?.email?.replaceAll('*', '') || ''}
          onChange={() => null}
        />
      </EuiFormRow>

      <EuiFormRow display="rowCompressed" label="Phone">
        <EuiFieldText
          name="phone"
          onKeyDown={handleKeyDown}
          compressed
          value={searchParams?.phone?.replaceAll('*', '') || ''}
          onChange={() => null}
        />
      </EuiFormRow>

      <EuiFormRow
        display="rowCompressed"
        label="Structure"
        isInvalid={
          selectedStructureOption && Object.keys(searchParams).length === 1
        }
        error={
          'Please also use at least one of the other search fields in addition to Structure'
        }>
        <Structres
          structureTypes={allowedStructureTypes}
          showSelected={true}
          persistedOption={persistedStructureOption}
          onSelect={option => {
            setSelectedStructureOption(option);
            handleSelectStructure(option?.value);
          }}
        />
      </EuiFormRow>

      <EuiSpacer />

      <EuiFormRow display="rowCompressed">
        <EuiCheckbox
          id="eligible"
          label="Eligible voters only?"
          checked={searchParams?.eligible}
          onChange={e => handleEligibleChange(e)}
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
          <EuiButton iconType="search" onClick={showModal} fill size="m">
            Search again
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="s" />
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
