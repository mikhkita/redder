$(document).ready(function(){
    var myWidth,
        myHeight,
        globalScroll = 0,
        radius = 0,
        backWidth,
        backHeight,
        isMobile = device.mobile(),
        rotation = 0,
        prevHeight = 10000;

    // isMobile = true;

    if( isMobile )
        new FastClick(document.body);

    $(window).stellar({
        hideDistantElements: false,
        horizontalScrolling: false,
        positionProperty: "transform"
    });

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

        if( 1920/899 > myWidth/myHeight  ){
            backHeight = myHeight;
            backWidth = myHeight*1920/899;
        }else{
            backWidth = myWidth;
            backHeight = myWidth*899/1920;
        }

        if( isMobile ){

        }else{
            $(".b-main-slide").css("height", myHeight);
            $(".b-main-slide .b-big-logo").css({
                "width" : myWidth*0.51,
                "height" : 292/978*myWidth*0.51,
                "margin-left" : -1*myWidth*0.51/2,
                "margin-top" : -1*292/978*myWidth*0.51/2,
                "background-size" : myWidth*0.51
            });

            $(".b-about-slide p").css("font-size",(myWidth>1600)?23:18);
            $(".b-about-slide p").css("line-height",(myWidth>1600)?"36px":"30px");

            $(".b-back-cont").css({
                width: backWidth,
                height: backHeight,
                "margin-left": -1*backWidth/2,
                "margin-top": -1*backHeight/2
            });
        }

        radius = myWidth*250/1920;

        if( Math.abs(myWidth/myHeight-rotation) > 0.5 || myHeight-prevHeight < 0 ) firstRender();

        prevHeight = myHeight;
        rotation = myWidth/myHeight;

        // var min_height = (myHeight < 500)?500:myHeight;
        // $(".b-what-we-do-2,.b-what-we-do-3").css("height", min_height);
        // $(".b-work").css("min-height", min_height);
    }
    function firstRender() {
        if( isMobile ){
            $(".b-main-slide").css("height", myHeight);
            $(".b-main-slide .b-big-logo").css({
                "width" : myWidth*0.51,
                "height" : 292/978*myWidth*0.51,
                "margin-left" : -1*myWidth*0.51/2,
                "margin-top" : -1*292/978*myWidth*0.51/2,
                "background-size" : myWidth*0.51
            });

            $(".b-back-cont").css({
                width: backWidth,
                height: backHeight+150,
                "margin-left": -1*backWidth/2,
                "margin-top": 0
            });

            if( myHeight < 600 ){
                $(".b-scroll-down").hide();
            }else{
                $(".b-scroll-down").show();
            }
        }
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
        prev_y = 0,
        menuOpened = false,
        menuBlocked = false;
    $("body").mousemove(function(e){
        if( menuOpened ) return false;
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
                    if( menuOpened ) return false;
                    $this.css("opacity",0);
                    transition($this, 0.5);
                },300);
            }else{
                $this.css("opacity",0);
                transition($this, 0.5);
            }
        });
    });

    $('svg.b-back-svg g path').each(function(){
        $(this).attr("data-fill", $(this).attr("fill"));
    });

    var menuToggle;
    function toggleMenu(open){
        var menuX = myWidth;
            menuY = 0,
            iter = 15;
        menuToggle = setInterval(function(){
            iterMenu(menuX, menuY, open);
            menuX -= (myWidth/iter);
            menuY += (myHeight/iter);
            if( menuX < -400 ){
                if( open ){
                    $(".b-main-menu").show();
                    $(".b-main-menu li").each(function(){
                        TweenLite.to($(this), 0.5, { "y" : 0, opacity : 1, delay: 0.1*$(this).index(), ease : Quad.easeOut } );
                    });
                    $(".b-main-menu li").each(function(){
                        $(this).find(".b-line").css("right", $(this).find("a").width()+20);
                    });
                }else{
                    TweenLite.to($(".b-main-menu li"), 0, { "y" : 30, opacity : 0 } );
                    $(".menu-hide").fadeIn(1000);
                    menuOpened = false;
                }
                menuBlocked = false;
                clearInterval(menuToggle);
            }
        },20);
        if( open ){
            $(".b-menu-butt").addClass("opened");
            $(".menu-hide").fadeOut(200);
        }else{
            $(".b-menu-butt").removeClass("opened");
            $(".b-main-menu").fadeOut(200);
        }
    }

    function iterMenu(x,y,open){
        $('svg.b-back-svg g path').each(function(){
            var $this = $(this),
                left = $this.attr("data-left"),
                top = $this.attr("data-top"),
                k = 2;
            if( x-radius < left-top/k && x+radius > left-top/k){
                transition($this, 0);
                if( open ){
                    $this.css({
                        "opacity":0.8,
                        "fill" : "#FFF",
                        "stroke" : "rgba(0,0,0,0.1)"
                    });
                }else{
                    $this.css({
                        "opacity":0,
                        "fill" : $this.attr("data-fill"),
                        "stroke" : "rgba(255,255,255,0.5)"
                    });
                }
            }
        });
    }

    $('.b-menu-butt').click(function(){
        if( menuBlocked ) return false;
        menuBlocked = true;
        $(".menu-hide").stop();
        if( menuOpened ){
            toggleMenu(false);
        }else{
            toggleMenu(true);
            menuOpened = true;
        }
        return false;
    });

    $(".b-main-menu li a").click(function(){
        toggleMenu(false);
    });

    var myTween;
    $(".b-main-menu li").hover(function(){
        myTween = TweenLite.to($(this).find(".b-line"), 5, { "width" : $(this).find(".b-line").offset().left, ease: Linear.easeNone, onComplete : function($li){
            $li.find("a").trigger("click");
        }, onCompleteParams:[$(this)] });
    },function(){
        myTween.kill();
        $(this).find(".b-line").css("width",0);
    });

    $(".b-callback input[type='text']").focus(function(){
        $(this).parent(".b-input").addClass("focus");
    }).blur(function(){
        $(this).parent(".b-input").removeClass("focus");    
    });

    var bgo = false;
    $(".b-go").hover(function(){
        bgo = true;
    },function(){
        bgo = false;
    });

    $("body").on("click", ".b-go", function(){
        if( !bgo && !isMobile ) return false;
        bgo = false;
        
        console.log("asdasdasdasdasd");
        var block = $( $(this).attr("data-block") ),
            off = $(this).attr("data-offset")||0,
            delay = $(this).attr("data-delay")||0,
            duration = $(this).attr("data-duration")*1||800,
            focus = $(this).attr("data-focus")||0;
        setTimeout(function(){
            $("body").animate({
                scrollTop : block.offset().top-off
            }, duration, function(){

                if( focus )
                    block.find("input").eq(0).focus();
            });
        }, delay);
        return false;
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