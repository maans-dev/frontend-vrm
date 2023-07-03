import { FunctionComponent, useEffect, useState } from 'react';
import useStructureFetcher from '@lib/fetcher/structures/structures';
import { debounce } from 'lodash';
import { ProvinceEnum, Structure } from '@lib/domain/person';
import {
  EuiButtonIcon,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIconTip,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { StructureType } from '@lib/domain/stuctures';

export type Props = {
  onSelect?: (option: EuiComboBoxOptionOption<Partial<Structure>>) => void;
  persistedOption?: EuiComboBoxOptionOption<Partial<Structure>>;
  showSelected?: boolean;
  structureTypes?:
    | 'ward'
    | 'votingdistrict'
    | 'region'
    | 'municipality'
    | 'constituency'
    | 'province'
    | string[];
};

const Structres: FunctionComponent<Props> = ({
  onSelect,
  persistedOption,
  showSelected,
  structureTypes = ['ward', 'votingdistrict'],
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { structures, isLoading } = useStructureFetcher(searchValue);
  const [structuresInternal, setStructuresInternal] =
    useState<Partial<Structure[]>>(null);
  const [selected, setSelected] =
    useState<EuiComboBoxOptionOption<Partial<Structure>>>(persistedOption);

  const debouncedHandleSearchChange = debounce((value: string) => {
    setSearchValue(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    debouncedHandleSearchChange(value);
  };

  useEffect(() => {
    const filteredStructures = structures?.filter(s => {
      const type = s.type.toLowerCase();
      return structureTypes.includes(type);
    });
    setStructuresInternal(filteredStructures);
  }, [structures]);

  useEffect(() => {
    if (persistedOption) {
      setSelected(persistedOption);
    }
  }, [persistedOption]);

  const options = structuresInternal?.map(s => ({
    label: `${s.formatted}`,
    value: s as Partial<Structure>,
  }));

  const getProvince = (structure: Partial<Structure>) => {
    if ('province' in structure) return structure.province;
    if ('province_enum' in structure)
      return ProvinceEnum[structure.province_enum];
    return 'Unknown';
  };

  const renderOption = option => {
    const { value } = option;
    let label: string = StructureType.Unkown;
    let description = 'Unknown';
    switch (value.type.toLowerCase() as StructureType) {
      case StructureType.Constituency:
        label = value.constituency;
        description = `Constiteuncy, ${getProvince(value)}`;
        break;
      case StructureType.Province:
        label = value.province;
        description = `Province, ${getProvince(value)}`;
        break;
      case StructureType.Municipality:
        label = value.municipalityShortName;
        description = `Municipality, ${getProvince(value)}`;
        break;
      case StructureType.Region:
        label = value.region;
        description = `Region, ${getProvince(value)}`;
        break;
      case StructureType.VotingDistrict:
        label = `${value.votingDistrict} (${value.votingDistrict_id})`;
        description = `Voting district, ${getProvince(value)}`;
        break;
      case StructureType.Ward:
        label = `${value.municipalityShortName} Ward ${value.ward_num}`;
        description = `Ward, ${getProvince(value)}`;
        break;
    }

    return (
      <div>
        <EuiText size="xs">{label}</EuiText>
        <EuiText size="xs" color="subdued">
          {description}
        </EuiText>
      </div>
    );
  };

  return (
    <>
      <EuiComboBox
        // compressed
        fullWidth
        async
        isLoading={searchValue && isLoading}
        noSuggestions={!searchValue}
        aria-label="Start typing to search for a structure"
        placeholder="Start typing to search for a structure"
        singleSelection={{ asPlainText: true }}
        // selectedOptions={selected ? [selected] : []}
        options={searchValue ? options : []}
        onChange={options => {
          setSelected(options[0]);
          onSelect(options[0]);
        }}
        rowHeight={50}
        onSearchChange={handleSearchChange}
        renderOption={renderOption}
        isClearable={true}
        append={
          <EuiIconTip
            css={{
              width: '800px',
            }}
            color="primary"
            title="Search for a structure by it's name or code:"
            content={
              <EuiText size="s">
                <ul>
                  <li>
                    Ward: <strong>TSHWANE Ward 92</strong>
                  </li>
                  <li>
                    VD: <strong>ARCADIA PRIMARY SCHOOL</strong>
                  </li>
                  <li>
                    Code: <strong>97090252</strong>
                  </li>
                </ul>
              </EuiText>
            }
          />
        }
      />
      {selected && showSelected && (
        <>
          <EuiSpacer size="xs" />
          <EuiPanel
            paddingSize="s"
            css={{
              borderColor: '#155FA2',
            }}
            hasBorder={true}
            hasShadow={false}>
            <EuiFlexGroup responsive={false} alignItems="center">
              <EuiFlexItem>{renderOption(selected)}</EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  onClick={() => {
                    setSelected(undefined);
                    onSelect(undefined);
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </>
      )}
    </>
  );
};

export default Structres;
