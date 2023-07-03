const turf = require('@turf/turf');

module.exports = function (area, location) {
    const searchWithin = turf.polygon([area.map((x) => [x.x, x.y])]);
    const point = turf.point([location.x, location.y]);

    const ptsWithin = turf.pointsWithinPolygon(point, searchWithin);

    return ptsWithin.features.length === 0 ? true : false;
}