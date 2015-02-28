/* --------- VARIABLES ----------- */

var ex1stat = 0;
var ex2stat = 0;

/* --------- JOB POSITIONS --------- */

batchp = 0.8;
batchs = 1.4;
batchc = "#adadad";

j00k = [5, 2, 1, 3, 0, 7, 4, 6];
straightorder = [0, 1, 2, 3, 4, 5, 6, 7];
j11k = [0, 1, 2, 3, 4, 5, 6, 7];
j11o = straightorder
j12k = [0, 1, 2, 2, 0, 1, 6, 7];
j12o = straightorder

j22k = [0, 1, 2, 3, 4, 2, 6, 7];
j22o = straightorder;
j23k = [0, 1, 5, 3, 4, 5, 6, 7];
j23o = [0, 1, 5, 3, 4, 2, 6, 7];
j24k = [0, 1, 3, 3, 4, 5, 6, 7];
j24o = [0, 1, 3, 2, 4, 5, 6, 7];
j25k = [0, 1, 2, 2, 4, 5, 6, 7];
j25o = straightorder;

j32k = [0, 1, 1, 3, 4, 5, 6, 7];
j32o = straightorder;
j33k = [0, 1, 1, 3, 4, 2, 6, 7];
j33o = straightorder;

j42k = [0, 0, 2, 3, 4, 2, 6, 7];
j42o = straightorder;

ex1exp = ["All jobs, labelled alphabetically and chromatically in the order of their due dates, which are shown in the bottom left corners.",
  "One optimal solution. Dotted lines demarcate batches. Note that there are a few empty batches&mdash;the reason for this will become clear later.",
  "A job's horizontal extent in this kind of diagram represents its processing time, e.g. the minimum time the part must spend in the oven.",
  "The vertical dimension represents its physical size.",
  "We will use capital letters to refer to the due dates and processing times of entire batches. Here, the batch processing time equals the processing time of job D."];

ex2exp = ["Let's start with a single-EDD schedule and play around with the jobs.",
  "Say we move job F into a batch with job C. This works fine: EDD isn't violated. Note that job F's original batch is now empty.",
  "Alright, let's undo that again, and go the other way. We can move job C into job F's batch, but &hellip;",
  "&hellip; EDD would be violated! Note that job E's batch is now due <em>after</em> job F's batch.",
  "So let's not do that. But would moving jobs into later-scheduled batches <em>always</em> lead to EDD violations?",
  "Yes, it would, except when&mdash;like here&mdash;the due dates are the same. But in those cases, we might as well &hellip;",
  "&hellip; schedule it the other way around&mdash;it won't make a difference in terms of maximum lateness, anyway."];

ex3exp = ["Let's once again start with a single-EDD schedule.",
  "Let's make a move; say we'll take job C and put it into job B's batch. So far, so good.",
  "That makes job B the host, and job C the guest.",
  "We might now try to move job F into the vacant batch, but for obvious reasons that would violate EDD.",
  "Job F is a guest in a host-less batch, and we can't allow that!"];

ex4exp = ["In the single-EDD schedule, all batches' lateness values are known.",
  "After moving job F into an earlier batch, the completion time (and thus lateness) of the final three batches has been reduced by the processing time of job F (i.e. 18). At the same time &hellip;",
  "&hellip; the batch of job C now takes longer than before, due to the new guest job. All batches except for the first two will experience an additional delay of 18 - 6 = 12.",
  "Let's try that again: we could move job B into the first batch. That will introduce a reduction of 17, and &hellip;",
  "&hellip; an extra delay of 12-2 = 15. The resulting batch lateness values for this schedule are shown in the bottom line of the table below."];

/* ---------- JOB SETUP FUNCTIONS ---------*/
function setupJobs(exn, s, p, c, d, bs, bp, bc) {
  // first, create the axes
  $("#ex" + exn).append("<div class='exax'></div> <!-- ARROW GRAPHIC --> <div style='position:absolute; bottom: -1.45em;'> <svg width='120em' height='4em' viewbox='0 -2 120 2'> <defs> <marker id='arrow' markerWidth='6.5' markerHeight='6.5' refx='1' refy='3' orient='auto'> <path d='M1,0.5 L1,5 L5,3 L1,1' style='fill:grey;' /> </marker> </defs> <path d='M0,0 L112,0' style='stroke:grey; stroke-width: 0.4; fill: none; marker-end: url(#arrow);' /> </svg>  ");
  // first, create the job objects and batch objects
  for(var j = 0; j<s.length; j++) {
    $("#ex" + exn).append("<div id='ex" + exn + "j" + j + "' class='exj'><span>" + d[j] + "</span></div>");
    if(p[j] > 2) {
    $("#ex" + exn + "j" + j).append("<div class='exl'><span>" + String.fromCharCode(65.0+j) + "</span></div>");
    }
  }
  for(var j = 0; j<s.length+1; j++) {
    $("#ex" + exn).append("<div id='ex" + exn + "b" + j + "' class='exb'></div>");
  }

  // set up the job and batch heights, widths and colors
  for(var j = 0; j<s.length; j++) {
    $("#ex" + exn + "j" + j).css({width: p[j] + "em", height: s[j] + "em", backgroundColor: c[j]});
  }
  for(var b = 0; b<bp.length; b++) {
    $("#ex" + exn + "b" + b).css({width: bp[b] + "em", height: bs[b] + "em", backgroundColor: bc[b]});
  }
}

function arrangeJobs(exn, s, p, bp, kr, animate, order, outoforder) {
  outoforder = (typeof outoforder === "undefined") ? false : outoforder;
  // position the jobs

  var curLeft = 0;
  for(var k = 0; k<kr.length; k++) {
    // go through all the batches
    var curBottom = 0;
    var Pk = 0;
    
    // now add the batch marker
    if(!outoforder) {
      style = {left: curLeft + "em", bottom: "0em"};
      if(animate) {
        $("#ex" + exn + "b" + k).animate(style);
      } else {
        $("#ex" + exn + "b" + k).css(style);
      }
    }
    // add the relevant jobs to this batch
    for(var oj=0; oj<kr.length; oj++) {
      var j = order[oj];
      if(kr[j]==k) {
        if(outoforder) {
          curBottom = [12,8,18,-2,16,3,6,2][kr[j]];
          bp =        [0,6,5,-5,-3,-10,10,3][kr[j]];
        }
        style = {left: (bp + curLeft) + "em", bottom: curBottom + "em"};
        curBottom += s[j];
        Pk = Math.max(Pk, p[j]);
        if(animate) {
          $("#ex" + exn + "j" + j).animate(style);
        } else {
          $("#ex" + exn + "j" + j).css(style);
        }
      }
    }
    
    // also, add the last batch marker if this is the last batch
    if(k == kr.length - 1 && !outoforder) {
      style = {left: (bp + curLeft + Pk) + "em", bottom: "0em"};
      if(animate) {
        $("#ex" + exn + "b" + (k+1)).animate(style);
      } else {
        $("#ex" + exn + "b" + (k+1)).css(style);
      }
    }

    // now update curLeft and curBottom:
    curLeft += (Pk + bp);
    curBottom = 0;
  }
}

/* ----------- ON DOCUMENT LOAD ---------- */
$(function() {
  // replace all <span class="Lmax"></span> with the right Lmax
  $(".Lmax").html("<em>L</em><sub style='font-size:75%'>max</sub>");
  $(".Lksingle").html("<em>L</em><sub style='font-size:75%'><em>k</em>,single</sub>");
  $(".xkk").html("<em>x</em><sub style='font-size:75%'><em>kk</em></sub>");
  $(".pk").html("<em>p</em><sub style='font-size:75%'><em>k</em></sub>");
  $(".Lk").html("<em>L</em><sub style='font-size:75%'><em>k</em></sub>");
  loadExample1();
  loadExample2();
  loadExample3();
  loadExample4();
  loadExample5();

  var ex1s = 0;
  var ex2s = 0;
  var ex3s = 0;
  var ex4s = 0;

  $("#ex1a1").hide();
  $("#ex1a2").hide();
  $("#ex1a3").hide();
  $("#ex4f1").css("visibility", "hidden");
  $("#ex4f2").css("visibility", "hidden");
  $("#ex4f3").css("visibility", "hidden");
  $("#ex4f4").css("visibility", "hidden");
  
  $("#ex1exp").html(ex1exp[ex1s]);
  $("#ex2exp").html(ex2exp[ex2s]);
  $("#ex3exp").html(ex2exp[ex2s]);
  $("#ex4exp").html(ex2exp[ex2s]);

  $("#ex1next").click(function() {
    if(ex1s < 4) {
      ex1s++;
      $("#ex1exp").html(ex1exp[ex1s]);
      nextSlide("ex1f" + ex1s);
    }
  });
  $("#ex1prev").click(function() {
    if(ex1s > 1){ 
      prevSlide("ex1f" + ex1s);
      ex1s--;
      $("#ex1exp").html(ex1exp[ex1s]);
    }
  });
  $("#ex2next").click(function() {
    if(ex2s < 6) {
      ex2s++;
      nextSlide("ex2f" + ex2s);
      $("#ex2exp").html(ex2exp[ex2s]);
    }
  });
  $("#ex2prev").click(function() {
    if(ex2s > 0){ 
      prevSlide("ex2f" + ex2s);
      ex2s--;
      $("#ex2exp").html(ex2exp[ex2s]);
    }
  });
    $("#ex3next").click(function() {
    if(ex3s < 4) {
      ex3s++;
      nextSlide("ex3f" + ex3s);
      $("#ex3exp").html(ex3exp[ex3s]);
    }
  });
  $("#ex3prev").click(function() {
    if(ex3s > 0){ 
      prevSlide("ex3f" + ex3s);
      ex3s--;
      $("#ex3exp").html(ex3exp[ex3s]);
    }
  });
    $("#ex4next").click(function() {
    if(ex4s < 4) {
      ex4s++;
      nextSlide("ex4f" + ex4s);
      $("#ex4exp").html(ex4exp[ex4s]);
    }
  });
  $("#ex4prev").click(function() {
    if(ex4s > 0){ 
      prevSlide("ex4f" + ex4s);
      ex4s--;
      $("#ex4exp").html(ex4exp[ex4s]);
    }
  });
  function nextSlide(id) {
    switch(id) {
      // FIRST EXAMPLE 
      case "ex1f1":
        // show the optimal solution
        $(".exax, .exb, svg").show();
        arrangeJobs(1, j11s, j11p, batchp, j12k, true, j12o);
        break;
      case "ex1f2":
        // show p
        $("[id^='ex1j']").animate({opacity: "0.2"});
        $("#ex1j4").animate({opacity: "1"}, {queue:false});
        $("#ex1a1").show();
        break;
      case "ex1f3":
        // show s
        $("#ex1a2").show();
        break;
      case "ex1f4":
        // show Pk
        $("#ex1j2, #ex1j3").animate({opacity: "1"}, {queue:false});
        $("#ex1j4").animate({opacity: "0.2"}, {queue:false});
        $("#ex1a3").show();
        break;
      case "ex1f5":
        // move up
        $("[id^='ex1j']").animate({opacity: "1"}, {queue:false});
        $("#ex1").animate({marginTop: "15%"});
        $("svg").show();
        break;
      /* FIRST EXAMPLE: IMPROVING EDD */
      case "ex2f1":
        // move 32 into 17
        arrangeJobs(2, j11s, j11p, batchp, j22k, true, j22o);
        break;
      case "ex2f2":
        // move back to original
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex2f3":
        // move 17 into 32
        arrangeJobs(2, j11s, j11p, batchp, j23k, true, j23o);
        break;
      case "ex2f4":
        // move back to original
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex2f5":
        // move 17 into 17 (wrong)
        arrangeJobs(2, j11s, j11p, batchp, j24k, true, j24o);
        break;
      case "ex2f6":
        // move 17 into 17 (right)
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        arrangeJobs(2, j11s, j11p, batchp, j25k, true, j25o);
        break;
      /* EXAMPLE 3 */
      case "ex3f1":
        // move 17 into 9
        arrangeJobs(3, j11s, j11p, batchp, j32k, true, j32o);
        break;
      case "ex3f2":
        // show guest/host labels
        $("#ex3a1, #ex3a2").show();
        break;
      case "ex3f3":
        // move 32 into empty batch
        arrangeJobs(3, j11s, j11p, batchp, j33k, true, j33o);
        break;
      case "ex3f4":
        $("#ex3a3").show();
        break;
      case "ex4f1":
        // move 32 into 17, show first row
        arrangeJobs(4, j11s, j11p, batchp, j22k, true, j22o);
        $("#ex4a1").show("slow");
        ex4L1 = [0, 0, 10, 8, 22, 23, 36-18, 54-18, 56-18];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L1[i]);
        });
        $("#ex4f1").css("visibility", "visible");
        break;
      case "ex4f2":
        // show the overhead annotation
        $("#ex4a2").show();
        $("#ex4a1").hide();
        ex4L2 = [0,0, 10, 8+12, 22+12, 23+12, 36-18+12, 54-18+12, 56-18+12];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L2[i]);
        });
        $("#ex4f2").css("visibility", "visible");
        break;
      case "ex4f3":
        // hide overhead annotation, move 9 into 2
        $("#ex4a2").hide();
        arrangeJobs(4, j11s, j11p, batchp, j42k, true, j42o);
        $("#ex4a3").show("slow");
        ex4L3 = [0,0, 10-17, 8+12-17, 22+12-17, 23+12-17, 36-18+12-17, 54-18+12-17, 56-18+12-17];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L3[i]);
        });
        $("#ex4f3").css("visibility", "visible");
        break;
      case "ex4f4":
        // show the overhead annotation
        $("#ex4a3").hide();
        $("#ex4a4").show();
        ex4L4 = [0,0+15, 10-17+15, 8+12-17+15, 22+12-17+15, 23+12-17+15, 36-18+12-17+15, 54-18+12-17+15, 56-18+12-17+15];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L4[i]);
        });
        $("#ex4f4").css("visibility", "visible");
      }
  }
    function prevSlide(id) {
    switch(id) {
      case "ex1f1":
        // show the original arrangement
        arrangeJobs(1, j11s, j11p, 3*batchp, j00k, true, j11o, true);
        $(".exax, .exb, svg").hide();
        break;
      case "ex1f2":
        // show optimal solution, hide p
        $("[id^='ex1j']").animate({opacity: "1"}, {queue:false});
        $("#ex1a1").hide();
        break;
      case "ex1f3":
        // hide s
        $("#ex1a2").hide();
        $("#ex1a1").show();
        break;
      case "ex1f4":
        // hide Pk, show s
        $("#ex1j2, #ex1j3").animate({opacity: "0.2"}, {queue:false});
        $("#ex1j4").animate({opacity: "1"}, {queue:false});
        $("#ex1a3").hide();
        $("#ex1a2").show();
        break;
      case "ex1f5":
        // move down, restore opacity
        $("[id^='ex1j']").animate({opacity: "0.2"}, {queue:false});
        $("#ex1j2, #ex1j3").animate({opacity: "1"}, {queue:false});
        $("#ex1").animate({marginTop: "40%"});
        $("#ex1a3").show();
        break;
      /* FIRST EXAMPLE: IMPROVING EDD */
      case "ex2f1":
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex2f2":
        // move 32 into 17
        arrangeJobs(2, j11s, j11p, batchp, j22k, true, j22o);
        break;
      case "ex2f3":
        // move back to original
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex2f4":
        // move 17 into 32
        arrangeJobs(2, j11s, j11p, batchp, j23k, true, j23o);
        break;
      case "ex2f5":
        // move back to original
        arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex2f6":
        // move 17 into 17 (wrong)
        arrangeJobs(2, j11s, j11p, batchp, j24k, true, j24o);
        break;
      case "ex3f1":
        // move 32 into 17
        arrangeJobs(3, j11s, j11p, batchp, j11k, true, j11o);
        break;
      case "ex3f2":
        // move 39 into the empty batch
        $("#ex3a1, #ex3a2").hide();
        break;
      case "ex3f3":
        // move 39 back into its own batch
        arrangeJobs(3, j11s, j11p, batchp, j32k, true, j32o);
        break;
      case "ex3f4":
        // move the 17 to the 9, even though the 32 is still in there
        $("#ex3a3").hide();
        arrangeJobs(3, j11s, j11p, batchp, j33k, true, j33o);
        break;
      case "ex4f1":
        // move back into regular position, hide all annotations
        arrangeJobs(4, j11s, j11p, batchp, j11k, true, j11o);
        $("#ex4a1").hide();
        ex4L1 = [0, 0, 10, 8, 22, 23, 36, 54, 56];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L1[i]);
        });
        $("#ex4f1").css("visibility", "hidden");
        break;
      case "ex4f2":
        // move 32 into 17, show first row
        $("#ex4a1").show("slow");
        $("#ex4a2").hide();
        ex4L1 = [0, 0, 10, 8, 22, 23, 36-18, 54-18, 56-18];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L1[i]);
        });
        $("#ex4f2").css("visibility", "hidden");
        break;
      case "ex4f3":
        // show the overhead annotation
        $("#ex4a2").show();
        $("#ex4a3").hide();
        arrangeJobs(4, j11s, j11p, batchp, j22k, true, j22o);
        ex4L2 = [0,0, 10, 8+12, 22+12, 23+12, 36-18+12, 54-18+12, 56-18+12];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L2[i]);
        });
        $("#ex4f3").css("visibility", "hidden");
        break;
      case "ex4f4":
        // hide overhead annotation, move 9 into 2
        $("#ex4a4").hide();
        $("#ex4a3").show("slow");
        ex4L3 = [0,0, 10-17, 8+12-17, 22+12-17, 23+12-17, 36-18+12-17, 54-18+12-17, 56-18+12-17];
        $("#totalL").children("td").each(function(i) {
          if(i>0) $(this).html(ex4L3[i]);
        });
        $("#ex4f4").css("visibility", "hidden");
        break;

    }
    }
});


function cleanUpSlide(slide) {
  setTimeout(function() {
  switch(slide) {
    case "s_ex1":
      /* restore the slide to its original state */
        $("[id^='ex1j']").attr('style', '');
        $("[id^='ex1a']").attr('style', '');
        $("#ex1").css('margin-top', '40%');
        $("#eq1").attr('style', '');
      break;
  }
  },1000);
}

function loadExample1() {
  j11p = [2, 17, 6, 14, 11, 18, 19, 8];
  j11s = [3, 8, 4, 15, 15, 10, 14, 14];
  j11c = ["#b58900",
          "#cb4b16",
          "#dc322f",
          "#d33682",
          "#6c71c4",
          "#268bd2",
          "#2aa198",
          "#859900"];
  j11d = [2, 9, 17, 17, 27, 32, 33, 39];
  setupJobs(1, j11s, j11p, j11c, j11d, 3*batchp, batchs, batchc);
  arrangeJobs(1, j11s, j11p, 3*batchp, j00k, true, j11o, true);
  // hide the batch markers and stuff
  $(".exax, .exb, svg").hide();
  resizeExj(1);
}

function loadExample2() {
  j11p = [2, 17, 6, 14, 11, 18, 19, 8];
  j11s = [3, 8, 4, 15, 15, 10, 14, 14];
  j11c = ["#b58900",
          "#cb4b16",
          "#dc322f",
          "#d33682",
          "#6c71c4",
          "#268bd2",
          "#2aa198",
          "#859900"];
  j11d = [2, 9, 17, 17, 27, 32, 33, 39];
  setupJobs(2, j11s, j11p, j11c, j11d, batchp, batchs, batchc);
  arrangeJobs(2, j11s, j11p, batchp, j11k, true, j11o);
  resizeExj(2);
}
function loadExample3() {
  j11p = [2, 17, 6, 14, 11, 18, 19, 8];
  j11s = [3, 8, 4, 15, 15, 10, 14, 14];
  j11c = ["#b58900",
          "#cb4b16",
          "#dc322f",
          "#d33682",
          "#6c71c4",
          "#268bd2",
          "#2aa198",
          "#859900"];
  j11d = [2, 9, 17, 17, 27, 32, 33, 39];
  setupJobs(3, j11s, j11p, j11c, j11d, batchp, batchs, batchc);
  arrangeJobs(3, j11s, j11p, batchp, j11k, true, j11o);
  resizeExj(3);
}
function loadExample4() {
  j11p = [2, 17, 6, 14, 11, 18, 19, 8];
  j11s = [3, 8, 4, 15, 15, 10, 14, 14];
  j11c = ["#b58900",
          "#cb4b16",
          "#dc322f",
          "#d33682",
          "#6c71c4",
          "#268bd2",
          "#2aa198",
          "#859900"];
  j11d = [2, 9, 17, 17, 27, 32, 33, 39];
  setupJobs(4, j11s, j11p, j11c, j11d, batchp, batchs, batchc);
  arrangeJobs(4, j11s, j11p, batchp, j11k, true, j11o);
  resizeExj(4);
}
function loadExample5() {
  j11p = [2, 17, 6, 14, 11, 18, 19, 8];
  j11s = [3, 8, 4, 15, 15, 10, 14, 14];
  j11c = ["#b58900",
          "#cb4b16",
          "#dc322f",
          "#d33682",
          "#6c71c4",
          "#268bd2",
          "#2aa198",
          "#859900"];
  j11d = [2, 9, 17, 17, 27, 32, 33, 39];
  setupJobs(5, j11s, j11p, j11c, j11d, batchp, batchs, batchc);
  arrangeJobs(5, j11s, j11p, batchp, j11k, true, j11o);
  resizeExj(5);
}
function resizeExj(exn) {
  /*$(".exj").each(function() {
    $(this).css("bottom", "0");
  });*/
  $("#ex" + exn).css("transform:", "scale(0.34)");
  $("#ex" + exn).css("-moz-transform", "scale(0.34)");
  $("#ex" + exn).css("-webkit-transform", "scale(0.34)");
  $("#ex" + exn).css("transform-origin:", "0% 50% 0");
  $("#ex" + exn).css("-moz-transform-origin", "0% 50% 0");
  $("#ex" + exn).css("-webkit-transform-origin", "0% 50% 0");
}
