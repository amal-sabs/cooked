import json
import re
from typing import List, Dict

def update_template_directions_from_original():
    """
    Replace only the directions in recipes_template.json with those from recipes.json, matching by recipe_name.
    """
    with open("recipes.json", "r", encoding="utf-8") as f:
        original = json.load(f)
    with open("recipes_template.json", "r", encoding="utf-8") as f:
        templated = json.load(f)
    # Build a mapping from recipe_name to directions
    directions_map = {r["recipe_name"]: r["directions"] for r in original if "recipe_name" in r and "directions" in r}
    for recipe in templated:
        name = recipe.get("recipe_name")
        if name in directions_map:
            recipe["directions"] = directions_map[name]
    with open("recipes_template.json", "w", encoding="utf-8") as f:
        json.dump(templated, f, indent=2, ensure_ascii=False)

# Helper to extract amount, unit, and name from ingredient string
def parse_fraction(amount_str):
    # Handles unicode fractions, mixed numbers, fractions, and decimals
    unicode_fractions = {
        '¼': 0.25,
        '½': 0.5,
        '¾': 0.75,
        '⅐': 1/7,
        '⅑': 1/9,
        '⅒': 0.1,
        '⅓': 1/3,
        '⅔': 2/3,
        '⅕': 0.2,
        '⅖': 0.4,
        '⅗': 0.6,
        '⅘': 0.8,
        '⅙': 1/6,
        '⅚': 5/6,
        '⅛': 0.125,
        '⅜': 0.375,
        '⅝': 0.625,
        '⅞': 0.875
    }
    amount_str = amount_str.strip()
    # Replace unicode fractions with their float equivalents
    for uf, val in unicode_fractions.items():
        if uf in amount_str:
            if amount_str == uf:
                return val
            # Mixed number, e.g. '1½'
            amount_str = amount_str.replace(uf, f' {uf}')
    # Now handle mixed numbers with unicode fractions
    parts = amount_str.split()
    total = 0.0
    for part in parts:
        if part in unicode_fractions:
            total += unicode_fractions[part]
        elif '/' in part:
            try:
                num, denom = part.split('/')
                total += float(num) / float(denom)
            except Exception:
                pass
        else:
            try:
                total += float(part)
            except Exception:
                pass
    if total > 0:
        return total
    try:
        return float(amount_str)
    except Exception:
        return amount_str  # fallback: return as string

def parse_ingredient(ingredient: str):
    # Try to match: amount [unit] name, including unicode fractions
    match = re.match(r"^([\d\s/\.¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]+)\s*([a-zA-Z]+)?\s*(.*)$", ingredient)
    if match:
        amount = match.group(1).strip()
        unit = match.group(2) if match.group(2) else None
        name = match.group(3).strip() if match.group(3) else None
        parsed_amount = parse_fraction(amount) if amount else None
        return {"name": name, "amount": parsed_amount, "unit": unit}
    # fallback: no amount/unit
    return {"name": ingredient, "amount": None, "unit": None}

# Helper to replace ingredient mentions in directions with template variables
def template_directions(directions: List[str], ingredients: List[Dict]):
    templated = []
    for step in directions:
        for idx, ing in enumerate(ingredients):
            if ing["name"]:
                # Build template variable: ${amountIng1} ${unitIng1} ${nameIng1}
                var_parts = []
                var_parts.append(f"${{amountIng{idx+1}}}")
                if ing["unit"]:
                    var_parts.append(f"${{unitIng{idx+1}}}")
                var_parts.append(f"${{nameIng{idx+1}}}")
                template_var = ' '.join(var_parts).replace('  ', ' ').strip()
                # Replace ingredient name with template variable
                # DOESNT WORK WELL, (exp if you have all purpose flour as the name of the ingredient, but directions say flour)
                pattern = re.compile(rf"(?<!\\w){re.escape(ing['name'])}(?!\\w)", re.IGNORECASE)
                step = pattern.sub(template_var, step)
        templated.append(step)
    return templated

def convert_recipe(recipe):
    # Parse ingredients
    parsed_ingredients = [parse_ingredient(ing) for ing in recipe.get("ingredients", [])]
    # Template directions
    templated_directions = template_directions(recipe.get("directions", []), parsed_ingredients)
    # Add template variable names for each ingredient
    for idx, ing in enumerate(parsed_ingredients):
        ing["template_amount_var"] = f"amountIng{idx+1}"
        ing["template_unit_var"] = f"unitIng{idx+1}" if ing["unit"] else None
        ing["template_name_var"] = f"nameIng{idx+1}"
    # Add a template_vars mapping for dynamic use in code
    template_vars = {}
    for idx, ing in enumerate(parsed_ingredients):
        template_vars[f"amountIng{idx+1}"] = ing["amount"]
        template_vars[f"unitIng{idx+1}"] = ing["unit"]
        template_vars[f"nameIng{idx+1}"] = ing["name"]
    # Build new recipe
    new_recipe = dict(recipe)
    new_recipe["ingredients"] = parsed_ingredients
    new_recipe["directions"] = templated_directions
    new_recipe["template_vars"] = template_vars
    return new_recipe

def main():
    with open("recipes.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    # Assume data is a list of recipes
    new_data = [convert_recipe(recipe) for recipe in data]
    with open("recipes_template.json", "w", encoding="utf-8") as f:
        json.dump(new_data, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    # main()  
    update_template_directions_from_original()  # i gave up on getting the ingredients dynamically in the instructions
