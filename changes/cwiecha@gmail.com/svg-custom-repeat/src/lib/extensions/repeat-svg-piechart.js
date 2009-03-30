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

UX.piechartcount = 0;

function RepeatPieChart (elmnt) {
    this.element = elmnt;
    this.currValue = "";
    this.m_bPieChartBuilt = false;
    this.m_sSVGId = "";
	this.m_sSVGTemplate = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='170' height='130'>\
    <defs> \
        <clipPath id='clipGraph'> \
            <circle r='75' cx='80' cy='80'/> \
        </clipPath> \
        <clipPath id='clipRight'> \
            <rect width='80' height='160' x='80'/> \
        </clipPath> \
        <clipPath id='clipLeft'> \
            <rect width='80' height='160' x='0'/> \
        </clipPath> \
        <clipPath id='clipBar'> \
            <circle r='75' cx='80' cy='80' transform='scale(1 0.6) translate(0 30)'/> \
            <rect width='150' height='20' x='5' y='45'/> \
        </clipPath> \
        <filter id='Drop_Shadow' filterUnits='objectBoundingBox' x='-10%' y='-10%' width='150%' height='150%'> \
            <feGaussianBlur in='SourceAlpha' stdDeviation='5' result='blurredAlpha'/> \
            <feOffset in='blurredAlpha' dx='3' dy='3' result='offsetBlurredAlpha'/> \
	    <feMerge> \
		<feMergeNode in='offsetBlurredAlpha'/> \
		<feMergeNode in='SourceGraphic'/> \
	    </feMerge> \
        </filter> \
        <radialGradient id='aigrd1' gradientUnits='userSpaceOnUse' cx='40' cy='40'> \
            <stop offset='0' style='stop-color:#FFFFFF'/> \
            <stop offset='1' style='stop-color:#000000'/> \
        </radialGradient> \
        <radialGradient id='aigrd2' gradientUnits='userSpaceOnUse' cx='75' cy='75'> \
            <stop offset='0' style='stop-color:#FFFFFF'/> \
            <stop offset='1' style='stop-color:#000000'/> \
        </radialGradient> \
    </defs> \
    <!-- \
    <g> \
                    <rect width='160' height='160' fill='#FFFFFF'/> \
     </g> --> \
\
    <g filter='url(#Drop_Shadow)'> \
        <g id='foot' clip-path='url(#clipBar)'> \
        <g id='Bars'> \
            <rect id='Bar' width='160' height='100' fill='#00A651' x='0' y='40'/> \
        </g> \
        <rect width='160' height='160' fill='url(#aigrd2)' opacity='0.2'/> \
        </g> \
        <g transform='scale(1 0.6)'> \
            <g clip-path='url(#clipGraph)'> \
                <g id='Leftpart' clip-path='url(#clipLeft)'> \
                    <rect id='Left' width='80' height='160' x='0' y='0' fill='#00A651'/> \
                </g> \
                <g id='Rightpart' clip-path='url(#clipRight)'> \
                    <rect id='Right' width='80' height='160' x='80' y='0' fill='#00A651'/> \
                </g> \
                <rect width='160' height='160' fill='url(#aigrd1)' opacity='0.2'/> \
                <g id='Text' filter='url(#Drop_Shadow)'> \
                    <g id='Lefttext'> \
                        <text x='80' y='20' fill='#FFFFFF' font-weight='bold' font-family='Arial' font-size='15px' text-anchor='middle'> </text> \
                    </g> \
                    <g id='Righttext'> \
                        <text x='80' y='20' fill='#FFFFFF' font-weight='bold' font-family='Arial' font-size='15px' text-anchor='middle' transform='rotate(180 80 16)'> </text> \
                    </g> \
                </g> \
            </g> \
            <!--circle r='75' cx='80' cy='80' stroke='#000000' fill='none'/--> \
        </g> \
    </g> \
</svg>"
}

// replace with equivalent UX function
RepeatPieChart.prototype.SetText = function(obj, value)
{
  for (var i = 0; i < obj.childNodes.length; i++) {
    if (obj.childNodes.item(i).nodeType == 1)
      obj.childNodes.item(i).firstChild.nodeValue = value;
  }
}


RepeatPieChart.prototype.BuildPieChart = function(argValues, argText)
{
// ClearSVG();

	var colors = new Array( "#00A651", 
                        "#FF6666", 
                        "#00AEEF", 
                        "#A67C52", 
                        "#FFCC00", 
                        "#662D91", 
                        "#8DC63F", 
                        "#92278F", 
                        "#F7941D", 
                        "#0054A6",
                        "#CCCCCC");

    if (argValues.length == 0)return;
    var isText = true;
	var Angle = 0;
    var Bar;
    var Txt;
    var TxtAngle;
    var j = 0;
    var Part = "Left";
    var isLeft = true;
    var LastAngle = 0;
    var Scale = 0;
    for (var i = 0;i < argValues.length;i++) {
        Scale += argValues[i];
    }

    Scale /= 100;   

    for (var i = 0;i < argValues.length-1;i++)
    {
        Angle -= 3.6 * argValues[i] / Scale;
        
        if (Angle > -180) Part = "Left";
        else Part = "Right";
        if (Part == "Right" && isLeft)
        {
            isLeft = false;
            document.getElementById(Part).setAttribute("fill", colors[j]);
        }
        j++;
        if (j > colors.length) j = 0;

        if (Angle > -270)
        {
            var len = 75*Math.sin((180+Angle) * Math.PI / 180);
            len = 75 - len;
            if (Angle > -90) len = 0;
            var bar = document.getElementById("Bar").cloneNode(true);
            bar.setAttribute("x", len + 5);
            bar.setAttribute("fill", colors[j]);
            document.getElementById("Bars").appendChild(bar);
        }

        Bar = document.getElementById("Left").cloneNode(true);
        Bar.setAttribute("transform", "rotate(" + Angle + " 80 80)");
        Bar.setAttribute("fill", colors[j]);
        document.getElementById(Part + "part").appendChild(Bar);
        
        TxtAngle = LastAngle + (Angle - LastAngle) / 2;
        if (TxtAngle < -90 && TxtAngle > -270) Part = "Right";
        else Part = "Left";
        Txt = document.getElementById(Part + "text").cloneNode(true);
        Txt.setAttribute("transform", "rotate(" + TxtAngle + " 80 80)");
		this.SetText(Txt, argText[i]);
        document.getElementById("Text").appendChild(Txt);
        LastAngle = Angle;
    }
    Angle = -360;
    if (isLeft)
    {
        isLeft = false;
        document.getElementById("Right").setAttribute("fill", colors[j]);
    }
    TxtAngle = LastAngle + (Angle - LastAngle) / 2;
    if (TxtAngle < -90 && TxtAngle > -270) Part = "Right";
    else Part = "Left";
    Txt = document.getElementById(Part + "text").cloneNode(true);
    Txt.setAttribute("transform", "rotate(" + TxtAngle + " 80 80)");
    this.SetText(Txt, argText[argText.length - 1]);
    document.getElementById("Text").appendChild(Txt);
}

function piechartValueChanged(pThis, sNewValue) {

}

RepeatPieChart.prototype.onDocumentReady = function() {
	pThis = this;
	pThis.m_sSVGId = "ux-repeat-piechart-" + UX.piechartcount;
	var svgContainer = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
	pThis.element.insertAdjacentElement( "beforeBegin", svgContainer );
	svgContainer.innerHTML = this.m_sSVGTemplate;

	this.element.parentNode.addEventListener("xforms-refresh", function() {
	var argValues = new Array();
	var argTitles = new Array();
	var nextGroup, nextChild, roleAttr;

	for ( var i=0; i < pThis.element.childNodes.length; i++ ) {
		nextGroup = pThis.element.childNodes[i];
		for ( var j=0; j < nextGroup.childNodes.length; j++ ) {
			nextChild = nextGroup.childNodes[j];
			if ( nextChild.getAttribute ) {
				roleAttr = nextChild.getAttribute("role");
				if (roleAttr === "value" ) {
					argValues[i] = parseInt( nextChild.getValue() );
				}
				else if(roleAttr === "label") {
					argTitles[i] = nextChild.getValue();
				}
			}
		}
	}
	pThis.BuildPieChart(argValues, argTitles);
        
	UX.piechartcount++;
		}, true);
}




