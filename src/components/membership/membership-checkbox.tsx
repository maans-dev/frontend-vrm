import { FunctionComponent } from 'react';
import { EuiFlexGrid, EuiCheckableCard, htmlIdGenerator } from '@elastic/eui';
import moment from 'moment';

export interface Props {
  onAbroadChange: (update: boolean) => void;
  onDawnChange: (update: boolean) => void;
  onYouthChange: (update: boolean) => void;
  daAbroadInternal: boolean;
  daYouth: boolean;
  dawnOptOut: boolean;
  gender: string;
  dob: string;
}

const MembershipCheckbox: FunctionComponent<Props> = ({
  onAbroadChange,
  daAbroadInternal,
  daYouth,
  dawnOptOut,
  onDawnChange,
  onYouthChange,
  gender,
  dob,
}: Props) => {
  function isAbove31(dateStr) {
    const age = moment().diff(moment(dateStr), 'years');
    return age > 31 ? true : false;
  }
  return (
    <EuiFlexGrid columns={3}>
      <EuiCheckableCard
        id={htmlIdGenerator()()}
        label="DA Youth"
        checkableType="checkbox"
        aria-label="DA Youth"
        disabled={isAbove31(dob)}
        checked={!isAbove31(dob) && daYouth}
        onChange={() => onYouthChange(daYouth)}
      />
      <EuiCheckableCard
        id={htmlIdGenerator()()}
        label="DAWN Opt-out"
        checkableType="checkbox"
        aria-label="DAWN Opt-out"
        disabled={gender === 'M'}
        checked={Boolean(dawnOptOut)}
        onChange={() => onDawnChange(!dawnOptOut)}
      />
      <EuiCheckableCard
        id={htmlIdGenerator()()}
        label="DA Abroad"
        checkableType="checkbox"
        aria-label="DA Abroad"
        checked={Boolean(daAbroadInternal)}
        onChange={() => onAbroadChange(!daAbroadInternal)}
      />
    </EuiFlexGrid>
  );
};

export default MembershipCheckbox;
