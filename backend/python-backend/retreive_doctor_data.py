import pandas as pd

def filter_doctors(csv_file, locations, specializations):
    # Load the CSV file
    df = pd.read_csv(csv_file)

    # Ensure all values in 'Location' and 'Specialization' are strings and fill NaNs
    df["Location"] = df["Location"].astype(str).str.lower().fillna("")
    df["Specialization"] = df["Specialization"].astype(str).str.lower().fillna("")

    # Convert input lists to lowercase
    locations = [loc.lower() for loc in locations]
    specializations = [spec.lower() for spec in specializations]

    # Use .str.contains() safely to avoid NaN errors
    location_mask = df["Location"].apply(lambda x: any(loc in x for loc in locations) if isinstance(x, str) else False)
    specialization_mask = df["Specialization"].apply(lambda x: any(spec in x for spec in specializations) if isinstance(x, str) else False)

    # Apply filters
    filtered_df = df[location_mask & specialization_mask]

    return filtered_df.to_json(orient="records", indent=4)  # Convert to JSON format

def get_doctors(locations, specializations):
    csv_file = "data/mumbai_doctors_data.csv"  # Replace with your actual file
    return filter_doctors(csv_file, locations, specializations)

if __name__ == "__main__":
    csv_file = "data/mumbai_doctors_data.csv"  # Replace with your actual file
    locations = ["Kandivali", "Mahim"]  # Adjusted to match variations
    specializations = ["General Physician", "Gynecologist"]

    filtered_json = filter_doctors(csv_file, locations, specializations)

    # Print the JSON result
    print(filtered_json)
