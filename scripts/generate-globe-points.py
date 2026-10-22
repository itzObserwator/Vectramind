"""Build the land particle mask from Natural Earth 110m land GeoJSON.
Usage: python3 scripts/generate-globe-points.py input.geojson
Source: https://github.com/nvkelso/natural-earth-vector (public domain).
The browser loads only the generated compact points, not the source polygons.
"""
import json, math, sys
from pathlib import Path
features = json.loads(Path(sys.argv[1]).read_text())["features"]
polygons = []
for feature in features:
    geometry = feature["geometry"]
    for rings in geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]:
        outer = rings[0]
        polygons.append((min(p[0] for p in outer), max(p[0] for p in outer), min(p[1] for p in outer), max(p[1] for p in outer), rings))
def inside(x, y, ring):
    result = False
    previous = ring[-1]
    for current in ring:
        if (current[1] > y) != (previous[1] > y) and x < (previous[0]-current[0])*(y-current[1])/(previous[1]-current[1])+current[0]: result = not result
        previous = current
    return result
points = []
count = 40000
for i in range(count):
    y = 1 - 2 * (i+.5) / count
    latitude = math.degrees(math.asin(y))
    longitude = (i * 137.50776405003785) % 360 - 180
    land = any(x0 <= longitude <= x1 and y0 <= latitude <= y1 and inside(longitude, latitude, rings[0]) and not any(inside(longitude, latitude, hole) for hole in rings[1:]) for x0,x1,y0,y1,rings in polygons)
    if not land and i % 14: continue
    longitude = math.radians(longitude)
    radius = math.sqrt(1-y*y)
    points.extend([round(radius*math.sin(longitude),5), round(y,5), round(radius*math.cos(longitude),5), 1 if land else .10])
Path('public/data/globe-points.json').write_text(json.dumps(points,separators=(',',':')))
print(f'{len(points)//4} globe particles')
