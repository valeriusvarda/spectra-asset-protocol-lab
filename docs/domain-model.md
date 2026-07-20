# SPECTRA Domain Model

## Document Control

- Document ID: SPECTRA-DOM-001
- Status: Draft
- Model version: 0.1.0
- Research date: 2026-07-20

---

## 1. Purpose

This document defines the initial actors, asset concepts, state categories,
authority relationships and trust boundaries used by SPECTRA.

---

## 2. System Boundary

### Inside the Model

- token state;
- allowance state;
- authorization roles;
- observable events;
- integration ledger records;
- simplified bridge messages;
- canonical and remote supply accounting.

### Outside the Initial Model

- consensus implementation;
- validator economics;
- production bridge infrastructure;
- real key-management systems;
- complete chain-finality modeling;
- network-level attacks.

---

## 3. State Categories

### Persistent State

TODO

### Transaction Input

TODO

### Execution Environment

TODO

### Derived State

TODO

### Observation

TODO

---

## 4. Actor Registry

| Actor ID | Actor | Purpose | Trust Level | Authority | Controlled State | Failure Impact |
|---|---|---|---|---|---|---|
| ACT-001 | Token holder | TODO | Untrusted | Transfer owned balance | Own balance through valid operations | Limited |
| ACT-002 | Owner | TODO | Untrusted | Approve spender | Allowance entries | Medium |
| ACT-003 | Spender | TODO | Untrusted | Delegated spending | Owner allowance and balances | High |
| ACT-004 | Token contract | TODO | Conditional | State-transition enforcement | Balance, allowance and supply | Critical |
| ACT-005 | Administrator | TODO | Privileged | Configuration and role management | Control plane | Critical |
| ACT-006 | Minter | TODO | Privileged | Create supply | Total supply and balances | Critical |
| ACT-007 | Pauser | TODO | Privileged | Stop selected transitions | Pause status | High |
| ACT-008 | Exchange adapter | TODO | Conditional | Interpret deposits and withdrawals | Integration records | Critical |
| ACT-009 | Custody ledger | TODO | Conditional | Record customer claims | Off-chain balances | Critical |
| ACT-010 | Event indexer | TODO | Conditional | Observe protocol events | Indexed observations | High |
| ACT-011 | Bridge adapter | TODO | Privileged boundary | Lock, mint, burn or release | Cross-chain accounting | Critical |
| ACT-012 | Attacker | Exploit assumptions | Untrusted | No legitimate privilege | Depends on exploit | Critical |

---

## 5. Asset Concepts

### Canonical Asset

TODO

### Remote Representation

TODO

### Locked Asset

TODO

### Minted Asset

TODO

### Burned Asset

TODO

### Credited Balance

TODO

### Actual Received Amount

TODO

### Reported Total Supply

TODO

### Effective Circulating Supply

TODO

---

## 6. Settlement Variables

Let:

- `A_requested` be the amount requested by the sender;
- `A_debited` be the amount removed from the sender;
- `A_received` be the amount actually received by the recipient;
- `A_credited` be the amount recorded by an integration ledger;
- `A_fee` be the amount redirected or burned as a fee.

The initial settlement divergence is:

`D_settlement = A_credited - A_received`

TODO: Explain why a non-zero divergence may create a financial liability.

---

## 7. Initial State Model

The initial abstract state is:

`S = (B, W, T, R, P, N, L, M, G)`

Where:

- `B` represents balances;
- `W` represents allowances;
- `T` represents reported total supply;
- `R` represents roles;
- `P` represents protocol control state;
- `N` represents processed nonces or message identifiers;
- `L` represents locked canonical supply;
- `M` represents remote represented supply;
- `G` represents observable event history.

TODO: Explain each component in one paragraph.

---

## 8. Trust Boundaries

| Boundary ID | From | To | Assumption | Failure Consequence |
|---|---|---|---|---|
| TB-001 | Token contract | Exchange adapter | TODO | TODO |
| TB-002 | Event indexer | Custody ledger | TODO | TODO |
| TB-003 | Source gateway | Destination gateway | TODO | TODO |
| TB-004 | Administrator | Protocol control state | TODO | TODO |
| TB-005 | Bridge adapter | Mint authority | TODO | TODO |

---

## 9. Initial Threat Assumptions

1. Untrusted users may choose transaction ordering strategically.
2. Privileged roles may be compromised or misconfigured.
3. Integration systems may misinterpret return data.
4. Events may be missing or inconsistent with state.
5. Requested, received and credited amounts may differ.
6. Cross-chain messages may be replayed.
7. Similar interfaces may conceal different execution assumptions.

---

## 10. Known Limitations

TODOcjk
