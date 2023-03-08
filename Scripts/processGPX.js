

const fs = require('fs');
const gpxParse = require('gpx-parse');

const directoryPath = 'C:\\Users\\Master Yoda\\Downloads\\Commute\\';

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  let longestDistance = 0;
  let longestDistanceFile = '';

  files.forEach(function (file, index) {
    fs.readFile(directoryPath + file, function (err, data) {
      if (err) {
        return console.log('Unable to read file: ' + err);
      }

      let totalTime = 0;

      gpxParse.parseGpx(data, function (error, data) {
        if (error) {
          return console.log('Error parsing GPX data: ' + error);
        }

        const distance = data.tracks[0].segments.reduce(
          (totalDistance, segment) => {
            const segmentDistance = segment.reduce((distance, point, index) => {
              if (index === 0) {
                return distance;
              }
              const previousPoint = segment[index - 1];
              return distance + getDistanceFromLatLonInKm(
                point.lat,
                point.lon,
                previousPoint.lat,
                previousPoint.lon
              );
            }, 0);
            return totalDistance + segmentDistance;
          },
          0
        );

        const segment = data.tracks[0].segments[0];
          const timeTaken = data.tracks[0].segments[0].timeInterval
    ? data.tracks[0].segments[0].timeInterval.endTime - data.tracks[0].segments[0].timeInterval.startTime
    : 0;


        totalTime += timeTaken;

        if (distance > longestDistance) {
          longestDistance = distance;
          longestDistanceFile = file;
        }

        console.log(`Distance for ${file} is ${distance.toFixed(2)} km, time is ${totalTime.toFixed(2)}`);
      });
    });
  });

  console.log(`The file with the longest distance is ${longestDistanceFile}.`);
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

//cd C:\xampp\htdocs\Cycling\Scripts
//node processGPX.js