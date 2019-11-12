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

	$('#autoscrollup').on('click', function() {
		console.log('click autoscrollup');
		window.clearInterval(interval);
		intTime += 30;
		if (intTime > 1000) intTime = 1000;
		interval = setInterval(function() {  var pos = b.scrollTop(); b.scrollTop(pos + 2); }, intTime);
	});

	$('#autoscrolldown').on('click', function() {
		window.clearInterval(interval);
		intTime -= 30;
		if (intTime < 20) intTime = 20;
		interval = setInterval(function() { var pos = b.scrollTop(); b.scrollTop(pos + 2); }, intTime);
	});

	$('#autoscrollstop').on('click', function() {
		window.clearInterval(interval);
		intTime = 300;
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
        html += '</div>';  // content
        html += '</div>';  // dialog
        html += '</div>';  // modalWindow
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
    
    $("#youtube-button").popover({
        html: true,
        placement: 'left',
        content: function() {
            return $('#youtube-player').html();
        }
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
