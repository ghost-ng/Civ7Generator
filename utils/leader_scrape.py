import os
import requests
from bs4 import BeautifulSoup
import zipfile

# URL of the Civilization VII Leaders page
url = "https://civilization.2k.com/civ-vii/game-guide/leaders/"

# Create a directory to store the images
folder_name = "Civ7_Leader_Images"
os.makedirs(folder_name, exist_ok=True)

# Fetch the HTML content of the page
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# Find all image elements associated with leaders
img_tags = soup.find_all("img", class_="bc-news-tile__thumb__img")

# Extract and download each image
for img in img_tags:
    img_url = img.get("src")
    if img_url:
        # Ensure the URL is absolute
        if img_url.startswith("//"):
            img_url = "https:" + img_url
        elif not img_url.startswith("http"):
            img_url = url + img_url

        # Extract the image filename
        img_name = os.path.basename(img_url)

        # Download the image
        img_data = requests.get(img_url).content
        with open(os.path.join(folder_name, img_name), "wb") as img_file:
            img_file.write(img_data)
        print(f"Downloaded {img_name}")

print("All images have been downloaded.")

# Compress the images into a ZIP file
zip_filename = f"{folder_name}.zip"
with zipfile.ZipFile(zip_filename, 'w') as zipf:
    for root, _, files in os.walk(folder_name):
        for file in files:
            zipf.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), folder_name))

print(f"Images have been compressed into {zip_filename}")
