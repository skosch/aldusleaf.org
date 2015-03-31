Four days ago, a colleague of mine appropriated the old Linux
box I wasn't using anymore. He needed to run Windows-based instrumentation
software, and I, basking in my smug confidence that all of my research code
was mirrored on Github, because *only an idiot wouldn't back things up*, put on
my most magnaminous, cavalier smile and said "sure man, go ahead and wipe it, I got
a copy of everything".

Of course, there was no copy.

I also didn't have a spare terabyte-sized hard drive lying around to pull an
image onto, for later file carving attempts. So I had to work from a USB-booted
Live Xubuntu and access the unmounted NTFS (previously ext4) partition directly.
Here's what I learned.

* SleuthKit/Autopsy are very popular. But unless I missed something, they require an
  image file, and that wasn't going to happen.
* PhotoRec ran briefly, but didn't produce anything useful, and then asked me
  whether I wanted to store the remaining (?) 950&nbsp;GB as an image file. No thank
  you.
* extundelete refused to run at all, because the partition was now NTFS.
* TestDisk (i.e. attempting to restore the ext4) was out of the question,
  because I couldn't risk ruining my colleague's Windows system.

Having exhausted the popular open source options, I searched on and found 
<a href="http://www.r-tt.com/free_linux_recovery/">R-Linux</a>, an obscure
freeware tool developed in Richmond Hill, Ontario, just a town over from here.
It has a pleasant GUI and, after scanning my hard drive overnight, it recognized
the old ext4 partition, starting exactly 986830848 sectors in.
<figure>
<img src="{{path}}/rlinux1.jpg" style="width:40em" alt="R-Linux showing the found ext4 partition">
<figcaption>R-Linux showing the old ext4 partition it found</figcaption>
</figure>

A double-click on said partition reveals all of the old inodes found on the
partition. You can open said inodes and look at their content&mdash;it's binary junk,
most of it; punctuated by the occasional image or text file. At any rate, it's
impossible to look through all of them by hand, and for some bizarre reason
R-Linux, in all its beauty, offers no way of searching through the inodes'
contents (at least the "Find/Mark" function doesn't appear to be doing that).

<figure>
<img src="{{path}}/rlinux2.jpg" alt="R-Linux showing the inodes on the drive"
style="width:40em">
<figcaption>R-Linux showing the inodes on the drive</figcaption>
</figure>

There is another, old-school way to search, though: grep. And it works suprisingly well:

<pre>
sudo dd if=/dev/sda2 skip=986830848 bs=512 count=937498624 | grep --text -A 1000 -B 10 'import numpy as np' | tee results
</pre>

First, we use `dd` to read out the raw bytes on `/dev/sda2`. We start at
sector 986830848, we specify a sector (here: block) to have a size `bs` of 512
bytes each, and we read out 937498624 sectors (all of those were given to us by R-Linux). The
output is piped to `grep --text`. The `-A` and `-B` arguments ask grep to spit
out not only the lines matching `import numpy as np` (I was looking for Python
code), but also 10 lines before
and 1000 lines after. Finally, `tee` lets us see the output on the screen, while
also saving it to a text file called `results`.

I recovered three of my five Python files this way. Some of them were found
several times over, in various garbled and outdated incarnations. Two of them
are lost, probably, forever. But that's okay. I suppose I had to learn my
lesson.

<div class="tombstone">&#9753;</div>
