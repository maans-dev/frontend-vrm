import Appsignal from '@appsignal/javascript';
import { plugin as appSignalBreadcrumbsNetwork } from '@appsignal/plugin-breadcrumbs-network';
import { plugin as appSignalPathDecorator } from '@appsignal/plugin-path-decorator';
import { plugin } from '@appsignal/plugin-window-events';
import redact from 'redact-object';

export const appsignal = new Appsignal({
  key: process.env.NEXT_PUBLIC_APPSIGNAL,
  revision: process.env.NEXT_PUBLIC_VERSION,
});

export const initAppsignal = () => {
  appsignal.use(appSignalPathDecorator());
  appsignal.use(appSignalBreadcrumbsNetwork());
  appsignal.use(plugin());
};

export const redactObject = (person: unknown) => {
  if (!person) return 'null';
  const redacted = redact(person, [
    'idNumber',
    'firstName',
    'givenName',
    'surname',
    'address',
    'dob',
    'payment',
    'value',
  ]);
  console.log('REDACTED', redacted);
  return JSON.stringify(redacted);
};
