import { Person } from '@lib/domain/person';
import {
  assertHasFields,
  CanvassUpdate,
  GeneralUpdate,
  PersonUpdate,
} from '@lib/domain/person-update';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';

export type CanvassingContextType = {
  data: Partial<Person>;
  person: Person | null;
  isContextReady: boolean;
  setPerson: (person: Person) => void;
  setUpdatePayload: (update: PersonUpdate<GeneralUpdate>) => void;
  nextId: () => number;
  // submitUpdatePayload: () => void;
};

export const CanvassingContext = createContext<Partial<CanvassingContextType>>(
  {}
);

const CanvassingProvider = ({ children }) => {
  const [data, setData] = useState<
    Partial<Person> & Partial<{ canvass: CanvassUpdate }>
  >({});
  const [person, setPersonInternal] = useState<Person | null>(null);
  const [sequence, setSequence] = useState(0);
  const router = useRouter();

  const setPerson = (person: Person) => setPersonInternal(person);

  const setUpdatePayload = (update: PersonUpdate<GeneralUpdate>) => {
    // data is not an object and must be deleted
    if (!update.data) {
      setData(prev => {
        delete prev[update.field];
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

      return { ...prev, [update.field]: next };
    });
  };

  const nextId = () => {
    const next = sequence + 1;
    setSequence(next);
    return next;
  };

  useEffect(() => {
    if (
      !router.asPath.includes('/canvass') ||
      router.asPath.includes('/canvassing-type')
    ) {
      setData({});
      setPerson(null);
    }
    if (router.asPath.includes('/voter-search')) {
      setData(prev => {
        return {
          canvass: prev.canvass,
        };
      });
      setPerson(null);
    }
  }, [router]);

  useEffect(() => {
    console.log('[CANVASSING CONTEXT]', { data, person });
  }, [data, person]);

  return (
    <CanvassingContext.Provider
      value={{
        data,
        person,
        isContextReady: true,
        setPerson: setPerson,
        setUpdatePayload: setUpdatePayload,
        nextId: nextId,
      }}>
      {children}
    </CanvassingContext.Provider>
  );
};

export default CanvassingProvider;
