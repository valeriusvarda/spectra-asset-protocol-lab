declare const amountBrand: unique symbol;

export type Amount = bigint & {
  readonly [amountBrand]: "Amount";
};

export function isAmount(value: unknown): value is Amount {
  return typeof value === "bigint" && value >= 0n;
}

export function createAmount(value: unknown): Amount {
  if (typeof value !== "bigint") {
    throw new TypeError("Amount must be a bigint.");
  }

  if (value < 0n) {
    throw new RangeError("Amount must be non-negative.");
  }

  return value as Amount;
}

export const ZERO_AMOUNT: Amount = createAmount(0n);

export function addAmounts(left: Amount, right: Amount): Amount {
  return createAmount(left + right);
}

export function subtractAmounts(
  minuend: Amount,
  subtrahend: Amount,
): Amount {
  if (subtrahend > minuend) {
    throw new RangeError(
      "Amount subtraction cannot produce a negative value.",
    );
  }

  return createAmount(minuend - subtrahend);
}
