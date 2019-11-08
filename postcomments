var CH_TYPE = 1;
var chords = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C','Db','D','D#','E','F','Gb','G','G#','A','A#','C'];
// var chords = ['C','C#','D','Eb','E','F','F#','G','Ab','A','B','H','C','Db','D','D#','E','F','Gb','G','G#','A','A#','C'];
var chordRegex = /C#|D#|F#|G#|A#|Db|Eb|Gb|Ab|Bb|H|C|D|E|F|G|A|B|H/g;
var transPos = 0

function transpose(step) {
	if (step == undefined || step == 0)
		return;
    
    hideAllTooltips();
    
    var match;

	$('#post-commens sup, #post-commens b').each(function() {
		for (s = 0; s < Math.abs(step); s++) {
			var chord = $(this).text();
			var o = "";
			var p = chord.split(chordRegex);
			var i = 0;
			if (step > 0) {
				while (match = chordRegex.exec(chord)) {
					o += p[i++] + chords[chords.indexOf(match[0])+1];
				}
			}
			else if (step < 0) {
				while (match = chordRegex.exec(chord))
					o += p[i++] + chords[chords.indexOf(match[0],1)-1];
			}
			o += p[i];
				
			$(this).text(o);
		}
	});
    
    transPos = transPos + step;
    if (transPos > 11) transPos = 0;
    if (transPos < -11) transPos = 0;
    $('#transposeinfo div').text(transPos);
    
    if ($('#button-fav').attr("src").includes('ic_menu_fav.')) {
        $.nette.ajax({type: 'POST', url: "?do=changeTrans", data: {t:transPos}});
    }
}

function getSelectionCharOffsetsWithin(element, selectAllIfNothing) {
	var start = 0, end = 0;
	var sel, range, priorRange;
	if (typeof window.getSelection != "undefined") {
		if (window.getSelection().rangeCount != 1) {
			return {start: 0,end: Number.MAX_VALUE};
		}
		range = window.getSelection().getRangeAt(0);
		priorRange = range.cloneRange();
		priorRange.selectNodeContents(element);
		priorRange.setEnd(range.startContainer, range.startOffset);
		start = priorRange.toString().length;
		end = start + range.toString().length;
	} else if (typeof document.selection != "undefined" && (sel = document.selection).type != "Control") {
		range = sel.createRange();
		priorRange = document.body.createTextRange();
		priorRange.moveToElementText(element);
		priorRange.setEndPoint("EndToStart", range);
		start = priorRange.text.length;
		end = start + range.text.length;
	}
	
	if (selectAllIfNothing && start == end) return {start: 0,end: Number.MAX_VALUE};
	
	return {start: start,end: end};
}

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
  
  console.log(selectionEnd + " **-** " + selectionStart);
}

$(document).ready(function() {
	initChtt();
	
	var interval;
	var b = $(document);
	var intTime = 300;

	$('.ui-state-default').hover(function(){
		$(this).removeClass().addClass('ui-state-hover');
	}, function(){
		$(this).removeClass().addClass('ui-state-default');
	});


	$('#transposeup').click(function() {
		transpose(1);
	});

	$('#transposedown').click(function() {
		transpose(-1);
	});
    
    $('body').on('click', '.notes li a', function() {
        $p = $(this).find('p');
        $("#modal-main").attr("val", $p.attr('val'));
        doModalEditNote("Edit note", $p.text());
    });
    
    function doModalEditNote(heading, text) {
        html =  '<div id="modal-note" class="modal" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
        html += '<div class="modal-dialog modal-lg">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<a class="close" data-dismiss="modal">Ã—</a>';
        html += '<h4>'+heading+'</h4>'
        html += '</div>';
        html += '<div class="modal-body">';
        html += '<form>';
        html += '<div class="form-group">';
        html += '<textarea class="form-control" id="note-text" rows="4" cols="30" maxlength="200" placeholder="Empty note will be deleted">'+text+'</textarea>';
        html += '</div>';
        html += '</form>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
        html += '<button type="button" class="btn btn-primary" data-dismiss="modal">Save</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("#modal-main").html(html);
        $("#modal-note").modal();
    }
    
    $('body').on('click', '#rate-stars img', function(e) {
        $.nette.ajax({
            type: 'POST',
            url: "?do=rate",
            data: {id : $(this).attr('alt')},
            success: function (payload) {
                showToast(payload.typ, payload.pom);
            },
            error: function (payload) {
                
            }
        });
    });
    
 
    $('#change-chord-diag').on("click", function(e){
        if (!$(this).parent().hasClass("disabled")) {
            $(this).next('ul').toggle();
            e.stopPropagation();
            e.preventDefault();
        }
    });
    
    $(".change-chord-diag-menu a").on("click", function(e){
        CH_TYPE = $(this).attr("val");
    });
   
    $('body').on('click', '#test-split', function(e){
        $el = $('#post-commens');
        
        $el.css("-webkit-columns", "2 200px");
        $el.css("columns", "2 200px");
        $el.css("-webkit-column-rule", "1px solid lightgrey");
        $el.css("column-rule", "1px solid lightgrey");
  
    });
    
    $('body').on('click', '#create-note', function(e){
        $.nette.ajax({ url: "?do=saveNote", type: 'POST', data: ({ p : -1, t: "New note..." })});
    });
    
    $('body').on('click', '#modal-note .btn-primary', function(e){
        $.nette.ajax({ url: "?do=saveNote", type: 'POST', data: ({ p : $("#modal-main").attr("val"), t: $("#modal-note textarea").val()})});
    });
    
    $('#button-print').click(function() {
        $("#post-commens").printArea( { mode : 'iframe', popClose : false} );
    });
    
    $('#button-show-chords').click(function() {
        if (!$(this).parent().hasClass("disabled")) {
            if ($('#all-chords').length) {
                $('#all-chords').remove();
                $(this).text("Show all chords diagrams");
            }
            else {
                var ar = [];
                var tx = "";
                $("#post-commens sup, #post-commens b").each(function(i) {
                    var ch = $(this).text();
                    if (ar.indexOf(ch) == -1) {
                        ar.push(ch);
                        
                        var chd = getChordContent(ch, true);
                        tx += "<div class=\"chord-base\"><div class=\"chord-title\">"+ch+"</div><div class=\"chttc\">"+chd+"</div></div>";
                    }
                });
                $("#post-commens").append("<div id=\"all-chords\">"+tx+"</div>");
                $(this).text("Hide all chords diagrams");
            }
        }
    });
});

function loophalaman(a){var e="";nomerkiri=parseInt(numshowpage/2),nomerkiri==numshowpage-nomerkiri&&(numshowpage=2*nomerkiri+1),mulai=nomerhal-nomerkiri,mulai<1&&(mulai=1),maksimal=parseInt(a/postperpage)+1,maksimal-1==a/postperpage&&(maksimal-=1),akhir=mulai+numshowpage-1,akhir>maksimal&&(akhir=maksimal),e+="<span class='showpageOf'>Page "+nomerhal+" of "+maksimal+"</span>";var s=parseInt(nomerhal)-1;nomerhal>1&&(e+=2==nomerhal?"page"==jenis?'<span class="showpage"><a href="'+home_page+'">'+upPageWord+"</a></span>":'<span class="showpageNum"><a href="/search/label/'+lblname1+"?&max-results="+postperpage+'">'+upPageWord+"</a></span>":"page"==jenis?'<span class="showpageNum"><a href="#" onclick="redirectpage('+s+');return false">'+upPageWord+"</a></span>":'<span class="showpageNum"><a href="#" onclick="redirectlabel('+s+');return false">'+upPageWord+"</a></span>"),mulai>1&&(e+="page"==jenis?'<span class="showpageNum"><a href="'+home_page+'">1</a></span>':'<span class="showpageNum"><a href="/search/label/'+lblname1+"?&max-results="+postperpage+'">1</a></span>'),mulai>2&&(e+="");for(var r=mulai;r<=akhir;r++)e+=nomerhal==r?'<span class="showpagePoint">'+r+"</span>":1==r?"page"==jenis?'<span class="showpageNum"><a href="'+home_page+'">1</a></span>':'<span class="showpageNum"><a href="/search/label/'+lblname1+"?&max-results="+postperpage+'">1</a></span>':"page"==jenis?'<span class="showpageNum"><a href="#" onclick="redirectpage('+r+');return false">'+r+"</a></span>":'<span class="showpageNum"><a href="#" onclick="redirectlabel('+r+');return false">'+r+"</a></span>";akhir<maksimal-1&&(e+=""),akhir<maksimal&&(e+="page"==jenis?'<span class="showpageNum"><a href="#" onclick="redirectpage('+maksimal+');return false">'+maksimal+"</a></span>":'<span class="showpageNum"><a href="#" onclick="redirectlabel('+maksimal+');return false">'+maksimal+"</a></span>");var n=parseInt(nomerhal)+1;nomerhal<maksimal&&(e+="page"==jenis?'<span class="showpageNum"><a href="#" onclick="redirectpage('+n+');return false">'+downPageWord+"</a></span>":'<span class="showpageNum"><a href="#" onclick="redirectlabel('+n+');return false">'+downPageWord+"</a></span>");for(var t=document.getElementsByName("pageArea"),l=document.getElementById("blog-pager"),p=0;p<t.length;p++)t[p].innerHTML=e;t&&t.length>0&&(e=""),l&&(l.innerHTML=e)}function hitungtotaldata(a){var e=a.feed,s=parseInt(e.openSearch$totalResults.$t,10);loophalaman(s)}function halamanblogger(){var a=urlactivepage;-1!=a.indexOf("/search/label/")&&(lblname1=-1!=a.indexOf("?updated-max")?a.substring(a.indexOf("/search/label/")+14,a.indexOf("?updated-max")):a.substring(a.indexOf("/search/label/")+14,a.indexOf("?&max"))),-1==a.indexOf("?q=")&&-1==a.indexOf(".html")&&(-1==a.indexOf("/search/label/")?(jenis="page",nomerhal=-1!=urlactivepage.indexOf("#PageNo=")?urlactivepage.substring(urlactivepage.indexOf("#PageNo=")+8,urlactivepage.length):1,document.write('<script src="'+home_page+'feeds/posts/summary?max-results=1&alt=json-in-script&callback=hitungtotaldata"></script>')):(jenis="label",-1==a.indexOf("&max-results=")&&(postperpage=20),nomerhal=-1!=urlactivepage.indexOf("#PageNo=")?urlactivepage.substring(urlactivepage.indexOf("#PageNo=")+8,urlactivepage.length):1,document.write('<script src="'+home_page+"feeds/posts/summary/-/"+lblname1+'?alt=json-in-script&callback=hitungtotaldata&max-results=1" ></script>')))}function redirectpage(a){jsonstart=(a-1)*postperpage,nopage=a;var e=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.setAttribute("src",home_page+"feeds/posts/summary?start-index="+jsonstart+"&max-results=1&alt=json-in-script&callback=finddatepost"),e.appendChild(s)}function redirectlabel(a){jsonstart=(a-1)*postperpage,nopage=a;var e=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.setAttribute("src",home_page+"feeds/posts/summary/-/"+lblname1+"?start-index="+jsonstart+"&max-results=1&alt=json-in-script&callback=finddatepost"),e.appendChild(s)}function finddatepost(a){post=a.feed.entry[0];var e=post.published.$t.substring(0,19)+post.published.$t.substring(23,29),s=encodeURIComponent(e);if("page"==jenis)var r="/search?updated-max="+s+"&max-results="+postperpage+"#PageNo="+nopage;else var r="/search/label/"+lblname1+"?updated-max="+s+"&max-results="+postperpage+"#PageNo="+nopage;location.href=r}var nopage,jenis,nomerhal,lblname1;halamanblogger();
var MONTH_FORMAT=[,"January","February","March","April","May","June","July","August","September","October","November","December"],NO_IMAGE="http://3.bp.blogspot.com/-Yw8BIuvwoSQ/VsjkCIMoltI/AAAAAAAAC4c/s55PW6xEKn0/s1600-r/nth.png",WIDGET_RECENT_POST_NUM=5,WIDGET_RANDOM_POST_NUM=5,WIDGET_RECENT_COMMENT_NUM=3,POSTPERPAGE_NUM=10,LABEL_SEARCH_NUM=10;
$(".featured .HTML .widget-content").each(function(){var e=$(this).find("div").attr("data-label"),t="random",a="recent",s="label",r=$(this).find("div").attr("id");r.match(t)?$.ajax({url:"/feeds/posts/default?alt=json-in-script",type:"get",dataType:"jsonp",success:function(e){e=e.feed.entry.length-5,e=Math.floor(Math.random()*(e-0+1))+0,0==e&&(e=Math.floor(Math.random()*(e-0+1))+1),$.ajax({url:"/feeds/posts/default?alt=json-in-script&start-index="+e+"&max-results=5",type:"get",dataType:"jsonp",success:function(e){for(var t="",a='<div cass="feat-wrap">',s=0;s<e.feed.entry.length;s++){for(var r=0;r<e.feed.entry[s].link.length;r++)if("alternate"==e.feed.entry[s].link[r].rel){t=e.feed.entry[s].link[r].href;break}var n=e.feed.entry[s].title.$t,c=e.feed.entry[s].author[0].name.$t,l=e.feed.entry[s].published.$t,i=l.substring(0,4),d=l.substring(5,7),o=l.substring(8,10),u=MONTH_FORMAT[parseInt(d,10)]+" "+o+", "+i,f=e.feed.entry[s].category[0].term,p=e.feed.entry[s].content.$t,h=$("<div>").html(p);if(p.indexOf("http://www.youtube.com/embed/")>-1||p.indexOf("https://www.youtube.com/embed/")>-1)var v=e.feed.entry[s].media$thumbnail.url,m=v;else if(p.indexOf("<img")>-1)var b=h.find("img:first").attr("src"),m=b;else var m=NO_IMAGE;0==s?a+='<div class="feat-column1"><div class="hot-item item1"><div class="featured-inner"><a href="/search/label/'+f+'" class="post-tag">'+f+'</a><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a><div class="post-panel"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><div class="featured-meta"><span class="featured-author">'+c+'</span><span class="featured-date">'+u+"</span></div></div></div></div></div>":1==s?a+='<div class="feat-column2"><li class="item2"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":2==s?a+='<li class="item3"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":3==s?a+='<li class="item4"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":4==s&&(a+='<li class="item5"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li></div>")}a+='<div class="clear"/></div>',$(".featured .HTML .widget-content").each(function(){$(this).find("div").attr("id").match("random")&&($(this).html(a),$(this).removeClass("widget-content").addClass("layout-content"),$(this).find(".rcp-thumb").each(function(){$(this).attr("style",function(e,t){return t.replace("/default.jpg","/hqdefault.jpg")}).attr("style",function(e,t){return t.replace("s72-c","s1600")})}))})}})}}):r.match(a)?$.ajax({url:"/feeds/posts/default?alt=json-in-script",type:"get",dataType:"jsonp",success:function(e){$.ajax({url:"/feeds/posts/default?alt=json-in-script&max-results=5",type:"get",dataType:"jsonp",success:function(e){for(var t="",a='<div cass="feat-wrap">',s=0;s<e.feed.entry.length;s++){for(var r=0;r<e.feed.entry[s].link.length;r++)if("alternate"==e.feed.entry[s].link[r].rel){t=e.feed.entry[s].link[r].href;break}var n=e.feed.entry[s].title.$t,c=e.feed.entry[s].author[0].name.$t,l=e.feed.entry[s].published.$t,i=l.substring(0,4),d=l.substring(5,7),o=l.substring(8,10),u=MONTH_FORMAT[parseInt(d,10)]+" "+o+", "+i,f=e.feed.entry[s].category[0].term,p=e.feed.entry[s].content.$t,h=$("<div>").html(p);if(p.indexOf("http://www.youtube.com/embed/")>-1||p.indexOf("https://www.youtube.com/embed/")>-1)var v=e.feed.entry[s].media$thumbnail.url,m=v;else if(p.indexOf("<img")>-1)var b=h.find("img:first").attr("src"),m=b;else var m=NO_IMAGE;0==s?a+='<div class="feat-column1"><div class="hot-item item1"><div class="featured-inner"><a href="/search/label/'+f+'" class="post-tag">'+f+'</a><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a><div class="post-panel"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><div class="featured-meta"><span class="featured-author">'+c+'</span><span class="featured-date">'+u+"</span></div></div></div></div></div>":1==s?a+='<div class="feat-column2"><li class="item2"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":2==s?a+='<li class="item3"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":3==s?a+='<li class="item4"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":4==s&&(a+='<li class="item5"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li></div>")}a+='<div class="clear"/></div>',$(".featured .HTML .widget-content").each(function(){$(this).find("div").attr("id").match("recent")&&($(this).html(a),$(this).removeClass("widget-content").addClass("layout-content"),$(this).find(".rcp-thumb").each(function(){$(this).attr("style",function(e,t){return t.replace("/default.jpg","/hqdefault.jpg")}).attr("style",function(e,t){return t.replace("s72-c","s1600")})}))})}})}}):r.match(s)&&$.ajax({url:"/feeds/posts/default/-/"+e+"?alt=json-in-script&max-results=5",type:"get",dataType:"jsonp",success:function(e){for(var t="",a='<div cass="feat-wrap">',s=0;s<e.feed.entry.length;s++){for(var r=0;r<e.feed.entry[s].link.length;r++)if("alternate"==e.feed.entry[s].link[r].rel){t=e.feed.entry[s].link[r].href;break}var n=e.feed.entry[s].title.$t,c=e.feed.entry[s].author[0].name.$t,l=e.feed.entry[s].published.$t,i=l.substring(0,4),d=l.substring(5,7),o=l.substring(8,10),u=MONTH_FORMAT[parseInt(d,10)]+" "+o+", "+i,f=e.feed.entry[s].category[0].term,p=e.feed.entry[s].content.$t,h=$("<div>").html(p);if(p.indexOf("http://www.youtube.com/embed/")>-1||p.indexOf("https://www.youtube.com/embed/")>-1)var v=e.feed.entry[s].media$thumbnail.url,m=v;else if(p.indexOf("<img")>-1)var b=h.find("img:first").attr("src"),m=b;else var m=NO_IMAGE;0==s?a+='<div class="feat-column1"><div class="hot-item item1"><div class="featured-inner"><a href="/search/label/'+f+'" class="post-tag">'+f+'</a><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a><div class="post-panel"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><div class="featured-meta"><span class="featured-author">'+c+'</span><span class="featured-date">'+u+"</span></div></div></div></div></div>":1==s?a+='<div class="feat-column2"><li class="item2"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":2==s?a+='<li class="item3"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":3==s?a+='<li class="item4"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li>":4==s&&(a+='<li class="item5"><div class="feat-thumbnail"><a class="rcp-thumb" href="'+t+'" style="background:url('+m+') no-repeat center center;background-size: cover"><span class="featured-overlay"/></a></div><div class="post-content"><h3 class="rcp-title"><a href="'+t+'">'+n+'</a></h3><span class="recent-date">'+u+"</span></li></div>")}a+='<div class="clear"/></div>',$(".featured .HTML .widget-content").each(function(){$(this).find("div").attr("id").match("label")&&($(this).html(a),$(this).removeClass("widget-content").addClass("layout-content"),$(this).find(".rcp-thumb").each(function(){$(this).attr("style",function(e,t){return t.replace("/default.jpg","/hqdefault.jpg")}).attr("style",function(e,t){return t.replace("s72-c","s1600")})}))})}})});
$(document).ready(function(){var t=90;$("#PopularPosts1,.recent_posts_arlina").find("img").each(function(a,r){var r=$(r);r.attr({src:r.attr("src").replace(/s\B\d{2,4}/,"s"+t)}),r.attr("width","100%"),r.attr("height","auto")})});
(function(a){a.fn.lazyload=function(b){var c={threshold:0,failurelimit:0,event:"scroll",effect:"show",container:window};if(b){a.extend(c,b)}var d=this;if("scroll"==c.event){a(c.container).bind("scroll",function(b){var e=0;d.each(function(){if(a.abovethetop(this,c)||a.leftofbegin(this,c)){}else if(!a.belowthefold(this,c)&&!a.rightoffold(this,c)){a(this).trigger("appear")}else{if(e++>c.failurelimit){return false}}});var f=a.grep(d,function(a){return!a.loaded});d=a(f)})}this.each(function(){var b=this;if(undefined==a(b).attr("original")){a(b).attr("original",a(b).attr("src"))}if("scroll"!=c.event||undefined==a(b).attr("src")||c.placeholder==a(b).attr("src")||a.abovethetop(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.rightoffold(b,c)){if(c.placeholder){a(b).attr("src",c.placeholder)}else{a(b).removeAttr("src")}b.loaded=false}else{b.loaded=true}a(b).one("appear",function(){if(!this.loaded){a("<img />").bind("load",function(){a(b).hide().attr("src",a(b).attr("original"))[c.effect](c.effectspeed);b.loaded=true}).attr("src",a(b).attr("original"))}});if("scroll"!=c.event){a(b).bind(c.event,function(c){if(!b.loaded){a(b).trigger("appear")}})}});a(c.container).trigger(c.event);return this};a.belowthefold=function(b,c){if(c.container===undefined||c.container===window){var d=a(window).height()+a(window).scrollTop()}else{var d=a(c.container).offset().top+a(c.container).height()}return d<=a(b).offset().top-c.threshold};a.rightoffold=function(b,c){if(c.container===undefined||c.container===window){var d=a(window).width()+a(window).scrollLeft()}else{var d=a(c.container).offset().left+a(c.container).width()}return d<=a(b).offset().left-c.threshold};a.abovethetop=function(b,c){if(c.container===undefined||c.container===window){var d=a(window).scrollTop()}else{var d=a(c.container).offset().top}return d>=a(b).offset().top+c.threshold+a(b).height()};a.leftofbegin=function(b,c){if(c.container===undefined||c.container===window){var d=a(window).scrollLeft()}else{var d=a(c.container).offset().left}return d>=a(b).offset().left+c.threshold+a(b).width()};a.extend(a.expr[":"],{"below-the-fold":"$.belowthefold(a, {threshold : 0, container: window})","above-the-fold":"!$.belowthefold(a, {threshold : 0, container: window})","right-of-fold":"$.rightoffold(a, {threshold : 0, container: window})","left-of-fold":"!$.rightoffold(a, {threshold : 0, container:window})"})})(jQuery);$(function(){$("img").lazyload({placeholder:"http://1.bp.blogspot.com/-Qg5bi1ZtDdM/VZ5nHAyYBqI/AAAAAAAAChE/exGnasO4oyk/s640/arlinadesign.gif",effect:"fadeIn",threshold:"0"})});
$(function(){$(window).scroll(function(){$(this).scrollTop()>400?$(".simplifytotop").addClass('arlniainf'):$(".simplifytotop").removeClass('arlniainf')}),$(".simplifytotop").click(function(){return $("html,body").animate({scrollTop:0},400),!1})});
function getCurrentYear(){var e=new Date;return e.getFullYear()}el=document.getElementById(&quot;current-year&quot;),el.innerHTML=getCurrentYear();
function show(e){document.getElementById(e).style.display=&quot;block&quot;}function hide(e){document.getElementById(e).style.display=&quot;none&quot;}
$(function(){if($("#HTML1").length){var o=$("#HTML1"),t=$("#HTML1").offset().top,i=$("#HTML1").height();$(window).scroll(function(){var s=$("#comments").offset().top-i-20,f=$(window).scrollTop();if(f>t?o.css({position:"fixed",top:83}):o.css("position","static"),f>s){var n=s-f;o.css({top:n})}})}});
$('i[rel="pre"]').replaceWith(function(){return $("<pre><code>"+$(this).html()+"</code></pre>")});for(var pres=document.querySelectorAll("pre,code,kbd,blockquote,td"),i=0;i<pres.length;i++)pres[i].addEventListener("dblclick",function(){var e=getSelection(),t=document.createRange();t.selectNodeContents(this),e.removeAllRanges(),e.addRange(t)},!1);
function blockLinks(e,n){for(var a=document.getElementById(e),m=a.getElementsByTagName(n),t=0;t<m.length;t++)-1!==m[t].innerHTML.indexOf("</a>")&&(m[t].innerHTML="Warning!! SPAM has been detected!",m[t].className="spammer-detected")}blockLinks("comment_block","p");
function downloadJSAtOnload(){var e=document.createElement("script");e.src="https://cdn.rawgit.com/Arlina-Design/FlamingTree/master/highlightpro.js",document.body.appendChild(e)}window.addEventListener?window.addEventListener("load",downloadJSAtOnload,!1):window.attachEvent?window.attachEvent("onload",downloadJSAtOnload):window.onload=downloadJSAtOnload;
$(document).ready(function(){$(&quot;#flippy&quot;).click(function(){$(&quot;#flippanel&quot;).slideToggle(&quot;normal&quot;)})});
//Related Post Thumb
$(&quot;ul#related-summary li img&quot;).each(function(){$(this).attr(&quot;src&quot;,$(this).attr(&quot;src&quot;).replace(/\/s[0-9]+(\-c)?\//,&quot;/w200-h140-c/&quot;))});
// Nav
!function(t){var e=t("a.blog-pager-newer-link"),l=t("a.blog-pager-older-link");t.get(e.attr("href"),function(l){e.html(t(l).find(".post h1.post-title").text())},"html"),t.get(l.attr("href"),function(e){l.html(t(e).find(".post h1.post-title").text())},"html")}(jQuery);
// Youtube Responsive
setTimeout(function(){$(".video-youtube").each(function(){$(this).replaceWith('<iframe class="video-youtube loader" src="'+$(this).data("src")+'" allowfullscreen="allowfullscreen" height="281" width="500"></iframe>')})},5e3);
