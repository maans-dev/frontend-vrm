import { ICanvassType } from '@components/canvassing-type/type';
import { Campaign, Person } from '@lib/domain/person';
import {
  assertHasFields,
  CanvassUpdate,
  GeneralUpdate,
  PersonUpdate,
  PersonUpdateRequest,
} from '@lib/domain/person-update';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ToastContext } from './toast.context';
import { Moment } from 'moment';
import moment from 'moment';

export type CanvassingContextType = {
  data: Partial<PersonUpdateRequest> & Partial<{ canvass: CanvassUpdate }>;
  person: Person | null;
  isContextReady: boolean;
  isSubmitting: boolean;
  isComplete: boolean;
  isDirty: boolean;
  serverError: string;
  doFormReset: Date;
  campaign: Campaign;
  canvassingType: ICanvassType;
  canvasser: Partial<Person>;
  canvassDate: Moment;
  setPerson: (person: Person) => void;
  setCampaign: (campaign: Campaign) => void;
  setCanvassingType: (type: ICanvassType) => void;
  setCanvasser: (canvasser: Partial<Person>) => void;
  setCanvassDate: (data: Moment) => void;
  setUpdatePayload: (update: PersonUpdate<GeneralUpdate>) => void;
  nextId: () => number;
  submitUpdatePayload: () => void;
  resetForm: () => void;
};

export const CanvassingContext = createContext<Partial<CanvassingContextType>>(
  {}
);

const CanvassingProvider = ({ children }) => {
  const [data, setData] = useState<
    Partial<PersonUpdateRequest> & Partial<{ canvass: CanvassUpdate }>
  >({});
  const [person, setPersonInternal] = useState<Person | null>(null);
  const [sequence, setSequence] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const [campaign, setCampaignInternal] = useState(null);
  const [canvassingType, setCanvassingTypeInternal] = useState(null);
  const [canvasser, setCanvasserTypeInternal] = useState(null);
  const [canvassDate, setCanvassDateInternal] = useState(null);
  const [doFormReset, setDoFormReset] = useState(new Date());
  const { addToast } = useContext(ToastContext);

  const setPerson = (person: Person) => setPersonInternal(person);

  const setUpdatePayload = (update: PersonUpdate<GeneralUpdate>) => {
    // data is not an object and must be deleted
    if (!update.data) {
      setData(prev => {
        delete prev[update.field];
        checkIsDirty(prev);
        return prev;
      });
      return;
    }

    // data is an object so scan it's fields for deletions
    if (
      typeof update.data === 'object' &&
      !Array.isArray(update.data) &&
      update.data !== null
    ) {
      for (const key in update.data as object) {
        if (update.data[key] === null) delete update.data[key];
      }
    }

    // is a deleted item so remove all other updates for this item, leaving only key and deleted flag
    if (
      typeof update.data === 'object' &&
      !Array.isArray(update.data) &&
      'deleted' in update.data
    ) {
      for (const key in update.data) {
        if (key !== 'key' && key !== 'deleted') delete update.data[key];
      }
    }

    setData(prev => {
      let next = update.data as any;

      // if update is for a multivalue field/array
      if (person && Array.isArray(person[update.field])) {
        // 1st update for this multivalue field so add as array
        if (data?.hasOwnProperty(update.field)) {
          next = [
            ...data[update.field].filter((d: GeneralUpdate) => {
              assertHasFields(['key'], d);
              assertHasFields(['key'], update.data);
              return d.key !== update.data?.key;
            }),
            update.data,
          ];
        } else {
          next = [update.data];
        }

        // if update is empty it will only contain a key so remove the data
        assertHasFields(['key'], update.data);
        if (Object.keys(update.data).length === 1 && update.data?.key) {
          if (prev?.[update.field]) {
            next = [
              ...prev[update.field].filter((d: GeneralUpdate) => {
                assertHasFields(['key'], d);
                assertHasFields(['key'], update.data);
                return d.key !== update.data?.key;
              }),
            ];
          } else {
            return prev;
          }
        }

        // handle deletions
        if ('deleted' in update.data) {
          if (typeof update.data.key === 'number') {
            // completely remove if this is a new item
            next = [
              ...prev[update.field].filter((d: GeneralUpdate) => {
                assertHasFields(['key'], d);
                assertHasFields(['key'], update.data);
                return d.key !== update.data?.key;
              }),
            ];
          } else {
          }
        }

        // no elements so remove completely
        if (next.length === 0) {
          delete prev[update.field];
          return prev;
        }
      }

      // Existing field is an object so merge with prev
      if (
        prev &&
        prev[update.field] &&
        !Array.isArray(prev[update.field]) &&
        typeof prev[update.field] === 'object'
      ) {
        next = { ...prev[update.field], ...next };
      }

      const updatedData = { ...prev, [update.field]: next };

      checkIsDirty(updatedData);

      return updatedData;
    });
  };

  const nextId = useCallback(() => {
    const next = sequence + 1;
    setSequence(next);
    return next;
  }, [sequence]);

  const submitUpdatePayload = async () => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const requestBody = cloneDeep(data);
      requestBody.key = person.key;
      requestBody.username = 17888131; // TODO: Get this from logged in user
      if (!requestBody?.canvass?.date)
        requestBody.canvass.date = moment().format('YYYY-DD-MM');
      if (!requestBody?.canvass?.key) requestBody.canvass.key = 17888131; // TODO: Get this from logged in user
      // remove numeric keys as these represent new items
      if ('comments' in data) {
        requestBody.comments.forEach(item => {
          if ('key' in item && typeof item.key === 'number') delete item.key;
        });
      }

      if ('contacts' in data) {
        requestBody.contacts.forEach(item => {
          if ('key' in item && typeof item.key === 'number') delete item.key;
        });
      }

      if ('fields' in data) {
        requestBody.fields.forEach(item => {
          if ('key' in item && typeof item.key === 'number') delete item.key;
        });
      }

      console.log('[PERSON EVENT REQUEST]', requestBody);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/event/canvass/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      const respPayload = await response.json();

      if (response.ok) {
        setIsComplete(true);
        if (router.pathname.includes('/canvass/')) {
          router.push('/canvass/canvassing-type');
        } else if (router.pathname.includes('/capture/')) {
          router.push('/capture/capturing-type');
        }
        addToast({
          id: 'voter-submitted-success',
          title: 'Voter has been successfully updated',
          color: 'success',
        });
      } else {
        setServerError(respPayload?.message || 'Something went wrong');
      }

      console.log('[PERSON EVENT RESPONSE]', respPayload);
    } catch (error) {
      // TODO: Need to display these error in a Toast.
      console.error('Something went wrong. Please try again later', error);
    }
    setIsSubmitting(false);
  };

  const setCampaign = (campaign: Campaign) => {
    if (campaign) {
      sessionStorage.setItem(
        'campaign',
        JSON.stringify({
          key: campaign.key,
          name: campaign.name,
        })
      );
      setCampaignInternal(campaign);
    } else {
      sessionStorage.removeItem('campaign');
      setCampaignInternal(null);
    }
  };
  const setCanvassingType = (type: ICanvassType) => {
    if (type) {
      sessionStorage.setItem('canvassType', JSON.stringify(type));
      setCanvassingTypeInternal(type);
    } else {
      sessionStorage.removeItem('canvassType');
      setCanvassingTypeInternal(null);
    }
  };
  const setCanvasser = (person: Partial<Person>) => {
    if (person && person.key) {
      sessionStorage.setItem(
        'canvasser',
        JSON.stringify({
          key: person.key,
          givenName: person.givenName,
          firstName: person.firstName,
          surname: person.surname,
        })
      );
      setCanvasserTypeInternal(person);
    } else {
      sessionStorage.removeItem('canvasser');
      setCanvasserTypeInternal(null);
    }
  };
  const setCanvassDate = (date: Moment) => {
    if (date && date.isValid()) {
      sessionStorage.setItem('canvassDate', date.format('YYYY-MM-DD'));
      setCanvassDateInternal(date);
    } else {
      sessionStorage.removeItem('canvassDate');
      setCanvassDateInternal(null);
    }
  };

  const checkIsDirty = updatedData =>
    updatedData && Object.keys(updatedData).length > 1
      ? setIsDirty(true)
      : setIsDirty(false);

  const resetForm = () => {
    console.log('RESET FORM');
    setDoFormReset(new Date());

    setIsComplete(false);
    setPerson(null);
    setData(prev => ({
      canvass: {
        activity: prev?.canvass?.activity,
        type: prev?.canvass?.type,
        date: prev?.canvass?.date,
        key: prev?.canvass?.key,
      },
    }));
    setServerError('');
    setIsDirty(false);
  };

  // reset context state based on url
  useEffect(() => {
    if (
      !router.asPath.includes('/canvass') &&
      !router.asPath.includes('/capture')
    ) {
      setIsComplete(false);
      setPerson(null);
      setData(null);
      setServerError('');
      setIsDirty(false);
    }
    if (
      router.asPath.includes('/canvassing-type') ||
      router.asPath.includes('/capturing-type')
    ) {
      setIsComplete(false);
      setPerson(null);
      setData(prev => ({
        canvass: {
          activity: prev?.canvass?.activity,
          type: prev?.canvass?.type,
          date: prev?.canvass?.date,
          key: prev?.canvass?.key,
        },
      }));
      setServerError('');
      setIsDirty(false);
    }
    if (
      router.asPath.includes('/voter-search') ||
      router.asPath.includes('/capturing-search')
    ) {
      setData(prev => {
        return {
          canvass: prev.canvass,
        };
      });
      setPerson(null);
      setServerError('');
      setIsDirty(false);
    }

    const captureRoute = router.route.includes('/capture');
    const canvassRoute = router.route.includes('/canvass');

    if (!captureRoute && !canvassRoute) {
      // remove local storage when not in canvassing or capture
      sessionStorage.removeItem('campaign');
      sessionStorage.removeItem('canvassType');
      sessionStorage.removeItem('canvasser');
      sessionStorage.removeItem('canvassDate');
      return;
    }

    // rediect to canvass/capture type page if campaign/type not set
    // if (
    //   (canvassRoute && router.route !== '/canvass/canvassing-type') ||
    //   (captureRoute && router.route !== '/capture/capturing-type')
    // ) {
    //   if (!campaign || !type) {
    //     router.push(
    //       canvassRoute ? '/canvass/canvassing-type' : '/capture/capturing-type'
    //     );
    //   }
    // }

    if (
      !data?.canvass ||
      !data?.canvass?.activity ||
      !data?.canvass?.type ||
      !data?.canvass?.date ||
      !data?.canvass?.key
    ) {
      const campaign = JSON.parse(sessionStorage.getItem('campaign')) || null;
      const type = JSON.parse(sessionStorage.getItem('canvassType')) || null;
      const canvasser = JSON.parse(sessionStorage.getItem('canvasser')) || null;
      const canvassDate = sessionStorage.getItem('canvassDate') || null;

      setCampaign(campaign);
      setCanvassingType(type);
      setCanvasser(canvasser);
      setCanvassDate(moment(canvassDate));

      const canvassUpdate: CanvassUpdate = {};
      if (campaign) canvassUpdate.activity = campaign.key;
      if (type) canvassUpdate.type = type.id;
      if (canvasser) canvassUpdate.key = canvasser.key;
      if (canvassDate) canvassUpdate.date = canvassDate;

      setData(prev => ({
        canvass: {
          ...prev?.canvass,
          ...canvassUpdate,
        },
      }));
    }
  }, [router]);

  // TODO: Remove this when stable as it's just for debugging
  useEffect(() => {
    console.log('[CANVASSING CONTEXT]', { data, person });
  }, [data, person]);

  return (
    <CanvassingContext.Provider
      value={{
        data,
        person,
        isContextReady: true,
        isSubmitting,
        isComplete,
        isDirty,
        serverError,
        doFormReset,
        campaign,
        canvassingType,
        canvasser,
        canvassDate,
        setPerson,
        setCampaign,
        setCanvassingType,
        setCanvasser,
        setCanvassDate,
        setUpdatePayload,
        nextId,
        submitUpdatePayload,
        resetForm,
      }}>
      {children}
    </CanvassingContext.Provider>
  );
};

export default CanvassingProvider;
