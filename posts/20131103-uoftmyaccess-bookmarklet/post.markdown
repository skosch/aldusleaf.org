This one is for students at the University of Toronto: the following bookmarklet
prepends the string <tt>http://myaccess.library.utoronto.ca/login?url=</tt> to
the current URL. This is useful whenever you are trying to access some journal article
via the publisher's website, but hit a paywall. Instead of venturing to <a
href="http://library.utoronto.ca">library.utoronto.ca</a> to use their abysmal
search to get a link to the paper that's already in front of you, just use this
bookmarklet. After asking for your UTORid and auto-redirecting several times, the
myaccess server will bring you directly to the article you were just looking at.

<pre>
javascript:(function(){window.location.assign('http://myaccess.library.utoronto.ca/login?url='+document.URL);})();
</pre>
