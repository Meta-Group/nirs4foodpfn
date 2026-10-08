# NIRS4FoodPFN dashboard

Static dashboard for comparing NIR spectra and dataset metadata. It provides context for the NIRS4FoodPFN project and supports exploratory analysis of food datasets alongside plant, soil, and other reference domains.

The site is published with GitHub Pages from `static/` on pushes to `main`, following the deployment pattern used by [DPG_web](https://github.com/Meta-Group/DPG_web). In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Pages URL can then be connected to `http://machinelearning.inginf.units.it/nirs4foodpfn` by the institutional web server.

## Local preview

```bash
cd static
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serve the directory over HTTP; opening `index.html` as a local file prevents the browser from loading the JSON catalog.

## Data included

`static/data/catalog.json` contains nirs4all-datasets catalog metadata and the 43 mean/quantile profiles available for sources in the public tier. The dashboard includes no raw spectra, sample rows, or sample identifiers. Profiles and metadata remain subject to the dataset-level licenses and attribution requirements in the source catalog.

Local project datasets marked private or `LicenseRef-not-cleared` are not included in this public bundle. Keep local analysis exports out of `static/` unless their redistribution rights have been confirmed. The catalog's cards and datasheets are CC-BY-4.0; that does not override each dataset's own license.

Band annotations in the plot are approximate interpretations of overlapping NIR regions. They describe likely absorption mechanisms and matrix effects, not unique compound identification.
