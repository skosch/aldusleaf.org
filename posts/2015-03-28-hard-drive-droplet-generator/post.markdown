<script type="text/javascript" src="js/katex/katex.min.js"></script>
<link rel="stylesheet" href="js/katex/katex.min.css"></link>
<script type="text/javascript">
  $(function() {
  $(".math, .tmath").each(function() {
    var texTxt = $(this).text();
    el = $(this).get(0);
    if(el.tagName == "DIV"){
        addDisp = "\\\\displaystyle{";
        addDispAfter = "}"
    } else {
        addDisp = "";
        addDispAfter = "";
    }
    try {
        katex.render(addDisp+texTxt+addDispAfter, el);
    }
    catch(err) {
        $(this).html("<span class='err'>"+err);
    }
  });
  $(".imath").each(function() {
    var texTxt = $(this).text();
    el = $(this).get(0);
    try {
        katex.render(texTxt, el);
    }
    catch(err) {
        $(this).html("<span class='err'>"+err);
    }
  });
  })
</script>
<figure>
<img src="{{path}}/finished.jpg" alt="Finished droplet generator, nozzle
inserted">
<figcaption>The finished droplet generator. Takes about two hours to build.</figcaption>
</figure>
This blog post is a mini-version of the paper <em>A
simple vibrating orifice monodisperse droplet generator using
a hard drive actuator arm,</em> written during my time in the <a
href="http://mussl.mie.utoronto.ca/">Ashgriz lab</a> in Toronto. It's been accepted
for publication in <a
href="http://scitation.aip.org/content/aip/journal/rsi">Review of Scientific
Instruments</a>.

<strong>Tools required:</strong> old hard drive (single-platter ones are
easier to work with!), wire, metal hack saw, soldering iron (probably,
though not strictly), a liquid supply, tubing.

<strong>Optional but recommended:</strong>
electric band saw, small piece of plastic sheet (e.g. acrylic or polycarbonate),
two or three small screws, drill press, epoxy glue, glass capillaries, audio jack,
audio cable, function generator, syringe pump, strobe light, magnifying glass,
lab stands.

<strong>For the nozzles:</strong> hypodermic needles, sand paper, a flame, epoxy
glue, glass capillary tubes.

<h2>Background</h2>
So you work in fluid mechanics and work with droplets. You're doing impact experiments, or
laser-based drop sizing, or aerosol studies, or something of that sort. In any
event, you need to make thousands of droplets that are all, say, exactly 350
microns in diameter. What are you going to do?

<ul>
<li>You could construct a liquid-filled chamber, and rely on some mechanism that pushes out exactly the
  desired amount of said liquid through a very thin nozzle. That's how inkjet printer cartridges do it. The
  simplest such mechanism is a piezoelectric element. Jiann Yang
&amp; friends, at NIST, have published a super-simple design (<a
href="http://www.nist.gov/el/fire_research/upload/Yang-A-Simple-Piezoele
ctric-Droplet-Generator.pdf">PDF</a>) that has inspired
countless grad students and hobby tinkerers (see the <a
href="http://forums.reprap.org/read.php?153,52959,page=0"><em>DIY
printhead</em> topic in the RepRap
forums</a>). Later, Hartmut Ulmke invented a <a
href="http://diogenes.iwt.uni-bremen.de/vt/laser/generator-photos.htm">s
imilar device</a> (although his device squeezes the nozzle, not the
chamber).<br><br> Piezo-based drop generation works very well.
Until it doesn't, of course. The nozzles get clogged, the crystals crack,
air bubbles get into your chamber, and to add injury to insult, you keep
zapping yourself by inadvertently touching the element.
</li> <li><em>Or,</em> if you don't need to control individual
droplets, you could take a very thin stream of water and lightly
shake it at a high frequency. If you do it right, the stream <a
href="http://en.wikipedia.org/wiki/Plateau%E2%80%93Rayleigh_instability"
>will break up into droplets of the desired size</a>. </li></ul>

Except, how do you go about the water-shaking part?

Well, you could go back to piezoelectric elements once more. And, in fact, you can buy
droplet-generating machines that do exactly that (the most popular design is
by Berglund and Liu; paper <a
href="http://pubs.acs.org/doi/abs/10.1021/es60074a001">here</a>).
But they're pricey: used specimens of <a
href="http://www.tsi.com/vibrating-orifice-aerosol-generator-3450/">TSI's
VOAG3450 model</a>, for instance, sell for US$2500 on eBay.

So, <a
href="http://rspa.royalsocietypublishing.org/content/royprsa/290/1423/54
7.full.pdf">for half a century</a> now, many of us have resorted to taking a needle
and shaking it with the cone of a speaker, because speakers are cheap. Now, the
problem is that depending on the liquid, the needle, and the droplet size you
need to produce, you get to listen to this all day:

<iframe width="220" height="165" src="https://www.youtube.com/embed/dimdySz8F0c" frameborder="0" allowfullscreen></iframe>

&hellip; at the volume of a typical domestic fire alarm. It's atrocious. 

Of course, there is <em>no</em> elegant way to mount a loudspeaker to an
experimental rig in the first place&mdash;let alone to attach
the needle to the speaker's cone. It will always be an embarassingly awkward
contraption, liable to fall apart any day (but particularly on the Friday
afternoon just before your paper is due).

So I spent a few days looking for alternative sources of vibration. Far and away
the best one is the rotary actuator that controls the sideways movement of the
read/write arm in a magnetic computer hard drive. 
<figure>
<img src="{{path}}/schematic.png" alt="Schematic of the hard drive actuator">
<figcaption>Exploded view of the actuator assembly. Top view of the whole hard
drive in the top left corner.</figcaption>
</figure>
It's straightforward: the arm pivots about an axis. At its tip sits the read/write sensor (which
you'll rip out); glued onto the other end is a flat area of copper wire wound into a
coil. That coil, sandwiched between two magnets, becomes magnetic itself once
you electrify it and instantaneously whips the arm to the side.
Reverse the current, and the arm flits to the other side. The actuator is
controlled by very precise servo electronics (which you'll rip out as well), and
it can move extremely fast&mdash;it has to, because modern hard drives spin at
7200RPM. You will apply an alternating current to the coil to make the arm
vibrate. In my experience, the arm will translate frequencies up to 17,000&nbsp;Hz
into movement without any problem, and probably beyond.

<h2>Construction and Operation</h2>
<figure>
<img src="{{path}}/numbers.jpg" alt="Numbered components of the hard drive">
<figcaption>A multi-platter hard drive after removing the cover and taking out
the connection board and the top magnet.</figcaption>
</figure>
You can make your own in a few hours, assuming you have an old hard drive lying
around somewhere. Here's the recipe:

1. Loosen every screw and pry open the cover.
2. Temporarily remove the top magnet, arm axis (1), arm (2), ribbon wires (3), circuit
   boards (4), and platters (5) such that only the base plate remains.
3. Cut out the corner of the base plate holding the axis bearing (i.e. saw along
   the dashed line).
4. Reinstall the arm and axis.
5. Remove the read/write head (6) and all of the wiring leading to it, along
   with any connected I/O and servo circuitry (4). If your model has a ribbon
   cable (3), be careful not to tear off the two strands powering the coil. You
   can rip the ribbon cable out, but make sure there are exposed terminals (7)
   to which you can solder new leads.
6. The wire strands and/or your solder connection will probably be very
   delicate. I epoxied them to an audio jack, which I glued into an acrylic
   cover plate that I bolted onto the base plate. The cover plate has the
   wonderful side effect of preventing me from accidentaly bending the arm. (See
   the photo at the top of this page.)


<h3>Making the nozzles</h3>
You can now stick your nozzle through one of the holes at the tip
of the arm. Oh, right. I haven't mentioned the nozzles. You can use
unmodified hypodermic needles, of course (and I'd recommend those with <a
href="http://en.wikipedia.org/wiki/Luer_taper">Luer fittings</a> to keep
them easily exchangeable). But it's even better to use a piece of glass
capillary, sanded and heated in a flame, which you can then glue into a
clipped hypodermic needle as shown here:

<figure>
<img src="{{path}}/needles.jpg" alt="Manufacthttps://www.facebook.com/uring the nozzles">
<figcaption>Above: assembly of nozzle from
low-gauge hypodermic syringe (Luer fitting) and capillary. Below: nozzle tip
fabrication, capillary from left to right: broken, sanded, heated in a flame (I.D.
200&nbsp;&mu;m), heated for longer (I.D. 25&nbsp;&mu;m, could be sanded down by about
200&nbsp;&mu;m), overheated (I.D. 0&nbsp;&mu;m).</figcaption>
</figure>

These things are ridiculously easy to make. You just have to buy the needles (I
used size 16G) and borosilicate capillary tubes, both of which are (almost literally) a dime a dozen.
The nozzles get clogged easily, especially when your orifices are very small and
even more so when you're using unfiltered tap water. But you can always pop the nozzle
onto a syringe and draw clean (or soap/CLR) water back through it to clean it
out.

<h3>Operation</h3>
Connect the coil to a function generator and dial in 50&nbsp;Hz at about 1&nbsp;V, and you should see and feel the arm
jitter lightly. (Don't have a function generator? Use a tool like <a
href="http://onlinetonegenerator.com/">onlinetonegenerator.com</a> and
plug the coil into your headphone jack.) 

Stick the nozzle through one of the small holes at the tip of the actuator arm,
and feed liquid into it. It's best to use something like a syringe
pump&mdash;you want to make sure you get a constant flow without pressure
fluctuations. Increase the flow rate such that the jet breaks up into random
droplets after a distance of about ten-ish orifice diameters. Now adjust the
frequency of the function generator. Whether or not your droplets are uniform is
easiest to see when looking at them through a magnifying glass and
against a strobe light. If you don't have one, blow against the stream:
if it deflects at a uniform angle, all droplets are of the same size.

A rough guideline that relates orifice diameter <span
class="math">D_o</span> and frequency <span class="math">f</span> to the
flow rate <span class="math">Q</span> is
<div class="math">
 3.5 \leq \frac{Q}{\pi f \left(\frac{D_o}{2}\right)^2} \leq 7.
</div>

How big are the droplets? Under stable conditions, each oscillation will result
in one droplet. So all we need to do is to divide the flow rate by the frequency
and to convert from volume to diameter, and we get
<div class="math">
D_d = \left(\frac{6Q}{\pi f}\right)^{(1/3)}
</div>

for the droplet diameter <span class="math">D_d</span>.

I had no problem at all making droplets between 100&nbsp;&mu;m and 1&nbsp;mm. I didn't try
making smaller or larger ones, though I see no reason why that shouldn't work.

Here is a chart with some frequency/flow rate combinations that worked for me.
<figure>
<img src="{{path}}/results.jpg" alt="Results">
<figcaption>Some of the frequency/flow rate combinations that produced uniform
droplets (&#9633;&nbsp;size as predicted by the equation above; &loz;&nbsp;size as
estimated from photograph). Photos shown are <span
class="math">D_d</span>=200&nbsp;&mu;m and 386&nbsp;&mu;m.</figcaption>
</figure>

<em>Note: if you build one of these things, it would make my day if you cited my
original article or linked to this page. Also, if you use the hard drive
actuator as a vibration source for another purpose, I'd love to know so I can
make a note of it here.</em>
<div class="tombstone">&#9753;</div>
