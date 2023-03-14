import useSWR from 'swr';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ITags } from '@components/canvassing-tags/types';

interface Age {
  from: number;
  to: number;
  date?: Date;
}

interface VoterData {
  key?: number;
  surname?: string;
  firstName?: string;
  givenName?: string;
  dob?: number;
  age?: Age;
  colourCodes?: number[];
  membershipNumber?: string;
  fields: ITags;
}

interface VoterDataResponse {
  voterData: VoterData | null;
  error: string | null;
  isLoading: boolean;
}

const fetchData = (url: string) =>
  axios
    .get(url)
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => {
      console.error(err);
      throw new Error('Network response was not ok');
    });

export const useVoterData = (): VoterDataResponse => {
  const { data, error } = useSWR<VoterData>(
    'https://sturdy-giggle.da-io.net/person?template=[%22Address%22,%22Contact%22,%22Field%22,%22Comment%22]&surname=WURFEL&dob=19740830&contactability={%22PHONE%22:{%22canContact%22:true,%22value%22:%22082484*%22},%22EMAIL%22:{%22canContact%22:true,%22value%22:%22*Wurfel*%22}}&limit=10',
    fetchData
  );

  const [voterData, setVoterData] = useState<VoterData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setErrorMsg('Error loading data');
    } else if (data) {
      setVoterData(data);
    }
  }, [data, error]);

  return {
    voterData,
    error: errorMsg || error,
    isLoading: !voterData && !error,
  };
};
