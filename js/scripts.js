// Logo or title element
let titleElement;

// Input and submit elements
let valueInputElement;
let submitButtonElement;

// Info elements
let ipAddressInfoElement;
let locationInfoElement;
let timezoneInfoElement;
let ispInfoElement;

// Map
let leafletMap;

window.addEventListener("DOMContentLoaded", () => {
  // Set DOM elements to variable.
  titleElement = document.getElementById("title");

  valueInputElement = document.getElementById("value-input");
  submitButtonElement = document.getElementById("submit-button");

  ipAddressInfoElement = document.getElementById("ip-address-info");
  locationInfoElement = document.getElementById("location-info");
  timezoneInfoElement = document.getElementById("timezone-info");
  ispInfoElement = document.getElementById("isp-info");

  // Add listener to title
  titleElement.addEventListener("click", () => fetchData());

  // Add listener to button click and input ENTER.
  submitButtonElement.addEventListener("click", onSubmit);
  valueInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") onSubmit();
  });

  // Initialize first IP-address data fetch and print.
  fetchData();
});

const onSubmit = () => {
  fetchData(valueInputElement.value);
};

const fetchData = async (value = "") => {
  await fetch(`http://ip-api.com/json/${value}?fields=34140159`)
    .then((res) => {
      if (res.ok) return res.json();
      else throw Error(res.statusText);
    })
    .then((data) => {
      if (data.status === "success") printFetchedData(data);
      else
        throw Error(
          `${JSON.stringify(data.message)}: ${JSON.stringify(data.query)}`
        );
    })
    .catch((error) => console.log(error));
};

const printFetchedData = ({
  query,
  city,
  regionName,
  offset,
  isp,
  lat,
  lon,
}) => {
  ipAddressInfoElement.innerText = query;
  locationInfoElement.innerText = `${city}, ${regionName}`;
  timezoneInfoElement.innerText = getUTCFromOffset(offset);
  ispInfoElement.innerText = isp;
  document.title = `${query} - IP Address tracker`;

  changeMapLocation(lat, lon);
};

// Utils
const getUTCFromOffset = (offset) => {
  let hours = Math.floor(offset / 60 / 60);
  const minutes = Math.floor(offset / 60) - hours * 60;

  // Adding the good-looking zero at left.

  if (0 < hours && hours < 10) hours = `+0${Math.abs(hours)}`;
  else if (-10 < hours && hours < 0) hours = `-0${Math.abs(hours)}`;
  else if (hours === 0) hours = `0${hours}`;

  const formattedTime = `UTC ${hours}:${minutes.toString().padStart(2, "0")}`;
  return formattedTime;
};

const changeMapLocation = (lat = 0, lon = 0) => {
  if (leafletMap) {
    leafletMap.flyTo([lat, lon], 13, {
      animation: true,
      duration: 1,
    });
  } else leafletMap = L.map("leaflet-container").setView([lat, lon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);

  L.marker([lat, lon]).addTo(leafletMap);
};
