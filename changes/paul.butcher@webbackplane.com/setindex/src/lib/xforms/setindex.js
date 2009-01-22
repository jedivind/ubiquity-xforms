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
 
 
/*global document, doUpdate*/

function SetIndex(elmnt)
{
	this.element = elmnt;
}


SetIndex.prototype.handleEvent = DeferToConditionalInvocationProcessor;

SetIndex.prototype.performAction = function (evt)
{
  var ctx, repeatID, repeatElement, indexResult, indexValue;
  
  //Flush any pending deferred updates.
  doUpdate();
  
  //Find the desired repeat object.
  repeatID = this.element.getAttribute("repeat");
  repeatElement = document.getElementById(repeatID);
  
  //evaluate @index
  ctx = this.getEvaluationContext();
  indexResult = ctx.model.EvaluateXPath(this.getAttribute("index"))
  indexValue = indexResult.numberValue();
  //Set the index of the repeat object
  if (!isNaN(indexValue)) {
    repeatElement.setIndex(indexValue); 
  }  
};
