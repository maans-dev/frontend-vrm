import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  EuiCheckableCard,
  EuiFieldText,
  EuiFlexItem,
  EuiInputPopover,
  EuiSpacer,
} from '@elastic/eui';
import { Structure } from '@lib/domain/person';
import StructureResults from './search-results';

export interface Props {
  structures: Partial<Structure[]>;
  handleSearchChange: (searchTerm: string) => void;
  isLoading: boolean;
  onSelect?: (
    label: string,
    data: {
      description: string;
      ward: string;
      votingDistrict_id: string;
    },
    value: Structure
  ) => void;
}

interface SelectedStrucure {
  label: string;
  data: {
    description: string;
    ward: string;
    votingDistrict_id: string;
  };
  value: Structure;
}

const SearchMap: FunctionComponent<Props> = ({
  handleSearchChange,
  structures,
  isLoading,
  onSelect,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] =
    useState<SelectedStrucure>();

  useEffect(() => {
    if (structures) {
      setIsPopoverOpen(true);
    } else {
      setIsPopoverOpen(false);
    }
  }, [structures]);

  const input = (
    <EuiFieldText
      isLoading={isLoading}
      placeholder="Type to search for a Voting District or Ward"
      onChange={e => {
        handleSearchChange(e.target.value);
      }}
      onClick={() => {
        setIsPopoverOpen(structures ? true : false);
      }}
      data-test-subj="searchMapInput"
      aria-label="Structure search"
    />
  );

  const handleSelectStructure = selected => {
    setIsPopoverOpen(false);

    const inputElement = document.querySelector(
      'input[aria-label="Structure search"]'
    ) as HTMLInputElement;

    if (inputElement) {
      inputElement.value = '';
    }

    if (selected) {
      const {
        label,
        value,
        data: { description },
      } = selected;
      if (onSelect) {
        onSelect(label, value, description);
      } else {
        setSelectedStructure(selectedStructure => {
          if (selectedStructure && selectedStructure.value === selected.value) {
            return selectedStructure;
          }
          return selected;
        });
      }
    }
  };

  const handleDelete = () => {
    setSelectedStructure(null);
  };

  return (
    <>
      <EuiInputPopover
        input={input}
        isOpen={isPopoverOpen}
        closePopover={() => setIsPopoverOpen(false)}>
        <StructureResults
          structures={structures}
          onSelect={handleSelectStructure}
        />
      </EuiInputPopover>
      <EuiSpacer size="s" />
      {selectedStructure && (
        <EuiFlexItem>
          <EuiCheckableCard
            css={{
              borderColor: '#155FA2',
            }}
            id={selectedStructure?.label}
            label={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{selectedStructure?.label}</span>
                <span style={{ marginTop: '4px' }}>
                  {selectedStructure?.data.description}
                </span>
              </div>
            }
            checkableType="checkbox"
            checked={true}
            onChange={() => {
              handleDelete();
            }}
          />
        </EuiFlexItem>
      )}
    </>
  );
};

export default SearchMap;
