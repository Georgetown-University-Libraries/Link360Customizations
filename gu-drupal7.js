$(document).ready(function() {
	$("#gu-footer").before("<div id='gu-summon'><div id='gu-summon-body'/><button type='button' onclick='guSummonToggle(false)'>Classic View</button></div>");
	if (loadPrototype()) {
		$("#GU-RES2").append("<button type='button' onclick='javascript:guSummonToggle(true)'>Enhanced View</button>");	
		guSummonToggle(true);
	}
});

function guSummonToggle(v) {
	if (v) {
		$("#gu-summon").show();
		$("#gu-citation-tools").append($("table.gu-citation-tools"));
		$("#GU-RES2").hide();
	} else {
		$("#gu-summon").hide();
		$("#gu-citation-tools-hold").append($("table.gu-citation-tools"));
		$("#GU-RES2").show();		
	}
}

function guSubmit() {
	$('#help-form').submit();
}

function setHelp(field, val) {
	$('#help-form').find("input[name="+field+"]").val($.trim(val.text()));
}

function createPrototypeButton(h, name, ti) {
	$("#gu-more").append('<p class="ask"><a href="' + h+'" title="'+ti+'"><button class="box">'+name+'</button></a></p>');					
}

function testNoFormat() {
	if (typeof format == "undefined") return true;
	return false;
}

function createPrototypeElements() {
	var target = "Article";
	var target_cont = "journal";
	if (testNoFormat()) {
	} else if (format == "Book" || format == "BookFormat") {
    	target = "Chapter";
    	target_cont = "book";
    }


    var gub = $("#gu-summon-body");
    
	makeCitation();

    gub.append("<h4 class='gu-ft'>For full-text, click &quot;"+target+"&quot; if available below.</h4>"); 

	var rows = displayFullTextTable();
	
	displayDisambiguation();
	
	if (rows == 0) {
		$("h4.gu-ft").text($("span.SS_NoResults:first").text());
		$("#gu-summon span.SS_NoResults:first").hide();
	}

	//More information links
	var cust = $("td.CustomLink a.AnchorButton,td.CustomLinkGroup a.AnchorButton");
	if (cust.length > 1) {
		gub.append("<h4 class='gu-more-i'><span class='gu-more-i ui-icon ui-icon-triangle-1-e'></span>If a link to full-text is not available above...</h4>");
		gub.append("<p class='gu-more'>Try one of the options below for obtaining full-text</p>");
		gub.append("<div id='gu-more'/>");
		
		cust.each(function(){
			var h=$(this).attr("href");
			var ti=$(this).text();
			var ti2 = ti;
			if (ti.substr(0,23) == "Get electronic copy of ") {
				createPrototypeButton(h, ti2, "Request this resource from another library.  Allow 1-2 business days for delivery.");
			} else if (ti == "by ISSN") {
				ti2 = "Search Catalog " + ti;
				createPrototypeButton(h, ti2, "Try your search again using the Georgetown Library Catalog");
			} else if (ti == "By ISBN") {
				ti2 = "Search Catalog " + ti;
				createPrototypeButton(h, ti2, "Try your search again using the Georgetown Library Catalog");
			} else if (ti == "by Title") {
				ti2 = "Search Catalog " + ti;
				createPrototypeButton(h, ti2, "Try your search again using the Georgetown Library Catalog");
			} else if (ti != "Responsible use of electronic resources") {
				createPrototypeButton(h, ti2, ti2);
			}
		});
		
		
		gub.append("<div id='gu-more2'/>");
		cust.each(function(){
			var h=$(this).attr("href");
			var ti=$(this).text();
			if (ti == "Responsible use of electronic resources") {
				$("table.gu-tbl").after("<div id='gu-responsible'/>");
				$("#gu-responsible").append($(this).clone(true,true));
			}
		});
	} else if (cust.length == 1) {
		gub.append("<div id='gu-more2'/>");
		cust.each(function(){
			var h=$(this).attr("href");
			var ti=$(this).text();
			if (ti == "Responsible use of electronic resources") {
				$("table.gu-tbl").after("<div id='gu-responsible'/>");
				$("#gu-responsible").append($(this).clone(true,true));
			}
		});		
	}

	if (rows == 0) {
		$("h4.gu-more-i").hide();
	}
	
	$("table.gu-tbl").after("<div id='gu-terms-of-use'/>");
	$("#gu-terms-of-use").append($("a.ss_pn_link").clone(true,true));
	$("#gu-terms-of-use").append(" ");
	$("#gu-terms-of-use").append($("span.SS_ALTermsOfUse").clone(true,true));

	//Help Block
	gub.append("<h4 class='gu-help-i'><span class='gu-help-i ui-icon ui-icon-triangle-1-e'></span>Additional help</h4>");
	gub.append("<div id='gu-help'/>");
	gub.append("<form id='help-form' action='http://www.library.georgetown.edu/e-problem' method='GET'/>"); //existing version of webform in PROD will only take GET params
	createHelpForm();
	$("#gu-help").append('<p class="ask"><a href="javascript:guSubmit()" id="gu-eresource" href="#" title="Report a problem with this electronic '+target_cont+'"><button class="box">Report a Problem</button></a></p>');
	$("#gu-help").append('<p class="ask"><a href="http://www.library.georgetown.edu/ask-us" title="Contact a librarian for assistance"><button class="box"><img style="border:none;" src="//www.library.georgetown.edu/sites/all/themes/gu_library_7/images/ask-us-icon.png">Ask Us</button></a></p>');
	//$("#gu-help").append('<p class="ask"><a href="http://www.library.georgetown.edu/loans" title="Request item by inter-library loan"><img style="border:none;" src="http://www.library.georgetown.edu/sites/default/files/images/cant-find-it.png"></a></p>');


	$("h4.gu-more-i").toggle(
		function(){
			$("#gu-more,p.gu-more").show();
			$("span.gu-more-i").removeClass("ui-icon-triangle-1-e");
			$("span.gu-more-i").addClass("ui-icon-triangle-1-s");
		}, 
		function(){
			$("#gu-more,p.gu-more").hide();
			$("span.gu-more-i").addClass("ui-icon-triangle-1-e");
			$("span.gu-more-i").removeClass("ui-icon-triangle-1-s");				
		}
	);
	
	if ($("table.gu-tbl td.gu-art button").length == 0) {$("h4.gu-more-i").click();}

	$("h4.gu-help-i").toggle(
		function(){
			$("#gu-help").show();
			$("span.gu-help-i").removeClass("ui-icon-triangle-1-e");
			$("span.gu-help-i").addClass("ui-icon-triangle-1-s");
		}, 
		function(){
			$("#gu-help").hide();
			$("span.gu-help-i").addClass("ui-icon-triangle-1-e");
			$("span.gu-help-i").removeClass("ui-icon-triangle-1-s");				
		}
	);	
}

function displayDisambiguation() {
	var disamb = $("div.SS_HoldingText");
	if (disamb.length == 0) return;
	var h4 = $("h4:contains(Your search returned)");
	var gub = $("#gu-summon-body");
	gub.append(h4.clone(true,true));
	gub.append(disamb.clone(true,true));
}

function createHelpForm() {
	$("#help-form").append("<input type='hidden' name='URL' value='" + document.location + "'/>");
	$("#help-form").append("<input type='hidden' name='DB'/>");
	$("#help-form").append("<input type='hidden' name='JOURNAL'/>");
	$("#help-form").append("<input type='hidden' name='TITLE'/>");
	$("#help-form").append("<input type='hidden' name='AUTHOR'/>");
	$("#help-form").append("<input type='hidden' name='DATE'/>");
	$("#help-form").append("<input type='hidden' name='ISSN'/>");
	$("#help-form").append("<input type='hidden' name='ISBN'/>");
	$("#help-form").append("<input type='hidden' name='VOLUME'/>");
	$("#help-form").append("<input type='hidden' name='ISSUE'/>");
	$("#help-form").append("<input type='hidden' name='PAGES'/>");
	$("#help-form").append("<input type='hidden' name='DOI'/>");	
}

function displayFullTextTable() {
	$("#gu-summon-body").append($("span.SS_NoResults").clone(true,true));
	if (testNoFormat()) {
	} else if (format == "Book" || format == "BookFormat") {
		var rows = $("#BookLinkTable").children("tbody").children("tr");
		rows = rows.not("tr:has(td.ContentHeading)");
		
		if (rows.length > 0) {
			var t = $("#gu-summon-body").append("<table class='gu-tbl'/>").children("table:last");
			t.append("<tr><th colspan='2'>Links to Content</th><th>Resource</th></tr>");
			rows.each(function(i){
				srctd = $(this).children("td");
				t.append("<tr/>");
				var tr = t.find("tr:last");
				var td = tr.append("<td class='gu-art'/>").children("td:last");
				td.append($(srctd[0]).find("td.ResultsRow a").clone(true, true));
				td.find("a").wrapInner("<button type='button'/>");
				var td = tr.append("<td class='gu-jour'/>").children("td:last");
				td.append($(srctd[1]).find("a").clone(true, true));
				td.find("a").wrapInner("<button type='button'/>");
				var td = tr.append("<td class='gu-link'/>").children("td:last");
				var x = $(srctd[2]).find("a");
				if (x.length > 0) {
					td.append(x.clone(true, true));
				} else {
					td.append($(srctd[3]).text());
				}
			});
		}
    	return rows.length;
    } else {
		var rows = $("#JournalLinkTable").children("tbody").children("tr:has(td.ResultsRow)");
		
		if (rows.length > 0) {
			var t = $("#gu-summon-body").append("<table class='gu-tbl'/>").children("table:last");
			t.append("<tr><th colspan='2'>Links to Content</th><th>Coverage Range</th><th>Resource</th></tr>");
			rows.each(function(i){
				srctd = $(this).children("td");
				
				var alink = $(srctd[1]).find("td.c1 a,div.cl table tr td.ResultsRow a");
				var jlink = $(srctd[2]).find("a");
				
				if (alink.is("*") || jlink.is("*")) {
					t.append("<tr/>");
					var tr = t.find("tr:last");
					var td = tr.append("<td class='gu-art'/>").children("td:last");
					td.append(alink.clone(true, true));
					td.find("a").wrapInner("<button type='button'/>");
					var td = tr.append("<td class='gu-jour'/>").children("td:last");
					td.append(jlink.clone(true, true));
					td.find("a").wrapInner("<button type='button'/>");
					var td = tr.append("<td class='gu-cov'/>").children("td:last");
					td.append($(srctd[0]).text());
					var td = tr.append("<td class='gu-link'/>").children("td:last");
					var x = $(srctd[3]).find("a");
					if (x.length > 0) {
						td.append(x.clone(true, true));
					} else {
						td.append($(srctd[3]).text());
					}
					
				}
				
			});
			
		}
    	
		var crows = $("#crossRefMessage #CrossRefTable tr");

		if (crows.length > 0) {
			crows.each(function(i){
				srctd = $(this).children("td");
				t.append("<tr/>");
				var tr = t.find("tr:last");
				var td = tr.append("<td class='gu-art'/>").children("td:last");
				td.append($(srctd[1]).find("#ArticleCL a").clone(true, true));
				td.find("a").wrapInner("<button type='button'/>");
				var td = tr.append("<td class='gu-jour'/>").children("td:last");
				var td = tr.append("<td class='gu-cov'/>").children("td:last");
				var td = tr.append("<td class='gu-link'/>").children("td:last");
				td.append("Use CrossRef service to search doi.org for full text. DOI: ");
				//td.append($(srctd[0]).text());
				//td.append(":");
				var x = $(srctd[3]).find("a");
				if (x.length > 0) {
					td.append(x.clone(true, true));
				} else {
					td.append($(srctd[3]).text());
				}
			});
			
		}

    	return rows.length + crows.length;
    }
	
}

function makeCitation() {
	var gub = $("#gu-summon-body");
	gub.append("<div id='gu-head'><h4>Citation</h4></div>");
	gub.append("<div id='gu-citation'></div>");
	$("#gu-citation").append(getCitation());
	$("#gu-citation").append("<div id='gu-citation-tools'/>");
	var cite = $("table.SS_CitationTable + table:has(span.SSALItemExport)");
	cite.addClass("gu-citation-tools");
	cite.before("<span id='gu-citation-tools-hold'/>");
}

function citationFind(id) {
	return $("#CitationResults").find("td#"+id);
}

function citationPart(prefix, id, suff) {
	var v = citationFind(id);
	if (v.is("*")) {
		var t = $.trim(v.text());
		if (t != "") {
			return prefix + t + suff;
		}
	}
	return "";
}

function getEndPage() {
	var v = $("#exportCitationButtons input[name=epage]").val();
	v = $.trim(v);
	if (v != "") v = "-" + v;
	return v;
}

function getCitation() {
    var cite = "";

	if (testNoFormat()) {
	} else if (format == "Journal" || format == "JournalFormat") {
		if (citationFind("CitationDissertationAuthorValue").is("*")) {
			cite += citationPart("", "CitationDissertationAuthorValue", ".  ");
			cite += citationPart("", "CitationDissertationDateValue", ".  ");
			cite += citationPart("", "CitationDissertationTitleValue", ".  ");
		} else {
			cite += citationPart("", "CitationJournalAuthorValue", ".  ");
			cite += citationPart("", "CitationJournalDateValue", ".  ");
			cite += citationPart("", "CitationJournalArticleValue", "");
			var vol = citationPart("", "CitationJournalVolumeValue", "");
			var jend = (vol == "") ? "</em>" : ",</em> ";
			cite += citationPart(", <em>", "CitationJournalTitleValue", jend + vol);
			cite += citationPart("(", "CitationJournalIssueValue", ")");
			cite += citationPart(", ", "CitationJournalPageValue", getEndPage());
			cite += ".";
		}
		cite += citationPart(" (ISSN: ", "CitationJournalIssnValue", "). ")
	} else if (format == "Book" || format == "BookFormat") {
		cite += citationPart("", "CitationBookAuthorValue", ".  ");
		cite += citationPart("(", "CitationBookDateValue", ").  ");
		cite += citationPart("", "CitationBookChapterValue", ".  ");
		cite += citationPart("<em>", "CitationBookTitleValue", ".</em>  ");
		var place = citationPart("", "CitationBookPlaceValue", ": ");
		cite += citationPart(place,"CitationBookPublisherValue", ".  ")
		cite += citationPart("","CitationBookSpageValue", getEndPage())
		cite += ".";
		cite += citationPart(" (ISBN: ","CitationBookISBNValue", "). ")
	} else if (format == "Dissertation" || format == "DissertationFormat") {
		cite += citationPart("", "CitationDissertationAuthorValue", ".");
		cite += citationPart("", "CitationDissertationDateValue", ".");
		cite += citationPart("", "CitationDissertationTitleValue", ".");
		cite += citationPart(" (ISBN: ","CitationBookISBNValue", "). ")
	} else {
	}

	
	return cite;
}

function loadPrototype() {
    createPrototypeElements();

    if ($("div.SS_TitleSearchForm").is("*")) {
    	$("div.url").html("<div id='gu-help'/>").css("text-align","left");
    	if ($("div.SS_NoJournalFoundMsg").is("*")) {
        	$("#gu-help").append('<p class="ask"><a href="https://illiad.library.georgetown.edu/illiad/" title="Request access to the journal from another library"><button class="box">Check other libraries for journal access</button></a></p>');    		
    	}
    	$("#gu-help").append('<p class="ask"><a href="http://www.library.georgetown.edu/e-problem" id="gu-eresource" title="Report a problem with journal finder"><button class="box">Report a Problem</button></a></p>');
    	$("#gu-help").append('<p class="ask"><a href="http://www.library.georgetown.edu/ask-us" title="Contact a librarian for assistance"><button class="box"><img style="border:none;" src="//www.library.georgetown.edu/sites/all/themes/gu_library_7/images/ask-us-icon.png">Ask Us</button></a></p>');
        $("#gu-help").show();
    	return false;
    } else if ($("span.SS_TOU").is("*")) {
    	return false;
    } else if ($("div.SSRefinerError").is("*")) {
    	return false;
    } else	if (testNoFormat()) {
    } else if (format == null) {
    	return false;
    } else if (format == "Journal" || format == "JournalFormat") {
		if (citationFind("CitationDissertationAuthorValue").is("*")) {
			setHelp("AUTHOR", citationFind("CitationDissertationAuthorValue"));
			setHelp("TITLE", citationFind("CitationDissertationTitleValue"));
			setHelp("DATE", citationFind("CitationDissertationDateValue"));			
		} else {
			setHelp("AUTHOR", citationFind("CitationJournalAuthorValue"));
			setHelp("DATE", citationFind("CitationJournalDateValue"));
			setHelp("JOURNAL", citationFind("CitationJournalTitleValue"));
			setHelp("ISSN", citationFind("CitationJournalIssnValue"));
			setHelp("TITLE", citationFind("CitationJournalArticleValue"));
			setHelp("VOLUME", citationFind("CitationJournalVolumeValue"));
			setHelp("ISSUE", citationFind("CitationJournalIssueValue"));
			setHelp("PAGES", citationFind("CitationJournalPageValue"));			
		}
	} else if (format == "Book" || format == "BookFormat") {
		setHelp("AUTHOR", citationFind("CitationBookAuthorValue"));
		setHelp("DATE", citationFind("CitationBookDateValue"));
		setHelp("JOURNAL", citationFind("CitationBookTitleValue"));
		setHelp("ISBN", citationFind("CitationBookISBNValue"));
		setHelp("TITLE", citationFind("CitationBookChapterValue"));
		setHelp("PUBLISHER", citationFind("CitationbookPublisherValue")); //NOT IN WEBFORM
		setHelp("DOI", citationFind("CitationBookDOIValue"));
		setHelp("PAGES", citationFind("CitationBookSpageValue"));
	} else if (format == "Dissertation" || format == "DissertationFormat") {
		setHelp("AUTHOR", citationFind("CitationDissertationAuthorValue"));
		setHelp("TITLE", citationFind("CitationDissertationTitleValue"));
		setHelp("DATE", citationFind("CitationDissertationDateValue"));
	} else {
		return false;
	}
	

	return true;
}