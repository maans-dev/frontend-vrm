interface IconInfo {
  image: string;
  alt: string;
  label: string;
}

export const eventIcons: Record<string, IconInfo> = {
  membership: {
    image: '/images/pins/membership.png',
    alt: 'Blue pin',
    label: 'Membership',
  },
  'vr-api-ad-hoc': {
    image: '/images/pins/iecrefresh.png',
    alt: 'Orange pin',
    label: 'IEC refresh',
  },
  canvass: {
    image: '/images/pins/canvass.png',
    alt: 'Red pin',
    label: 'Canvass',
  },
  datacleanup: {
    image: '/images/pins/datacleanup.png',
    alt: 'Green pin',
    label: 'Data cleanup',
  },
  'user-agreement': {
    image: '/images/pins/login.png',
    alt: 'Yellow pin',
    label: 'Login',
  },
  default: {
    image: '/images/pins/other.png',
    alt: 'Grey pin',
    label: 'Other',
  },
};
