from openai import OpenAI
import datetime
import os
from pydantic import BaseModel
import json
from retreive_beds import get_beds

class symptoms_response_format(BaseModel):
    location: list[str]

def clean(data):
    parsed_data = json.loads(data)
    location = parsed_data.get("location", [])
    print("LOCATION")
    print(location)

    return location

system_message = """
available location = cities = ["Mumbai", "Borivali", "Dahisar", "Kandivali", "Malad", "Goregaon", "Bhandup", "Vikhroli", "Mulund", "Kurla", "Chembur", "Ghatkopar", "Andheri", "Santacruz", "Bandra", "Jogeshwari", "Colaba", "Byculla", "Mazgaon", "Dadar", "Parel", "Worli", "Prabhadevi", "Sion", "Dharavi", "Matunga", "Tardeo", "Agripada", "Chinchpokli", "Girgaon", "Marine Lines", "Fort"]
 my current location in kurla
 out of the available locations, find the location closest to the user's location
 you are allowed to send multiple locations, use a list -> eg. ['kurla', 'chembur']
"""

def analyzer(location):
  system = system_message

  key = os.getenv("OPENAI_API_KEY")

  MODEL="gpt-4o"
  client = OpenAI(api_key=key)


  completion = client.beta.chat.completions.parse(
    model=MODEL,
    messages=[
      {"role": "system", "content": system},
      {"role": "user", "content": f"{location}"},
    ],
    response_format=symptoms_response_format,
  )

  data = completion.choices[0].message.content
  print("DATA")
  print(data)

  location = clean(data)

  return location

def beds_finder(location):
    location = analyzer(location)
    beds = get_beds(location)
    return beds


if __name__ == '__main__':
  location = {
    "lattitude": 19.0759837,
    "longitude": 72.8776559
  }

  beds = beds_finder(location)
  print(beds)
  f = open("beds.json", "w")
  f.write(beds)
  f.close()