import os

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

replacements = [
    ("from-blue-700 via-blue-600 to-blue-800", "from-primary via-secondary to-primary"),
    ("from-blue-700 via-blue-600 to-blue-500", "from-primary via-secondary to-primary"),
    ("from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800", "from-primary to-secondary hover:from-secondary hover:to-primary"),
    ("from-blue-600 to-blue-700", "from-primary to-secondary"),
    ("hover:from-blue-600 hover:to-blue-700", "hover:from-primary hover:to-secondary"),
    ("from-blue-50 to-blue-100", "from-warm to-warm-100"),
    ("from-blue-700 to-blue-600", "from-primary to-secondary"),
    ("from-blue-100 via-blue-50 to-white", "from-warm-100 via-warm-50 to-warm"),
    
    # Specific color mappings
    ("bg-blue-600", "bg-primary"),
    ("bg-blue-700", "bg-primary"),
    ("bg-blue-50", "bg-warm"),
    ("bg-blue-100", "bg-warm-100"),
    ("bg-blue-400/20", "bg-accent/20"),
    ("hover:bg-blue-50", "hover:bg-warm-100"),
    ("hover:bg-blue-100", "hover:bg-warm-100"),
    
    ("text-blue-100", "text-accent"),
    ("text-blue-600", "text-primary"),
    ("text-blue-700", "text-primary"),
    ("hover:text-blue-700", "hover:text-primary"),
    ("hover:text-blue-600", "hover:text-secondary"),
    ("group-hover:text-blue-600", "group-hover:text-primary"),
    
    ("border-blue-200", "border-accent"),
    ("border-blue-300", "border-accent/50"),
    ("border-blue-100", "border-accent"),
    ("hover:border-blue-300", "hover:border-accent"),
    ("hover:border-blue-400", "hover:border-secondary"),
    ("border-blue-800", "border-primary-900"),
    ("border-blue-900", "border-primary-900"),
    
    ("ring-blue-500", "ring-secondary"),
    ("focus:ring-blue-600", "focus:ring-secondary"),
    ("focus:border-blue-600", "focus:border-secondary"),
    ("focus:border-blue-500", "focus:border-accent"),
    ("focus:ring-blue-100", "focus:ring-accent/20"),
    
    ("shadow-blue-200", "shadow-accent/30"),
]

base_dir = "c:/Users/Hatim Malak/Desktop/E-commerce"

for file_path in files:
    full_path = os.path.join(base_dir, file_path)
    if os.path.exists(full_path):
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        for old, new in replacements:
            content = content.replace(old, new)
            
        # Additional file-specific manual tweaks as requested in PLAN
        if "CartPage.jsx" in file_path:
            content = content.replace("border-2 border-accent/50", "border-2 border-accent/30")
        
        if "OrderPage.jsx" in file_path:
            content = content.replace("bg-gray-50", "bg-warm")
            
        if "SignInPage.jsx" in file_path or "SignUpPage.jsx" in file_path:
            content = content.replace("bg-gray-50", "bg-warm")
            content = content.replace("bg-white/10 backdrop-blur-sm border border-white/20", "bg-warm/15 backdrop-blur-sm border border-warm/30")
            
        if "Contact_Us.jsx" in file_path:
            pass

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"Not found: {file_path}")
