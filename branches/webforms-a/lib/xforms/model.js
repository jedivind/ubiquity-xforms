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

function processBinds(oModel, oElement, oContextNode) {

    // getElementsByTagName Returns all descendent nodes with that tagName, not
    // just the children.
    // This leads to the problem that non-child descendent nodes are being
    // processed multiply, leading
    // not only to slow rebuilds, but to the situation in which non-child binds
    // are being processed
    // first in correct context, then in the context of the original ancestor
    // for whom this function
    // was called - to wit, the model, therby giving incorrect results.
    // The multiplicity of the call is equal to 2 to the power of the depth of
    // the bind, thus, although an immediate
    // child of model is called once, a grandchild is called twice, but since it
    // also calls its children,
    // those children are each called four times, and so on. Each time, pressing
    // ever deeper down Pascal's Triangle.
    //  
    // I have left this following commented line as a warning to those who may
    // see an opportunity for optimisation
    // arising from the amalgamation of oElement.childNodes, and
    // if(oBind.tagName == "bind"). Do not be tempted
    // to replace it with getElementsByTagName, as along that road, lies slow
    // and erroneous behaviour.
    //  
    // var nsBinds = oElement.getElementsByTagName("bind");

    var nsBinds = oElement.childNodes;
    var len = nsBinds.length;
    var sExpe = null;
    var oParentBind = null;
    var i;
    

    /*
     * [ISSUE] Should check tagUrn.
     */
    for ( i = 0; i < len; i++) {
        var oBind = nsBinds[i];
        
        if (NamespaceManager.compareFullName(
                oBind, "bind", "http://www.w3.org/2002/xforms")) {            
            oBind["ownerModel"] = oModel;
            
            // If the bind statement has a nodeset attribute 
            // then get the list of nodes.
            sExpr = oBind.getAttribute("nodeset");
            if (sExpr) {
                processBind(oBind, sExpr, oModel, oContextNode);
                
            } else if (NamespaceManager.compareFullName(
                  oBind.parentNode, "bind", "http://www.w3.org/2002/xforms")) {
                // if we are in a nested bind, check for in-line context.
                sExpr = oBind.getAttribute("context");
                
                if (sExpr) {
                    processBind(oBind, sExpr, oModel, oContextNode);
                }
            }
        }
    } // for ( each bind element )
} // processBinds()

function processBind(oBind, sExpr, oModel, oContextNode) {
    var oNodeset, oNode, oPN, oVertex;
    var i, j;
    var sMIPName, sMIPVal, sMIPName;
    var modelItemProps = ["readonly", "required", "relevant", "calculate", 
                          "constraint" /*,  "type", "p3ptype" */ ];
    var oRes = oModel.EvaluateXPath(sExpr, oContextNode);
    var oBinder = null;
    var oParnetBind = null;
    
    if (oRes) {
        // The bind has an inline-context attribute
        // we need to get the last parent with nodeset attribute
        if  (oBind.getAttribute("context")) {
            
            oBinder = oBind.parentNode;
            while (oBinder) {
                if (oBinder.getAttribute("nodeset")) {
                    oParnetBind = oBinder;
                    oBinder = null;
                } else {
                    oBinder = oBinder.parentNode;
                }
            }
        }
        
        switch(oRes.type) {
        case "node-set": {
            oNodeset = oRes.nodeSetValue();
            
            if (oNodeset) {
                // loop through all the nodes
                for(j = 0; j < oNodeset.length; j++) {
                    oNode = oNodeset[j];

                    if (oNode) {
                        // Either create or locate the proxy node for
                        // the current node.
                        if (!oNode.m_proxy) {
                            oNode.m_proxy = new ProxyNode(oNode);
                        }
                        oPN = oNode.m_proxy;

                        // If we have an ID then save a bound node.
                        // 
                        // [TODO] We only need the nodeset, but we're
                        // keeping 'boundNode' for now, so that it
                        // doesn't break anything.
                        if (j === 0) {
                            oBind["boundNode"] = oPN;
                            oBind["boundNodeSet"] = oNodeset;
                        }

                        // Create a vertex for the MDDG. Note that when
                        // first creating the MDDG we also create the
                        // PDS.
                        if (!oPN.m_vertex) {
                            var oSE = new SubExpression(oPN);
                            oPN.m_vertex = oModel.m_oDE.createVertex(oSE);
                            
                            // The proxy node needs to store the vertex
                            // so that when its data changes it can add
                            // the vertex to the PDS.
                            oModel.changeList.addChange(oPN.m_vertex);
                        }
                        
                        // We can now process the attributes on the bind statement.
                        for (i = 0; i < modelItemProps.length; i++) {
                            var oMIPVertex = null;
                            sMIPName = modelItemProps[i];
                            sMIPVal = oBind.getAttribute(sMIPName);
                            
                            if (sMIPVal) {
                                if (sMIPName === "calculate") {
                                    oMIPVertex = oPN.m_vertex;
                                } else if (sMIPName === "relevant") {
                                    sMIPName = "enabled";
                                } else if (sMIPName === "constraint") {
                                    sMIPName = "valid"
                                }
                                
                                if (oParnetBind) {
                                    oPN = oParnetBind["boundNode"];
                                }
                                oModel.createMIP(
                                        oMIPVertex, sMIPName, sMIPVal, oPN, oNode);
                            }
                        }
                        // Finally, process any nested bind statements
                        // in the context of this node.
                        processBinds(oModel, oBind, oNode);
                    }
                } // for ( each of the nodes in the node-list )
            }            
        }
        break;
        
        case "boolean": 
        break;
        
        case "number":  
        break;
        
        case "string":  
        break;
        
        default: {        
            throw "Binding exception.";
        }
        break;
        }
    }
}

// [ISSUE] This function is erroneously named
// Ideally, a function called something like testfor... should test for a given
// state,
// then return a boolean (or possibly a tristate, or some kind of return code)
// that describes the outcome of the test. Ideally, it shouldn't have
// uncontrollable
// or wide-reaching side-effects, such as the dispatch of an event that
// instigates
// the most complex operation in the entire application, and, may also invoke
// any
// handlers that a form author wishes to attach to that event, or one of about a
// dozen
// others that are, in turn, invoked by the default processing of
// xforms-model-construct.
//  
// [TODO] Either move the event dispatch to a caller of this function, or rename
// this
// function to something like "constructIfReady".

function testForReady(pThis) {
    // Test the children of pThis for readiness, iff pThis element is itself
    // ready.

    if (pThis["elementLoaded"] === true) {

        // Start with the assumption that pThis is now ready.
        pThis["elementState"] = 0;

        /*
         * Get all the children of pThis element, and check each one for its
         * ready state.
         */
        var ns = pThis.element.childNodes;

        // [ISSUE] This loop is too big
        // Due to each comment in this loop taking up 6 lines, it is impossible
        // to see the start and end braces of this loop at the same time.
        // This makes is difficult to gain a high-level understanding of the
        // code
        for ( var i = 0; i < ns.length; i++) {
            var oNode = ns[i];

            /*
             * If the child doesn't exist (how?) then pThis element is in error.
             */

            if (!oNode) {
                pThis["elementState"] = -1;
                break;
            } else if (oNode["elementState"]) {

                /*
                 * If any child is not ready then pThis element is not ready.
                 */
                if (oNode["elementState"] === 1) {
                    pThis["elementState"] = 1;
                    break;
                } else if (oNode["elementState"] === -1) {
                    /*
                     * If any child is in error, pThis element is also in error.
                     */
                    pThis["elementState"] = -1;
                    break;
                }
            }
        } // for (each child node)

        /*
         * When the model is ready we can begin the 'model construct' process.
         * [TODO] This should also be on an 'element ready' kind of event.
         */
        if (pThis["elementState"] === 0) {
            var evt = document.createEvent("Events");
            evt.initEvent("xforms-model-construct", true, false);
            evt._actionDepth = -1;
            FormsProcessor.dispatchEvent(pThis.element, evt);
        }
    }// if (pThis element is loaded)
    return;
} // testForReady()


function __replaceInstanceDocument(pThis, oInstance, oDom) {
    var bRet = false;

    if (!oInstance) {
        throw "No instance found with an ID of '" + sID + "'";
    } else if (oInstance.length) {
        throw "Multiple instances found with an ID of '" + sID + "'";
    } else {
        oInstance.replaceDocument(oDom);
        pThis.flagRebuild();
        bRet = true;
    }
    return bRet;
}


function _replaceInstanceDocument(pThis, sID, oDom) {
    var bRet = false;

    if (sID) {
        /*
         * [TODO] Should be getElementById().
         */
        var oInstance = pThis.element.getElementById(sID);
        bRet = __replaceInstanceDocument(pThis, oInstance, oDom);
    }
    return bRet;
}


function _addBindingTemp(pThis, oContext, sXPath) {
    var oRet = null;
    var oPN;

    /*
     * First locate the node that we're binding to.
     */
    var oNode = getFirstNode(pThis.EvaluateXPath(sXPath, oContext));

    /*
     * Now use the node to create a proxy if one doesn't already exist.
     */
    if (oNode) {
        oPN = oNode.m_proxy;

        if (!oPN) {
            oPN = new ProxyNode(oNode);
            oNode.m_proxy = oPN;
        }
    } else {
        /*
         * If there is no node to bind to then create a default one.
         */
        oPN = new ProxyNode(null);
    }

    oRet = oPN;
    return oRet;
}


function _addControlExpression(pThis, oTarget, oContext, sXPath) {
    var oRet = null;

    pThis.element.ownerDocument.logger.log("Adding expression for '"
            + oTarget.tagName + "' to '" + sXPath + "'", "mdl");

    if (!oContext) {
        oContext = pThis;
    }

    var oPE = new ProxyExpression(oContext, sXPath, pThis);
    
    /*
     * Store a reference to the proxy in the control.
     */
    oTarget.m_proxy = oPE;
    oRet = oPE;
    return oRet;
}


/*
 * [ISSUE] Not sure I like the test for oVertex, but equally having two
 * functions--one for @calculate and one for all other MIPs seems a little
 * unnecessary too. (The only difference between them is that @calculate will
 * store its result in a node, and therefore needs to have a dependent vertex.)
 */
function _createMIP(pThis, oVertex, sMIPName, sExpr, oPN, oContextNode) {
    /*
     * Create an expression.
     */
    var oCPE = (oVertex) ? new ComputedXPathExpression(oPN, sExpr,
            oContextNode, pThis) : new MIPExpression(oPN, sExpr, oContextNode,
            pThis);
    oPN[sMIPName] = oCPE;

    /*
     * Create a vertex for the expression, and add the vertex for the node that
     * we are iterating over as a dependent (if there is one).
     */
    var oCalcVertex = pThis.m_oDE.createVertex(oCPE);

    // oPN.m_vertex = oCalcVertex;
    pThis.changeList.addChange(oCalcVertex);
    if (oVertex) {
        oCalcVertex.addDependent(oVertex);
    }

    /*
     * Now we need to see if there are any sub-expressions in the expression
     * we've just used.
     */

    oCPE.addDependentExpressions(oCalcVertex, pThis.m_oDE, pThis.changeList);
    return;
} // createMIP()


function _EvaluateXPath(pThis, sXPath, pContextResolver) {
    var oRet = null
    var oContext = null;
    
    if (!pContextResolver) {
        pContextResolver = pThis;
    } else if (pContextResolver["m_oNode"]) {
        pContextResolver = pContextResolver["m_oNode"];
    }

    var sType = typeof (pContextResolver.getEvaluationContext);
    if (sType === "function" || sType === "unknown") {
        oContext = pContextResolver.getEvaluationContext();
        
        // for an empty model getEvaluationContext 
        // can return a context without a node, so check for it first!
        if (oContext.node) {
            // Shouldn't it be oContext.node["m_oNode"] ?? 
            oContext = oContext.node["m_oNode"] ? 
                 ["m_oNode"] : oContext.node;
        }
    } else {
        oContext = pContextResolver.node ? 
                pContextResolver.node : pContextResolver;
    }

    if (oContext) {
        try {
            g_currentModel = pThis;
            oRet = xpathDomEval(sXPath, oContext);
            g_currentModel = null;
        } catch (e) {
            //  this.element.ownerDocument.xformslog.log("Build error: " + e.description, "bind");
        }
    }
    return oRet;
}


/*
 * The deferred update process allows the model to bring
 * itself up-to-date.
 */
function _deferredUpdate(pThis) {
    if (pThis.m_bNeedRebuild) {
        pThis.rebuild();
    }

    if (pThis.m_bNeedRecalculate) {
        pThis.recalculate();
    }

    if (pThis.m_bNeedRevalidate) {
        pThis.revalidate();
    }

    if (pThis.m_bNeedRewire) {
        pThis.rewire();
    }

    if (pThis.m_bNeedRefresh) {
        pThis.refresh();
    }

    return;
}


function _model_contentReady(pThis) {
    pThis.changeList = new ChangeList();
    pThis.m_oDE = new dependencyEngine();

    /*
     * Register for any child elements completing their
     * 'document load'.
     */
    pThis.element.addEventListener("instance-load", {
        handleEvent : function(evt) {
            testForReady(pThis);
        }
    }, false);

    /*
     * Register the default model construct handler.
     */
    FormsProcessor.addDefaultEventListener(pThis.element,
            "xforms-model-construct", {
                handleEvent : function(evt) {
                    pThis.modelConstruct();
                }
            }, false);

    /*
     * Register the default model construct done handler.
     */
    FormsProcessor.addDefaultEventListener(pThis,
            "xforms-model-construct-done", {
                handleEvent : function(evt) {
                    pThis.modelConstructDone();
                }
            }, false);
    return;
}


function _modelConstruct(pThis) {
    /*
     * - Load schemas.
     * - Load instance data.
     * - Initialise P3P.
     * - Construct instance data.
     */
    
    /*
     * Perform rebuild, recalculate and revalidate.
     */
    pThis.rebuild();
    pThis.recalculate();
    pThis.revalidate();

    var evt = pThis.element.ownerDocument.createEvent("Events");
    evt._actionDepth = -1;
    evt.initEvent("xforms-model-construct-done", true, false);
    spawn( function() {
        FormsProcessor.dispatchEvent(pThis.element, evt);
    });
    return;
}