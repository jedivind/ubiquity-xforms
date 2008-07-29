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

/**
	Inserts an element as the last child of body, and sets up the CSS to bind this to onload.xml
		Calling this as a final step in the script loading process ensures that all existing elements
		have been bound to an appropriate XBL, and have performed their decorations, prior to 
		calling any initialisation code that would otherwise have been called by onload.
*/
alert("second onload file;")
function FFInsertElementForOnloadXBL()
{
alert("second onload inserting;")
	document.body.insertAdjacentHTML("beforeEnd","<p id='second-onload-loading-element'style='width:0px;style:display:inline-block;'>Loading...</p>");
    var oHead = document.getElementsByTagName("head")[0];
    var oStyle = document.createElement('style');
    var s = "";

    oStyle.setAttribute("type", "text/css");
    oStyle.innerHTML = "p#second-onload-loading-element{-moz-binding: url(\""+g_sBehaviourDirectory+"onload.xml#loader\");}";

    alert(oStyle.innerHTML);
    oHead.insertBefore(oStyle, null);
alert("second onload inserted;")
}

//This is only required by firefox, which binds XBLs in document order of opening tag, once the script
//	that sets up the decorator has finished.
//	In IE, the HTCs are bound as soon as the rule is inserted.
if(window.navigator.appName == "Netscape")
{
	InsertElementForOnloadXBL = FFInsertElementForOnloadXBL;
}
else
{
	InsertElementForOnloadXBL = function(){};
}
