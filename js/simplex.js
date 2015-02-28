function loadTables() {
  var table = $('#kb_table');
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
          var cell = $('<th>Right SB</th>');
        } else if (lL == 0 && rL == 2) {
          var cell = $('<th>Left SB</th>');
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
/*IN> numeric.solveLP([1,2,3],                     //* minimize [1,2,3]*x                *
                    [[-1,0,0],[0,-1,0],[0,0,-1]], //* matrix A of inequality constraint *
                    [0,0,0],                      //* RHS b of inequality constraint    
                    [[1,1,1]],                    //* matrix Aeq of equality constraint *
                    [3]                           //* vector beq of equality constraint *
                    );
OUT> { solution:[3,1.685e-16,4.559e-19], message:"", iterations:12 } */

/* We're trying to model the following system:

Minimize k1_abs + k2_abs + ... + k36_abs

lL.r + k(6*l+r)_actual + rL.l == $("total_" + l + r).val()      FORALL l, r < 6
(36 equations)

k(6*l+r)_actual - k(6*l+r)_abs  <= 0            FORALL l, r < 6
(36 equations)

-k(6*l+r)_actual - k(6*l+r)_abs  <= 0            FORALL l, r < 6
(36 equations)

-lL.r - rL.l <= -$("min_" + l + r).val()
(slacknum equations) 

so our Aeq looks like this in rows:
[ left sidebearings (6), right sidebearings (6), actual kerns (36), absolute
kerns (36), ]



*/

n = 12+2*36;

c = []; // cost vector
for(var i=0; i<n; i++) {
  if(i>=(36+12) && i<(36+12+36)) {
    c[i] = 1;
  } else {
    c[i] = 0;
  } 
}

Aeq = [];
beq = [];
// add kerning equality rows
for(var l=0; l<6; l++) {
  for(var r=0; r<6; r++) {
    row = 6*l+r;
    Aeq[row] = []
    b = $("#total_" + l + r).val();
    for(var j=0; j<n; j++) {
      Aeq[row][j] = 0;
      if(j==l || j==6+r || j==12+6*l+r) Aeq[row][j] = (b >= 0 ? 1 : -1);
    }
    beq[row] = Math.abs(b);
  }
}


A = [];
b = [];
// add absoluteness positive equations
for(var l=0; l<6; l++) {
  for(var r=0; r<6; r++) {
    row = 6*l+r;
    A[row] = []
    for(var j=0; j<n; j++) {
      A[row][j] = 0;
      if(j==12+6*l+r) A[row][j] = 1; // actual value  (if this is -10, then
                                      // it's -(-10) + abs <= 0
      if(j==36+12+6*l+r) A[row][j] = -1; // absolute value  (
    }
    b[row] = 0;
  }
}

// add absoluteness negative uations
for(var l=0; l<6; l++) {
  for(var r=0; r<6; r++) {
    row = 36+6*l+r;
    A[row] = []
    for(var j=0; j<n; j++) {
      A[row][j] = 0;
      if(j==12+6*l+r) A[row][j] = -1; // actual value
      if(j==36+12+6*l+r) A[row][j] = -1; // absolute value
    }
    b[row] = 0;
  }
}

// now add minimum constraints
    slackNumber = 0;
    for(var l=0; l<6; l++) {
      for(var r=0; r<6; r++) {
        // skip if not a needed constraint
        if($("#min_" + l + r).val() != "") {
            A[2*36 + slackNumber] = [];
            for(var j=0; j<n; j++) {
              A[2*36 + slackNumber][j] = 0;
              if(j == l || j == 6+r) A[2*36 + slackNumber][j] = -1;
            }
            b[2*36 + slackNumber] = -$("#min_" + l + r).val();
            slackNumber++;
        }
      }
    }

solution = numeric.solveLP(c, A, b, Aeq, beq)['solution'];

for(var i=0; i<6; i++) {
  $("#ressb_" + i + "0").val(Math.round(solution[i]));
  $("#ressb_" + i + "1").val(Math.round(solution[i+6]));
}
for(var l=0; l<6; l++) {
  for(var r=0; r<6; r++) {
    $("#resk_" + l + r).val(Math.round(solution[12+l*6+r]));
  }
}

}

$(document).ready(function($) {
  loadTables();
});
