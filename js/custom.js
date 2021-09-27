$(function () {
    //check login info display member-nav if logged in, otherwise display public
	var loggedin = window.ISLOGGEDIN;
	if (loggedin == 1) {
		$("#member-links").css({
			"display": "block"
		});
		$("#public-links").css({
			"display": "none"
		});
	}
	else {
		$("#member-links").css({
			"display": "none"
		});
		$("#public-links").css({
			"display": "block"
		});
	}

	// popover
	$("a[rel=popover]").popover();
	$("#ccv").popover(); 

	// tooltip
	$("a[rel=tooltip]").tooltip();

	// Updates the amount form field on event registration form
	$('#BookingAmount').val(parseFloat($('#event-price').text()).toFixed(2));
	
	// Replaces the default BC "No events found." message
	var customEmptyMessage = "Registration for this event is not currently open.";
	if ($('#event-registration').text().trim() == "No events found.") $('#event-registration').text(customEmptyMessage);					

	// when textarea is focussed we select all code
	$(".bannerCode").focus(function(){
	    $(this).select();
	});	
	// work magic on banners
	affiliateLink = $("div.affiliateInfo a:first").attr("href");
	$("div.banners div.item").each(function(){
	    var bannerImage = $(this).find("img").attr("src");
	    var url = document.domain;
	    var html = "<a href='"+affiliateLink+"'><img src='http://"+url+bannerImage+"' /></a>";
	    $(this).find(".bannerCode").text(html);
	    $(this).find(".textCode").text(affiliateLink);
	});

	$(".results-product.clearfix").unwrap();
/* 	$(".productItem").unwrap(); */
	$("ul.productList").replaceWith($("ul.productList").html());
	$( ".largeProduct ul.item-list" ).removeClass( "isotope");		

	$("li.pag-current").append('<span class="sr-only">(current)</span>').wrapInner('<a href="#" />').addClass('active');
	
	$("ul#webapp16074pagination").addClass('hidden-print');

	$("aside").addClass('hidden-print');

	var option = $('#CAT_Custom_395204').find(":selected").text();
	$('#ProCareAmount').val(option);
	
	$('#CAT_Custom_395204').change(function () {
	    var selected_item = $(this).val()
	    $('#ProCareAmount').val(selected_item);
	    $('#ProCareAmount').attr('value', $('#CAT_Custom_395204').val())
	});
});
