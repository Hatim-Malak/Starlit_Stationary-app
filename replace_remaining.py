import os
import re

files = [
    "Starlit_Stationary_frontend/src/Pages/CartPage.jsx",
    "Starlit_Stationary_frontend/src/Pages/OrderPage.jsx",
    "Starlit_Stationary_frontend/src/Pages/YourOrderPage.jsx",
    "Starlit_Stationary_frontend/src/Pages/SignInPage.jsx",
    "Starlit_Stationary_frontend/src/Pages/SignUpPage.jsx",
    "Starlit_Stationary_frontend/src/Pages/Contact_Us.jsx",
    "Starlit_Stationary_frontend/src/Pages/AdminOrders.jsx",
    "Starlit_Stationary_frontend/src/Pages/NewProduct.jsx",
    "Starlit_Stationary_frontend/src/Pages/UpdateProduct.jsx"
]

base_dir = "c:/Users/Hatim Malak/Desktop/E-commerce"

regex_replacements = [
    (r"divide-blue-100", "divide-accent"),
    (r"hover:bg-blue-800/50", "hover:bg-primary/50"),
    (r"hover:from-blue-700 hover:to-blue-800", "hover:from-secondary hover:to-primary"),
    (r"border-blue-500", "border-accent"),
    (r"focus:ring-blue-300", "focus:ring-accent"),
    (r"from-gray-50 to-blue-50", "from-warm to-warm-100"),
    (r"from-blue-400 to-blue-300", "from-secondary to-primary"),
    (r"text-blue-400", "text-secondary"),
    (r"text-blue-500", "text-secondary"),
    (r"text-blue-800", "text-primary"),
    (r"text-blue-[0-9]+", "text-primary"),
    (r"bg-blue-[0-9]+", "bg-primary"),
    (r"border-blue-[0-9]+", "border-accent"),
]

for file_path in files:
    full_path = os.path.join(base_dir, file_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        for old, new in regex_replacements:
            content = re.sub(old, new, content)
            
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Cleaned {file_path}")
