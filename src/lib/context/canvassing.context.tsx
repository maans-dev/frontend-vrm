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
  setPerson: (person: Person) => void;
  setCampaign: (campaign: Campaign) => void;
  setCanvassingType: (type: ICanvassType) => void;
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
      requestBody.username = 12345678; // TODO: Get this from logged in user
      requestBody.canvass.activity = 'dbb882d6-7fd4-4826-aa05-528b52b749f2'; // TODO: remove this once campaign list is hooked up to API
      requestBody.canvass.date = new Date(); // TODO: remove this once campaign list is hooked up to API
      requestBody.canvass.key = 12345678; // TODO: Get this from logged in user

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

      console.log('[PERSON EVENT PAYLOAD]', requestBody);

      const response = await fetch(
        `https://sturdy-giggle.da-io.net/event/canvass/`, // TODO: the base url shouldn't be hard-coded
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      const respPayload = await response.json();

      if (response.ok) {
        setIsComplete(true);
        router.push('/canvass/canvassing-type');
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
    localStorage.setItem('campaign', JSON.stringify(campaign));
    setCampaignInternal(campaign);
  };
  const setCanvassingType = (type: ICanvassType) => {
    localStorage.setItem('canvassType', JSON.stringify(type));
    setCanvassingTypeInternal(type);
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
      },
    }));
    setServerError('');
    setIsDirty(false);
  };

  // reset context state based on url
  useEffect(() => {
    if (!router.asPath.includes('/canvass')) {
      setIsComplete(false);
      setPerson(null);
      setData(null);
      setServerError('');
      setIsDirty(false);
    }
    if (router.asPath.includes('/canvassing-type')) {
      setIsComplete(false);
      setPerson(null);
      setData(prev => ({
        canvass: {
          activity: prev?.canvass?.activity,
          type: prev?.canvass?.type,
        },
      }));
      setServerError('');
      setIsDirty(false);
    }
    if (router.asPath.includes('/voter-search')) {
      setData(prev => {
        return {
          canvass: prev.canvass,
        };
      });
      setPerson(null);
      setServerError('');
      setIsDirty(false);
    }
  }, [router]);

  // Load campaign & canvassing type from local storage
  useEffect(() => {
    if (!router.route.includes('/canvass')) {
      // remove local storage when not in canvassing
      localStorage.removeItem('campaign');
      localStorage.removeItem('canvassType');
      return;
    }

    const campaign = JSON.parse(localStorage.getItem('campaign'));
    const type = JSON.parse(localStorage.getItem('canvassType'));

    // rediect to canvass type page if campaign/type not set
    if (
      router.route.includes('/canvass') &&
      router.route !== '/canvass/canvassing-type'
    ) {
      if (!campaign || !type) {
        router.push('/canvass/canvassing-type');
      }
    }

    if (!data?.canvass || !data?.canvass?.activity || !data?.canvass?.type) {
      setCampaign(campaign);
      setCanvassingType(type);
      if (campaign && type) {
        setData(prev => ({
          canvass: {
            ...prev?.canvass,
            ...{ activity: campaign.key, type: type.id },
          },
        }));
      }
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
        setPerson,
        setCampaign,
        setCanvassingType,
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
