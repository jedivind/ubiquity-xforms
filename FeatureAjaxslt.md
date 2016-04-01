# Introduction #
[Ajaxslt](http://code.google.com/p/ajaxslt/) is a pure Javascript implementation of XSLT and XPATH. Ubiquity XForms uses ajaxslt (with a few minor modifications) for processing XPath expressions.

# Details #
#### Current Version: **0.8.1** ####
#### Modifications: ####
  * \lib\ajaxslt\xpath.js
    1. Add global variable `var g_OuterMostContextNode;`
    1. Add `this.OuterMostContextNode = node;` and `this.currentModel = g_currentModel;` to the constructor of `ExprContext`.
    1. Add `this.OuterMostContextNode` to the `ExprContext` returned from `ExprContext.prototype.clone`.

  * \lib\xforms\ajaxslt-improvements.js
    1. Add `XNode.prototype.cloneNode` method (ajaxslt does not support cloneNode.)
    1. Add 'local-name' and 'namespace-uri' XPath functions to `FunctionCallExpr`prototype.
    1. Add global variable `var g_currentModel = null;`
    1. Add global variable `var g_bSaveDependencies = false;`
    1. Override `LocationExpr.prototype.evaluate`} function. If the global var `g_bSaveDependencies` is true, save each of the XPath steps (nodes) from the `LocationExpr` in the array `g_arrSavedDependencies`. The saved nodes are used to build the dependency graph for `ComputedExpressions` (such as @calculate).

_Note: We need to try to make all modifications in ajaxslt-improvements.js; otherwise, we will need to port all of the changes to xpath.js everytime we upgrade to a newer version of ajaxslt._ --Mark Birbeck That's true, although it has just occurred to me that as a first step we could at least maintain a diff file, like the one submitted to Google.

#### Bug Fixes: ####
  * xpathParse/xpathReduce fails to reduce an XPath expression to a single Expr (that would then be evaluated with respect to a context node) when the expression contains a path followed by the multiplication operator (asterisk) followed by a function call. `[example: ../principal * instance('rate')]`

> The rule [XPathExpr, [ XPathExpr, TOK\_ASTERISK](.md), 0, passExpr, ASSOC\_LEFT ] must be added to xpathGrammarRules to fix the problem. [Issue 26](http://code.google.com/p/ajaxslt/issues/list) was opened against ajaxslt.