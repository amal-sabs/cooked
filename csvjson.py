import csv
import json
import re

input_file = "recipes.csv"
output_file = "recipes.json"

def clean_list_field(text):
    """Convert comma-separated string into list"""
    if not text:
        return []
    return [item.strip() for item in text.split(",") if item.strip()]

def clean_directions(text):
    """Convert multiline directions into list of steps"""
    if not text:
        return []
    steps = re.split(r'\n+', text)  # split on blank lines
    return [step.strip() for step in steps if step.strip()]

def clean_nutrition(text):
    """Convert nutrition string into dictionary (basic parsing)"""
    if not text:
        return {}
    
    parts = text.split(",")
    nutrition_dict = {}
    
    for part in parts:
        part = part.strip()
        if part:
            key_value = part.split(" ", 1)
            if len(key_value) == 2:
                key, value = key_value
                nutrition_dict[key] = value
    
    return nutrition_dict

recipes = []

with open(input_file, mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)

    for row in reader:
        # Skip completely empty rows
        if not any(row.values()):
            continue

        recipe = {}

        # Remove the index column if it exists
        row.pop("", None)

        # Basic fields
        recipe["recipe_name"] = row.get("recipe_name")
        recipe["prep_time"] = row.get("prep_time")
        recipe["cook_time"] = row.get("cook_time")
        recipe["total_time"] = row.get("total_time")
        recipe["servings"] = row.get("servings")
        recipe["yield"] = row.get("yield")
        recipe["rating"] = float(row["rating"]) if row.get("rating") else None
        recipe["url"] = row.get("url")
        recipe["cuisine_path"] = row.get("cuisine_path")
        recipe["image"] = row.get("img_src")

        # Clean complex fields
        recipe["ingredients"] = clean_list_field(row.get("ingredients"))
        recipe["directions"] = clean_directions(row.get("directions"))
        recipe["nutrition"] = clean_nutrition(row.get("nutrition"))

        recipes.append(recipe)

# Save JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(recipes, f, indent=2, ensure_ascii=False)