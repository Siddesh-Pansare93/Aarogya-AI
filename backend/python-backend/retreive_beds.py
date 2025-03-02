import pandas as pd

def filter_hopitals(csv_file, locations):
    # Load the CSV file
    df = pd.read_csv(csv_file)

    # Ensure all values in 'Location' and 'Specialization' are strings and fill NaNs
    df["Location"] = df["Location"].astype(str).str.lower().fillna("")

    # Convert input lists to lowercase
    locations = [loc.lower() for loc in locations]

    # Use .str.contains() safely to avoid NaN errors
    location_mask = df["Location"].apply(lambda x: any(loc in x for loc in locations) if isinstance(x, str) else False)

    # Apply filters
    filtered_df = df[location_mask]

    return filtered_df.to_json(orient="records", indent=4)  # Convert to JSON format

def get_beds(locations):
    csv_file = "data/updated_mumbai_hospitals.csv"  # Replace with your actual file
    return filter_hopitals(csv_file, locations)

if __name__ == "__main__":
    # csv_file = "data/mh_hospitals_beds.csv"  # Replace with your actual file
    csv_file = "data/updated_mumbai_hospitals.csv"  # Replace with your actual file
    locations = ["kurla west", "kurla east"]  # Adjusted to match variations

    filtered_json = filter_hopitals(csv_file, locations)

    # Print the JSON result
    print(filtered_json)
