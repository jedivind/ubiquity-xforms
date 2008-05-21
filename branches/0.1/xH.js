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

/*
 * Detecting XForms capability
 *
 * The scenarios are as follows:
 *
 *  If the Mozilla XForms plug-in is present then do nothing;
 *
 *  If formsPlayer is present
 *  {
 *    if an upgrade is requested
 *      set @codebase to point to formsPlayera.b.c.d.cab
 *  }
 *  else
 *  {
 *    if installation is allowed
 *    {
 *      if a specific version is requested
 *        set @codebase to point to formsPlayera.b.c.d.cab
 *      else
 *        set @codebase to point to formsPlayer.cab (the latest version)
 *    }
 *    else
 *      tell user that they should get formsPlayer
 *  }
 */

var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

document.hasFeature = new Array;

var bUseAjax = true;
var bInstallFp = false;
var bUpgradeFp = false;
var sUpgradeFpVersion;
var sFpBestAvailable = "1,4,3,1040";

var bUseAjaxFallback = false || bUseAjax;
var bHasXforms = false;


/*
 * This will throw an exception if sLatestFpRelease
 * does not exist, but if it does exist, we need to
 * allow upgrades or initial installs.
 */

try
{
    sUpgradeFpVersion = sLatestFpRelease;
    bUpgradeFp = true;
    bInstallFp = true;
}
catch(e)
{
    sUpgradeFpVersion = sFpBestAvailable;
    bInstallFp = true; // this will come from the <meta> values. 
    bUpgradeFp = true;
}


/*
 * We can indicate that we want to use Ajax rather than
 * built-in processors.
 *
 * [TODO] Check, since this is probably only true with IE and formsPlayer.
 */

if (!bUseAjax)
{
	// If there is native support then use it
	if (document.implementation.hasFeature("org.w3c.xforms.dom", "1.0"))
		bHasXforms = true;
	else
	{
		// If this is IE then check for formsPlayer
		if ( isIE && isWin && !isOpera )
		{
			var bCreateObject = false;
	    var sObjectId = "formsPlayerBehavior";
			var sObjectHeight = "0";
			var sObjectWidth = "0";
			var sObjectCodeBase;
			var sObjectClassId = "4D0ABA11-C5F0-4478-991A-375C4B648F58";

			try
			{
  		  var oFp;

        /*
         * Using 'checker' is the new technique, but older installs may require the older
         * technique.
         */

        try
			  {
  			  oFp = new ActiveXObject("formsPlayer.checker");
  			}
  			catch(e)
  			{
				  oFp = new ActiveXObject("XFORMS.Factory");
				}

				// If we can't create formsPlayer then we won't get here.

				oFp = null;

				/*
				 * If we have detected formsPlayer, we now see if we need to upgrade it. If not, we enforce
				 * a minimum version number of the current 'best available'.
				 */

				if (bUpgradeFp)
				{
					sObjectCodeBase = "http://www.formsPlayer.com/files/releases/"
						+ "formsPlayer" + sUpgradeFpVersion.replace(/,/g, ".") + ".cab#Version=" + sUpgradeFpVersion;
				}
				else
				{
					sObjectCodeBase = "http://www.formsPlayer.com/files/releases/"
						+ "formsPlayer" + sFpBestAvailable.replace(/,/g, ".") + ".cab#Version=" + sFpBestAvailable;
				}

				// Indicate that we want to create the object tag.

				bCreateObject = true;
			}
			catch (e)
			{

				/*
				 * If we don't have formsPlayer, then we need to see
				 * if we can install it.
				 */

				if (bInstallFp)
				{
					/*
					 * We can install either the latest version, or a
					 * specific one.
					 */

					sObjectCodeBase = "http://www.formsPlayer.com/files/releases/"
						+ ((bUpgradeFp) ? "formsPlayer" + sUpgradeFpVersion.replace(/,/g, ".") + ".cab" : "formsPlayer.cab");

					// Indicate that we want to create the object tag.

					bCreateObject = true;
				}

				/*
				 * If we can't install it then we give the user
				 * the option.
				 */

				else
				{
					var alternateContent = '<div style="width: 100%; background-color: silver;">This '
						+ 'content could run a whole lot faster '
						+ 'if you installed formsPlayer. '
						+ '<a href="http://www.formsPlayer.com/project/formsplayer/">Get formsPlayer</a></div>';

					document.write(alternateContent);
				}
			}

			if (bCreateObject)
			{
				// Insert an object tag
				_createObject(
					"id", sObjectId,
					"width", sObjectWidth,
					"height", sObjectHeight,
					"codebase", sObjectCodeBase,
					"classid", "clsid:" + sObjectClassId
				);

				// Now wire up the behaviour to the correct namespace(s)

				var oNsColl = document.namespaces;
				var bHasXformsNs = false;

				for (var i = 0; i < oNsColl.length; i++)
				{
					var ns = document.namespaces[i];

					if (ns.urn == "http://www.w3.org/2002/xforms")
					{
						ns.doImport("#" + sObjectId);
						bHasXformsNs = true;
					}
				}

				bHasXforms = true;
			}
		}
		else
		{
			var alternateContent = '<div style="width: 100%; background-color: silver;">This '
				+ 'content could run a whole lot faster '
				+ 'if you installed the Firefox XForms plugin. '
				+ '<a href="https://addons.mozilla.org/firefox/824/">Get XForms Extension</a></div>';

			document.write(alternateContent);
		}
	}//if ( there is no native support )
}//if ( Ajax is not the primary processor )


/*
 * If we still haven't got an XForms processor...
 */

if (!bHasXforms)
{
    /*
     * ...are we allowed to fallback to using Ajax?
     */

    if (bUseAjaxFallback)
    {
	    var g_pathToLib = "http://ubiquity-xforms.googlecode.com/svn/branches/0.1/lib/";
	    var g_sBehaviourDirectory = "http://ubiquity-xforms.googlecode.com/svn/branches/0.1/behaviours/";

	    //  var oLogReader = new YAHOO.widget.LogReader("fc-logger",{top:"50%",right:"10px"});
	    //  document.logger = new YAHOO.widget.LogWriter("ajaxfP");
	    document.logger = { log: function(sText, sContext) { } };

	    document.write('<script src="' + g_pathToLib + 'xforms/main.js">/**/</script>');
	    bHasXforms = true;
    }
    else
    {
	    var alternateContent = '<div style="width: 100%; background-color: silver;">You '
		    + 'are trying to view content that requires '
		    + 'an XForms processor, but you do not have one installed '
		    + 'and formsPlayer Ajax Edition has been disabled.</div>';

	    document.write(alternateContent);
    }
}

// Finally, indicate whether we now support XForms
document.hasFeature["org.w3c.xforms.dom"] = bHasXforms;

function _createObject()
{ 
	var str = '';

	str += '<object ';
	for (var i = 0; i < arguments.length; i = i + 2)
		str += arguments[i] + '="' + arguments[i + 1] + '" ';
	str += '></object>';

	document.write(str);
}
