from groq import Groq
import base64


# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Path to your image
# image_path = "images/image.jpg"
image_path = "images/medical_filter.png"

# Getting the base64 string
base64_image = encode_image(image_path)

client = Groq()

system_message = """
Your job is to classify medical waster
Analyze the provided image and determine its type.
Also provide steps to dispose of the waste and the risks involved.
"""

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": system_message},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}",
                    },
                },
            ],
        }
    ],
    model="llama-3.2-11b-vision-preview",
)

print(chat_completion.choices[0].message.content)