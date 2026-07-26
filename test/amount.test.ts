import assert from "node:assert/strict";
import test from "node:test";

import {
  ZERO_AMOUNT,
  addAmounts,
  createAmount,
  isAmount,
  subtractAmounts,
} from "../model/amount.js";

test("createAmount accepts zero and positive bigint values", () => {
  assert.equal(createAmount(0n), 0n);
  assert.equal(createAmount(1n), 1n);
  assert.equal(createAmount(10n ** 30n), 10n ** 30n);
});

test("createAmount rejects non-bigint runtime inputs", () => {
  assert.throws(
    () => createAmount("1"),
    {
      name: "TypeError",
      message: "Amount must be a bigint.",
    },
  );
});

test("createAmount rejects negative bigint values", () => {
  assert.throws(
    () => createAmount(-1n),
    {
      name: "RangeError",
      message: "Amount must be non-negative.",
    },
  );
});

test("isAmount recognizes the modeled amount domain", () => {
  assert.equal(isAmount(0n), true);
  assert.equal(isAmount(25n), true);
  assert.equal(isAmount(-1n), false);
  assert.equal(isAmount(1), false);
  assert.equal(isAmount("1"), false);
  assert.equal(isAmount(null), false);
});

test("ZERO_AMOUNT is the canonical zero value", () => {
  assert.equal(ZERO_AMOUNT, 0n);
});

test("addAmounts returns the exact integer sum", () => {
  const left = createAmount(7n);
  const right = createAmount(5n);

  assert.equal(addAmounts(left, right), 12n);
});

test("subtractAmounts returns the exact non-negative difference", () => {
  const minuend = createAmount(12n);
  const subtrahend = createAmount(5n);

  assert.equal(subtractAmounts(minuend, subtrahend), 7n);
  assert.equal(subtractAmounts(minuend, minuend), ZERO_AMOUNT);
});

test("subtractAmounts rejects domain underflow", () => {
  const smaller = createAmount(5n);
  const larger = createAmount(12n);

  assert.throws(
    () => subtractAmounts(smaller, larger),
    {
      name: "RangeError",
      message: "Amount subtraction cannot produce a negative value.",
    },
  );
});
