
//run on document load and on window resize
$(document).ready(function () {
$(window).bind('resize', function(){
        if ($(window).width() < 1100) {
        $("#backgrounddiv").hide();
        $("#topheaderdiv").show();
        $("#content").css({'margin-left': "10px"});
    }else{
        $("#content").css({'margin-left': "289px"});
        $("#backgrounddiv").show();
        $("#topheaderdiv").hide();
    }
    }).resize();

});


