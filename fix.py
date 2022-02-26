import json
import requests

with open("values.json", "r") as file:
    data = json.load(file)

for key in data:
    try:
        name = key
        name = name.replace(" ", "_")
        image = data[key]['IMAGE']
        response = requests.get(image)
        with open(f"images/{name}.png", "wb") as file:
            file.write(response.content)
    except:
        pass