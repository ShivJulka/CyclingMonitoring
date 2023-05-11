//script to loop through all gpx files in a directory and output a html file with similar activities to a seperat HTML document


const fs = require('fs');
const path = require('path');
const togeojson = require('togeojson');
const DOMParser = require('xmldom').DOMParser;


//use the Haversine formula to calculate the distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

//function to apply the haversine formula to points in the GPX file
function computeDistance(geojson) {
  let distance = 0;
  const coordinates = geojson.features[0].geometry.coordinates;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];

    distance += haversineDistance(lat1, lon1, lat2, lon2);
  }

  return distance;
}

//function to get the duration of the activity
function getDuration(geojson) {
  const coordinates = geojson.features[0].geometry.coordinates;
  const startTime = new Date(coordinates[0][2] * 1000);
  const endTime = new Date(coordinates[coordinates.length - 1][2] * 1000);
  const duration = (endTime - startTime) / 1000; // in seconds

  return duration;
}

//function to group the similae journeys
function groupBy(journeys, distanceTolerance, timeTolerance) {
  const groups = {};

  journeys.forEach((journey) => {
    let foundGroup = false;

    Object.keys(groups).forEach((groupId) => {
      const refJourney = groups[groupId][0];

      if (
        Math.abs(journey.distance - refJourney.distance) <= distanceTolerance &&
        Math.abs(journey.duration - refJourney.duration) <= timeTolerance
      ) {
        groups[groupId].push(journey);
        foundGroup = true;
      }
    });

    if (!foundGroup) {
      const groupId = Object.keys(groups).length + 1;
      groups[groupId] = [journey];
    }
  });

  return groups;
}

//write the external HTML file
function writeHtmlOutput(groups, outputHtml) {
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Similar Activities</title>
</head>
<body>
<h1>Similar Activities</h1>
`;

  Object.keys(groups).forEach((groupId) => {
    const group = groups[groupId];
    htmlContent += `<h2>Group ${groupId}</h2><ul>`;
    group.forEach((journey) => {
      htmlContent += `<li>${journey.file}: ${journey.distance.toFixed(
        2
      )} km, ${journey.duration.toFixed(2)} s</li>`;
    });
    htmlContent += '</ul>';
  });

  htmlContent += '</body></html>';

  fs.writeFileSync(outputHtml, htmlContent);
}


//read the GPX file
function readGpxFile(filePath) {
  try {
    const gpxFile = fs.readFileSync(filePath, 'utf8');
    const gpxDom = new DOMParser().parseFromString(gpxFile);
    const geojson = togeojson.gpx(gpxDom);
    return geojson;
  } catch (error) {
    console.error(`Error parsing ${filePath}: ${error}`);
    return null;
  }
}

//main script
const directoryPath = 'C://xampp//htdocs//CyclingMonitoring//activity';
const outputHtml = 'similar_activities.html';

const journeys = [];

// Loop through all the files in the directory
fs.readdirSync(directoryPath).forEach((filename) => {
  if (filename.endsWith('.gpx')) {
    const filePath = path.join(directoryPath, filename);
    const geojson = readGpxFile(filePath);

    if (!geojson) return;

    const distance = computeDistance(geojson); // Compute the total distance in km
    const duration = getDuration(geojson); // Compute the total duration in seconds

    const journey = {
      file: filename,
      distance: distance,
      duration: duration,
    };

    journeys.push(journey);
  }
});


// Group the journeys by distance and duration

const distanceTolerance = 0.1; // in km
const timeTolerance = 300; // in seconds
const groupedJourneys = groupBy(journeys, distanceTolerance, timeTolerance);

writeHtmlOutput(groupedJourneys, outputHtml);
