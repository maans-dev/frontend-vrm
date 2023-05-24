import Appsignal from '@appsignal/javascript';
import { plugin as appSignalBreadcrumbsNetwork } from '@appsignal/plugin-breadcrumbs-network';
import { plugin as appSignalPathDecorator } from '@appsignal/plugin-path-decorator';
import { plugin } from '@appsignal/plugin-window-events';

export const appsignal = new Appsignal({
  key: process.env.NEXT_PUBLIC_APPSIGNAL,
  revision: process.env.NEXT_PUBLIC_VERSION,
});

export const initAppsignal = () => {
  appsignal.use(appSignalPathDecorator());
  appsignal.use(appSignalBreadcrumbsNetwork());
  appsignal.use(plugin());
};
