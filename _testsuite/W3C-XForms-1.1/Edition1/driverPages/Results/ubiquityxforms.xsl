<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version='1.0'
	xmlns:xsl='http://www.w3.org/1999/XSL/Transform'
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:xforms="http://www.w3.org/2002/xforms"
    xmlns:ts="http://www.w3c.org/MarkUp/Forms/XForms/Test/11">
	
	<xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="no" xalan:indent-amount="2" xmlns:xalan="http://xml.apache.org/xslt"/>
	
    <xsl:param name="filename"></xsl:param>    
    
    <xsl:variable  name="otherff"
                   select="document(concat('FF3Results/',$filename))/ts:testSuite/ts:specChapter"/>
    
    
	<xsl:template match="*">
	<html xmlns="http://www.w3.org/1999/xhtml"  
    xmlns:ts="http://www.w3c.org/MarkUp/Forms/XForms/Test/11"
    exclude-result-prefixes="ts">
    <head>
        <title>XForms Results Table</title>
        <link rel="stylesheet" href="../../Results.css" type="text/css"></link>
        <link rel="stylesheet" href="../../TestSuite11.css" type="text/css"></link>       
    </head>
    <body>
        <h1 class="title">XForms 1.1 Test Suite Implementation Status for Ubiquity-XForms</h1>
        <h2 class="subtitle">XForms 1.1 Test -- November 2008</h2>
        <h3>This report describes the results from testing the XForms 1.1 Test Suite with Ubiquity-XForms.</h3>
    
        <h2 class="subtitle">Legend</h2>
       
        <table cellpadding="2" cellspacing="1" border="1" >
            <tr>
                <th class="testCaseNameTitle" width="80">Type</th>
                <th class="testCaseNameTitle" width="300">Description</th>
            </tr>
            <tr>
                <td class="green">Passed</td>
                <td>The test passed when it was run manually.</td>
            </tr>
            <tr>
                <td class="red">Failed</td>
                <td>The test failed when it was run manually.</td>
            </tr>
            <tr>
                <td class="white">Unknown</td>
                <td>The test was not run, or an unknown result occurred.</td>
            </tr>
        </table>
        
        <h2 class="subtitle">Results Table</h2>        
        
        <table cellpadding="2" cellspacing="1" border="1">
            <tr class="heading">
                <td class="inner130">Test Case Number</td>
                <td class="innerLongCell">Test Case Name</td>
                <td class="innerTitle">IE 7</td>
            </tr>
      
        <xsl:apply-templates/>
              </table>
        </body>
   </html>
    </xsl:template>
	
	  <!-- Add the ubiquity-xforms script -->
	  <xsl:template match="ts:specChapter">
	      <tr class="chapter">
	          <td colspan="4">
	              <xsl:value-of select="@chapterName" />
	              <xsl:value-of select="@chapterTitle" />
	          </td>
           </tr>    
	       <xsl:apply-templates />	     
	  </xsl:template>


	  <!-- Add the xforms model elements to the body -->
	<xsl:template match="ts:testCase">
        <xsl:variable name="testcasename" select="ts:testCaseName"/>
<tr class="outer">		
			<td class="inner130"><xsl:value-of select="ts:testCaseName"/></td>
            <td class="innerLongCell"><xsl:value-of select="ts:testCaseDescription"/></td>
            <xsl:if test="ts:testCaseStatus = 'Failed'">
               <td class="innerCellFailed"><xsl:value-of select="ts:testCaseStatus"/></td>
            </xsl:if>
            <xsl:if test="ts:testCaseStatus = 'Passed'">
               <td class="innerCellPassed"><xsl:value-of select="ts:testCaseStatus"/></td>
            </xsl:if>            
        </tr>
	</xsl:template>
 
    
    <xsl:template match="ts:statusSummary"/> 
    <xsl:template match="ts:profile"/> 

</xsl:stylesheet>