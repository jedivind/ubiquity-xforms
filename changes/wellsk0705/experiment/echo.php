<?xml version="1.0"?>
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
    <meta content="text/html; charset=ISO-8859-1" http-equiv="content-type"></meta>
    <title>XForms Echo Test</title>   
     <?php phpinfo(); ?>
   
    <script type="text/javascript"> 
       <?php echo 'While this is going to be parsed.'; ?> 
   </script>
    <link type="text/css" href="style/gen_default.css" rel="stylesheet"></link>
  </head>
  <body>
     <h1>Form posted data</h1>
    <?php
echo 'Hello ' . htmlspecialchars($_POST["name"]) . '!';
?> 
    
        <?php echo $HTTP_RAW_POST_DATA; ?>        
        <?php echo $http_response_header; ?> 
 
   </body>
</html>