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
