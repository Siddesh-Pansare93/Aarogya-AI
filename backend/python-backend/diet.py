from openai import OpenAI
import datetime
import os
from pydantic import BaseModel
import json




class diet_format(BaseModel):
    diet_nutritions: list[str, float]
    suggestions: list[str]

# def clean(data):
#     parsed_data = json.loads(data)

#     # Separate nutritional facts and ingredients
#     diet_nutritions = parsed_data.get("diet_nutritions", [])
#     suggestions = parsed_data.get("suggestions", [])

#     nutritional_facts_dict = {}
#     for fact in diet_nutritions:
#         # Remove leading "-" and strip spaces
#         fact = fact.strip()
#         key, value = fact.split(": ")
#         nutritional_facts_dict[key] = float(value)

#     # Convert to JSON (optional, for pretty printing)
#     nutritional_facts_json = json.dumps(nutritional_facts_dict, indent=2)

#     # Print the result
#     # print(nutritional_facts_json)
#     # print(suggestions)



#     return nutritional_facts_json, suggestions


def clean(data):
    parsed_data = json.loads(data)

    # Separate nutritional facts and suggestions
    diet_nutritions = parsed_data.get("diet_nutritions", [])
    suggestions = parsed_data.get("suggestions", [])

    nutritional_facts_dict = {}
    for fact in diet_nutritions:
        # Validate and process each fact
        fact = fact.strip()
        if ": " in fact:
            key, value = fact.split(": ", 1)  # Use maxsplit=1 to avoid issues with extra colons
            try:
                nutritional_facts_dict[key] = str(value)  # Convert to float
            except ValueError:
                print(fact)
                print(f"Skipping invalid nutritional fact: {fact}")
        else:
            print(f"Skipping malformed fact: {fact}")

    # Convert to JSON (optional, for pretty printing)
    nutritional_facts_json = json.dumps(nutritional_facts_dict, indent=2)

    return nutritional_facts_json, suggestions


system_message = """
You are a nutritionist, based on the users profile, medical history, goals, and food preferences, generate a personalized nutrition plan for the user.
diet_nutritions: generate a personalized nutrition plan for the user. The nutrition plan should have the reuqired amount of of the following nutritions only
calories (Kcal), carbohydrates (g), proteins (g), fats (g), sodium (mg), calcium (mg), copper (mg), iron (mg), manganese (mg), phosphorus (mg), potassium (mg)
all the nutritions needed to be consumed in a day only.
the format for diet_nutritions - eg. calories : 400, carbohydrates : 500
suggestions: Based on the generated nutrition plan, suggest some dishes for the user that will benefit them, suggest indian dishes
"""

def generate_diet(user_profile):
#   system = "You are a nutritionist, based on the users profile, medical history, goals, and food preferences, generate a personalized nutrition plan for the user. The nutrition plan should include meal suggestions, amount of calories, proteins, carbohydrates, fats, sugar, various vitamins, etc. (Inlcude more nutritions), all the nutritions needed to be consumed in a day only. do not send plans for breakfast, lunch, etc. the values of the nutrition should be in grams only and not in mg, no values should be more than 500 and other non significant values should be less than 100"
#   system = "You are a nutritionist, based on the users profile, medical history, goals, and food preferences, generate a personalized nutrition plan for the user. The nutrition plan should include meal suggestions, amount of calories, proteins, carbohydrates, fats, sugar, various vitamins, etc. (Inlcude more nutritions), all the nutritions needed to be consumed in a day only. do not send plans for breakfast, lunch, etc. the values of the nutrition should be in grams only and not in mg, and suggest indian dishes only"
  system = system_message

  key = os.getenv("OPENAI_API_KEY")

  MODEL="gpt-4o"
  client = OpenAI(api_key=key)


  completion = client.beta.chat.completions.parse(
    model=MODEL,
    messages=[
      {"role": "system", "content": system},
      {"role": "user", "content": f"This is the user profile data {user_profile}"},
    ],
    response_format=diet_format,
  )

  data = completion.choices[0].message.content
  print("DATA")
  print(data)
  diet_nutritions, suggestions = clean(data)

  return [diet_nutritions, suggestions]




if __name__ == '__main__':
    # example
    user_profile = {
        "Age": "20",
        "weight (kg)": "70",
        "Height (cm)": "170",
        "Gender": "Male",
        "Activity Level": "Moderately Active",
        "Dietary Preferences": "non Vegetarian",
        "Allergies": "None",
        "Taste Preferences": "Spicy",
        "Medical History": "None",
        "Current Medical Conditions": "None",    
    }
    result = generate_diet(user_profile)
    print(result[0])
    print(result[1])