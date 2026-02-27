# Building Parking Control App

A lightweight web app to monitor and control parking inside a building.

## Features

- Track current occupancy vs total capacity.
- Register vehicle check-in by plate number.
- Register vehicle check-out and auto-calculate fee.
- Live table of parked vehicles and current parking duration.
- Revenue counter based on hourly rate (`$2.50/hour`, billed per started hour).

## Run locally

Because this is a static app, you can open `index.html` directly, or run:

```bash
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.
