<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version='1.0'
	xmlns:xsl='http://www.w3.org/1999/XSL/Transform'
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:xforms="http://www.w3.org/2002/xforms">
	
	<xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="no" xalan:indent-amount="2" xmlns:xalan="http://xml.apache.org/xslt"/>
	
	<xsl:template match="*">    
      <xsl:copy>
        <xsl:copy-of select="@*"/>
        <xsl:apply-templates/>
      </xsl:copy>
    </xsl:template>
	
	  <!-- Add the ubiquity-xforms script -->
	<xsl:template match="xhtml:head">
		<xsl:copy>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates />	
		</xsl:copy>
	</xsl:template>
	
	
    <!-- Add the xforms model elements to the body -->
	<xsl:template match="xhtml:body">
		<xsl:copy>
			<xsl:copy-of select="@*|//xhtml:head/xforms:model" />
			<xsl:apply-templates />
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="xhtml:link">
		<xhtml:script type="text/javascript" src="http://ubiquity-xforms.googlecode.com/trunk/ubiquity-loader.js"/>			
		<xsl:copy>
			<xsl:copy-of select="@*" />
			<xsl:apply-templates />
		</xsl:copy>		
	</xsl:template>	
	
	<!-- remove the xforms:model elements from head -->
	<xsl:template match="xhtml:head/xforms:model"/>

</xsl:stylesheet>