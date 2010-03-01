/*
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

UX.chartcount = 0;

function RepeatDojoChart (elmnt) {
    this.element = elmnt;
    this.currValue = "";
    this.m_bChartBuilt = false;
    this.m_sChartId = "";
    this.store = null;
    this.chart = null;
    dojo.require("dojox.charting.DataChart");
    dojo.require("dojox.charting.plot2d.Pie");
}

// replace with equivalent UX function
RepeatDojoChart.prototype.SetText = function(obj, value)
{
  for (var i = 0; i < obj.childNodes.length; i++) {
    if (obj.childNodes.item(i).nodeType == 1)
      obj.childNodes.item(i).firstChild.nodeValue = value;
  }
}


RepeatDojoChart.prototype.buildDojoChart = function(pThis)
{
	if (!pThis.m_bChartBuilt) {
		this.m_sChartId = "ux-repeat-chart-" + UX.chartcount;
		var chartContainer = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
		chartContainer.id = pThis.m_sChartId;
		UX.addStyle( chartContainer, "width", "300px" );
		UX.addStyle( chartContainer, "height", "300px" );
		UX.addStyle( chartContainer, "display", "block" );
		pThis.element.insertAdjacentElement( "beforeBegin", chartContainer );

        UX.chartcount++;
        pThis.m_bChartBuilt = true;

       pThis.store = new mvc.data.RepeatStore(pThis);
             
       var chart = new dojox.charting.DataChart( pThis.m_sChartId, {
           store: pThis.store,
           comparative: true,
           type: dojox.charting.plot2d.Pie,
           query: { name: "*" },
           displayRange:8,
           fieldName:"value" });
    }   
}

function chartValueChanged(pThis, sNewValue) {

}

RepeatDojoChart.prototype.refresh = function() {
    var pThis = this;
    if ( !this.m_bChartBuilt ) {
        this.ownerDocument.body.addEventListener(
        "xforms-ready",
        {
          control: pThis.ownerDocument.body,
          handleEvent: function (evt) {           
            pThis.buildDojoChart( pThis );
            UX.addStyle( pThis, "display", "none" );
          }
        },
        true )
    } 
    else {
        var i = 0; // debug stop    
    }
    
}





