interface IconInfo {
  image: string;
  alt: string;
  label: string;
}

export const eventIcons: Record<string, IconInfo> = {
  admin: {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_whiteS.png',
    alt: 'White pin',
    label: 'System edit',
  },
  membership: {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blueM.png',
    alt: 'Blue pin',
    label: 'Membership',
  },
  'vr-api-ad-hoc': {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_orangeI.png',
    alt: 'Orange pin',
    label: 'IEC refresh',
  },
  canvass: {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_redC.png',
    alt: 'Red pin',
    label: 'Canvass',
  },
  datacleanup: {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greenD.png',
    alt: 'Green pin',
    label: 'Data cleanup',
  },
  'user-agreement': {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_yellowL.png',
    alt: 'Yellow pin',
    label: 'Login',
  },
  default: {
    image:
      'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_greyO.png',
    alt: 'Grey pin',
    label: 'Other',
  },
};
