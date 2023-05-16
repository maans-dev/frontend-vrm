import React, { useState } from 'react';
import { EuiSelectable, EuiSelectableOption, EuiText } from '@elastic/eui';
import { Structure, StructureType } from '@lib/domain/stuctures';

interface Props {
  structures: Structure[];
  onSelect: (selected: Structure[]) => void;
}

export interface OptionData {
  description?: string;
  value: Structure;
  ward?: string;
}

const StructureResults = ({ structures, onSelect }: Props) => {
  const getStructureLabel = (structure: Structure) => {
    let label: string = StructureType.Unkown;
    switch (structure.type as StructureType) {
      case StructureType.Constituency:
        label = structure.constituency;
        break;
      case StructureType.Province:
        label = structure.province;
        break;
      case StructureType.Municipality:
        label = structure.municipalityShortName;
        break;
      case StructureType.Region:
        label = structure.region;
        break;
      case StructureType.VotingDistrict:
        label = `${structure.votingDistrict} (${structure.votingDistrict_id})`;
        break;
      case StructureType.Ward:
        label = `${structure.municipalityShortName} Ward ${structure.ward_num}`;
        break;
    }
    return label;
  };

  const getStructureDescription = (structure: Structure) => {
    let description: string = StructureType.Unkown;
    switch (structure.type as StructureType) {
      case StructureType.Constituency:
        description = `Constiteuncy, ${structure.province}`;
        break;
      case StructureType.Province:
        description = `Province, ${structure.province}`;
        break;
      case StructureType.Municipality:
        description = `Municipality, ${structure.province}`;
        break;
      case StructureType.Region:
        description = `Region, ${structure.province}`;
        break;
      case StructureType.VotingDistrict:
        description = `Voting district, ${structure.province}`;
        break;
      case StructureType.Ward:
        description = `Ward, ${structure.province}`;
        break;
    }
    return description;
  };

  const [options, setOptions] = useState<
    Array<EuiSelectableOption<OptionData>>
  >(
    structures && Array.isArray(structures)
      ? structures.map(
          (structure): EuiSelectableOption<OptionData> => ({
            label: getStructureLabel(structure),
            data: {
              description: getStructureDescription(structure),
              ward: structure?.ward,
            },
            isGroupLabel: false,
            value: structure,
          })
        )
      : []
  );

  const renderOption = (option: EuiSelectableOption<OptionData>) => {
    return (
      <>
        <EuiText size="xs" className="eui-displayBlock">
          {option.label}
        </EuiText>
        <EuiText size="xs" color="subdued" className="eui-displayBlock">
          <small>{option.description}</small>
        </EuiText>
      </>
    );
  };

  const handleSelect = options => {
    setOptions(options);

    const selectedStructure = options.find(option => option.checked === 'on');
    onSelect(selectedStructure);
  };

  return (
    <>
      <EuiSelectable
        options={options}
        singleSelection="always"
        allowExclusions={false}
        onChange={handleSelect}
        renderOption={renderOption}
        listProps={{
          rowHeight: 50,
          showIcons: false,
        }}
        height={240}>
        {(list, search) => (
          <>
            {search}
            {list}
          </>
        )}
      </EuiSelectable>
    </>
  );
};

export default StructureResults;
