import { appsignal } from '@lib/appsignal';
import { initialize } from 'unleash-client';

export const unleashClient = initialize({
  url: process.env.FEATURE_FLAGS_URL,
  appName: process.env.NEXT_PUBLIC_ENVIRONMENT,
  instanceId: process.env.FEATURE_FLAGS_INSTANCE_ID,
  customHeaders: { Authorization: process.env.FEATURE_FLAGS_INSTANCE_ID },
});

unleashClient.on('ready', () => {
  appsignal.addBreadcrumb({
    category: 'Log',
    action: 'UNLEASH READY',
    metadata: {
      features: unleashClient.getFeatureToggleDefinitions() as any,
    },
  });
});

// optional error handling when using unleash directly
unleashClient.on('error', err => {
  appsignal.sendError(
    new Error(`Unable to initialize feature toggles: ${err.message}`),
    span => {
      span.setAction('feature-toggles');
      span.setParams({
        error: err.message,
      });
    }
  );
});
