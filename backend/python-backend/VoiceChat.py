
import os
from groq import Groq
from openai import OpenAI
import datetime
# client = Groq(
#     api_key=os.environ.get("GROQ_API_KEY"),
# )


client = Groq()



system_message = """
You are an expert nutritionist. Help the user with their queries regarding their diet and the food they are eating.
Refuse to answer any questions that are not related to nutrition or health.
Keep it short and concise.
You are only suppose to answer in English, Hindi, Marathi, and other Indian languages
"""


def get_text(filename):
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
          file=(filename, file.read()),
          model="whisper-large-v3-turbo",
          response_format="verbose_json",
        )
        return transcription.text
        


def get_response(prompt):
  system = system_message

  key = os.getenv("OPENAI_API_KEY")

  MODEL="gpt-4o-mini"
  client = OpenAI(api_key=key)


  completion = client.chat.completions.create(
    model=MODEL,
    messages=[
      {"role": "system", "content": system},
      {"role": "user", "content": prompt},
    ]
  )
  return(completion.choices[0].message.content) 


def clean(data):
    data = data.replace("*", "")
    return data


def VoiceChat(filename):
    text = get_text(filename)
    print(f"Text: {text}")
    result = get_response(text)
    result = clean(result)
    print(f"Result: {result}")
    return result



if __name__ == '__main__':
    VoiceChat("uploads/audio.m4a")



































