// global vars
var _menuFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_config/menu.json');
var _originalMenuFile = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_config/menu_orig.json');
var _menuIconsFolder = new BCAPI.Models.FileSystem.Folder('/_System/Apps/solid-admin-menus/_admin/content/menu-icons');
var _currentMenuItems; //Working set of menu items pulled from the menu.json file on the server.
var _currentMenuItemsArray;
var _currentNavItemImage;  //The currently selected nav item image for use in the modal pop up.
var _adminMenuLabelsHtmlId = 'menu-custom-labels';
var _invisibleTitle = 'Hidden from users';
var _visibleTitle = 'Visible to all users';
var _graybackButtonClass = 'greyback';
var _linksToNewWindowTitle = 'Link opens in a new window';
var _linksToAdminAreaTitle = 'Links opens in admin area';
var _removesNavigationItemTitle = 'Removes navigation item';
var _visibleGlyphiconClass = 'glyphicon-eye-open';
var _invisibleGlyphiconClass = 'glyphicon-eye-close';
var _linksToNewWindowGlyphiconClass = 'glyphicon-new-window';
var _linksToAdminAreaGlyphiconClass = 'glyphicon-unchecked';
var _removesNavigationItemGlyphiconClass = 'glyphicon-minus-sign';
var _subNavigationExpandedGlyphiconClass = 'glyphicon-circle-arrow-down';
var _subNavigationCollapsedGlyphiconClass = 'glyphicon-circle-arrow-right';
var _defaultIconClass = 'default-icon';
var _userDefinedNavItemClass = 'user-defined';
var _validFileExtensions = [".png"];
var _customIconClass = 'custom-icon';
var _newNavTypeDropdownSelector;
var _httpsRecommendedForAdminWindowWarningHtml = '<div class="nav-item-warning-message alert alert-warning">\'https\' is recommended for admin links for maximum compatibility. </div>';

function hasSubNavItems(navItemContainer) {
	return ($(navItemContainer).find('.sub-nav-items .nav-item-container').length > 0);
}

function isAdminTarget(navItemContainer) {
	return $(navItemContainer).find('.nav-item-toggle-target span.' + _linksToAdminAreaGlyphiconClass).length === 1;
}

//Reassigns weights based on position of nav items.
function reassignWeights(topListContainer) {
	function reassignWeightsByNavItemContainers(navItemContainers) {
		$.each(navItemContainers, function(index, element) {
			$(element).find('.nav-item-weight input').first().val((index + 1) * 10000);
		});
	}		 
	reassignWeightsByNavItemContainers(topListContainer.children('li').children('.nav-item-container'));	 
}

function postLoadNavigationData() {
		
	var allLeftNavigationItemContainerSelector = $('.nav-item-container:not(.sub-nav-items .nav-item-container)', '#left-admin-menu');
	$('.nav-item-warning-message').remove();
	
	//Check for left nav items with sub navs and no url
	var leftNavItemContainersWithoutUrlSelector = allLeftNavigationItemContainerSelector.filter(function(){
		var url = $(this).find('input[type="url"]').val();
		return (url === '' && hasSubNavItems(this) === false);
	});
	$('<div class="nav-item-warning-message alert alert-warning">This item will not appear in the menu until either a URL is entered or sub menu items are added</div>')
	.insertBefore(leftNavItemContainersWithoutUrlSelector.find('.sub-nav-items'));
	
	//Check for left nav items with a url set that also have sub navs
	var leftNavItemContainersWithUrlAndSubNavItemsSelector = allLeftNavigationItemContainerSelector.filter(function(){
		var url = $(this).find('input[type="url"]:not(.sub-nav-items input[type="url"])').val();
		return (url !== undefined && url !== '' && hasSubNavItems(this) === true);
	});
	$('<div class="nav-item-warning-message alert alert-warning">It is not recommended to have a URL on a parent menu item when there are sub menu items</div>')
	.insertBefore(leftNavItemContainersWithUrlAndSubNavItemsSelector.find('.sub-nav-items'));
	
	//Check for sub nav items without a url
	var subNavItemContainersWithNoUrl = $('.sub-nav-items .nav-item-container', '#left-admin-menu').filter(function() {
		var url = $(this).find('input[type="url"]').val();
		return (url !== undefined && url === '');
	});	
	subNavItemContainersWithNoUrl.append('<div class="nav-item-warning-message alert alert-warning">Sub menu items should have a URL</div>');
	
	//Check for admin frame urls that are not http (warning to use https)
	var leftNavItemContainerSelector = $('.nav-item-container:not(.sub-nav-items .nav-item-container)', '#left-admin-menu').filter(function() {
		var url = $(this).find('input[type="url"]:not(.sub-nav-items input[type="url"])').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});
	
	$(_httpsRecommendedForAdminWindowWarningHtml).insertBefore(leftNavItemContainerSelector.find('.sub-nav-items'));
	
	//Check for admin frame urls that are not http (warning to use https)
	var topNavItemContainerSelector = $('.nav-item-container', '#top-admin-menu').filter(function() {
		var url = $(this).find('input[type="url"]').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});	
	 
	topNavItemContainerSelector.append(_httpsRecommendedForAdminWindowWarningHtml);
	
	var subNavItemContainerSelector = $('.sub-nav-items .nav-item-container', '#left-admin-menu').filter(function() {
		var url = $(this).find('input[type="url"]').val();				
		return(isAdminTarget(this) && url !== undefined && url !== '' && url.indexOf('https') !== 0);		
	});
	subNavItemContainerSelector.append(_httpsRecommendedForAdminWindowWarningHtml);
	
	//Hide subnav button if there are no sub nav items.
	allLeftNavigationItemContainerSelector.filter(function() {
		return hasSubNavItems(this) === false;
	}).find('.nav-item-toggle-subnav').hide();

	//Show subnav button if there are sub nav items.
	allLeftNavigationItemContainerSelector.filter(function() {
		return hasSubNavItems(this) === true;
	}).find('.nav-item-toggle-subnav').show();	
	
	$('.nav-item-image:not(.blank)').unbind('click').click(function(){
		_currentNavItemImage = this;
		$('#myModal').modal({
		  keyboard: false
		});	 
	});
	
	$('#top-admin-menu ul, #left-admin-menu ul:not(#left-admin-menu .sub-nav-items ul), #left-admin-menu .sub-nav-items ul').sortable({
		update: function (event, ui) {
			reassignWeights($(ui.item).parent());			
		}
	});	
}

function sortByMainNavAndWeight(a, b) {
	//Top (Ribbon) or Left Nav is considered main nav and should come first, then sub nav items.
	
	if ((a.menuItem.parent === undefined && b.menuItem.parent === undefined) || (a.menuItem.parent !== undefined && b.menuItem.parent !== undefined)) {
		//Both items are main nav items or sub nav items, so sort by weight.
		return (parseInt(a.menuItem.weight) < parseInt(b.menuItem.weight) ? -1 : parseInt(a.menuItem.weight) > parseInt(b.menuItem.weight) ? 1 : 0);
	} else if (a.menuItem.parent === undefined) { 
		//First item is a main nav, this should come first.
		return -1; 
	} else {
		//First item is a sub nav, this should come last.
		return 1;
	}			
}

function sortByLastModified(a, b) {
	var lastModifiedA = new Date(a.attributes.lastModified);
	var lastModifiedB = new Date(b.attributes.lastModified);
	return lastModifiedA < lastModifiedB ? -1 : lastModifiedA > lastModifiedB ? 1 : 0;
}

function loadNavigationData() {	
	_originalMenuFile.download().done(function(origMenuFileContent) {		
		var originalMenuItems = $.parseJSON(origMenuFileContent);
		_menuFile.download().done(function(content) {
			_currentMenuItems = $.parseJSON(content);
			
			_currentMenuItemsArray = [];
			$.each(_currentMenuItems, function(key) {
				_currentMenuItemsArray.push({'menuItem':_currentMenuItems[key], 'key':key});
			});
			
			_currentMenuItemsArray.sort(sortByMainNavAndWeight);
			 
			$.each(_currentMenuItemsArray, function(index, value) {
			
				if (value.key.indexOf(_adminMenuLabelsHtmlId) === 0) {
					if (value.key === _adminMenuLabelsHtmlId) {
						return;
					}
					
					//Set Access Rights Checkboxes
					var role = value.menuItem.applyIf.userHasRoles[0];
					$('#access-rights-container').find('input[value="' + role + '"]').attr('checked','checked');
				
					return;
				}
			
				var adminMenuSectionSelector;
				var glyphiconIconClass = 'blank';
				var isUserDefined = false;
				var isSubNavItem = false;
				var isTopNavItem = false;	

				var titleWatermark = 'Menu Title';
				if (originalMenuItems[value.key] !== undefined) {
					titleWatermark = originalMenuItems[value.key].title;
				}				
				
				if ((value.menuItem.parent === '' || value.menuItem.parent === undefined) && value.key.indexOf('ribbon') !== 0) {
					adminMenuSectionSelector = $('#left-admin-menu').find('ul:not(#left-admin-menu .sub-nav-items ul)');
					
					isUserDefined = value.key.indexOf("menu-AdminMenuLabels-") == 0;
					if (isUserDefined == false) {
						glyphiconIconClass = value.key.substring(5);	
					} else {
						glyphiconIconClass = _userDefinedNavItemClass;
					}
					
					var dropdownOptionText = value.menuItem.title;
					if (dropdownOptionText === '') {
						dropdownOptionText = titleWatermark;
					}
					_newNavTypeDropdownSelector.append($('<option>', { value : value.key + '-subnav' }).text('Left > ' + dropdownOptionText));
					
				} else if (value.key.indexOf('ribbon') === 0) {
					adminMenuSectionSelector = $('#top-admin-menu').find('ul');
					isUserDefined = true;
					isTopNavItem = true;
					$('#no-top-nav-items-label').hide();
				} else {					
					isUserDefined = value.key.indexOf("menu-AdminMenuLabels-") == 0;
					adminMenuSectionSelector = $('#' + value.menuItem.parent + '-subnav ul');
					isSubNavItem = true;
				} 	 

				var urlTargetTitle;
				var urlTargetGlyphClass;
				var urlTargetButtonClass ='';
				var openInNewWindow = (value.menuItem.attr !== undefined && value.menuItem.attr.target !== undefined && value.menuItem.attr.target === '_blank');
				
				if (openInNewWindow === true) {
					urlTargetTitle = _linksToNewWindowTitle;
					urlTargetGlyphClass = _linksToNewWindowGlyphiconClass;		
				} else {
					urlTargetTitle = _linksToAdminAreaTitle;
					urlTargetGlyphClass = _linksToAdminAreaGlyphiconClass;
					urlTargetButtonClass= _graybackButtonClass;
				}
				
				var visibleGlyphClass;
				var visibleTitle;
				var visibleButtonClass = '';
				var isVisible = (value.menuItem.visible !== false);
				
				if (isVisible === true) {
					visibleGlyphClass = _visibleGlyphiconClass;
					visibleTitle = _visibleTitle;
				} else {
					visibleGlyphClass = _invisibleGlyphiconClass;
					visibleTitle = _invisibleTitle;
					visibleButtonClass = _graybackButtonClass;
				}	
				
				var removeSectionHtml='';
				var urlSectionHtml ='';			
				var href='';
				if (value.menuItem.attr !== undefined && value.menuItem.attr.href !== undefined) {
					href = value.menuItem.attr.href;
				}
				
				if (isUserDefined === true) {
					removeSectionHtml = 
					['<div class="nav-item-toggle-remove">',
						 '<button type="button" class="btn btn-default btn-sm" title="' + _removesNavigationItemTitle + '">',
							 '<span class="glyphicon ' + _removesNavigationItemGlyphiconClass + '"></span>',
						 '</button>',
					 '</div>'].join('\n');
					 
					 urlSectionHtml = 
					 ['<div class="nav-item-url">',
						 '<input type="url" value="' + href + '" placeholder="URL" />',
					 '</div>',
					 '<div class="nav-item-toggle-target">',
						 '<button type="button" class="btn btn-default btn-sm ' + urlTargetButtonClass +'" title="' + urlTargetTitle + '">',
							 '<span class="glyphicon ' + urlTargetGlyphClass + '"></span>',
						 '</button>',
					 '</div>'].join('\n');
				}
				
										
				var subNavToggleHtml = '';
				var subNavWrapperHtml = '';								
				if (isSubNavItem === false && isTopNavItem === false) {
					subNavToggleHtml =
					['<div class="nav-item-toggle-subnav">',
						'<button type="button" class="btn btn-default btn-sm ' + _graybackButtonClass + '" title="Collapse sub menu items">',
							'<span class="glyphicon ' + _subNavigationCollapsedGlyphiconClass + '"></span> Sub Menu',
						'</button>',
					'</div>'].join('\n');
					subNavWrapperHtml = 
					['<div id = "' + value.key + '-subnav" class="sub-nav-items" style="display:none;">',
					'<ul></ul>',
					'</div>'].join('\n');					
					
					var hasCustomIconClass = '';
					var iconStyle = '';
					var iconAttribute = '';
					if (value.menuItem.icon !== undefined) {	
						iconAttribute = 'icon-url="' + value.menuItem.icon + '" ';
						iconStyle = 'background:url(\'' + value.menuItem.icon + '\') 0 0 no-repeat;';
						hasCustomIconClass = _customIconClass;												
					}					
				}
							
				var newNavContainerString = 
					['<li>',
					'<div class="nav-item-container">',
						 '<input type="hidden" value="' + value.key + '"/>',
						 '<div class="nav-item-image ' + glyphiconIconClass + ' ' + hasCustomIconClass + '" ' + iconAttribute + ' style="' + iconStyle + '" title="Click to change icon">',						 
						 '</div>',						 				 
						 '<div class="nav-item-title">',
							'<input type="text" value="' + value.menuItem.title + '" placeholder="' + titleWatermark + '" />',
						 '</div>',

						 '<div class="nav-item-weight">',
							'<input type="number" value="' + value.menuItem.weight + '" placeholder="Weight" />',
						 '</div>',
						 '<div class="nav-item-toggle-hide">',
							 '<button type="button" class="btn btn-default btn-sm ' + visibleButtonClass + '" title="' + visibleTitle + '">',
								 '<span class="glyphicon ' + visibleGlyphClass + '"></span>',
							 '</button>',
						 '</div>',				 
						 urlSectionHtml,
						 removeSectionHtml,
						 subNavToggleHtml,
						 subNavWrapperHtml,
					 '</div>',					 
					 '</li>'].join('\n');
				$(adminMenuSectionSelector).append(newNavContainerString);				 
				
			});
			setNavigationItemButtons();
			postLoadNavigationData();	 	
		});
	});
}

function isValidTitle(title) {
	var tempVal = title.replace(/ /g,'');
	
	//Blank title is OK
	if (title === '') { 
		return true; 
	}
	return /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(tempVal) === true;
}

function isValidUrl(url) {	
	var re1='((?:http|https)(?::\\/{2}[\\w]+)(?:[\\/|\\.]?)(?:[^\\s"]*))';	// HTTP URL 1
	var p = new RegExp(re1,["i"]);
	return p.exec(url) !== null;
}

function getUniqueHtmlId(seed) {
	var tempHtmlId = seed.replace(/ /g,'');
	var derivedHtmlId = tempHtmlId;
	// Make sure HtmlId is unique
	var isMatch;
	var suffix = 1;
	
	do {
		isMatch = $('.nav-item-container input[type="hidden"][value="' + derivedHtmlId + '"]', '#editLabelForm').length === 1;
		if (isMatch) {
			derivedHtmlId = tempHtmlId + suffix; 
		}
		suffix+=1;
	}	
	while (isMatch === true);	

	return derivedHtmlId;
}

function addNewLabelToList(e) {
	e.preventDefault();
	
	var errors = '';
	var title = $.trim($('#NewTitle').val());
	if (title === '') {
		errors += 'You must enter a value for "Title"\n';
	}
	
	if (isValidTitle(title) === false) {	
		errors += 'You may only add alphanumeric characters for the "Title"\n';
	} 
	
	var url = $.trim($('#NewUrl').val());
	if (url !== '' && isValidUrl(url) === false) {
		errors += 'You must enter Urls starting with "http://" or "https://"';
	}
		
	if (errors !== '') {
		alert('Please fix the following errors: \n' + errors);
		return;
	}
	
	var navTypeValue = _newNavTypeDropdownSelector.val();
	var targetParentNavContainerSelector = $('#' + navTypeValue + '> ul');
	var openInNewWindow = $('#NewOpenInNewWindow').is(':checked');
	
	var urlTargetTitle;
	var urlTargetGlyphClass;
	var urlTargetButtonClass ='';
	if (openInNewWindow === true) {
		urlTargetTitle = _linksToNewWindowTitle;
		urlTargetGlyphClass = _linksToNewWindowGlyphiconClass;		
	} else {
		urlTargetTitle = _linksToAdminAreaTitle;
		urlTargetGlyphClass = _linksToAdminAreaGlyphiconClass;
		urlTargetButtonClass= _graybackButtonClass;
	}	
	
	var newHtmlId;
	var navItemImageClass = 'blank';	
	var subNavToggleHtml = '';
	var subNavWrapperHtml = '';
	if (navTypeValue === 'top-admin-menu') {
		newHtmlId = getUniqueHtmlId('ribbon-AdminMenuLabels-' + title);
		$('#no-top-nav-items-label').hide();
	} else if (navTypeValue === 'left-admin-menu') {
		newHtmlId = getUniqueHtmlId('menu-AdminMenuLabels-' + title);
		
		navItemImageClass = _userDefinedNavItemClass;
		subNavToggleHtml =
		['<div class="nav-item-toggle-subnav">',
			'<button type="button" class="btn btn-default btn-sm ' + _graybackButtonClass + '" title="Collapse sub menu items">',
				'<span class="glyphicon ' + _subNavigationCollapsedGlyphiconClass + '"></span> Sub Menu',
			'</button>',
		'</div>'].join('\n');
		subNavWrapperHtml = 
		['<div id = "' + newHtmlId + '-subnav" class="sub-nav-items">',
		'<ul></ul>',
		'</div>'].join('\n');

        _newNavTypeDropdownSelector.append($('<option>', { value : newHtmlId + '-subnav' }).text('Left > ' + title));
		
	} else { //Sub Nav
		newHtmlId = getUniqueHtmlId('menu-AdminMenuLabels-' + title);
	}
	 
	var newNavContainerString = 
	['<li>',
	 '<div class="nav-item-container">',
	 '<input type="hidden" value="' + newHtmlId + '"/>',
	 '<div class="nav-item-image ' + navItemImageClass + '" title="Click to change icon">',	 
	 '</div>',	
	 '<div class="nav-item-title">',
	 	'<input type="text" value="' + title + '" placeholder="Menu Title" />',
	 '</div>',

	 '<div class="nav-item-weight">',
	 	'<input type="number" value="-1" placeholder="Weight" />',
	 '</div>',
	 '<div class="nav-item-toggle-hide">',
	 	 '<button type="button" class="btn btn-default btn-sm" title="' + _visibleTitle + '">',
			 '<span class="glyphicon ' + _visibleGlyphiconClass + '"></span>',
		 '</button>',
	 '</div>',
	 '<div class="nav-item-url">',
		 '<input type="url" value="' + url + '" placeholder="URL" />',
	 '</div>',
	 '<div class="nav-item-toggle-target">',
		 '<button type="button" class="btn btn-default btn-sm ' + urlTargetButtonClass +'" title="' + urlTargetTitle + '">',
			 '<span class="glyphicon ' + urlTargetGlyphClass + '"></span>',
		 '</button>',
	 '</div>',
	 '<div class="nav-item-toggle-remove">',
		 '<button type="button" class="btn btn-default btn-sm" title="' + _removesNavigationItemTitle + '">',
			 '<span class="glyphicon ' + _removesNavigationItemGlyphiconClass + '"></span>',
		 '</button>',
	 '</div>',
	 subNavToggleHtml,
	 subNavWrapperHtml,
	 '</div>',	 
	 '</li>'].join('\n');
	
	targetParentNavContainerSelector.prepend($(newNavContainerString).hide().fadeIn(1500));
	reassignWeights(targetParentNavContainerSelector);
	$('#' + newHtmlId + '-subnav').hide();
	postLoadNavigationData();
	$('#addLabelForm').find('.form-actions button[type="reset"]').click();
	setNavigationItemButtons();
	showItemAddedAlert();	
}

function setNavigationItemButtons() {
	$('.nav-item-toggle-hide button').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_visibleGlyphiconClass)) {
			span.removeClass(_visibleGlyphiconClass);
			span.addClass(_invisibleGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title',_invisibleTitle);			
		} else {
			span.removeClass(_invisibleGlyphiconClass);
			span.addClass(_visibleGlyphiconClass);
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title',_visibleTitle);
		}
	});
	
	$('.nav-item-toggle-target button').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_linksToNewWindowGlyphiconClass)) {
			span.removeClass(_linksToNewWindowGlyphiconClass);
			span.addClass(_linksToAdminAreaGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title',_linksToAdminAreaTitle);			
		} else {
			span.removeClass(_linksToAdminAreaGlyphiconClass);
			span.addClass(_linksToNewWindowGlyphiconClass);	
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title',_linksToNewWindowTitle);
		}
		
		postLoadNavigationData();
	});
	
	$('.nav-item-toggle-subnav button').unbind('click').click(function() {
		var span = $(this).find('span');
		if (span.hasClass(_subNavigationExpandedGlyphiconClass)) {
			span.removeClass(_subNavigationExpandedGlyphiconClass);
			span.addClass(_subNavigationCollapsedGlyphiconClass);
			$(this).addClass(_graybackButtonClass);
			$(this).attr('title','Expand sub menu items');
			$(this).parents('.nav-item-container').find('.sub-nav-items').slideUp();
		} else {
			span.removeClass(_subNavigationCollapsedGlyphiconClass);
			span.addClass(_subNavigationExpandedGlyphiconClass);
			$(this).removeClass(_graybackButtonClass);
			$(this).attr('title','Collapse sub menu items');
			$(this).parents('.nav-item-container').find('.sub-nav-items').slideDown();
		}
	});
	
	$('.nav-item-toggle-remove button').unbind('click').click(function() {
		if (window.confirm('Are you sure you want to remove this navigation item?')) {
		
			var parentHtmlId = $(this).closest('.nav-item-container').find('input[type="hidden"]').first()[0].value;
            _newNavTypeDropdownSelector.find('option[value="' + parentHtmlId + '-subnav"]').each(function() {
				$(this).remove();
			});
			
			$(this).closest('li').fadeOut(500, function() {
				$(this).remove();
				if ($('#top-admin-menu').find('.nav-item-container').length === 0) {
					$('#no-top-nav-items-label').show();
				}
				postLoadNavigationData();
			});
		}
	});
	
	//Bind Delete Icon Button
	$('#delete-icon').unbind('click').click(function() {
	
		var selectedImageSelector = $('.library-icon.selected');
		
		if (selectedImageSelector.hasClass(_defaultIconClass)) {
			window.alert('You may not delete a default icon');
			return;
		}
		
		if (selectedImageSelector.length === 0) {
			window.alert('You must select an icon to delete');
			return;
		}
		
		if (!window.confirm('Are you sure you want to remove this icon? Any menu items using this icon will no longer display it.')) {
			return;
		}
		
		var selectedImageFile = new BCAPI.Models.FileSystem.File('/_System/Apps/solid-admin-menus/_admin' + selectedImageSelector.attr('icon-url').substring(1));
		selectedImageFile.destroy().done(function() {
			loadMenuIcons();
	    });
	});
	
	$('#select-icon').unbind('click').click(function() {
		var selectedImageSelector = $('.library-icon.selected');
		if (selectedImageSelector.length === 0) {
			window.alert('You must select an icon');
			return;
		}
		
		var fullIconPath = '/_System/Apps/solid-admin-menus/_admin' + selectedImageSelector.attr('icon-url').substring(1);
		$(_currentNavItemImage).removeClass(_userDefinedNavItemClass);
		$(_currentNavItemImage).addClass(_customIconClass);
		$(_currentNavItemImage).attr('icon-url',fullIconPath);
		$(_currentNavItemImage).css('background','url(\'' + fullIconPath + '\') 0 0 no-repeat');
		$('#myModal').modal('hide');
	});
	
	$('#upload-new-icon').find('input[type="file"]').unbind('change').change(function() {
			var fileUploadInput = this;
			var fileName = fileUploadInput.value;
			if (fileName.length > 0) {
				var isFileExtensionValid = false;
				var fileExtension;
				for (var j = 0; j < _validFileExtensions.length; j++) {
					fileExtension = _validFileExtensions[j];
					if (fileName.substr(fileName.length - fileExtension.length, fileExtension.length).toLowerCase() == fileExtension.toLowerCase()) {
						isFileExtensionValid = true;
						break;
					}
				}

				if (!isFileExtensionValid) {
					alert("Sorry, " + fileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
					return;
				}
				
				$('.uploading-icon-message','#myModal').fadeIn();
			 
				var fileUploadInputSelector = $(fileUploadInput);
				var newFileName = RAT.Helper.Primitives.generateGuid() + fileExtension;
				var imageFileLocation = BCAPI.Models.FileSystem.Root.file('/_System/Apps/solid-admin-menus/_admin/content/menu-icons/' + newFileName);
				imageFileLocation.upload($(fileUploadInput)[0].files[0]).done(function() {
					fileUploadInputSelector.replaceWith( fileUploadInputSelector = fileUploadInputSelector.clone( true ) );
					loadMenuIcons(newFileName, function() {$('.uploading-icon-message','#myModal').fadeOut();	});
								 
				});
		  }
		});
}
function showItemAddedAlert() {	
	$('.new-item-added-message').show().delay(5000).fadeOut(1000);
}

function showSavedAlert() {
	$('.saved-message').show();
}

function showSaveAlert() {
	$('.save-actions').hide();
	$('.saving-message').show();
}

function revertSaveAlert() {
	$('.save-actions').show();
	$('.saving-message').hide();
}

function saveChanges() {
	showSaveAlert();
	var navItemContainersSelector = $('.nav-item-container','#editLabelForm');
	
	var errors = '';
	var accessRightsSelectedCheckboxes = $('#accessRightsForm').find('input[type="checkbox"]:checked');
	
	if (accessRightsSelectedCheckboxes.length === 0) {
		errors += 'You must select at least one role with access rights to this application.\n';
	}
	
	$.each(navItemContainersSelector, function(index, value) {
	
		var navItemContainerSelector = $(value);
		var htmlId = navItemContainerSelector.find('input[type="hidden"]').first().val();
		var title = navItemContainerSelector.find('.nav-item-title input').first().val();
		var url='';
		var isUserDefined = htmlId.indexOf('ribbon-') === 0 || htmlId.indexOf('menu-AdminMenuLabels-') === 0;		
		
		//Validation
		if (isValidTitle(title) === false) {	
			errors += 'You may only add alphanumeric characters for the "Title"\n';
		} 
		
		if (isUserDefined === true) {
			url = $.trim(navItemContainerSelector.find('.nav-item-url input').first().val());
			
			if (url !== '' && isValidUrl(url) === false) {
				errors += 'You must enter Urls starting with "http://" or "https://"';
			}
		}
				
		//Set basic fields for each property on the main menu items object.
		if (_currentMenuItems[htmlId] === undefined) {
			_currentMenuItems[htmlId] = {};
		}
		
		_currentMenuItems[htmlId].title = title;
		_currentMenuItems[htmlId].weight = navItemContainerSelector.find('.nav-item-weight input').first().val();
		_currentMenuItems[htmlId].visible = navItemContainerSelector.find('.nav-item-toggle-hide button').first().hasClass(_graybackButtonClass) === false;
		
		//Set custom icon URL if applicable.
		var hasCustomBackgroundImage = navItemContainerSelector.find('.nav-item-image').first().hasClass(_customIconClass);
		
		if (hasCustomBackgroundImage === true) {
			_currentMenuItems[htmlId].icon = navItemContainerSelector.find('.nav-item-image').first().attr('icon-url');		
		} else {
			_currentMenuItems[htmlId].icon = undefined;
		}
		
		if (url !== '') {
			_currentMenuItems[htmlId].attr = {};
			_currentMenuItems[htmlId].attr.href = url;
						
			if (navItemContainerSelector.find('.nav-item-toggle-target button').first().hasClass(_graybackButtonClass) === false) {
				_currentMenuItems[htmlId].attr.target = '_blank';
			} else {
				_currentMenuItems[htmlId].attr.target = undefined;
			}			
		} else {
			_currentMenuItems[htmlId].attr = undefined;
		}
		
		if (navItemContainerSelector.closest('.sub-nav-items').length > 0) {
			_currentMenuItems[htmlId].parent = navItemContainerSelector.closest('.sub-nav-items')[0].id.replace(/\-subnav/g,'');
		} else {
			_currentMenuItems[htmlId].parent = undefined;
		}
	});
	
	if (errors !== '') {
		alert('Please fix the following errors: \n' + errors);
		revertSaveAlert();
		return;
	}
	
	//See if we removed any items
	$.each(_currentMenuItems, function(key) {
		if (key !== _adminMenuLabelsHtmlId && $('.nav-item-container input[type="hidden"][value="' + key + '"]','#editLabelForm').length === 0) {
			_currentMenuItems[key] = undefined;
		}
	});	
		
	//Update Access Rights Settings	 
	//Because of the need to create badly formed json to populate menu.json we have to do some resetting and 
	//string replacement on the 'menu-custom-labels' properties		
	$.each(_currentMenuItemsArray, function(index, value) {
		if (value.key.indexOf(_adminMenuLabelsHtmlId) === 0) {
			_currentMenuItems[value.key] = undefined;
		}
	});
	
	_currentMenuItems[_adminMenuLabelsHtmlId] = {};
	_currentMenuItems[_adminMenuLabelsHtmlId].title = 'Admin Menu Labels';
	_currentMenuItems[_adminMenuLabelsHtmlId].parent = 'menu-site-settings';
	_currentMenuItems[_adminMenuLabelsHtmlId].visible = false;	
		
	if (accessRightsSelectedCheckboxes.length > 0) {
		$.each(accessRightsSelectedCheckboxes, function(index, element) {
			var currentProperty = _adminMenuLabelsHtmlId + index;
			_currentMenuItems[currentProperty] = {};
			_currentMenuItems[currentProperty].title = "Admin Menu Labels";
			_currentMenuItems[currentProperty].parent = "menu-site-settings";
			_currentMenuItems[currentProperty].attr = {};
			_currentMenuItems[currentProperty].attr.href = "/Admin/AppLoader.aspx?client_id=solid-admin-menus";
			_currentMenuItems[currentProperty].weight = 200000;
			_currentMenuItems[currentProperty].visible = false;
			_currentMenuItems[currentProperty].applyIf = {};
			_currentMenuItems[currentProperty].applyIf.userHasRoles = [];
			_currentMenuItems[currentProperty].applyIf.userHasRoles.push($(element).attr('value'));
			_currentMenuItems[currentProperty + 'copy'] = $.extend(true, {}, _currentMenuItems[currentProperty]);
			_currentMenuItems[currentProperty + 'copy'].visible = true;
		});		
	} 
	 
	var menuItemString = JSON.stringify(_currentMenuItems);
	
	//Replacing the "copy" properties with the "menu-custom-labels" property name after the JS object is converted to a string
	//because this would yield badly formed JSON.
	$.each(accessRightsSelectedCheckboxes, function(index) {
		menuItemString = menuItemString.replace('menu-custom-labels' + index + 'copy', 'menu-custom-labels');
	});
		
	_menuFile.upload(menuItemString).done(function() {	
		try {
			window.parent.location.reload();
		} catch (e) {
			revertSaveAlert();
			showSavedAlert();
		}		
	});	
}

function loadMenuIcons(newFileName, callback) {
	 _menuIconsFolder.fetch().done(function() {         
		 var contents = _menuIconsFolder.get('contents');		 
		 contents.sort(sortByLastModified);
		 var modalRowsSelector = $('#myModal').find('.library-rows');
		 modalRowsSelector.empty();
		 var currentIconRowSelector;
		 for (var i = 0; i < contents.length; i++) {
			 if (i % 15 === 0) {
				modalRowsSelector.append('<div class = "library-row"></div>');
				currentIconRowSelector = $('.library-row', '#myModal').last();
			 }			 
			 
			 var entity = contents[i];
			 var isFile = entity instanceof BCAPI.Models.FileSystem.File;
			
			 if (isFile) {
				var selectedClass = '';
				if (newFileName !== undefined && entity.get('name') === newFileName) {
					selectedClass = 'selected';
				}
				
				var defaultIconClass = entity.get('name').indexOf('menu_') === 0 ? _defaultIconClass + ' ' : '';
				
				var iconUrl = './content/menu-icons/' + entity.get('name');
				currentIconRowSelector.append('<div class = "library-icon ' + defaultIconClass + selectedClass + '" icon-url="' + iconUrl + '" style="background-image:url(\'' + iconUrl + '\'); background-position: center; background-repeat: no-repeat;"></div>');
			 }
		 }
		 
		 $('.library-row .library-icon').unbind('click').click(function(e) {
			e.preventDefault();
			$('.library-row .library-icon').removeClass('selected');
			$(this).addClass('selected');
		});
		
		if (callback !== undefined) {
			callback();
		}
	 });
}

function restoreDefaultSettings() {
	if (!window.confirm('This action will restore menu items to their initial view. Are you sure you wish to proceed?')) {
		return;
	}
	showSaveAlert();
	_originalMenuFile.download().done(function(content) {
		_menuFile.upload(content).done(function() {
			try {
				window.parent.location.reload();
			} catch (e) {
				revertSaveAlert();
				showSavedAlert();
			}		
		});			 
	});
}

$(function(){
	'use strict';		 
	RAT.Helper.BC.appendAccessTokenToAnchors($('#tab-labels, #tab-instructions'));
    _newNavTypeDropdownSelector = $('#NewNavType');
    loadNavigationData();
	
	$('#addLabelForm').submit(function(e){addNewLabelToList(e);});
	$('button.save').click(function(){saveChanges();});
	$('button.restore-default').click(function(){restoreDefaultSettings();});

	$.ajax({
				dataType: "json",
                url: '/api/v2/admin/sites/' + BCAPI.Helper.Site.getSiteId() + '/roles',
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", BCAPI.Helper.Site.getAccessToken());
				},
                success: function(data) {
					$.each(data.items, function(index, element) {
						$('#access-rights-container').find('' +
                            '.controls').append('<label><input type = "checkbox" value="' + element.name + '">' + element.name + '</input></label>');
					});					 
				}
            });
			
	loadMenuIcons();
	
});