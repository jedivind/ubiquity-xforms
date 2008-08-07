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

// JScript source code
	/*
	 * [TODO] Create a 'toggle state' function that uses functions
	 * from any library (YUI, prototype, etc.).
	 */

function setState(pThis,oProxy, sMIPName, sOn, sOff)
{
	//ONLY PERFORM THIS TIME-CONSUMING OPERATION IF IT IS NEEDED!!!!!
	//	We have already established, in formsPlayer, that the switching in-and-out of classNames
	//	 is one of the more time-consuming actions in IE.  So doing it (6 * 4) times  ( == calls in this function * calls to this function)
	//	 on every single control on every single refresh is hardly sensible when we are trying to  produce a more performant version of the AJAX form.  
	//To Reiterate - If we want more performant software, then we must optimise out pointless calls such as this.
	if(pThis.m_MIPSCurrentlyShowing[sMIPName] === undefined || (oProxy.getMIPState !== undefined && pThis.m_MIPSCurrentlyShowing[sMIPName] != oProxy.getMIPState(sMIPName)))
	{
		YAHOO.util.Dom.removeClass(pThis.element, sOn);
	//	YAHOO.util.Dom.removeClass(pThis.element, "pc-" + sOn);
		YAHOO.util.Dom.removeClass(pThis.element, sOff);
	//	YAHOO.util.Dom.removeClass(pThis.element, "pc-" + sOff);

		if (typeof oProxy.getMIPState  == "function")
		{
			if (oProxy.getMIPState(sMIPName))
			{
				pThis.m_MIPSCurrentlyShowing[sMIPName] = true;
				YAHOO.util.Dom.addClass(pThis.element, sOn);
			//	YAHOO.util.Dom.addClass(pThis.element, "pc-" + sOn);
			}
			else
			{
				pThis.m_MIPSCurrentlyShowing[sMIPName] = false;
				YAHOO.util.Dom.addClass(pThis.element, sOff);
			//	YAHOO.util.Dom.addClass(pThis.element, "pc-" + sOff);
			}
		}
	}

	return;
}

function setInitialState(pThis)
{
	pThis.m_MIPSCurrentlyShowing.readonly = false;
	pThis.m_MIPSCurrentlyShowing.required = false;
	pThis.m_MIPSCurrentlyShowing.valid = true;
	pThis.m_MIPSCurrentlyShowing.enabled = true;
	pThis.element.className += " read-write enabled valid optional";//" pc-read-write pc-enabled pc-valid pc-optional";
}
