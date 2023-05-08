import { useCallback, useEffect, useState } from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiSelectable,
  EuiSelectableOption,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { MdHowToVote } from 'react-icons/md';
import { Address } from '@lib/domain/person';

interface Props {
  address: Partial<Address>[];
  onSelect: (selected) => void;
}

export interface OptionData {
  description?: string;
  value: Partial<Address>;
  votingDistrict?: string;
  votingDistrict_id?: string;
  latitude?: string;
  longitude?: string;
  emoji?: string;
}

const AddressResults = ({ address, onSelect }: Props) => {
  const [options, setOptions] = useState<
    Array<EuiSelectableOption<OptionData>>
  >(
    address && Array.isArray(address)
      ? address.map(
          (addres): EuiSelectableOption<OptionData> => ({
            label: addres.formatted,
            data: {
              votingDistrict: addres?.votingDistrict,
              votingDistrict_id: addres?.votingDistrict_id,
              latitude: addres.latitude,
              longitude: addres.longitude,
              emoji: addres?.service?.emoji,
            },
            isGroupLabel: false,
            value: addres,
            // prepend: <></>,
          })
        )
      : []
  );

  const getOptionData = (option: EuiSelectableOption<OptionData>) => {
    return {
      description: option.data?.description,
      votingDistrict: option.data?.votingDistrict,
      votingDistrict_id: option.data?.votingDistrict_id,
      latitude: option.data?.latitude,
      longitude: option.data?.longitude,
      emoji: option?.data?.emoji,
    };
  };

  const renderOption = useCallback(
    (option: EuiSelectableOption<OptionData>) => {
      getOptionData(option);
      return (
        <>
          <EuiFlexItem grow={true}>
            {option.label ? (
              <EuiText size="xs">
                <strong>
                  {option.emoji} {option.label}
                </strong>
              </EuiText>
            ) : null}
            <EuiSpacer size="xs" />
            {option.label ? (
              <EuiText size="xs">
                {option.latitude}, {option.longitude}
              </EuiText>
            ) : null}
            <EuiSpacer size="xs" />
            {option.votingDistrict && option.votingDistrict_id && (
              <EuiText size="xs" className="eui-displayBlock">
                <EuiFlexGroup responsive={false} gutterSize="s">
                  <EuiFlexItem grow={false}>
                    <EuiIcon type={MdHowToVote} />
                  </EuiFlexItem>
                  <EuiFlexItem>
                    {option.votingDistrict} ({option.votingDistrict_id})
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiText>
            )}
          </EuiFlexItem>
        </>
      );
    },
    []
  );

  const handleSelect = options => {
    setOptions(options);

    const selectedStructure = options.find(option => option.checked === 'on');
    onSelect(selectedStructure);
  };

  useEffect(() => {
    if (address && Array.isArray(address)) {
      setOptions(
        address.map(
          (addres): EuiSelectableOption<OptionData> => ({
            label: addres.formatted,
            data: {
              votingDistrict: addres?.votingDistrict,
              votingDistrict_id: addres?.votingDistrict_id,
              latitude: addres.latitude,
              longitude: addres.longitude,
              emoji: addres?.service?.emoji,
            },
            isGroupLabel: false,
            value: addres,
            prepend: <></>,
          })
        )
      );
    }
  }, [address]);

  return (
    <>
      <EuiSelectable
        options={options}
        singleSelection="always"
        allowExclusions={false}
        onChange={handleSelect}
        renderOption={renderOption}
        listProps={{
          rowHeight: 75,
          showIcons: false,
        }}
        // height={80}
      >
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

export default AddressResults;
