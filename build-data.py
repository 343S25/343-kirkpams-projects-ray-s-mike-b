import os
import csv
import json

input_folder = 'src/data/providers'  # Replace with your folder path
output_file = 'src/data/providers.json'

results = []

try:
    # Read providers.csv for provider metadata
    providers_file = os.path.join(input_folder, 'providers.csv')
    providers = {}
    with open(providers_file, mode='r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            providers[row['name']] = {
                'name': row['name'],
                'website': row['website'],
                'logo': row['logo'],
                'plans': []
            }

    # Read individual provider plan files
    for provider_name in providers.keys():
        plan_file = os.path.join(input_folder, f"{provider_name.lower()}.csv")
        if os.path.exists(plan_file):
            with open(plan_file, mode='r', encoding='utf-8') as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    if (row['Plan Name'] == ""):
                        row['Plan Name'] = f'{row['CPUS']}-{row['CPU Type']}-{row['Memory']}GB'
                    providers[provider_name]['plans'].append(row)

    # Convert providers dictionary to a list
    results = list(providers.values())

    # Write the structured JSON to the output file
    with open(output_file, mode='w', encoding='utf-8') as json_file:
        json.dump(results, json_file, indent=2)

    print(f'JSON file created successfully: {output_file}')

except Exception as e:
    print(f'Error: {e}')
