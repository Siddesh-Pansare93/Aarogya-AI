from flask import Flask, request, jsonify
import os
import json
from scan_food import scan
from diet import generate_diet
from chat import chat
from VoiceChat import VoiceChat
from symptoms import symptoms_analyzer

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)




@app.route('/')
def index():
    return "Hello, World!"




# Route to handle requests from the Node.js backend
@app.route('/plan_diet', methods=['POST'])
def plan_diet():
    print("Received request to plan diet")
    try:
        # Parse JSON data from the request
        user_profile_data = request.json
        if not user_profile_data:
            return jsonify({"error": "Invalid or missing JSON data"}), 400
        
        print("User Profile Data:", user_profile_data)

        # Pass the data to the generate function
        result = generate_diet(user_profile_data)

        # Return the result as a JSON response
        print("Result:", result)
        return jsonify(result), 200

    except Exception as e:
        # Handle errors and return a 500 status
        print("Error:", e)
        return jsonify({"error": str(e)}), 500





@app.route('/scan_img', methods=['POST'])
def scan_img():
    print("Received request to scan image")
    try:
        # Log incoming request data for debugging
        print("Request Files:", request.files)
        print("Request Form:", request.form)

        # Check if an image file is included in the request
        if 'image' not in request.files:
            print("Error: No image file provided")
            return jsonify({"error": "No image file provided"}), 400

        # Get the uploaded image file
        image_file = request.files['image']

        # Validate the file type
        if not image_file.filename.endswith(('.png', '.jpg', '.jpeg')):
            print("Error: Invalid file type. Only PNG, JPG, and JPEG are allowed.")
            return jsonify({"error": "Invalid file type. Only PNG, JPG, and JPEG are allowed."}), 400

        # Save the file to the uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
        image_file.save(file_path)

        # Retrieve and validate the description
        description = request.form.get("description")
        if not description:
            # print("Error: No description provided")
            # return jsonify({"error": "No description provided"}), 400
            description = "no description provided by the user"

        # Retrieve and parse user_Details
        user_details = request.form.get("user_Details")
        if not user_details:
            print("Error: No user_Details provided")
            return jsonify({"error": "No user_Details provided"}), 400
        user_details = json.loads(user_details)  # Convert JSON string to dictionary

        # Retrieve and parse user_Diet
        # user_diet = request.form.get("user_Diet")
        # if not user_diet:
        #     print("Error: No user_Diet provided")
        #     return jsonify({"error": "No user_Diet provided"}), 400
        # user_diet = json.loads(user_diet)  # Convert JSON string to dictionary

        # Log received data
        print("Description:", description)
        print("User Details:", user_details)
        # print("User Diet:", user_diet)

        # Call the scan function with the received data
        result = scan(file_path, description, user_details)

        print(result)

        # Return the result
        # return jsonify(result), 200

        return jsonify({
            "nutritional_facts": result[0],
            "ingredients": result[1],
            "feedback": result[2],
            "final_thoughts": result[3]
        }), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500




# Route to handle requests from the Node.js backend
@app.route('/chatbot', methods=['POST'])
def chatbot():
    print("Received request to chat")
    try:
        # Parse JSON data from the request
        context = request.json
        if not context:
            return jsonify({"Context not found"}), 400
        
        print("Context :", context)

        user_prompt = request.json
        if not user_prompt:
            return jsonify({"user_prompt not found"}), 400

        print("user_prompt :", user_prompt)
        
        # Pass the data to the generate function
        result = chat(context, user_prompt)

        # Return the result as a JSON response
        print("Result:", result)
        return jsonify(result), 200
    except Exception as e:
        # Handle errors and return a 500 status
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file received"}), 400  # Returns JSON error

        audio_file = request.files['audio']
        print("Received audio file:", audio_file.filename)

        # Save the audio file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename)
        audio_file.save(file_path)
        print("Audio file saved at:", file_path)

        result = VoiceChat(file_path)

        

        # Simulated response data
        response_data = {
            "message": f"{result}",
        }

        return jsonify(response_data)  # Ensure JSON response

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Catch errors & return JSON


@app.route('/analyze_symptoms', methods=['POST'])
def analyze_symptoms_route():
    try:
        # Retrieve user_profile from request
        user_profile = request.form.get("user_Details")
        if not user_profile:
            print("Error: No user_Details provided")
            return jsonify({"error": "No user_Details provided"}), 400
        user_profile = json.loads(user_profile)  # Convert JSON string to dictionary
        print("User Profile:", user_profile)

        # Retrieve ingredients from request
        ingredients = request.form.get("ingredients")
        if not ingredients:
            print("Error: No ingredients provided")
            return jsonify({"error": "No ingredients provided"}), 400
        ingredients = json.loads(ingredients)  # Convert JSON string to dictionary
        print("Ingredients:", ingredients)


        location = request.form.get("location")
        if not location:
            print("Error: No location provided")
            return jsonify({"error": "No location provided"}), 400
        ingredients = json.loads(location)  # Convert JSON string to dictionary
        print("Location:", location)

        # Retrieve audio file from request
        if 'audio' not in request.files:
            print("Error: No audio file received")
            return jsonify({"error": "No audio file received"}), 400
        audio_file = request.files['audio']
        print("Received audio file:", audio_file.filename)

        # Save the audio file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename)
        audio_file.save(file_path)
        print("Audio file saved at:", file_path)

        # Call symptoms analyzer function
        diagnosis, severity, recommendations, doctors = symptoms_analyzer(user_profile, ingredients, file_path, location)
        print("\n"*10)
        print(diagnosis, severity, recommendations, doctors)

        # Return the response

        return jsonify({
            "diagnosis": diagnosis,
            "severity": severity,
            "recommendations": recommendations,
            "doctors": doctors
        }), 200
        # return jsonify({"analysis_result": result}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)