# SPECTRA State-Transition Model

## Document Control

* Document ID: SPECTRA-STM-001
* Status: Working Specification
* Version: 0.1.1
* Scope: Deterministic asset, integration, and bridge state transitions
* Evidence class: Project-defined research model
* Revision reason: Repair mathematical rendering and tighten model boundaries

---

## 1. Purpose

This document defines the initial state boundary, transition semantics,
failure model, reachability rules, reconciliation conditions, and foundational
invariants used by SPECTRA.

It is an experimental project model. It does not replace the normative
specifications of any asset standard, blockchain, virtual machine, bridge, or
custody platform.

---

## 2. Modeling Boundary

SPECTRA models five connected state domains:

1. token state;
2. protocol-control state;
3. simplified bridge state;
4. integration and custody state;
5. observable evidence state.

The initial model excludes:

* consensus implementation;
* validator economics;
* production key management;
* network propagation;
* complete chain-finality behavior;
* production bridge verification;
* gas and fee-market accounting.

A test result must not be generalized beyond this boundary.

---

## 3. Numeric Domain

Token and settlement amounts are modeled in integer base units.

Let the amount domain be:

$$
\mathbb{A} = \mathbb{N}_0
$$

where $\mathbb{N}_0$ is the set of non-negative integers.

Human-readable decimal values are presentation-layer interpretations of these
integer base units. Floating-point arithmetic is not part of the core state
model.

---

## 4. Global State

The global research state is:

$$
S =
\left(
S_{\mathrm{token}},
S_{\mathrm{control}},
S_{\mathrm{bridge}},
S_{\mathrm{integration}},
S_{\mathrm{observation}}
\right)
$$

### 4.1 Token State

$$
S_{\mathrm{token}} = (B, W, T)
$$

Where:

* $B(a)$ is the balance of account $a$;
* $W(o,s)$ is the allowance granted by owner $o$ to spender $s$;
* $T$ is the reported total supply.

### 4.2 Control State

$$
S_{\mathrm{control}} = (R, P, V)
$$

Where:

* $R(a)$ is the role set assigned to actor $a$;
* $P$ contains pause and protocol-control flags;
* $V$ identifies the modeled implementation or specification version.

### 4.3 Bridge State

$$
S_{\mathrm{bridge}} = (N, L, M)
$$

Where:

* $N$ is the set of processed cross-chain message identifiers;
* $L$ is the canonical amount locked by the model;
* $M$ is the remote representation minted by the model.

### 4.4 Integration State

$$
S_{\mathrm{integration}} = (C, Q, F)
$$

Where:

* $C(a)$ is the custody or integration credit assigned to account $a$;
* $Q$ is the set of pending reconciliation records;
* $F$ contains modeled confirmation and finality classifications.

### 4.5 Observation State

$$
S_{\mathrm{observation}} = (G, Z)
$$

Where:

* $G$ is the ordered sequence of emitted or observed events;
* $Z$ is the ordered sequence of deterministic execution-trace records.

---

## 5. Transition Input

A transition input is:

$$
x =
\left(
caller,
operation,
arguments,
environment
\right)
$$

The environment contains every external value required to reproduce the
transition, including:

* chain identifier;
* implementation version;
* modeled confirmation state;
* control flags;
* token identity;
* ordered transition index.

A value that can change the result must not remain implicit.

---

## 6. Transition Result

The transition function is:

$$
\delta(S,x) = Result
$$

The result is either a success or a failure:

$$
Result =
Success(S',O)
\cup
Failure(S_f,E)
$$

The observation object is:

$$
O =
\left(
status,
returnData,
events,
stateDelta
\right)
$$

Where:

* `status` records the modeled execution outcome;
* `returnData` records the explicit output bytes or normalized value;
* `events` records the ordered emitted or observed events;
* `stateDelta` records the fields that changed.

A successful transaction status is not sufficient evidence that the requested
economic effect occurred.

---

## 7. Preconditions

A precondition defines what must be true before a transition may succeed.

For an ordinary transfer of amount $q$ from account $a$ to account $b$:

$$
Pre_{\mathrm{transfer}}(S,x)
\equiv
q \geq 0
\land
B(a) \geq q
\land
P.paused = false
\land
caller = a
$$

For delegated spending:

$$
Pre_{\mathrm{transferFrom}}(S,x)
\equiv
B(owner) \geq q
\land
W(owner,spender) \geq q
\land
caller = spender
$$

A false precondition must not produce a successful state transition.

---

## 8. Postconditions

For a successful ordinary transfer without fee, mint, burn, or rebase:

$$
B'(a) = B(a) - q
$$

$$
B'(b) = B(b) + q
$$

$$
T' = T
$$

For every unrelated account $u$:

$$
u \notin {a,b}
\Rightarrow
B'(u) = B(u)
$$

The transition must produce the event required by the selected standard
manifest.

Postconditions describe the required result. They do not prescribe one
specific implementation technique.

---

## 9. Failure Semantics

Within the token-local model boundary, a rejected transition preserves token
state:

$$
Failure
\Rightarrow
S'*{\mathrm{token}} = S*{\mathrm{token}}
$$

This statement is intentionally local.

It does not claim that:

* chain-level fee accounting is unchanged;
* outer callers cannot continue after a low-level failure;
* an indexer cannot record a failed observation;
* an integration system cannot make an independent accounting error.

Every failure record must include a normalized reason code.

---

## 10. Reachability

Let $Reach$ be the set of states reachable under the model.

The initial state is reachable:

$$
S_0 \in Reach
$$

A successful valid transition extends the reachable-state set:

$$
S \in Reach
\land
Pre(S,x)
\land
\delta(S,x) = Success(S',O)
\Rightarrow
S' \in Reach
$$

A state that can be expressed mathematically is not necessarily reachable
under the transition rules.

---

## 11. Foundational Invariants

### INV-BASE-01 — Non-Negative Balances

$$
\forall a:
B(a) \geq 0
$$

### INV-BASE-02 — Non-Negative Allowances

$$
\forall o,s:
W(o,s) \geq 0
$$

### INV-BASE-03 — Ordinary Transfer Conservation

For a transfer with no fee, mint, burn, or rebase:

$$
\sum_a B'(a) = \sum_a B(a)
$$

### INV-BASE-04 — Authorization Integrity

A delegated transfer must not succeed when the amount exceeds the available
allowance:

$$
q > W(owner,spender)
\Rightarrow
success = false
$$

### INV-BASE-05 — Token-Local Failure Preservation

$$
Failure
\Rightarrow
S'*{\mathrm{token}} = S*{\mathrm{token}}
$$

### INV-BASE-06 — Deterministic Transition

For identical state, input, and explicit environment:

$$
(S,x,e) = (S^*,x^*,e^*)
\Rightarrow
\delta(S,x,e) = \delta(S^*,x^*,e^*)
$$

Determinism requires ordered collections, explicit environment values, and a
canonical serialization strategy.

---

## 12. Reconciliation Checkpoint

Settlement consistency is evaluated only after a deposit reaches a modeled
reconciliation checkpoint.

A checkpoint requires:

1. a transfer observation to exist;
2. the configured confirmation policy to be satisfied;
3. token identity to be validated;
4. destination identity to be validated;
5. no unresolved normalization error to remain;
6. the deposit record to be eligible for final credit.

At the checkpoint:

$$
INV_{\mathrm{settlement}}:
A_{\mathrm{credited}} = A_{\mathrm{received}}
$$

The settlement divergence is:

$$
D_{\mathrm{settlement}}
=======================

## A_{\mathrm{credited}}

A_{\mathrm{received}}
$$

A non-zero value represents a modeled reconciliation mismatch.

The model distinguishes a pending deposit from a finalized but incorrectly
credited deposit.

---

## 13. Frame Conditions

Every transition specification must identify:

* fields that may change;
* fields that must remain unchanged;
* events that must be emitted;
* events that are insufficient as independent state evidence;
* failure behavior;
* integration consequences.

A transition specification is incomplete when it defines only changed fields
and omits fields that must remain stable.

---

## 14. Deterministic Trace Record

Every executed transition will eventually produce a trace record containing:

* transition index;
* pre-state hash;
* normalized input;
* normalized environment;
* result classification;
* return-data classification;
* ordered event records;
* state delta;
* post-state hash;
* invariant results.

The same initial state and ordered input sequence must reproduce the same final
state hash under the same model version.

---

## 15. Evidence Rule

A SPECTRA conformance or security claim must connect:

1. a normalized requirement;
2. an explicit transition or implementation behavior;
3. an executable scenario or test;
4. a deterministic trace;
5. an invariant or conformance result;
6. a reproducible evidence record.

An event, transaction status, assertion, static-analysis warning, or visual
output is supporting evidence. None is treated as independent proof of
security.

---

## 16. Known Limitations

Version 0.1.1 does not model:

* complete consensus or reorganization behavior;
* validator incentives;
* production bridge verification;
* real key-management systems;
* every non-standard token extension;
* gas accounting;
* fee-market behavior;
* account nonce accounting;
* complete asynchronous liveness guarantees;
* machine-checked formal proofs.

These exclusions must remain visible when interpreting future test results.

---

## 17. Source Families

The model is informed by the following source families:

* Ethereum state-transition documentation;
* ERC-20 transfer, approval, and event requirements;
* Solidity state and failure behavior;
* invariant and safety-property literature.

Concrete claim-to-source bindings will be maintained in the future SPECTRA
evidence register.
