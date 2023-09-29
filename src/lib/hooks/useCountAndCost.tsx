import { useEffect, useState } from 'react';
import { Campaign } from '@lib/domain/person';

interface Costing {
  value: number;
  valueType: 'CENTS';
  per: number;
}

export interface CommsFetchResponse {
  count: number;
  costing: Costing;
}

const useFetchCountAndCost = (
  selectedStructures: any[],
  selectedCampaign: Campaign | null,
  mode: string,
  sessionToken: string
) => {
  const [countCost, setCountCost] = useState<CommsFetchResponse | null>(null);
  const fetchCountAndCost = async () => {
    const structuresQueryParam = encodeURIComponent(
      JSON.stringify(selectedStructures)
    );

    const url = `${process.env.NEXT_PUBLIC_API_BASE}/activity/extract/${
      mode === 'sms' ? 'sms' : 'email'
    }/count?structures=${structuresQueryParam}&campaign=${
      selectedCampaign.key
    }`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        method: 'GET',
      });

      if (response.ok) {
        const respPayload: CommsFetchResponse = await response.json();
        setCountCost(respPayload);
      }
    } catch (error) {
      console.log({ error }, 'count cost error');
    }
  };

  useEffect(() => {
    if (selectedStructures && selectedCampaign) {
      fetchCountAndCost();
    }
  }, [selectedStructures, selectedCampaign]);

  return { countCost };
};

export default useFetchCountAndCost;
