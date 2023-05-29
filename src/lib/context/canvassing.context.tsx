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
import { useSession } from 'next-auth/react';
import { useSWRConfig } from 'swr';
import { appsignal, redactObject } from '@lib/appsignal';

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
  setUpdatePayload: (update) => void;
  nextId: () => number;
  submitUpdatePayload: () => void;
  resetForm: () => void;
  handleTabChange: (tabNumber: number) => void;
  selectedTab: number;
};

export const CanvassingContext = createContext<Partial<CanvassingContextType>>(
  {}
);

const CanvassingProvider = ({ children }) => {
  const [data, setData] = useState<
    Partial<PersonUpdateRequest> & Partial<{ canvass: CanvassUpdate }>
  >({});
  const { data: session } = useSession();
  const [person, setPersonInternal] = useState<Person | null>(null);
  const [sequence, setSequence] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const [campaign, setCampaignInternal] = useState(null);
  const [canvassingType, setCanvassingTypeInternal] = useState(null);
  const [canvasser, setCanvasserInternal] = useState(null);
  const [canvassDate, setCanvassDateInternal] = useState(null);
  const [doFormReset, setDoFormReset] = useState(new Date());
  const { addToast } = useContext(ToastContext);
  const { mutate } = useSWRConfig();
  const [selectedTab, setSelectedTab] = useState(1);

  const setPerson = (person: Person) => setPersonInternal(person);

  const setUpdatePayload = (update: PersonUpdate<GeneralUpdate>) => {
    // data is not an object and must be deleted
    if (update.data === null) {
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

  function handleTabChange(tabNumber) {
    setSelectedTab(tabNumber);
  }

  const submitUpdatePayload = async () => {
    setIsSubmitting(true);
    setServerError('');
    const requestBody = cloneDeep(data);
    let url = '';
    try {
      requestBody.key = person.key;
      requestBody.username = session.user.darn;
      if (
        router.pathname.includes('cleanup') ||
        router.pathname.includes('canvass') ||
        router.pathname.includes('capture')
      ) {
        if (!requestBody?.canvass) {
          requestBody.canvass = {};
        }
        if (!requestBody?.canvass?.date)
          requestBody.canvass.date = moment().format('YYYY-MM-DD');
        if (!requestBody?.canvass?.key)
          requestBody.canvass.key = session.user.darn;
      }

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
      appsignal.addBreadcrumb({
        category: 'Log',
        action: 'PERSON EVENT REQUEST',
        metadata: {
          request: redactObject(requestBody),
        },
      });

      let endpoint = 'canvass';
      if (router.pathname.includes('cleanup')) {
        endpoint = 'datacleanup';
        // Delete the canvass field as that it's required for data cleanup.
        delete requestBody.canvass;
      }
      if (router.pathname.includes('membership')) {
        endpoint = 'membership';
      }

      url = `${process.env.NEXT_PUBLIC_API_BASE}/event/${endpoint}/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const respPayload = await response.clone().json();

      if (response.ok) {
        setIsComplete(true);
        mutate(
          `/person?key=${person.key}&template=["Address","Contact","Field","Comment","Canvass", "Membership"]`
        );
        if (router.pathname.includes('/canvass/')) {
          router.push('/canvass/canvassing-type');
        } else if (router.pathname.includes('/capture/')) {
          router.push('/capture/capturing-type');
        } else if (router.pathname.includes('/cleanup/')) {
          router.push('/cleanup/voter-search');
        } else if (router.pathname.includes('/membership')) {
          router.push('/membership/voter-search');
        }
        addToast({
          id: 'voter-submitted-success',
          title: 'Voter has been successfully updated',
          color: 'success',
        });
      } else {
        setServerError(respPayload?.message || 'Something went wrong');
        const errJson = JSON.parse(await response.clone().text());
        appsignal.sendError(
          new Error(`Unable to update person: ${errJson.message}`),
          span => {
            span.setAction('api-call');
            span.setParams({
              route: url,
              body: redactObject(requestBody),
            });
            span.setTags({ user_darn: session.user.darn.toString() });
          }
        );
      }

      console.log('[PERSON EVENT RESPONSE]', respPayload);
      appsignal.addBreadcrumb({
        category: 'Log',
        action: 'PERSON EVENT RESPONSE',
        metadata: {
          response: redactObject(respPayload),
        },
      });
      // throw new Error('Forced error for testing');
    } catch (error) {
      // TODO: Need to display these error in a Toast.
      console.error('Something went wrong. Please try again later', error);
      appsignal.sendError(
        new Error(`Unable to update person: ${error.message}`),
        span => {
          span.setAction('api-call');
          span.setParams({
            route: url,
            body: redactObject(requestBody),
          });
          span.setTags({ user_darn: session.user.darn.toString() });
        }
      );
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
          type: { name: campaign.type?.name },
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
          dob: person.dob,
        })
      );
      setCanvasserInternal(person);
    } else {
      sessionStorage.removeItem('canvasser');
      setCanvasserInternal(null);
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

  const checkIsDirty = updatedData => {
    updatedData &&
    Object.keys(updatedData).filter(k => k !== 'canvass').length > 0
      ? setIsDirty(true)
      : setIsDirty(false);
  };

  const resetForm = () => {
    setDoFormReset(new Date());

    setIsComplete(false);
    setPerson(null);
    if (router.pathname.includes('/canvass')) {
      setData(prev => ({
        canvass: {
          activity: prev?.canvass?.activity,
          type: prev?.canvass?.type,
          date: prev?.canvass?.date,
          key: prev?.canvass?.key,
        },
      }));
    }
    setServerError('');
    setIsDirty(false);
  };

  // reset context state based on url
  useEffect(() => {
    if (
      !router.asPath.includes('/canvass') &&
      !router.asPath.includes('/capture') &&
      !router.asPath.includes('/cleanup') &&
      !router.asPath.includes('/membership')
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
    if (router.asPath.includes('/voter-search')) {
      setData(prev => {
        return {
          canvass: prev?.canvass,
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

    // TODO: this smells bad as these vars shadow the state vars.
    const campaign = JSON.parse(sessionStorage.getItem('campaign')) || null;
    const type = JSON.parse(sessionStorage.getItem('canvassType')) || null;
    const canvasser = JSON.parse(sessionStorage.getItem('canvasser')) || null;
    const canvassDate = sessionStorage.getItem('canvassDate') || null;

    if (
      !data?.canvass ||
      !data?.canvass?.activity ||
      !data?.canvass?.type ||
      !data?.canvass?.date ||
      !data?.canvass?.key
    ) {
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

    // rediect to canvass/capture type page if campaign/type not set
    if (
      (canvassRoute && router.route !== '/canvass/canvassing-type') ||
      (captureRoute && router.route !== '/capture/capturing-type')
    ) {
      if (!campaign || !type) {
        router.push(
          canvassRoute ? '/canvass/canvassing-type' : '/capture/capturing-type'
        );
      }
    }
  }, [router]);

  // TODO: Remove this when stable as it's just for debugging
  useEffect(() => {
    console.log('[CONTEXT]', { data, person });
    appsignal.addBreadcrumb({
      category: 'Log',
      action: 'CONTEXT',
      metadata: {
        data: redactObject(data),
        person: redactObject(person),
      },
    });
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
        handleTabChange,
        selectedTab,
      }}>
      {children}
    </CanvassingContext.Provider>
  );
};

export default CanvassingProvider;
