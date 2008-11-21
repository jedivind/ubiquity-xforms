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

/*global UX, YAHOO*/
/*members Button, Element, Menu, addClass, addClassName, align, 
    appendChild, cfg, context, createElement, fn, hide, 
    insertAdjacentElement, isChrome, isFF, isIE, isSafari, offsetHeight, 
    offsetWidth, onclick, ownerDocument, render, scope, setProperty, 
    setStyle, show, subscribe, toggle, type, util, widget
*/
/**
  class:DropBox
  Attaches a dropbox and button to an element.
  
  containerElement - {Element} The element used to contain the dropbox and button
  referenceElement - {Element} The element used to position the button and dropbox on the screen
  dropElement - {Element} The element that will become the content of the dropbox
*/
function DropBox(containerElement, referenceElement, dropElement) {
  
  var m_Menu, 
  m_showing = false,

  /**
    method:toggle
    If the dropbox is currently hidden, shows the dropbox.  If it is visible, hides it. 
  */
  toggle = function () {
    if (m_showing) {
      this.hide();
    } else {
      this.show();
    }
  },
  
  /**
    function:show
    shows the dropbox.
  */
  show = function () {
    m_Menu.align("tl", "bl");
    m_Menu.cfg.setProperty("width", referenceElement.offsetWidth);
    m_Menu.show();
  },
  
  /**
    function:hide
    hides the dropbox.
  */
  hide = function () {
    m_Menu.hide();
  },
  /*
    Object to be returned from new DropBox, containing pointers to the public methods.
  */
  that = {
    show: show,
    hide: hide,
    toggle: toggle
  },
  
  /**
    function:alignButtonWithReference
    (Private) Aligns the drop trigger button with the reference element.
  */
  alignButtonWithReference = function (button) {

    var btnHeight,
    deltaPosition = 0,
    referenceYUIElement = new YAHOO.util.Element(referenceElement);
    referenceYUIElement.setStyle("display", "inline-block");
    btnHeight = referenceElement.offsetHeight;
    //IE doesn't include the borders.
    if (!UX.isIE) {
      btnHeight -= 2;
    }
    
    button.setStyle("height", btnHeight);
   
    if (UX.isIE || UX.isSafari) {
       //In these browsers, top will align top of button to top of sibling.
       //  but middle will align midpoint of button with baseline of text
      button.setStyle("vertical-align", "top");
    } else {
      button.setStyle("vertical-align", "middle");
      //align with true top of referenceElement
      
      if (UX.isChrome) {
        deltaPosition = -2;
      } else if (UX.isFF) {
        deltaPosition = -1;
      }

      button.setStyle("top", deltaPosition);
    }
    
  },
  
  /**
    function:createDropMenu
    (Private) Creates the menu that controls the behaviour and appearance of the dropbox
  */
  createDropMenu = function () {

    var dropWrapper = containerElement.ownerDocument.createElement("div");
    UX.addClassName(dropWrapper, "yuimenu");
  	containerElement.appendChild(dropWrapper);
  	UX.addClassName(dropElement, "bd");
  	dropWrapper.appendChild(dropElement);
    m_Menu = new YAHOO.widget.Menu(dropWrapper, {context: [referenceElement, "tl", "bl"]});
    m_Menu.render();
    
    //delay flicking the toggle controlling boolean, in case giving focus to
    //  the toggling button has invoked the hide.  Without this delay
    //  it would be reopened when the user expects it to close
    m_Menu.subscribe("hide", function () {
      setTimeout(function ()
      {
        m_showing = false;
      }, 100);
    });
    m_Menu.subscribe("show", function () {
      setTimeout(function ()
      {
        m_showing = true;
      }, 100);
    });
  };
  
  /**
    constructor
  */
  (function () {
    UX.addClassName(containerElement, "yui-skin-sam");
    UX.addClassName(containerElement, "ux-dropbox-container");

    var button,
    buttonElement = document.createElement("button");
    
    referenceElement.insertAdjacentElement("afterEnd", buttonElement);  
    
    button = new YAHOO.widget.Button(buttonElement, {type: "push", onclick: { scope: that, fn: toggle } });
    button.addClass("ux-drop-button");
    
    alignButtonWithReference(button);
    createDropMenu();
   
  }());

  return that;
  
}