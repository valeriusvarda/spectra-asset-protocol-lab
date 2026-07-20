# SPECTRA Research Source Map

## Document Control

- Document ID: SPECTRA-RSM-001
- Status: Draft
- Research date: 2026-07-20
- Scope: ERC-20, TRC-20, BEP-20 and ARC-200
- Evidence policy: Primary and official sources only

---

## 1. Research Question

Which interface, execution, failure, event and accounting behaviors are
explicitly specified across ERC-20, TRC-20, BEP-20 and ARC-200, and which
behaviors remain inferred or unspecified?

---

## 2. Evidence Classification

### SPECIFIED

A behavior explicitly required, recommended, permitted or prohibited by the
reviewed normative source.

### INFERRED

A conclusion derived from one or more official sources but not expressed as
a direct normative requirement.

### UNSPECIFIED

A behavior that the reviewed normative source does not define precisely
enough to support a conformance claim.

---

## 3. Terminology Boundaries

| Term | Definition | What It Is Not | Source |
|---|---|---|---|
| EIP | TODO | TODO | SRC-01 |
| ERC | TODO | TODO | SRC-01 |
| TRC-20 | TODO | TODO | SRC-03 |
| BEP | TODO | TODO | SRC-05 |
| BEP-20 | TODO | TODO | SRC-05 |
| ARC | TODO | TODO | SRC-07 |
| ARC-200 | TODO | TODO | SRC-08 |

---

## 4. Primary Source Registry

| ID | Ecosystem | Document | Authority | Status | Purpose |
|---|---|---|---|---|---|
| SRC-01 | Ethereum | EIP-1 | Ethereum EIPs | Active | Proposal taxonomy |
| SRC-02 | Ethereum | ERC-20 | Ethereum EIPs | Final | Token semantics |
| SRC-03 | TRON | TRC-20 Protocol Interface | TRON Developers | Current documentation | Interface semantics |
| SRC-04 | TRON | TRON Virtual Machine | TRON Developers | Current documentation | Execution environment |
| SRC-05 | BNB Chain | BEP-20 | BNB Chain BEPs | Proposal specification | Token semantics |
| SRC-06 | BNB Chain | BSC documentation | BNB Chain | Current documentation | Execution and finality |
| SRC-07 | Algorand | ARC-0 | Algorand ARC portal | Living process document | Proposal taxonomy |
| SRC-08 | Algorand | ARC-200 | Algorand ARC portal | Living | Token semantics |
| SRC-09 | Algorand | AVM documentation | Algorand Developer Portal | Current documentation | State and execution |

---

## 5. Normative Claim Ledger

| Claim ID | Standard | Layer | Normalized Claim | Strength | Evidence Class | Source | Integration Impact |
|---|---|---|---|---|---|---|---|
| CLM-001 | ERC-20 | Interface | TODO | MUST | SPECIFIED | SRC-02 | TODO |
| CLM-002 | ERC-20 | Return | TODO | MUST | SPECIFIED | SRC-02 | TODO |
| CLM-003 | ERC-20 | Metadata | TODO | OPTIONAL | SPECIFIED | SRC-02 | TODO |
| CLM-004 | TRC-20 | Interface | TODO | TODO | SPECIFIED | SRC-03 | TODO |
| CLM-005 | TRC-20 | Execution | TODO | N/A | INFERRED | SRC-03, SRC-04 | TODO |
| CLM-006 | BEP-20 | Metadata | TODO | REQUIRED | SPECIFIED | SRC-05 | TODO |
| CLM-007 | BEP-20 | Supply | TODO | TODO | SPECIFIED | SRC-05 | TODO |
| CLM-008 | ARC-200 | Failure | TODO | MUST | SPECIFIED | SRC-08 | TODO |
| CLM-009 | ARC-200 | Event | TODO | MUST | SPECIFIED | SRC-08 | TODO |

Continue until at least 12 claims are documented.

---

## 6. Initial Semantic Comparison

| Dimension | ERC-20 | TRC-20 | BEP-20 | ARC-200 |
|---|---|---|---|---|
| Execution environment | TODO | TODO | TODO | TODO |
| Transfer return semantics | TODO | TODO | TODO | TODO |
| Insufficient-balance behavior | TODO | TODO | TODO | TODO |
| Metadata requirements | TODO | TODO | TODO | TODO |
| Transfer event behavior | TODO | TODO | TODO | TODO |
| Supply interpretation | TODO | TODO | TODO | TODO |

---

## 7. Unresolved Questions

1. TODO
2. TODO
3. TODO
4. TODO

---

## 8. Preliminary Conclusion

Write 150–250 words distinguishing:

- explicitly specified behavior;
- inferred behavior;
- unspecified behavior;
- behaviors that SPECTRA must test experimentally.
