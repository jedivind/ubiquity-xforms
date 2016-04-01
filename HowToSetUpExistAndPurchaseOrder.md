# Exist and Purchase Order Installation #

The following describes the process to download eXist XML database and the Purchase Order demo that resides within the Downloads area. The goal is to get a the simple demo set-up and working to use as a base example of XForms and Ubiquity. For more information visit UsingTheLibrary wiki page.



## Installation ##

The first thing that must be installed on your local machine or server is the eXist open source database. Exist is an open source database that supports native XML. For our purposes it illustrates nicely how having an XML model in XForms and storing that model in a database in it's native form greatly reduces the amount of transformations performed on the data.

### Exist Download ###

Exist can be downloaded from the following link: http://exist.sourceforge.net/download.html.

There are a couple of options for installers. If your running Linix or Mac the Java base installer is your best bet, for MS windows the exist set-up...exe is the one for you.

Exist has a requirement of a JDK NOT a JRE. During installation you will be prompted for the location of your JDK. This can usually be found under C:/Java/jdk_... The default settings should serve the purpose of the demo just fine. Exist runs on Java so it should run on most platforms that you wish to install it on._

### Copy of Ubiquity Demo ###

The second thing that is needed is a copy of the Ubiquity Purchase Order demo database.
Navigate to the Downloads area at: http://code.google.com/p/ubiquity-xforms/downloads/list  and choose the ubxf-po-0.x.zip. This file contains backup of the entire UBX Purchase Order Demo. All files including Xforms, Javascript source, Xquery and Images are contained within this archive.

### Loading the Back-up ###
Navigate to the eXist client shell. This can be done many ways by either the icon in your start menu or bin\client.bat (DOS/Windows), bin/client.sh (Unix).

Perform a restore navigating to the "Tools > Restore" menu item. Choose the ubxf-po-0.x.zip version that you downloaded previously and select OK.

UPDATE: If eXist prompts you for a password to install the back-up it is,

pw : admin

At this point you should have installed Ubiquity / Exist and some sample forms.

## Running the Demo ##

The demo forms are all contained within the "testCollection". In eXist similar elements are grouped into collections to keep things organized. Within this collection reside the source XForms that we will run below.

Open your favorite web browser. The demo is designed to work on Chrome, Safari, FF or IE.
Since eXist runs within a webserver there is no need to start a webserver to serve the documents.

Navigate to the following URL: http://localhost:8080/exist/rest/db/testCollection/src/purchaseOrderTest/purchaseOrderMain.html.

You should see the main page of the UBX Purchase Order Demo.

## Next Step ##
Now that you have the demo running and installed feel free to roam around and try some of the functionality. For a more detailed explanation of the roles in the demo see the following document PurchaseOrderRolesExplanation, which will guide you through some of the functionality.