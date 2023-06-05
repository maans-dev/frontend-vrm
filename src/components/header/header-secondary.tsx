/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { EuiBreadcrumb, EuiHeader } from '@elastic/eui';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';

export type Props = {
  breadcrumb?: EuiBreadcrumb[];
};

export const HeaderSecondary: FunctionComponent<Props> = ({ breadcrumb }) => {
  const router = useRouter();
  const [crumbs, setCrumbs] = useState<EuiBreadcrumb[]>();

  // Set breadcumb for page
  useEffect(() => {
    const defaultBreadcrumb: EuiBreadcrumb[] = [];
    if (breadcrumb) {
      // add provided breadcrumbs to default
      const fullBreadcrumb = defaultBreadcrumb.concat(breadcrumb);
      setCrumbs(fullBreadcrumb);
    } else {
      // no breadcrumbs provided so use default
      setCrumbs(defaultBreadcrumb);
    }
  }, [breadcrumb, router]);

  return (
    <>
      <EuiHeader
        position="fixed"
        sections={[
          {
            breadcrumbs: crumbs,
            breadcrumbProps: { responsive: false },
            borders: 'right',
          },
        ]}
      />
    </>
  );
};
