# getistio.io
Website for GetIstio project. This supersedes previous project as we move from Gatsby to Hugo.

## Run Locally
1. Download and install [hugo](https://www.gohugo.io)
2. Fork this repo, clone it to your local machine 
3. Go to the cloned directory and run

```
hugo serve -D
```

## Adding Content

All contents are written in markdown. You can add main category by creating a folder in `/content` directory. The main index page for that new category is a file named `_index.en.md` (for English page). To add child pages under that category, create additional folder in that category folder and add another `_index.en.md` file.

As an example, to add a category named Installation, which contains 2 child pages named "Linux" and "MacOS", you need to add the following files and folders

- content
  - Installation
    - Linux
      - _index.en.md
    - MacOS
      - _index.en.md
    - _index.en.md

Take a look at other file in the `/content` directory to see example of required frontmatter.

To add blog content, just add markdown file in `/content/blog` directory.

### Adding Code Snippet

To automatically add copy code button to a shell code snippet, specify sh as the language after the backticks in the code snippet. For example:

```sh
getistio version
```

## Adding Event

To add Event, go to the `/content/community/event` directory and add a Markdown file there with the following frontmatter

```
title: "Sample Event 1"
date: 2018-12-29T11:02:05+06:00
description: "This is description for Sample Event 1"
categories: "event"
image: "images/webinar_dummy.jpg"
eventLink: "http://meet.google.com/abc"
eventDate: 2021-01-29
pastEvent: false
```

The `image`, `eventLink` and `eventDate` will be used to feature this event in the site's homepage. If the event is finished, you can change the frontmatter `pastEvent` to `true`.

## Multiday Event

To add multiday event (events that starts and ends on different day), add a `eventEndDate` in the frontmatter to indicate the event end date. The `eventDate` frontmatter still acts as the event start date.

Example, to add an event that starts on 5th March and ends on 8th March, the following frontmatter will work:

```
title: "Sample Event 1"
date: 2018-12-29T11:02:05+06:00
description: "This is description for Sample Event 1"
categories: "event"
image: "images/webinar_dummy.jpg"
eventLink: "http://meet.google.com/abc"
eventDate: 2021-03-05
eventStartDate: 2021-03-08
pastEvent: false
```