# NIRS4FoodPFN dashboard

Static dashboard for comparing NIR spectra and dataset metadata. It provides context for the NIRS4FoodPFN project and supports exploratory analysis of food datasets alongside plant, soil, and other NIR reference domains.

The site is published with GitHub Pages from the static directory on pushes to main, following the deployment pattern used by DPG_web. In repository settings, choose Pages → Build and deployment → Source → GitHub Actions. The Pages URL can then be connected to http://machinelearning.inginf.units.it/nirs4foodpfn by the institutional web server.

## Local preview

    cd static
    python3 -m http.server 8000

Open http://localhost:8000. Serve the directory over HTTP; opening index.html as a local file prevents the browser from loading the JSON catalog.

## Data included

The bundle shows only NIR sources. It includes all 75 NIR source profiles from the 73 local project datasets, represented by per-channel means and standard deviations. It also includes 97 NIR catalog entries from nirs4all; 41 external curves are included only where nirs4all marks the source public. No raw spectra, observation rows, sample identifiers, or local target values are included.

The local aggregate curves were requested for public analysis by the project owner. Other modalities are excluded. External nirs4all curves without confirmed redistribution rights remain unavailable. The nirs4all cards and datasheets are CC-BY-4.0; that does not override each external dataset's license.

Band annotations are approximate interpretations of overlapping NIR regions. They describe likely absorption mechanisms and matrix effects, not unique compound identification.
