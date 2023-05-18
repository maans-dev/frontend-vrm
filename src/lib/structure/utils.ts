import { ProvinceEnum } from '@lib/domain/person';
import { Structure, StructureType } from '@lib/domain/stuctures';

export const getStructureDescription = (structure: Partial<Structure>) => {
  let description: string = StructureType.Unkown;
  const getProvince = (structure: Partial<Structure>) => {
    if ('province' in structure) return structure.province;
    if ('province_enum' in structure)
      return ProvinceEnum[structure.province_enum];
    return 'Unknown';
  };
  switch (structure.type.toLowerCase() as StructureType) {
    case StructureType.Constituency:
      description = `Constiteuncy, ${getProvince(structure)}`;
      break;
    case StructureType.Province:
      description = `Province, ${getProvince(structure)}`;
      break;
    case StructureType.Municipality:
      description = `Municipality, ${getProvince(structure)}`;
      break;
    case StructureType.Region:
      description = `Region, ${getProvince(structure)}`;
      break;
    case StructureType.VotingDistrict:
      description = `Voting district, ${getProvince(structure)}`;
      break;
    case StructureType.Ward:
      description = `Ward, ${getProvince(structure)}`;
      break;
  }
  return description;
};
