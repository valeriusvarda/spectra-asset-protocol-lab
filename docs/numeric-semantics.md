# SPECTRA Quantitative Numeric Semantics

## Document Control

* Document ID: SPECTRA-NUM-001
* Status: Working Specification
* Version: 0.1.0
* Source review date: 2026-08-01
* Scope: Asset amounts, decimal scales, exact representation, and conversion
  policy boundaries
* Evidence classes: SPECIFIED, INFERRED, and PROJECT-DEFINED
* Related model: `model/amount.ts`
* Related specification: `docs/state-model.md`

---

## 1. Purpose

This document defines the quantitative semantics required to interpret,
compare, convert, and validate asset amounts across different protocol,
integration, custody, and settlement environments.

The document separates:

* integer base-unit amounts;
* decimal scales;
* human-readable decimal representations;
* asset identities;
* exact conversion conditions;
* rounding and rejection policies;
* protocol-specific numeric representations;
* integration assumptions.

The objective is to prevent a raw integer from being treated as an economically
meaningful amount without sufficient unit and scale context.

This document is a SPECTRA working specification.

It does not replace any official token, blockchain, bridge, exchange, custody,
or accounting specification.

---

## 2. Source Register

The initial quantitative model is informed by the following official primary
sources.

| Source ID               | Official Source                                                            | Evidence Used                                                                          |
| ----------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `SRC-ERC20`             | [EIP-20 — Token Standard][SRC-ERC20]                                       | Optional `decimals()` metadata, `uint8` return type, and user-representation semantics |
| `SRC-USDC-XRESERVE`     | [Circle USDC-backed Stablecoin Reference Specification][SRC-USDC-XRESERVE] | Native-USDC six-decimal precision and explicit conversion responsibility               |
| `SRC-STELLAR-ASSETS`    | [Stellar Asset Data Structures][SRC-STELLAR-ASSETS]                        | Signed 64-bit amount representation and seven-decimal scaling                          |
| `SRC-CCTP-STELLAR`      | [Circle CCTP on Stellar][SRC-CCTP-STELLAR]                                 | Six-versus-seven-decimal normalization, source dust behavior, and destination scaling  |
| `SRC-ECMASCRIPT-BIGINT` | [ECMAScript BigInt Type][SRC-ECMASCRIPT-BIGINT]                            | Integer representation and exact integer-operation semantics                           |

### 2.1 Evidence Classification

Source-backed statements in this document use the following project evidence
classes:

* `SPECIFIED` — stated directly by a reviewed official source;
* `INFERRED` — derived from reviewed official facts but not stated as a direct
  normative rule;
* `PROJECT-DEFINED` — introduced by the SPECTRA mathematical or engineering
  model.

An official source may support a local fact without making that fact universal.

For example:

```text
native USDC uses six decimals
```

does not imply:

```text
every stablecoin uses six decimals
```

The mathematical domains, source classifications, conversion-policy taxonomy,
and implementation obligations in this document remain SPECTRA-defined unless
an official source is explicitly identified.

---

## 3. Core Terminology

### 3.1 Base Unit

A base unit is the smallest integer accounting unit represented by the selected
asset or protocol model.

A base-unit amount is not inherently human-readable.

For example:

```text
1,000,000 base units
```

does not identify its economic value unless the asset and decimal scale are
known.

### 3.2 Human-Readable Amount

A human-readable amount is a decimal or rational interpretation of an integer
base-unit amount under an explicitly selected decimal scale.

Examples include:

```text
1 USDC
0.1 asset units
12.345678 tokens
```

A human-readable representation is not the canonical core-accounting value in
the initial SPECTRA model.

### 3.3 Decimal Scale

A decimal scale is a non-negative integer exponent that defines the relationship
between base units and a human-readable amount.

For a decimal scale `d`, the scale factor is:

```math
P(d) = 10^d
```

### 3.4 Scale Source

A scale source identifies why a particular decimal scale is being used.

Initial scale-source classifications are:

```text
PROTOCOL_FIXED
CONTRACT_DECLARED
EXTERNAL_CONFIGURATION
INTEGRATION_POLICY
UNKNOWN
```

A scale value and its source are separate facts.

### 3.5 Asset Identity

Asset identity determines which economic asset a base-unit amount belongs to.

A raw amount without asset identity must not be assumed to be interchangeable
with an equal raw amount belonging to another asset.

---

## 4. Mathematical Domains

Evidence class: `PROJECT-DEFINED`

### 4.1 Amount Domain

The shared Amount domain is:

```math
\mathbb{A}
=
\left\{
x \in \mathbb{Z}
\mid
x \geq 0
\right\}
```

Therefore:

```math
\mathbb{A} \subsetneq \mathbb{Z}
```

The relationship is strict because negative integers belong to
$\mathbb{Z}$ but do not belong to $\mathbb{A}$.

### 4.2 Decimal-Scale Domain

The shared decimal-scale domain is:

```math
\mathbb{D}
=
\left\{
d \in \mathbb{Z}
\mid
d \geq 0
\right\}
```

Equivalently:

```math
\mathbb{D} = \mathbb{N}_0
```

The initial shared mathematical model does not impose a protocol-specific upper
bound on $\mathbb{D}$.

Protocol adapters and executable implementations may define narrower domains or
operational limits.

### 4.3 Human-Readable Domain

Exactly represented finite decimal values are modeled as non-negative rational
values:

```math
\mathbb{H} \subseteq \mathbb{Q}_{\geq 0}
```

JavaScript binary floating-point values are not used as the authoritative
representation of $\mathbb{H}$.

---

## 5. Scale Factor

Evidence class: `PROJECT-DEFINED`

For:

```math
d \in \mathbb{D}
```

the scale factor is:

```math
P(d) = 10^d
```

Examples:

```math
P(0) = 1
```

```math
P(6) = 1{,}000{,}000
```

```math
P(7) = 10{,}000{,}000
```

```math
P(18)
=
1{,}000{,}000{,}000{,}000{,}000{,}000
```

A scale factor is not an Amount.

It is a conversion parameter.

---

## 6. Decoding Base Units

Evidence class: `PROJECT-DEFINED`

For a base-unit amount:

```math
b \in \mathbb{A}
```

and decimal scale:

```math
d \in \mathbb{D}
```

the human-readable interpretation is:

```math
decode_d(b)
=
\frac{b}{10^d}
```

For example:

```math
decode_6(1{,}250{,}000)
=
1.25
```

For a fixed scale, decoding is defined for every valid Amount.

Decoding must not mutate the underlying base-unit amount.

Decoding changes representation and interpretation, not the canonical integer
quantity stored by the model.

---

## 7. Encoding Human-Readable Values

Evidence class: `PROJECT-DEFINED`

For a human-readable value $h$ and decimal scale $d$:

```math
encode_d(h)
=
h \times 10^d
```

Encoding is a partial operation.

An exact conversion is defined only when:

```math
h \times 10^d
\in
\mathbb{Z}
```

and:

```math
h \times 10^d
\geq
0
```

Therefore:

```math
encode_d(h)
\in
\mathbb{A}
```

only when the exact-representability preconditions hold.

### 7.1 Exactly Representable Example

For:

```math
h = 1.25
```

and:

```math
d = 2
```

then:

```math
1.25 \times 10^2 = 125
```

and:

```math
125 \in \mathbb{A}
```

The value can be encoded exactly.

### 7.2 Non-Representable Example

For:

```math
h = 1.234
```

and:

```math
d = 2
```

then:

```math
1.234 \times 10^2 = 123.4
```

but:

```math
123.4 \notin \mathbb{Z}
```

The value cannot be encoded exactly under scale `2` without an explicit
rounding, truncation, or rejection policy.

### 7.3 Zero

For every:

```math
d \in \mathbb{D}
```

the following holds:

```math
encode_d(0) = 0
```

and:

```math
decode_d(0) = 0
```

Zero remains exactly representable under every valid decimal scale.

---

## 8. Exact Round-Trip Properties

Evidence class: `PROJECT-DEFINED`

For every:

```math
b \in \mathbb{A}
```

and fixed:

```math
d \in \mathbb{D}
```

the following must hold:

```math
encode_d(decode_d(b)) = b
```

For every exactly representable human-readable value $h$:

```math
decode_d(encode_d(h)) = h
```

The second property applies only when the exact-encoding preconditions are
satisfied.

A rounding or truncation policy changes these properties and must be specified
separately.

A failure to preserve an exact round trip may indicate:

* precision loss;
* inconsistent scale interpretation;
* binary floating-point conversion;
* implicit rounding;
* parser or formatter disagreement;
* asset metadata mismatch.

---

## 9. Amount and Scale Separation

Evidence class: `PROJECT-DEFINED`

An Amount and a DecimalScale represent different domains.

The following operation is semantically invalid:

```text
Amount + DecimalScale
```

The following comparison is also semantically invalid:

```text
Amount == DecimalScale
```

A scale describes how an Amount is interpreted.

It does not represent economic value independently.

The model must prevent scale metadata from being silently treated as an asset
quantity.

The model must also prevent an Amount from being silently treated as a scale.

---

## 10. Asset and Unit Safety

Evidence class: `PROJECT-DEFINED`

Equal raw amounts do not imply equal economic amounts.

For example:

```text
raw amount = 1,000,000
```

Under scale `6`:

```math
\frac{1{,}000{,}000}{10^6} = 1
```

Under scale `7`:

```math
\frac{1{,}000{,}000}{10^7} = 0.1
```

Under scale `18`:

```math
\frac{1{,}000{,}000}{10^{18}}
=
0.000000000001
```

Therefore, safe interpretation requires at least:

```text
asset identity
+
base-unit amount
+
decimal scale
+
scale source
```

Two Amount values must not be added merely because they share the same integer
representation.

Asset compatibility must be established separately.

For example:

```text
1,000,000 USDC base units
```

must not be treated as equivalent to:

```text
1,000,000 units of an unrelated six-decimal asset
```

merely because the raw integer and scale are equal.

---

## 11. Scale Availability

Evidence class: `PROJECT-DEFINED`

A scale may be:

1. fixed by a protocol;
2. declared by a contract;
3. supplied by an external registry;
4. configured by an integration;
5. unavailable or unknown.

An unavailable scale must remain explicitly unknown.

The shared model must not silently replace an unknown scale with an assumed
default.

The following states are not equivalent:

```text
known scale = 0
```

and:

```text
scale is unknown
```

A fallback scale is an integration policy and must be:

* explicit;
* reviewable;
* traceable;
* testable;
* included in deterministic replay inputs.

A deterministic trace that depends on scale interpretation must record:

* the selected scale;
* the scale source;
* whether a fallback was used;
* the applicable conversion policy;
* any discarded or residual value.

---

## 12. Source-Backed Protocol Cases

### 12.1 ERC-20

Evidence class: `SPECIFIED`

Primary source: [`SRC-ERC20`](#2-source-register)

ERC-20 defines `decimals()` as optional metadata.

An integration must not treat the presence of `decimals()` as guaranteed by the
base ERC-20 specification.

When present, the function returns a `uint8` value.

The function is intended to support user representation and does not change the
integer arithmetic performed by the token contract.

The `uint8` representation belongs to the ERC-20 adapter boundary and does not
automatically define the shared cross-standard scale domain.

SPECTRA must therefore distinguish:

```text
ERC-20 adapter-compatible decimal value
```

from:

```text
shared mathematical DecimalScale domain
```

An ERC-20 adapter may impose the `uint8` boundary without requiring the shared
cross-standard mathematical domain to use the same upper bound.

### 12.2 Native USDC

Evidence class: `SPECIFIED` within the reviewed Circle reference specification

Primary source: [`SRC-USDC-XRESERVE`](#2-source-register)

The reviewed native-USDC reference uses six decimal places.

Therefore:

```math
1\ \mathrm{USDC}
=
1{,}000{,}000\ \mathrm{base\ units}
```

This is an asset-specific fact.

It must not be generalized to every stablecoin or every asset named `USD`.

An integration handling native USDC must still establish:

* the correct asset identity;
* the correct deployment or contract;
* the scale source;
* whether the reviewed specification applies to that environment.

A token symbol alone is not sufficient evidence of asset identity or scale.

### 12.3 Stellar Classic Assets

Evidence class: `SPECIFIED`

Primary source: [`SRC-STELLAR-ASSETS`](#2-source-register)

Stellar Classic asset amounts use a fixed seven-decimal relationship between
the integer representation and the user-facing amount.

The protocol representation uses a signed 64-bit integer.

The shared SPECTRA Amount domain remains non-negative, while the protocol
adapter must separately model:

* Stellar's signed storage representation;
* the valid protocol range;
* conversion into the shared non-negative Amount domain;
* rejection of protocol values that are outside the selected SPECTRA boundary.

The distinction is:

```text
protocol storage representation
        ≠
shared financial-domain meaning
```

### 12.4 CCTP on Stellar

Evidence class: `SPECIFIED`

Primary source: [`SRC-CCTP-STELLAR`](#2-source-register)

The reviewed CCTP-on-Stellar integration introduces a precision boundary
between seven-decimal Stellar representations and six-decimal representations
used by other supported environments.

A cross-chain adapter must explicitly define:

* source scale;
* destination scale;
* normalization direction;
* exactness conditions;
* dust handling;
* rejection or rounding behavior;
* reconciliation evidence.

A cross-chain transfer may therefore require more than copying a raw integer
from one execution environment into another.

The conversion is economically correct only when the source and destination
scales, asset identities, and selected dust policy are all explicit.

### 12.5 ECMAScript BigInt

Evidence class: `SPECIFIED` for language behavior and `PROJECT-DEFINED` for
SPECTRA usage policy

Primary source: [`SRC-ECMASCRIPT-BIGINT`](#2-source-register)

ECMAScript BigInt provides an integer numeric type distinct from JavaScript
`number`.

SPECTRA uses `bigint` for authoritative integer base-unit arithmetic because
the model requires exact integer operations beyond the safe-integer range of
JavaScript `number`.

This choice does not independently solve:

* decimal parsing;
* decimal formatting;
* scale interpretation;
* JSON serialization;
* asset identity;
* protocol-specific bounds;
* database compatibility;
* resource-exhaustion risk.

---

## 13. Scale-Mismatch Analysis

Evidence class: `PROJECT-DEFINED`

This section derives the multiplicative interpretation error from the explicit
actual and assumed decimal scales.

Let:

* $d_a$ be the actual decimal scale;
* $d_i$ be the integration-assumed decimal scale;
* $b$ be the raw base-unit amount.

The actual human-readable value is:

```math
h_a
=
\frac{b}{10^{d_a}}
```

The integration-derived value is:

```math
h_i
=
\frac{b}{10^{d_i}}
```

The error ratio is:

```math
\frac{h_i}{h_a}
=
10^{d_a-d_i}
```

### 13.1 Six Decimals Interpreted as Eighteen

For:

```math
d_a = 6
```

and:

```math
d_i = 18
```

the error ratio is:

```math
\frac{h_i}{h_a}
=
10^{6-18}
=
10^{-12}
```

The integration understates the value by a factor of:

```math
10^{12}
```

For a raw amount of:

```text
1,000,000
```

the correct six-decimal interpretation is:

```math
\frac{1{,}000{,}000}{10^6}
=
1
```

The incorrect eighteen-decimal interpretation is:

```math
\frac{1{,}000{,}000}{10^{18}}
=
10^{-12}
```

### 13.2 Eighteen Decimals Interpreted as Six

For:

```math
d_a = 18
```

and:

```math
d_i = 6
```

the error ratio is:

```math
\frac{h_i}{h_a}
=
10^{18-6}
=
10^{12}
```

The integration overstates the value by a factor of:

```math
10^{12}
```

### 13.3 Six Decimals and Seven Decimals

For an actual scale of `7` and an assumed scale of `6`:

```math
\frac{h_i}{h_a}
=
10^{7-6}
=
10
```

The integration overstates the human-readable value by a factor of `10`.

For an actual scale of `6` and an assumed scale of `7`:

```math
\frac{h_i}{h_a}
=
10^{6-7}
=
0.1
```

The integration understates the value by a factor of `10`.

---

## 14. Conversion Policies

Evidence class: `PROJECT-DEFINED`

The policy taxonomy in this section belongs to the SPECTRA numeric model.

When an input is not exactly representable, the implementation must not choose
a policy implicitly.

Possible policy classes include:

```text
REJECT
TRUNCATE
ROUND_DOWN
ROUND_UP
ROUND_TO_NEAREST
ROUND_TIES_TO_EVEN
```

Each policy must define:

* mathematical behavior;
* direction of value bias;
* maximum possible error;
* treatment of negative values where applicable;
* treatment of exact half-way cases;
* emitted evidence;
* reconciliation effect.

### 14.1 Exact Conversion Policy

The initial SPECTRA numeric model selects:

```text
REJECT
```

for conversions that claim to be exact.

Under this policy:

```math
h \times 10^d \notin \mathbb{Z}
```

causes conversion failure.

The implementation must not silently alter the requested value.

### 14.2 Truncation

A truncation policy removes fractional base units.

For a non-negative value:

```math
truncate(x)
=
\lfloor x \rfloor
```

This policy introduces downward value bias whenever the input is not already an
integer.

### 14.3 Rounding Up

For a non-integer non-negative value:

```math
roundUp(x)
=
\lceil x \rceil
```

This policy introduces upward value bias.

### 14.4 Round to Nearest

A round-to-nearest policy requires a separate tie-breaking rule.

Possible tie-breaking rules include:

```text
ties away from zero
ties toward zero
ties to even
ties to odd
```

The phrase:

```text
round to nearest
```

is incomplete unless half-way behavior is defined.

### 14.5 Policy Evidence

A non-exact conversion record must include:

* original value;
* source scale;
* destination scale;
* selected policy;
* exact pre-policy result;
* final integer result;
* discarded or added amount;
* responsible adapter or component.

---

## 15. Security and Financial Failure Modes

Numeric-semantics failures include the following.

### 15.1 Silent Default Scale

An integration substitutes a value such as `18` when scale metadata is
unavailable.

Potential effects:

* incorrect deposit credit;
* incorrect withdrawal amount;
* incorrect portfolio value;
* invalid reconciliation;
* incorrect collateral value;
* incorrect fee calculation.

### 15.2 Scale Confusion

An amount represented under one scale is interpreted under another.

Potential effects:

* multiplicative value error;
* over-minting;
* under-minting;
* incorrect collateralization;
* ledger divergence;
* incorrect settlement evidence.

### 15.3 Binary Floating-Point Conversion

A decimal amount is converted through JavaScript `number`.

Potential effects:

* loss of integer exactness;
* inconsistent round trips;
* hidden dust;
* formatter-dependent output;
* disagreement between systems;
* failure at values beyond the safe-integer boundary.

### 15.4 Implicit Rounding

A fractional base-unit result is silently rounded.

Potential effects:

* value creation or destruction;
* systematic customer disadvantage;
* reconciliation drift;
* fee miscalculation;
* cumulative dust imbalance.

### 15.5 Missing Asset Identity

Equal integer values belonging to different assets are treated as fungible.

Potential effects:

* cross-asset balance corruption;
* incorrect netting;
* invalid settlement;
* accounting misstatement;
* unauthorized substitution.

### 15.6 Resource Exhaustion

An untrusted or excessively large scale is used to construct:

```math
10^d
```

Potential effects:

* excessive memory use;
* excessive computation;
* event-loop blocking;
* denial of service.

Operational scale limits must therefore be explicit even when the abstract
mathematical domain is unbounded.

### 15.7 Unknown Scale Treated as Zero

An unavailable scale is represented as:

```text
0
```

rather than:

```text
UNKNOWN
```

Potential effects:

* base units interpreted as whole units;
* incorrect account credit;
* invalid reporting;
* false reconciliation success.

### 15.8 Symbol-Based Asset Identification

An integration identifies assets only by symbols such as:

```text
USDC
USD
ETH
BTC
```

Potential effects:

* collision between unrelated deployments;
* counterfeit-asset acceptance;
* incorrect decimal metadata;
* incorrect price or risk mapping.

### 15.9 Cross-Chain Dust Loss

A source amount cannot be represented exactly at the destination scale.

Potential effects:

* stranded value;
* systematic value leakage;
* non-reconciling bridge records;
* customer disputes;
* supply-accounting mismatch.

---

## 16. Implementation Requirements

Evidence class: `PROJECT-DEFINED`

A future executable numeric-semantics layer must:

1. represent DecimalScale separately from Amount;
2. validate runtime scale inputs;
3. reject negative scales;
4. reject fractional scales;
5. avoid silent default scales;
6. distinguish unknown scale from scale zero;
7. avoid binary floating-point arithmetic for authoritative conversion;
8. define exact conversion as a partial operation;
9. reject non-representable input in the exact-conversion path;
10. preserve asset identity outside the raw Amount primitive;
11. expose protocol-specific scale bounds through adapters;
12. define operational resource limits explicitly;
13. produce deterministic error classifications;
14. preserve the selected scale source;
15. preserve the selected conversion policy;
16. expose discarded or residual value where applicable;
17. make conversion inputs reproducible in deterministic traces;
18. avoid treating display formatting as core accounting state.

### 16.1 Runtime Validation

Runtime validation must distinguish at least:

```text
incorrect runtime representation
invalid numeric domain value
unsupported operational scale
unknown scale
non-representable exact conversion
asset mismatch
```

These failures must not collapse into one ambiguous error.

### 16.2 Determinism

Given the same:

* model version;
* input amount;
* source scale;
* destination scale;
* asset identity;
* scale source;
* conversion policy;
* operational limits;

the conversion must produce the same:

* success or failure classification;
* integer result;
* residual value;
* evidence record.

### 16.3 Protocol Adapters

A protocol adapter must define:

* its accepted scale representation;
* its numeric bounds;
* whether scale is fixed or discovered;
* how discovery failure is represented;
* whether fallback configuration is permitted;
* how asset identity is established;
* how values are converted into the shared model.

---

## 17. Planned Type Boundaries

Evidence class: `PROJECT-DEFINED`

The following conceptual types are planned:

```text
Amount
DecimalScale
KnownScale
UnknownScale
ScaleSource
AssetId
ScaledAmount
ExactDecimalInput
ConversionPolicy
ConversionResult
ConversionError
ResidualAmount
```

These names are provisional.

No executable type is considered accepted until its:

* mathematical domain;
* semantic responsibility;
* runtime representation;
* validation behavior;
* error behavior;
* test obligations;
* serialization boundary

have been reviewed.

### 17.1 Amount

Represents:

```text
non-negative integer base units
```

It does not independently contain:

* asset identity;
* decimal scale;
* scale source;
* conversion policy.

### 17.2 DecimalScale

Represents:

```text
non-negative integer decimal exponent
```

It must not be interchangeable with Amount.

### 17.3 ScaledAmount

A future ScaledAmount may bind:

```text
asset identity
+
Amount
+
DecimalScale
+
ScaleSource
```

The exact structure remains unresolved.

### 17.4 ExactDecimalInput

A future ExactDecimalInput should represent a decimal value without binary
floating-point approximation.

A canonical decimal string is a candidate representation.

The accepted grammar remains unresolved.

---

## 18. Test Obligations

Evidence class: `PROJECT-DEFINED`

The eventual executable implementation must test at least the following.

### 18.1 DecimalScale Construction

* accepts zero;
* accepts representative positive integer scales;
* accepts scale `6`;
* accepts scale `7`;
* accepts scale `18`;
* rejects negative values;
* rejects fractional values;
* rejects `NaN`;
* rejects positive infinity;
* rejects negative infinity;
* rejects strings;
* rejects `null`;
* rejects arrays;
* rejects objects;
* rejects other incorrect runtime types.

### 18.2 Exact Encoding

* encodes exactly representable values;
* rejects excessive fractional precision;
* preserves zero;
* preserves large exact integers;
* does not use binary floating-point as the source of truth;
* encodes `1.25` under scale `2` as `125`;
* encodes `1` under scale `6` as `1,000,000`;
* rejects `1.234` under scale `2`;
* rejects unknown scale;
* produces deterministic failure classifications.

### 18.3 Decoding

* correctly interprets scale zero;
* correctly interprets six-decimal values;
* correctly interprets seven-decimal values;
* correctly interprets eighteen-decimal values;
* preserves exact round-trip behavior;
* does not mutate the input Amount;
* preserves zero;
* preserves large integer precision.

### 18.4 Scale Mismatch

* reproduces six-versus-eighteen-decimal understatement;
* reproduces eighteen-versus-six-decimal overstatement;
* reproduces six-versus-seven-decimal normalization;
* reports the selected scale source;
* rejects unknown scale where exact interpretation is required;
* distinguishes unknown scale from scale zero.

### 18.5 Asset Identity

* rejects addition of incompatible assets;
* rejects comparison where semantic compatibility is required but absent;
* preserves asset identity through conversion;
* does not infer identity from symbol alone;
* distinguishes deployments with the same symbol.

### 18.6 Conversion Policy

* exact policy rejects fractional base units;
* truncation reports discarded value;
* round-up reports added value;
* round-to-nearest defines tie behavior;
* policy selection is included in deterministic evidence;
* no policy is selected implicitly.

### 18.7 Operational Safety

* enforces the selected implementation resource limit;
* rejects pathological exponent inputs;
* avoids uncontrolled construction of excessive powers of ten;
* produces deterministic error classifications;
* distinguishes operational limits from protocol rules.

### 18.8 Algebraic Properties

For valid exact conversions:

```math
encode_d(decode_d(b)) = b
```

For exactly representable human-readable values:

```math
decode_d(encode_d(h)) = h
```

For zero:

```math
encode_d(0) = 0
```

and:

```math
decode_d(0) = 0
```

### 18.9 Evidence Tests

Tests must verify that evidence records include:

* asset identity;
* raw amount;
* source scale;
* destination scale;
* scale source;
* conversion policy;
* result;
* residual amount;
* deterministic error classification.

---

## 19. Open Design Questions

Evidence class: `PROJECT-DEFINED`

The following questions remain unresolved:

1. Should the shared executable DecimalScale type use `number` or `bigint`?
2. What implementation-level maximum scale prevents resource exhaustion without
   being misrepresented as a protocol rule?
3. Should an unknown scale use a separate union variant or a nullable field?
4. How should asset identity be represented across blockchain ecosystems?
5. Should exact decimal input be accepted only as a canonical string?
6. Which decimal grammar should be accepted?
7. Should leading plus signs be allowed?
8. Should leading zeros be normalized or rejected?
9. Should trailing fractional zeros be preserved?
10. Should scientific notation be accepted?
11. How should protocol adapters report scale-source confidence?
12. How should cross-scale dust be represented in reconciliation records?
13. Which conversion policies belong in the MVP?
14. Should residual value use the source scale, destination scale, or a rational
    representation?
15. How should exact decimal values be serialized?
16. Should ScaledAmount bind asset identity directly?
17. Should protocol-specific scale limits use wrapper types or adapter
    validation?
18. Should formatting functions preserve the original textual representation or
    emit a canonical representation?
19. How should signed protocol-storage values be mapped into the non-negative
    shared Amount domain?
20. Which failures should use exceptions and which should use explicit result
    unions?

These questions must be resolved before the executable conversion API is
frozen.

---

## 20. Evidence Boundary

This document establishes a project-defined quantitative model informed by
reviewed official sources.

It does not establish:

* universal token-decimal behavior;
* correctness of an unimplemented parser;
* correctness of an unimplemented formatter;
* correctness of an unimplemented DecimalScale type;
* production accounting suitability;
* protocol conformance;
* settlement equivalence;
* absence of numeric vulnerabilities;
* formal verification;
* correctness of every protocol adapter;
* completeness of the source review.

Future claims must remain bounded by:

* reviewed source coverage;
* selected scale source;
* selected asset identity;
* conversion policy;
* implementation behavior;
* executable tests;
* deterministic traces;
* known operational limits.

A passing test for one conversion case does not prove that all scales, assets,
protocols, or integration paths are correct.

A rendered human-readable value does not independently prove that the
underlying base-unit amount, scale, asset identity, or settlement state is
correct.

A successful transaction does not independently prove that a cross-system
numeric conversion preserved economic value.

---

[SRC-ERC20]: https://eips.ethereum.org/EIPS/eip-20
[SRC-USDC-XRESERVE]: https://developers.circle.com/xreserve/concepts/usdc-backed-stablecoin-specification
[SRC-STELLAR-ASSETS]: https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets
[SRC-CCTP-STELLAR]: https://developers.circle.com/cctp/references/stellar
[SRC-ECMASCRIPT-BIGINT]: https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type
