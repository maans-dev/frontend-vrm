import { FunctionComponent } from 'react';
import SheetPanel from './sheet-panel';
import { SheetGeneration } from '@lib/domain/sheet-generation';
import { KeyedMutator } from 'swr';

export type Props = {
  sheetGenData: SheetGeneration[];
  sheetGenMutate: KeyedMutator<SheetGeneration[]>;
};

const GeneratedSheets: FunctionComponent<Props> = ({
  sheetGenData,
  sheetGenMutate,
}) => {
  return (
    <SheetPanel sheetPanelData={sheetGenData} sheetGenMutate={sheetGenMutate} />
  );
};

export default GeneratedSheets;
