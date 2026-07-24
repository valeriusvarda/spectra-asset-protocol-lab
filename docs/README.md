# SPECTRA Documentation

This directory contains the human-readable research specifications, security
models, evidence rules, findings, and limitations used by SPECTRA.

## Current Documents

| Document         | Status                       | Purpose                                                                                                              |
| ---------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `state-model.md` | Working Specification v0.1.1 | Defines state boundaries, transition semantics, reachability, reconciliation conditions, and foundational invariants |

## Planned Documents

Documents are introduced only when they contain substantive and reviewable
material.

| Document               | Intended Purpose                                                    |
| ---------------------- | ------------------------------------------------------------------- |
| `project-charter.md`   | Frozen scope, research question, non-goals, and acceptance criteria |
| `architecture.md`      | Components, data flow, and trust boundaries                         |
| `methodology.md`       | Research, testing, tracing, and evidence-generation method          |
| `threat-model.md`      | Assets, actors, adversaries, trust boundaries, and abuse cases      |
| `invariants.md`        | Versioned invariant definitions and executable mappings             |
| `findings.md`          | Source-backed and test-backed findings                              |
| `limitations.md`       | Unsupported claims, exclusions, and unresolved risks                |
| `evidence-register.md` | Claim-to-source, test, trace, and visualization mappings            |

## Documentation Status

A document may use one of the following statuses:

* **Draft** — structurally incomplete or under initial development;
* **Working Specification** — complete enough to guide implementation but
  still subject to test-driven revision;
* **Candidate** — reviewed against its required evidence;
* **Accepted** — approved for the current project version;
* **Superseded** — replaced by a later version.

## Evidence Rule

Every material technical claim must connect to one or more of the following:

* an official specification;
* an explicit state-machine definition;
* an implementation;
* an executable test;
* an adversarial trace;
* a measurement;
* a reproducible evidence record.

Events, transaction statuses, assertions, static-analysis warnings, and visual
outputs are supporting evidence. None is treated as independent proof of
security.
