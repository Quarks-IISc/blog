import datetime
import os

# Path to the _posts folder
POSTS_DIR = "_posts"

# Ensure the _posts folder exists
if not os.path.exists(POSTS_DIR):
    os.makedirs(POSTS_DIR)

# Prompt for post details
title = input("Enter the post title: ")
date = datetime.datetime.now().strftime("%Y-%m-%d")
filename = f"{POSTS_DIR}/{date}-{title.replace(' ', '-').lower()}.md"

categories = input("Enter categories (comma-separated, optional): ")
content = input("Enter the post content: ")

# Create the Markdown content
markdown_content = f"""---
layout: post
title: "{title}"
date: {date}
categories: [{categories}]
author: Your Name
---

{content}
"""

# Write the Markdown content to a file
try:
    with open(filename, "w") as file:
        file.write(markdown_content)
    print(f"Post created successfully! File saved at: {filename}")
except Exception as e:
    print(f"An error occurred: {e}")
