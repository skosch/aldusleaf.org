# coding: utf8

from jinja2 import Environment, FileSystemLoader
import os
import markdown
import csv
import datetime
import time
import codecs

env = Environment(loader=FileSystemLoader('templates'))


# content is a list of blogentries
homecontent = ""

# Render post pages
template = env.get_template('post.html')

postdirs = next(os.walk('./posts'))[1]
postdirs += ['../crimson', '../about']
#postfiles = [each for each in os.listdir('./posts') if each.endswith('.markdown') and not each.startswith('desc-')]
postdirs.sort(reverse=True) # most recent dates first
for f in postdirs:
  with open(os.path.join("./posts", f, "desc.csv")) as descf:
    postdict = dict(csv.reader(descf, delimiter=','))

  # now descdict contains all the info. Add the post content
  input_file = codecs.open(os.path.join("./posts", f, "post.markdown"),"r", encoding="utf-8")
  text = input_file.read()

  postdict['post_content'] = markdown.markdown(text, output_format="html5")
  postdict['post_content'] = postdict['post_content'].replace("{{path}}", os.path.join("posts/", f))
  # add date generated
  postdict['dategenerated'] = datetime.datetime.now().strftime("%Y-%m-%d")

  if f=="../crimson" or f=="../about":
    with open(os.path.join('./posts/', f) + ".html", "wb") as of:
      of.write(template.render(postdict))
  else:
    with open(os.path.join('./' , f) + ".html", "wb") as of:
      of.write(template.render(postdict))
    entrytemplate = env.get_template('postentry.html')
    homecontent += entrytemplate.render(postdict)

# Render home page
template = env.get_template('home.html')
with open('./index.html', "wb") as of:
  of.write(template.render(home_content = homecontent))


