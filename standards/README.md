# Machine-Readable Standard Manifests

This directory will contain machine-readable behavioral manifests for the asset standards studied by SPECTRA.

## Planned Manifests

* `erc20.json`
* `trc20.json`
* `bep20.json`
* `arc200.json`
* `sasp1.json`

## Manifest Purpose

The manifests will serve as shared data sources for:

* the interface and semantics comparison matrix;
* the deterministic state model;
* the conformance engine;
* invariant mappings;
* the visual observatory.

Protocol information must not be duplicated manually inside frontend components.

## Expected Manifest Categories

Each manifest is expected to describe:

* standard identifier;
* ecosystem;
* execution environment;
* required methods;
* optional methods;
* return semantics;
* event requirements;
* approval model;
* supply controls;
* privilege extensions;
* decimal behavior;
* known integration risks;
* tested invariants.

## Current Status

Day 0 — manifest workspace initialized.

No behavioral claim has been entered yet because the primary-source review has not started.
