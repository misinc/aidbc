    window.RAT = {};
	RAT.Helper = {};
	
    RAT.Helper.Primitives =  {};

    /**
     * Returns a random 4 digit hexadecimal value.
     * 
     * @returns {string} 4 digit hexadecimal value.
     */
    RAT.Helper.Primitives.generate4DigitHexValue = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
	};
	
	/**
     * Returns a random guid (global unique identifier - 32 digit hexadecimal value in the form of XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     * 
     * @returns {string} randomly generated guid.
     */
	RAT.Helper.Primitives.generateGuid = function() {
        return RAT.Helper.Primitives.generate4DigitHexValue() + RAT.Helper.Primitives.generate4DigitHexValue() + '-' + RAT.Helper.Primitives.generate4DigitHexValue() + '-' + RAT.Helper.Primitives.generate4DigitHexValue() + '-' +
         RAT.Helper.Primitives.generate4DigitHexValue() + '-' + RAT.Helper.Primitives.generate4DigitHexValue() + RAT.Helper.Primitives.generate4DigitHexValue() + RAT.Helper.Primitives.generate4DigitHexValue();
	};
	
	RAT.Helper.Primitives.indexOf = function(array, item) {
		if(typeof Array.prototype.indexOf === 'function') {
			return array.indexOf(item);
		} else {			 
			var i = -1, index = -1;

			for(i = 0; i < array.length; i++) {
				if(array[i] === item) {
					index = i;
					break;
				}
			}

			return index;			 
		}	
	};
	
	RAT.Helper.BC = {};
	
	RAT.Helper.BC.appendAccessTokenToAnchors = function(anchorSelectors) {
		var access_token = BCAPI.Helper.Site.getAccessToken();
		anchorSelectors.each(function() {
			var href = $(this).attr('href');
			$(this).attr('href', href + '#access_token=' + access_token);
		});
	};
