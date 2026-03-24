# Quarks
**Quarks**, the undergraduate magazine of the Indian Institute of Science (IISc).

This repository contains the source code for the Quarks website, which is built using Jekyll, a static site generator. The website hosts a collection of stories, poems, photographs and more contributed by IISc students.

## Development

To set up the project locally and view changes before submitting them, you'll need to use Ruby and Bundler to run the Jekyll site.

### Prerequisites

- [Ruby](https://www.ruby-lang.org/en/documentation/installation/) (version 2.7.0 or higher recommended)
- [Bundler](https://bundler.io/) (installed via `gem install bundler`)

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Quarks-IISc-blog.git
   cd Quarks-IISc-blog
   ```

2. **Install dependencies:**
   Run the following command in the root directory to install all required Ruby gems listed in the `Gemfile`:

   ```bash
   bundle install
   ```

3. **Serve the website locally:**
   Start the local Jekyll development server:

   ```bash
   bundle exec jekyll serve
   ```

   The website will now be available locally at `http://127.0.0.1:4000/`. The server will automatically watch for file changes and rebuild the site (refresh your browser to see updates).

---

## Contributing

We welcome contributions from the IISc student community! Whether you want to publish a story, a poem, or a beautiful photograph, here is how you can contribute to Quarks.

### Submitting a New Post

All articles and pictures are stored as Markdown (`.md`) files inside the `_posts/` directory.

#### Method 1: Using the Python Script

You can use the provided Python script to easily scaffold a new post:

```bash
python _posts/Create_Post.py
```

It will prompt you for the title, categories, and content, and will automatically generate a correctly formatted Markdown file in the `_posts/` folder.

#### Method 2: Manual Creation

1. Create a new `.md` file inside the `_posts/` directory.
2. The filename **must** follow the format: `YYYY-MM-DD-title-of-post.md` (e.g., `2026-03-01-my-first-poem.md`).
3. Add the required YAML "Front Matter" at the very top of your file:

**For a Story or Poem:**

```yaml
---
layout: post
title: "The Title of Your Piece"
author: "Your Full Name"
categories: stories # use 'poems' for poetry
image: "/assets/images/Stories/your-image.jpg" # optional cover image
---
Your content goes here...
```

**For a Picture (Gallery):**

```yaml
---
layout: post
title: "Title of the Photograph"
author: "Photographer Name"
categories: pictures
image: "/assets/images/Pictures/your-photo.jpg"
description: "A short description of the photograph."
---
```

### Publishing Process

1. **Fork the repository** to your own GitHub account.
2. Create a new branch for your post: `git checkout -b new-post-title`
3. Add your Markdown file to `_posts/` and any accompanying images to `assets/images/Stories/`, `assets/images/Poems/`, or `assets/images/Pictures/`.
4. Run `bundle exec jekyll serve` locally to make sure your post looks great!
5. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Add new post: [Your Post Title]"
   git push origin new-post-title
   ```
6. **Open a Pull Request (PR)** against the main repository. The Quarks editorial team will review your submission and merge it!

