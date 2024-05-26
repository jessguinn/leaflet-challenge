import requests
import json

# URL of the USGS Earthquake API
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

# Send a GET request to the API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON content
    data = response.json()
    
    # Save the JSON content to a GeoJSON file
    with open("earthquake_data.geojson", "w") as geojson_file:
        json.dump(data, geojson_file, indent=4)
    
    print("Data successfully saved to earthquake_data.geojson")
else:
    print(f"Failed to fetch data. HTTP Status code: {response.status_code}")

