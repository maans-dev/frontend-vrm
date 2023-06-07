export function getCancellationTypeLabel(type) {
  switch (type) {
    case 'membership-resigned':
      return 'Membership Resigned';
    case 'membership-terminated':
      return 'Membership Terminated';
    default:
      return '';
  }
}

export function getMembershipStatusColor(status) {
  switch (status) {
    case null:
    case 'NotAMember':
      return 'subdued';
    case 'Resigned':
    case 'Terminated':
      return 'warning';
    case 'Expired':
      return 'danger';
    case 'Active':
      return 'success';
    default:
      return '';
  }
}

export const MembershipPaymentOptions = [
  { value: 'option_one', text: '1 Year / R10', years: 1, amount: 10 },
  { value: 'option_two', text: '2 Years / R20', years: 2, amount: 20 },
  { value: 'option_three', text: '3 Years / R30', years: 3, amount: 30 },
  { value: 'option_four', text: '4 Years / R40', years: 4, amount: 40 },
  { value: 'option_five', text: '5 Years / R50', years: 5, amount: 50 },
];
