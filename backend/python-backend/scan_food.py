from pydantic import BaseModel
import base64
from openai import OpenAI
import os
import json


key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=key)
Model = "gpt-4o-mini"


system_message = """
You are an expert at structured data extraction. You will be given an image of packaged food and must extract ingredients and nutritional facts in the specified format. For nutritional facts, adjust values based on the amount the user is consuming; if not mentioned, assume the entire package (per serving). Convert all values to grams (g), converting milligrams (mg) to grams where necessary.
For pre-prepared food, ensure nutritional facts are per serving.
Using the provided user profile, analyze whether the food is suitable based on medical history, allergies, and dietary needs. Provide feedback, highlighting any risks, benefits, or concerns. Warn the user if the food contains allergens or ingredients harmful to their health.

The nutritonal_facts must include
nutritional_facts: ['calories': 'str', 'carbohydrates': 'str', 'proteins': 'str', 'fats': 'str', 'minerals': 'str', 'fiber': 'str', 'cholesterol': 'str', 'sodium': 'str', 'sugar': 'str' ]

example - [
    'calories': '10g',
    'carbohydrates': '20g',
    'proteins': '10g',
    'fats': '10g',
    'fiber': '1g',
    'cholesterol': 'str',
    'sodium': 'str',
    'sugar': 'str'
]
"""


class food_info_extraction_format(BaseModel):
    nutritional_facts: list[str, str]
    ingredients: list[str]
    feedback: str
    final_thoughts: str

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# def get_data(image_path, user_prompt, user_profile, user_diet):
def get_data(image_path, user_prompt, user_profile):
    base64_image = encode_image(image_path)

    completion = client.beta.chat.completions.parse(
        model=Model,
        messages=[
            {
                "role": "system",
                "content": system_message
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        # "text": "This is maggie noodles, I am gonna eat all of this",
                        "text": f"{user_prompt} {user_profile}",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
        response_format=food_info_extraction_format,


    )
    data = completion.choices[0].message.content
    # print(data)
    return data

def clean_data(data):    
    parsed_data = json.loads(data)
    nutritional_facts = parsed_data.get("nutritional_facts", [])
    ingredients = parsed_data.get("ingredients", [])
    feedback = parsed_data.get("feedback", [])
    final_thoughts = parsed_data.get("final_thoughts", [])

    # Process the list into a dictionary
    nutritional_facts_dict = {}
    for fact in nutritional_facts:
        fact = fact.lstrip("-").strip()
        key, value = fact.split(": ")
        key = key.replace("Total", "").strip()
        # value = value.replace("g", "").strip()
        nutritional_facts_dict[key] = value

    # Convert to JSON
    nutritional_facts_json = json.dumps(nutritional_facts_dict, indent=2)
    return nutritional_facts_json, ingredients, feedback, final_thoughts

# def scan(image_path, user_prompt, user_profile, user_diet):
def scan(image_path, user_prompt, user_profile):
    data = get_data(image_path, user_prompt, user_profile)
    print(data)
    print("\n"*10)
    nutritional_facts_json, ingredients, feedback, final_thoughts = clean_data(data)
    print("Nutritional Facts")
    print(nutritional_facts_json)
    print("Ingredients")
    print(ingredients)
    print("Feedback")
    print(feedback)
    print("final_thoughts")
    print(final_thoughts)
    print("\n"*10)
    return [nutritional_facts_json, ingredients, feedback, final_thoughts]
    


if __name__ == "__main__":
    image_path = input("Enter the path to the image: ")
    user_prompt = input("Enter the user prompt: ")
    # nutritional_facts_json, ingredients = scan(image_path, user_prompt)
    # print(nutritional_facts_json)
    # print(ingredients)

    # example
    user_profile = {
        "Age": "20",
        "weight (kg)": "70",
        "Height (cm)": "170",
        "Gender": "Male",
        "Activity Level": "Moderately Active",
        "Dietary Preferences": "Vegetarian",
        "Allergies": "None",
        "Taste Preferences": "Spicy",
        "Medical History": "None",
    }


    user_diet = {"nutrients":{"Calories":2500,"Proteins":80,"Carbohydrates":350,"Fats":70,"Sugar":50,"Sodium":2000,"Fiber":30,"Vitamin A":900,"Vitamin C":90,"Calcium":1000,"Iron":14,"Magnesium":400,"Potassium":3500,"Vitamin B12":2.4},"mealSuggestions":["Meal 1: Tofu stir-fry with mixed vegetables (broccoli, bell peppers, and carrots) served with brown rice. Seasoned with soy sauce and sesame oil.","Meal 2: Whole grain pasta with marinara sauce, lentils, and spinach topped with nutritional yeast.","Meal 3: Smoothie with banana, spinach, almond milk, and a scoop of plant-based protein powder.","Meal 4: Quinoa salad with chickpeas, cherry tomatoes, cucumber, avocado, and a lemon-tahini dressing.","Meal 5: Vegetable curry with sweet potatoes and served with basmati rice and side of mixed greens salad with vinaigrette."]}



    result = scan(image_path, user_prompt, user_profile)
    print(result[0])
    print(result[1])
    print(result[2])
    print(result[3])