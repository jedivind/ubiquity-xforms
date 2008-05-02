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

//Once the actual list of files is completely settled, this will become a compressed file.',
var g_bUseDocumentDotWrite = true;
var g_bUseFormsPlayer = false;

try
{
	if (document.UseFormsPlayer)
		g_bUseFormsPlayer = true;
}
catch(e)
{
}
//for using the  faster versions of YUI libs
var sMin = "";//"-min"

if(!g_bUseFormsPlayer)
{
    document.m_arrScripts = [
    //	'yui-compressed.js',
    	'YUI/yahoo/yahoo'+sMin+'.js',
    	'YUI/event/event'+sMin+'.js',
    	'YUI/dom/dom'+sMin+'.js',
    	'YUI/animation/animation'+sMin+'.js',
    	'YUI/logger/logger'+sMin+'.js',
    	'YUI/connection/connection'+sMin+'.js',
 
         /*
          * For xf:message
          */

        'YUI/yahoo-dom-event/yahoo-dom-event.js',
        'YUI/dragdrop/dragdrop'+sMin+'.js',
        'YUI/container/container'+sMin+'.js',
        'third-party/yowl/yowl.js',
 
         /*
          * For xf:range
          */

        'YUI/slider/slider-min.js',

        'Scriptaculous/Prototype.js',
    	'Scriptaculous/scriptaculous.js',

        'Animation/Animate.js',
//        'Animation/AnimateImpl.js',
        'Animation/AnimateImplYUI.js',
    	'Animation/AnimateImplScriptaculous.js',
    
    	'ajaxslt/misc.js',
    	'ajaxslt/dom.js',
    	'ajaxslt/xpath.js',
    
    	'xforms/ajaxslt-improvements.js',
    	'xforms/xforms-core-function-library.js',
    	'xforms/VertexTargets.js',
    	'xforms/xforms.js',
    
    	'xforms/conditional-invocation.js',
    	'xforms/context.js',
    	'xforms/Control.js',
    	'xforms/pds.js',
    	'xforms/model.js',
    	'xforms/state.js',
    	'xforms/modelObj.js',
    	'xforms/input-value.js',
    	'xforms/output-value.js',
    	'xforms/range-value.js',
    
    	'smil/smil-set.js',
    	'smil/smil-animate.js',
    
    	'xforms/Instance.js',
    	'xforms/xf-action.js',
    	'xforms/actions.js',
    	'xforms/hint.js',
    	'xforms/setvalue.js',

    	'xforms/Repeat.js',
    	'xforms/Group.js',
    
    	'xforms/Submission.js',
    	'xforms/xforms-submission.js',
    	'xforms/xforms-submission-yui.js',
    	
    	'xforms/Switch.js',
    	'_backplane/case.js',
    	'xforms/case.js',
    
    	'threads.js',
    
        'dom/listener.js',
        'dom/dom2events.js',
    	'dom/eventTargetProxy.js',
    
    	'insertAdjacentHTML.js',

    	'decorate.js',
    	'smil/smil-defs.js',
    	'xforms/xforms-defs.js'
    ];
}
function AddScriptsToDocument_DW()
{

	var arrScriptElements = new Array();
	for(i in document.m_arrScripts)
	{
		arrScriptElements.push('<script src="'+ g_pathToLib + document.m_arrScripts[i] +'">/**/</script>');
	}
	
	if(document.all)
	{
		//Add the "Element Behaviours" to the list of stuff being added to the form for IE.
		var collNamespaces = document.namespaces;
		var arrImports = new Array();

		for(var i = 0; i < collNamespaces.length; ++i)
		{
			if(collNamespaces[i].urn == "http://www.w3.org/2002/xforms")
			{
				arrScriptElements.push('<?import  namespace="'+collNamespaces[i].name+'" implementation="'+g_sBehaviourDirectory+'instance.htc"?>');
				arrScriptElements.push('<?import  namespace="'+collNamespaces[i].name+'" implementation="'+g_sBehaviourDirectory+'xf-extension.htc" ?>');
			}
		}
	}

	document.write(arrScriptElements.join("\n"));
}

//In XHTML mode, firefox does not permit document.write()
function AddScriptsToDocument_DOM()
{
	var oHead =document.getElementsByTagName("head")[0];

	for(i in document.m_arrScripts)
	{
		var oScript = document.createElement('script');
		oScript.setAttribute("type","text/javascript");
		oScript.setAttribute("src",g_pathToLib + document.m_arrScripts[i]);
		oHead.appendChild(oScript);
	}	
}

function AddObjectTagAndImportInstructions()
{
	var sObjectTag = '<object classid="CLSID:4D0ABA11-C5F0-4478-991A-375C4B648F58" id="formsPlayer" height="0" width="0"><b>formsPlayer has failed to load! Please check your installation.</b></object>'
	var collNamespaces = document.namespaces;
	var arrImports = new Array();

	for(var i = 0; i < collNamespaces.length; ++i)
	{
		if(collNamespaces[i].urn == "http://www.w3.org/2002/xforms")
		{
			arrImports.push('<?import namespace="'+collNamespaces[i].name+'" implementation="#formsPlayer"?>');
		}
	}

	document.write(sObjectTag + arrImports.join('\n'));
}

AddXFormsFunctionalityToDocument = g_bUseFormsPlayer&&document.all?AddObjectTagAndImportInstructions:g_bUseDocumentDotWrite?AddScriptsToDocument_DW:AddScriptsToDocument_DOM;
AddXFormsFunctionalityToDocument();