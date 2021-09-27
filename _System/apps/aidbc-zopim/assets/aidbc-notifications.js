/* 
* 
* Copyright (c) 2012-2014 Adobe Systems Incorporated. All rights reserved.

* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation 
* the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
* DEALINGS IN THE SOFTWARE.
* 
*/

// JavaScript Document

var AIDBC_NOTIFICATIONS_DISMISSED_COOKIE = 'bcNotificationsInlineHelpDismissed';

$(document).ready(function() {
	_loadInstructions();
});

function _loadInstructions() {
	var instructionsHolder = $("#tab-instructions");
	
	var request = $.ajax({
		"url": "templates/instructions.tpl",
		"contentType": "text/plain"
	});
	
	request.done(function(data) {
		instructionsHolder.html(data);
		
		$(instructionsHolder).find("button[data-sid='btn-uninstall-app']").click(_uninstallApplication);
	});
	
	request.fail(function(xhr, textStatus, err) {
		console.log("bc-gallery instructions are not found.");
	});
}

function _uninstallApplication() { 	
	var backendFolderPath = "/_System/apps/bc-gallery",
		   redirected = false;
	
	var backendFolder = new BCAPI.Models.FileSystem.Folder(backendFolderPath);

	$.removeCookie(AIDBC_NOTIFICATIONS_DISMISSED_COOKIE);
	
	backendFolder.destroy().always(function() {
		console.log(frontendFolderPath + " folder was completely removed.");
		
		if(!redirected) {
			redirected = true;
			_redirectToDashboard();			
		}		
	});
	
}

function _redirectToDashboard() {
	var parentLocation = document.referrer,
		  dashboardUrl = parentLocation.substring(0, parentLocation.indexOf("/Admin")) + "/Admin/Dashboard_Business.aspx";
	
	window.parent.location = dashboardUrl;
}

function _showAppHelper() {
    if ($.cookie(AIDBC_NOTIFICATIONS_DISMISSED_COOKIE)) {
        return;
    }

    $('div.inlinehelp').show();    
    
    $('.inlinehelp .close-btn').click( function(){
        $('div.inlinehelp').hide();
        $.cookie(AIDBC_NOTIFICATIONS_DISMISSED_COOKIE, true, { expires: 365 });
    });
}

function resetFormElement(e) {
  e.wrap('<form data-netlify="true">').closest('form').get(0).reset();
  e.unwrap();
}

// end add image functions

function onAPIError(data, xhr, options) {
    var errorMessage = "Unknown error.";
    if (xhr.responseText) {
        errorMessage = "Server error. Error code: " + JSON.parse(xhr.responseText).code;
    }
    systemNotifications.showError("API Error", errorMessage);
};
