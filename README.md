# Tetrate Istio Distro Website
Website for Tetrate Istio Distro project (formerly GetIstio), build using Hugo

## Run Locally
1. Download and install [hugo](https://www.gohugo.io), version not less than v0.80.0. An **extended version** is required, so you may want to check how to install that for your machine's OS. Example, for [Linux](https://gohugo.io/getting-started/installing/#snap-package)
2. Fork this repo, clone it to your local machine 
3. Go to the cloned directory and run `npm install` to install PostCSS dependency (we use it to purge unused CSS)
4. Finally, to run the website in development mode, run the command:

```
hugo serve -D
```

>If you don't want to include drafts, drop the `-D` from the above command.

## Adding Content

All contents are written in markdown. You can add main category by creating a folder in `/content/{language_code}` directory. The main index page for that new category is a file named `_index.md`. To add child pages under that category, create additional folder in that category folder and add another `_index.md` file.

The website supports multiple languages and currently offers a choice of languages including:
- English: the `language_code` is `en`
- Chinese: the `language_code` is `zh`

As an example, to add a category named Installation in English, which contains 2 child pages named "Linux" and "MacOS", you need to add the following files and folders

- content
  - en
    - installation
      - linux
        - _index.md
      - macos
        - _index.md
      - _index.md

Take a look at other file in the `/content` directory to see example of required frontmatter.

To add blog content, just add markdown file in `/content/{language_code}/blog` directory.

#### Link ordering for Istio in Practice

The order of links in the sidebar is controlled by the `weight` property set in the `_index.md` file. Make sure you set the correct weight for any new content you add by checking the weight of the last item in the list, and incrementing it for the new content.

### Adding Code Snippet

To automatically add copy code button to a shell code snippet, specify `sh` as the language after the backticks in the code snippet. For example:

```sh
getmesh version
```

The copy code button is also enabled for YAML (`yaml`) and Go (`go`) code listings. You can add support for more in the `/assets/js/script.js` file. For example:

```
$('pre code.language-go')
  .parent()
  .append('<span class="copy-to-clipboard">copy</span>');
```

## Adding Event

To add Event, go to the `/content/community/event` directory and add a Markdown file there with the following frontmatter

```yaml
title: "Sample Event 1"
description: "This is description for Sample Event 1"
categories: "event"
image: "images/webinar_dummy.jpg"
eventLink: "http://meet.google.com/abc"
eventDate: 2021-03-04T09:00:00
pastEvent: false
```

The `image`, `eventLink` and `eventDate` will be used to feature this event in the site's homepage. If the event is finished, you can change the frontmatter `pastEvent` to `true`.

The event date should be provided in PST time zone. There are two shortcodes defined:

- `eventDate`: shows the event date as well as the link to convert time to other timezones
- `eventLink`: adds the event link to the page (uses the `eventLink` from frontmatter)

### Multiday Event

To add multiday event (events that starts and ends on different day), add a `eventEndDate` in the frontmatter to indicate the event end date. The `eventDate` frontmatter still acts as the event start date.

Example, to add an event that starts on 5th March and ends on 8th March, the following frontmatter will work:

```yaml
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

### Past Event

After an event is completed and a YouTube recording is available, you can update the `pastEvent` in that event's frontmatter to `true` and change the `eventLink` to that YouTube recording link. This will make that event appear in the Past Event section in Community page, as well as make the Watch Recording button appear, so that the website visitor can watch the event's recording.


## Adding Partnership Information

To add information about Tetrate Istio Distro partners, you can simply modify files in the following directories, with example given for a fictional partner named "Partner A":

- `content/en/partners/partner-a.md` -> this file holds the overview information about the partner. The required data in frontmatter has been annotated for detail
- `content/en/ecosystem-partners/partner-a` -> this directory holds the technical information that will be displayed in the docs section of the site. Technical documentation and tutorial can go here.
- `static/images` -> the partner's company logo and any images that are going to be displayed should go here.

## Auto-Generated Pages

The following pages of this website are auto-generated (see [here](https://github.com/tetratelabs/getmesh/blob/main/doc/gen.go)):

- /community/building-and-testing
- /community/contributing
- /community/release
- /getmesh-cli/reference

Be careful when modifying the contents of these pages in this repo as they will be lost whenever with the next GetMesh release. Also, if you're renaming the paths/URLs to those pages, make sure to [update the doc generation](https://github.com/tetratelabs/getmesh/blob/main/doc/gen.go) in the GetMesh repository.

## Contributing

To contribute code to this website, you can do the following:

1. Fork this repo
2. Commit signed changes to your fork
3. Submit a PR with those changes and ask for review
4. After the changes have been approved by the reviewer, you can merge it.
5. Happy contributing :)

Also, feel free to submit issue.
