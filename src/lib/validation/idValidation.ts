export function isValidRSAIDnumber(
  value: any,
  reason = false
):
  | boolean
  | { valid: boolean; reason: string; message: string; example: string } {
  const status: any = {
    valid: true,
    message: `Type Error: Expected parameter to be a valid 13-digit South African ID Number.`,
    example: '[860912 5073 089]',
  };

  if (status.valid && typeof value !== 'string') {
    status.valid = false;
    status.reason = `Invalid type: expected: string, received ${typeof value}`;
  }

  if (status.valid && !/^\d{13}$/.test(value)) {
    status.valid = false;
    status.reason = `Invalid length: (required: 13, length = ${value.length})`;
  }

  if (
    status.valid &&
    !value.match(
      /^([0-9][0-9])((?:[0][1-9])|(?:[1][0-2]))((?:[0-2][0-9])|(?:[3][0-1]))([0-9])([0-9]{3})([0-9])([0-9])([0-9])$/
    )
  ) {
    status.valid = false;
    status.reason = `Invalid format: ${value}`;
  }
  if (status.valid) {
    let t1 = 0;
    for (let i = 0; i < value.length - 1; i += 2) {
      t1 += parseInt(value.substring(i, i + 1));
    }

    let c = '';
    for (let i = 1; i < value.length; i += 2) {
      c += value.substring(i, i + 1);
    }

    const d = `${parseInt(c) * 2}`;
    let t2 = 0;
    for (let i = 0; i < d.length; i++) {
      t2 += parseInt(d.substring(i, i + 1));
    }

    const ld = (10 - ((t1 + t2) % 10)) % 10;
    const cd = parseInt(value.substring(12, 13));

    status.valid = cd === ld;
    if (!status.valid) {
      status.reason = `Invalid checksum: ${cd} missmatch ${ld}`;
    }
  }

  return reason ? status : status.valid;
}
