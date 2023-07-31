import { FunctionComponent, useMemo } from 'react';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import SheetCard from './sheet-card';
import { KeyedMutator } from 'swr';

export type Props = {
  sheetPanelData: SheetGeneration[];
  sheetGenMutate: KeyedMutator<SheetGeneration[]>;
};

const SheetPanel: FunctionComponent<Props> = ({
  sheetPanelData,
  sheetGenMutate,
}) => {
  const orderedItems = useMemo(() => {
    const items = sheetPanelData.sort((a, b) => {
      if (['PROCESSING', 'PENDING'].includes(a.status) && b.status === 'DONE') {
        return -1;
      }
      if (a.status === 'DONE' && ['PROCESSING', 'PENDING'].includes(b.status)) {
        return 1;
      }
      return 0;
    });
    return items;
  }, [sheetPanelData]);

  const sheetData = orderedItems.filter(item => item.status !== 'DELETED');

  return (
    <>
      {sheetData?.map(item => (
        <SheetCard key={item.key} data={item} sheetGenMutate={sheetGenMutate} />
      ))}
    </>
  );
};

export default SheetPanel;
