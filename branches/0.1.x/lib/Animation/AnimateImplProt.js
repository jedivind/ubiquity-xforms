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

function AnimateImplScriptaculous()
{
	animateColour: function (elTarget, oAttrs, nDuration)
	{
		return "E_NOTIMPL"
//		var oAnim = new PROTOTYPE.util.ColorAnim(elTarget, oAttrs, nDuration);
//		return oAnim;
	}
	
	
}

AnimateImplScriptaculous.animate = function(elTarget, oAttrs, nDuration)
{
	for(attr in oAttrs)
	{
		switch(attr)
		{
			case "height":
				new Effect.Scale(elTarget,200,{scaleX:false})
		}
	}
}
