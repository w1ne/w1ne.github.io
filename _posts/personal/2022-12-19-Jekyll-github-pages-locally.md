---
layout: single
title: Jekyll Github-pages locally in Ubuntu 22.04
blogid: personal
sticky: false
published: true
author: Andrii Shylenko
date: 2022-12-30
tags: [linux, Jekyll, blog, GitHub, programming, Ruby]
---
I'm an enthusiastic admirer of Jekyll, which I use for all my static websites and this blog. The official GitHub documentation doesn't help much as a guide to running Jekyll on my local machine. Here is how to run it in Ubuntu 22.04.

1. Install Ruby.
```console
sudo apt install ruby-full
```

2. Configure gems to ne stored in user home folder.
For bash use .bashrc (for zsh, we would use .zshrc)
```
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

3. Install Bundler
```console
gem install bundler
```

4. You need to have a Gemfile in your website root folder to continue, here is mine as an example.
```
source "https://rubygems.org"
git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }
gem "github-pages"
gem "jekyll"
gem "jekyll-theme-architect"
gem "webrick", "~> 1.7"
```

4. Install dependencies.
```console
bundle install
```


5. Run the server.
```console
bundle exec jekyll serve
```
