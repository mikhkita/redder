$(document).ready(function(){
    var myWidth,
        myHeight,
        globalScroll = 0,
        radius = 0;

    function resize(){
       if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || 
        document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        myWidth = (myWidth < 1000)?1000:myWidth;
        $(".b-main-slide").css("height", myHeight);
        $(".b-main-slide .b-big-logo").css({
            "width" : myWidth*0.51,
            "height" : 292/978*myWidth*0.51,
            "margin-left" : -1*myWidth*0.51/2,
            "margin-top" : -1*292/978*myWidth*0.51/2,
            "background-size" : myWidth*0.51
        });

        var backWidth, backHeight;
        if( 1920/899 > myWidth/myHeight  ){
            backHeight = myHeight;
            backWidth = myHeight*1920/899;
        }else{
            backWidth = myWidth;
            backHeight = myWidth*899/1920;
        }
        $(".b-back-cont").css({
            width: backWidth,
            height: backHeight,
            "margin-left": -1*backWidth/2,
            "margin-top": -1*backHeight/2
        });
        radius = myWidth*250/1920;
    }
    $(window).resize(resize);
    resize();

    customHandlers["onScroll"] = function(scroll){
        globalScroll = scroll;
        // translate($(".b-back-cont"), 0, scroll);
    }

    // setTimeout(function(){
    //     $(".b-back-cont .b-back-svg").fadeOut(2000);
    // },100);

    $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    $.fn.placeholder();

    $('svg.b-back-svg g path').each(function(){
        $(this).attr("data-left",$(this).position().left+$(this).width()/2);
        $(this).attr("data-top",$(this).position().top+$(this).height()/2);
    });
    var prev_x = 0,
        prev_y = 0;
    $("body").mousemove(function(e){
        var x = e.pageX,
            y = e.pageY;
        if( globalScroll > 150 || Math.abs(x - prev_x)+Math.abs(y - prev_y) < 15 ){
            return false;
        }
        prev_x = x;
        prev_y = y;


        // if( (x < myWidth/2) ){
        //     k = (x/myWidth/2*2000+100)/50;
        // }else{
        //     k = -1*((myWidth-x)/myWidth/2*2000+100)/50;
        // }

        $('svg.b-back-svg g path').each(function(){
            var $this = $(this),
                left = $this.attr("data-left"),
                top = $this.attr("data-top");
            // if( x-150 < left-top/k && x+150 > left-top/k){
            if( x-radius < left && x+radius > left && y-radius < top && y+radius > top ){
                transition($this, 0);
                $this.css("opacity",1);
                setTimeout(function(){
                    $this.css("opacity",0);
                    transition($this, 0.5);
                },300);
            }else{
                $this.css("opacity",0);
                transition($this, 0.5);
            }
        });
    });

    function transition(el,dur){
        el.css({
            "-webkit-transition":  "all "+dur+"s linear", "-moz-transition":  "all "+dur+"s linear", "-o-transition":  "all "+dur+"s linear", "transition":  "all "+dur+"s linear"
        });
    }

    function translate(el,x,y){
        el.css({
            "-webkit-transform": "translate("+x+"px,"+y+"px)",
            "-moz-transform": "translate("+x+"px,"+y+"px)",
            "-ms-transform": "translate("+x+"px,"+y+"px)",
            "transform": "translate("+x+"px,"+y+"px)"
        });
    }

});