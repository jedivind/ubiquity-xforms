/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Hint(elmnt)
{
	this.element = elmnt;
	this.element.addEventListener(
		"xforms-hint",
		Hint.prototype.performAction2, 
		true
	);
}

Hint.prototype.performAction = function()
{
		var hintList = this.element.getElementsByTagName("xf:hint");
   	    var hintSTR = hintList[0].textContent;
   		
		YAHOO.myToolTip = new YAHOO.widget.Tooltip(
			"myToolTip",
			{
	    		context:this.element,
	    		text:hintSTR,
	    		autodismissdelay:2000
	    	}
	    );
};

Hint.prototype.performAction2 = function()
{
		var hintList = this.element.getElementsByTagName("xf:hint");
		if(hintList.length !== 0)
		{
	   	    var hintSTR = hintList[0].textContent;
	   		
			YAHOO.myToolTip = new YAHOO.widget.Tooltip(
				"myToolTip",
				{
		    		context:this.element,
		    		text:hintSTR,
		    		autodismissdelay:2000
		    	}
		    );
	    }
	    else if(this.element.getAttribute("id"))
	    {
	    	hintList = this.ownerDocument.getElementsByTagName("xf:hint");
	    	if(hintList.length !== 0)
			{
				for(var counter = 0; counter < hintList.length; counter++)
				{
					if(hintList[counter].getAttribute("for") === this.element.getAttribute("id"))
					{
						var hintSTR = hintList[counter].textContent;
		   		
						YAHOO.myToolTip = new YAHOO.widget.Tooltip(
							"myToolTip",
							{
					    		context:this.element,
					    		text:hintSTR,
					    		autodismissdelay:2000
					    	}
					    );
					}
				}
		    }
	    }
};
