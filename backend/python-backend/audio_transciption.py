from groq import Groq


client = Groq()

def audio_transcriber(filename):
    with open(filename, "rb") as file:
        transcription = client.audio.transcriptions.create(
          file=(filename, file.read()),
          model="whisper-large-v3-turbo",
          response_format="verbose_json",
        )
        return transcription.text
        

