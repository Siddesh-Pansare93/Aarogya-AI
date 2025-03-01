import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# Base URL without page number
BASE_URL = "https://www.practo.com/mumbai/doctors?page={}"

# Headers to mimic a browser visit
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

data = []
page = 1  # Start from page 1

while True:
    print(f"Scraping page {page}...")

    # Get the page content
    response = requests.get(BASE_URL.format(page), headers=HEADERS)
    if response.status_code != 200:
        print("Failed to retrieve the webpage.")
        break

    soup = BeautifulSoup(response.text, "html.parser")

    # Find all doctor cards
    doctor_cards = soup.find_all("div", class_="listing-doctor-card")

    if not doctor_cards:
        print(f"No more doctor cards found on page {page}. Stopping...")
        break  # Stop if no doctor cards found

    # Extract data from each card
    for card in doctor_cards:
        try:
            name = card.find("h2", {"data-qa-id": "doctor_name"}).text.strip()
        except AttributeError:
            name = None

        try:
            specialization = card.find("span").text.strip()
        except AttributeError:
            specialization = None

        try:
            experience = card.find("div", {"data-qa-id": "doctor_experience"}).text.strip()
        except AttributeError:
            experience = None

        try:
            location = card.find("span", {"data-qa-id": "practice_locality"}).text.strip()
            city = card.find("span", {"data-qa-id": "practice_city"}).text.strip()
        except AttributeError:
            location, city = None, None

        try:
            hospital = card.find("span", {"data-qa-id": "doctor_clinic_name"}).text.strip()
        except AttributeError:
            hospital = None

        try:
            consultation_fee = card.find("span", {"data-qa-id": "consultation_fee"}).text.strip()
        except AttributeError:
            consultation_fee = None

        try:
            recommendation = card.find("span", {"data-qa-id": "doctor_recommendation"}).text.strip()
        except AttributeError:
            recommendation = None

        try:
            patient_stories = card.find("span", {"data-qa-id": "total_feedback"}).text.strip()
        except AttributeError:
            patient_stories = None

        try:
            availability = card.find("span", {"data-qa-id": "availability_text"}).text.strip()
        except AttributeError:
            availability = None

        try:
            profile_photo = card.find("img", {"data-qa-id": "doctor_profile_photo"})["src"]
        except (AttributeError, TypeError):
            profile_photo = None

        try:
            profile_link = card.find("a")["href"]
            profile_link = "https://www.practo.com" + profile_link  # Convert to full URL
        except (AttributeError, TypeError):
            profile_link = None

        print(f"Scraped data for {name}")
        a = {
            "Doctor Name": name,
            "Specialization": specialization,
            "Experience": experience,
            "Location": location,
            "City": city,
            "Hospital": hospital,
            "Consultation Fee": consultation_fee,
            "Recommendation": recommendation,
            "Patient Stories": patient_stories,
            "Availability": availability,
            "Profile Photo": profile_photo,
            "Profile Link": profile_link
        }

        # Store data in dictionary
        data.append({
            "Doctor Name": name,
            "Specialization": specialization,
            "Experience": experience,
            "Location": location,
            "City": city,
            "Hospital": hospital,
            "Consultation Fee": consultation_fee,
            "Recommendation": recommendation,
            "Patient Stories": patient_stories,
            "Availability": availability,
            "Profile Photo": profile_photo,
            "Profile Link": profile_link
        })

    page += 1  # Move to the next page
    time.sleep(2)  # Pause to avoid getting blocked

# Convert to DataFrame
df = pd.DataFrame(data)

# Save as CSV
df.to_csv("data/mumbai_doctors_data.csv", index=False)

print("Data scraping completed. Saved to doctors_data.csv successfully!")
