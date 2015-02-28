function loadTables() {

  var table = $('#kb_table')
    for (lL = 0; lL < 7; lL++) {
      var row = $('<tr></tr>').addClass("kbrow");
      table.append(row);
      for (rL = 0; rL < 7; rL++) {
        if (lL == 0 && rL == 0) {
          var cell = $('<th></th>');
        } else if (lL == 0) {
          var cell = $('<th>' + String.fromCharCode(96+rL) + '</th>');
        } else if (rL == 0) {
          var cell = $('<th>' + String.fromCharCode(96+lL) + '</th>');
        } else {
          var cell = $('<td><input id="total_' + (lL-1) + (rL-1) + '" class="kb" /><br/><input id="min_' + (lL-1) + (rL-1) + '" class="kb" /></td>');
        }
        row.append(cell)
      }
    }

  var table = $('#ressb_table')
    for (lL = 0; lL < 7; lL++) {
      var row = $('<tr></tr>').addClass("kbrow");
      table.append(row);
      for (rL = 0; rL < 3; rL++) {
        if (lL == 0 && rL == 0) {
          var cell = $('<th></th>');
        } else if (lL == 0 && rL == 1) {
          var cell = $('<th>Left SB</th>');
        } else if (lL == 0 && rL == 2) {
          var cell = $('<th>Right SB</th>');
        } else if (rL == 0) {
          var cell = $('<th>' + String.fromCharCode(96+lL) + '</th>');
        } else {
          var cell = $('<td><input id="ressb_' + (lL-1) + (rL-1) + '" class="kb" /></td>');
        }
        row.append(cell)
      }
    }

  var table = $('#resk_table')
    for (lL = 0; lL < 7; lL++) {
      var row = $('<tr></tr>').addClass("kbrow");
      table.append(row);
      for (rL = 0; rL < 7; rL++) {
        if (lL == 0 && rL == 0) {
          var cell = $('<th></th>');
        } else if (lL == 0) {
          var cell = $('<th>' + String.fromCharCode(96+rL) + '</th>');
        } else if (rL == 0) {
          var cell = $('<th>' + String.fromCharCode(96+lL) + '</th>');
        } else {
          var cell = $('<td><input id="resk_' + (lL-1) + (rL-1) + '" class="kb" /></td>');
        }
        row.append(cell)
      }
    }
}
function fillWithEvenValues() {
  // Clear all
  $("[id^=total_]").each(function() {
    $(this).val("");
  });

  $("[id^=min_]").each(function() {
    $(this).val("");
  });

  // Fill

  $("[id^=total_]").each(function() {
    rand = Math.random();
    $(this).val(4);
  });
}
function fillWithRandomValues() {
  // Clear all
  $("[id^=total_]").each(function() {
    $(this).val("");
  });

  $("[id^=min_]").each(function() {
    $(this).val("");
  });

  // Fill

  $("[id^=total_]").each(function() {
    rand = Math.random();
    $(this).val(Math.round(50*(rand - 0.05)));
  });

  $("[id^=min_]").each(function() {
    rand = Math.random();
    if(rand > 0.9) {
      $(this).val(Math.round( $("#" + $(this).attr("id").replace("min", "total")).val() * (Math.random() - 0.05)));
    } else {
      $(this).val("");
    }   
  });
}
function solve() {
  // Create the LP
  //
  // IN FORTRAN THE ARRAY INDEX STARTS WITH ONE. I KNOW RIGHT?
  var lp = {};

  // Figure out how many variables we need (we need a slack variable for every
  // non-empty min box.
  var nSlack = 0;
  $("[id^=min_]").each(function() {
    if($(this).val() != "") nSlack++;
  });

  // Create quadratic cost vector
  lp.n = 12 + 36;
  var c = [];
  // variables are numbered [all 6 left sidebearings, all 6 right sidebearings,
  // all 36 kerning values]
  for(i = 1; i <= 12; i++) {
    c[i] = [];
    for(j=1; j<=lp.n; j++) c[i][j] = 0.0;
    c[i][i] = 0.000001;
  }
  for(i = 13; i <= 12 + 36; i++) {
    c[i] = [];
    for(j=1; j<=lp.n; j++) c[i][j] = 0;
    c[i][i] = 100000;
  }
  // create linear cost vector (none)
  var d = [];
  for(i=1; i<=lp.n; i++) d[i] = 0;

  // Create each row, which is a.left + ab.kern + b.right == total_ab
  lp.m =  36 + nSlack;
  var A = [];
  var b = [];
  for(l = 1; l <= 6; l++) {
    for(r = 1; r <= 6; r++) {
      row = (6*(l-1) + (r-1))+1;
      A[row] = [];
      for(j = 1; j <= lp.n; j++) {
        A[row][j] = 0;
        if(j == l || j == 6+r || j == 12+row) {
          A[row][j] = 1;
        }
      }
      b[row] = $("#total_" + (l-1) + "" + (r-1)).val();
    }
  }

  // now add slack constraints
  slackNumber = 1;
  for(l = 1; l <= 6; l++) {
    for(r = 1; r <= 6; r++) {
      // skip if not a needed constraint
      if($("#min_" + (l-1) + (r-1)).val() != "") {
        A[36 + slackNumber] = [];
        for(j = 1; j <= lp.n; j++) {
          A[36 + slackNumber][j] = 0;
          if(j == l || j == 6+r) A[36 + slackNumber][j] = 1;
        }
        b[36 + slackNumber] = $("#min_" + (l-1) + (r-1)).val();
        slackNumber++;
      }
    }
  }

  // transpose A, since quadprog is stupid
  AT = []
  for(i = 1; i < A[1].length; i++){
    AT[i] = [];
    for(j = 1; j < A.length; j++) {
      AT[i][j] = A[j][i];
    }
  }

  $("#ttt").empty();
  /*print table */
  for(r = 1; r <= lp.n; r++) {
    for(f = 1; f <= lp.m; f++) {
      $("#ttt").append(AT[r][f] + "\t");
    }
      $("#ttt").append("\n");
  }
    for(f = 1; f <= lp.m; f++) {
      $("#ttt").append(b[f] + "\t");
    }
  $("#ttt").append("\n\n---cost---\n\n");
  /* print table*/
  for(r = 1; r <= lp.n; r++) {

    for(f = 1; f <= lp.n; f++) {
      $("#ttt").append(c[r][f] + "\t");
    }
    $("#ttt").append( "\n")
  }
  // get result
  dvec = d
  amat = AT
  Dmat = c
  bvec = b 
  res = solveQP(Dmat, dvec, amat, bvec, 36);
   for(i = 0; i < 6; i++) {
        $("#ressb_" + i + "0").val(Math.round(2*res['solution'][i+1])/2);
      }
      for(i = 6; i < 12; i++) {
        $("#ressb_" + (i - 6) + "1").val(Math.round(2*res['solution'][i+1])/2);
      }
      for(i = 1; i <= 6; i++) {
        for(j = 1; j <= 6; j++) {
        $("#resk_" + (i-1) + "" + (j-1)).val(Math.round(2*res['solution'][13 + (i-1)*6 + j-1])/2);
        }
      }

  console.log(res);
  return lp;
}

$(document).ready(function($) {
  loadTables();
});


