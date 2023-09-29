import { FunctionComponent, useMemo } from 'react';
import CommsCard from './comms-card';
import { BulkComms } from '@lib/domain/bulk-comms';

export type Props = {
  bulkCommsData?: BulkComms[];
};

const GeneratedBulkComms: FunctionComponent<Props> = ({ bulkCommsData }) => {
  const orderedItems = useMemo(() => {
    const items = bulkCommsData?.sort((a, b) => {
      if (['PROCESSING', 'PENDING'].includes(a.status) && b.status === 'DONE') {
        return -1;
      }
      if (a.status === 'DONE' && ['PROCESSING', 'PENDING'].includes(b.status)) {
        return 1;
      }
      return 0;
    });
    return items;
  }, [bulkCommsData]);

  const commsData = orderedItems?.filter(
    item => item.status !== 'DELETED' && item.status !== 'ERROR'
  );

  console.log({ bulkCommsData });

  return (
    <>
      {commsData?.map(item => (
        <CommsCard key={item.key} data={item} />
      ))}
    </>
  );
};

export default GeneratedBulkComms;
