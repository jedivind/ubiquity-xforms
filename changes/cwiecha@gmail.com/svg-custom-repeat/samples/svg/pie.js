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
var isText = true;


function SetText(obj, value)
{
  for (var i = 0; i < obj.childNodes.length; i++) {
    if (obj.childNodes.item(i).nodeType == 1)
      obj.childNodes.item(i).firstChild.nodeValue = value;
  }
}


function ClearSVG()
{
  // alert("Clear entered");


     // save template of Bar under Bars
     var bar = document.getElementById("Bar").cloneNode(true);
     bar.setAttribute("x", 0);
     bar.setAttribute("fill", "#00A651");

     // now remove all child bars
     var bars = document.getElementById("Bars");
     var barsNodeList = bars.childNodes;
     var barnode;

      var child = bars.firstChild;
      //loop over all childs
      while (child != null) {
        newchild = child.nextSibling;
        bars.removeChild(child);
        child = newchild;
      }

     // re add template bar
     document.getElementById("Bars").appendChild(bar);


   // save template of LeftText under Text
     var lefttext = document.getElementById("Lefttext").cloneNode(true);
     lefttext.setAttribute("transform", "");
     SetText(lefttext, "");
     
     var righttext = document.getElementById("Righttext").cloneNode(true);
     righttext.setAttribute("transform", "");
     SetText(righttext, "");

     
     var txt = document.getElementById("Text");
     var txtNodeList = txt.childNodes;

     var txtChild = txt.firstChild;
      //loop over all childs
      while (txtChild != null) {
        newtxtChild = txtChild.nextSibling;
        txt.removeChild(txtChild);
        txtChild = newtxtChild;
      }

      document.getElementById("Text").appendChild(lefttext);
      document.getElementById("Text").appendChild(righttext);

//alert("final text" + printNode(txt));


   var leftBar = document.getElementById("Left").cloneNode(true);
 //  Bar.setAttribute("transform", "rotate(" + Angle + " 80 80)");
   leftBar.setAttribute("fill", "#00A651");

      var leftpart = document.getElementById("Leftpart");
      var leftpartChild = leftpart.firstChild;
      //loop over all childs
      while (leftpartChild != null) {
        newleftpartChild = leftpartChild.nextSibling;
        leftpart.removeChild(leftpartChild);
        leftpartChild = newleftpartChild;
      }

    document.getElementById("Leftpart").appendChild(leftBar);


   var rightBar = document.getElementById("Right").cloneNode(true);
 //  Bar.setAttribute("transform", "rotate(" + Angle + " 80 80)");
   rightBar.setAttribute("fill", "#00A651");

     var rightpart = document.getElementById("Rightpart");
     var rightpartChild = rightpart.firstChild;
     //loop over all childs
     while (rightpartChild != null) {
       newrightpartChild = rightpartChild.nextSibling;
       rightpart.removeChild(rightpartChild);
       rightpartChild = newrightpartChild;
     }

    document.getElementById("Rightpart").appendChild(rightBar);
}

function Build()
{
// ClearSVG();

    if (Build.arguments.length == 0)return;
    var Angle = 0;
    var Bar;
    var Txt;
    var TxtAngle;
    var j = 0;
    var Part = "Left";
    var isLeft = true;
    var LastAngle = 0;
    var Scale = 0;
    for (var i = 0;i < Build.arguments.length;i++) {
        Scale += Build.arguments[i];
    }

    Scale /= 100;   

    for (var i = 0;i < Build.arguments.length-1;i++)
    {
        Angle -= 3.6 * Build.arguments[i] / Scale;
        
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
	SetText(Txt, Build.arguments[i]);
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
    SetText(Txt, Build.arguments[Build.arguments.length - 1]);
    document.getElementById("Text").appendChild(Txt);
}

parent.Build = Build;
parent.ClearSVG = ClearSVG;
