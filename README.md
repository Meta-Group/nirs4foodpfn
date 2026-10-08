# NIRS4FoodPFN dashboard

Static dashboard for comparing NIR spectra and dataset metadata. It provides context for the NIRS4FoodPFN project and supports exploratory analysis of food datasets alongside plant, soil, and other NIR reference domains.

The site is published with GitHub Pages from the static directory on pushes to main, following the deployment pattern used by DPG_web. In repository settings, choose Pages → Build and deployment → Source → GitHub Actions. The Pages URL can then be connected to http://machinelearning.inginf.units.it/nirs4foodpfn by the institutional web server.

## Local preview

    cd static
    python3 -m http.server 8000

Open http://localhost:8000. Serve the directory over HTTP; opening index.html as a local file prevents the browser from loading the JSON catalog.

## Data included

The bundle contains only NIR records: 97 nirs4all catalog entries and four project-owned milk/papaya datasets. The 41 external curves are included only where nirs4all marks the source public. The five project curves contain per-channel means and standard deviations for milk transmission (dark and white channels) and three papaya datasets. No raw spectra, observation rows, target values, sample identifiers, minima, or maxima are included for the project datasets.

Only the milk and papaya aggregate profiles approved by the project owner are included from local data. Other local datasets and external records without cleared redistribution rights have no published curve. The nirs4all cards and datasheets are CC-BY-4.0; that does not override each external dataset's license.

Band annotations are approximate interpretations of overlapping NIR regions. They describe likely absorption mechanisms and matrix effects, not unique compound identification.
