---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

A showcase of my engineering projects.

{% assign entries = site.posts | where: "blogid", "projects" %}
{% for post in entries %}
  {% include archive-single.html type="list" %}
{% endfor %}
