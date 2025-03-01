import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# Base URL
BASE_URL = "https://www.practo.com/mumbai/doctors?page={}"

# Headers to mimic a browser visit
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

data = []
page = 1
empty_specialization_count = 0  # Counter for missing specializations
MAX_RETRIES = 5  # Number of retries before giving up

while True:
    print(f"Scraping page {page}...")

    retries = 0
    while retries < MAX_RETRIES:
        try:
            response = requests.get(BASE_URL.format(page), headers=HEADERS, timeout=10)
            if response.status_code != 200:
                print(f"Failed to fetch page {page}, status code: {response.status_code}")
                break
            break  # Success, exit retry loop
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            retries += 1
            time.sleep(5)  # Wait before retrying

    if retries == MAX_RETRIES:
        print(f"Skipping page {page} after {MAX_RETRIES} retries.")
        break  # Exit the loop if retries exhausted

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

        # FIXED: Specialization extraction
        try:
            specialization_element = card.find("div", class_="u-grey_3-text")
            specialization = specialization_element.find("span").text.strip() if specialization_element else None
        except AttributeError:
            specialization = None

        if not specialization:
            empty_specialization_count += 1  # Count missing specializations

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
            profile_photo_tag = card.find("img", {"data-qa-id": "doctor_profile_photo"})
            profile_photo = profile_photo_tag["src"] if profile_photo_tag else None
        except (AttributeError, TypeError):
            profile_photo = None

        try:
            profile_link_tag = card.find("a", href=True)
            profile_link = "https://www.practo.com" + profile_link_tag["href"] if profile_link_tag else None
        except (AttributeError, TypeError):
            profile_link = None


        a = {
            "Doctor Name": name,
            "Specialization": specialization,
            "Experience": experience,
            "Location": location,
            "City": city,
            "Hospital": hospital,
            "Consultation Fee": consultation_fee,
            "Profile Photo": profile_photo,
            "Profile Link": profile_link
        }
        print(a)


        # Store data in dictionary
        data.append({
            "Doctor Name": name,
            "Specialization": specialization,
            "Experience": experience,
            "Location": location,
            "City": city,
            "Hospital": hospital,
            "Consultation Fee": consultation_fee,
            "Profile Photo": profile_photo,
            "Profile Link": profile_link
        })

    # Print the count of missing specializations after each page
    print(f"Page {page} scraped. Total empty specializations so far: {empty_specialization_count}")

    # Save after every page
    df = pd.DataFrame(data)
    df.to_csv("doctors_data_fixed.csv", index=False)
    print(f"Saved data after page {page}.")

    page += 1  # Move to the next page
    time.sleep(2)  # Pause to avoid getting blocked

print("Data scraping completed!")
print(f"Total empty specialization fields: {empty_specialization_count}")
