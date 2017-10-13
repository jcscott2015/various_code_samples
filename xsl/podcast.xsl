<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">

    <xsl:output method="html" />        
        <xsl:variable name="title" select="/rss/channel/title"/>                
        <xsl:template match="/">        
        <html>
            <head>
                <title>                 
                    <xsl:value-of select="$title"/> - XML file              
                </title>
                <style type="text/css">
                    body {font-family:verdana;font-size:12px; margin-top:10px;padding:0;text-align:center;}
                    img {border:none;}
                    #main {width:620px; text-align:left; margin:0px auto;}                  
                    h2 {margin-top:0px;font-size:16px;}                 
                    #header {height:22px;width:620px;background-color:#000;color:#fff;font-size:11px;margin-bottom:10px;}                                               
                    #header a {color:#fff;margin:3px 0;}
                    #logo {position:absolute;}
                    .topnavLeft {float:left;padding:0;margin:0;width:300px;height:22px;}                    
                    .topnavLnks {height:22px;padding-left:70px;padding-top:3px;}                    
                    .topnavRight {width:280px;height:22px;float:right;text-align:right;padding-top:3px;margin-right:10px;}                              
                    #podLogo {float:left;margin:0 20px 10px 0;padding:0;}                   
                    #podinfo {margin: 5px 0;}
                    #instructions {display:table;height: 0px;}                  
                    .item {clear:both;}                 
                    h3 {font-size:14px;padding-top:10px;}                                        
                    #footer {font-size:11px;padding-bottom:10px;}
                    .item a, .item a:visited, .item a:hover, #footer a, #footer a:visited, #footer a:hover {color:#000; text-decoration:none;}
                    .item a:hover, #footer a:hover {color:#764596;}
                </style>
            </head>         
            <xsl:apply-templates select="rss/channel"/>             
        </html> 
        </xsl:template>     
        
        <xsl:template match="channel">      
        <body onload="document.getElementById('podurl').value=window.location;">                
        <div id="main">

        <div id="content">

            <a>
            <xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute>
            <img id="podLogo">
    
            <xsl:attribute name="src">
                <xsl:value-of select="./itunes:image/@href" />
            </xsl:attribute>
            </img>
            </a>
            
            <h2><xsl:value-of select="title" /> Podcast</h2>                
                <p id="description">
                
                <xsl:value-of select="./description" />             
                
                </p>                
                
                <div id="preview">
                    <b>Preview this podcast</b> 
                    <p>To preview the latest episode before subscribing, <a>        
                    <xsl:attribute name="href">
                        <xsl:value-of select="./item/enclosure/@url" />
                    </xsl:attribute>download this file.</a></p>
                </div>                              

                <div id="instructions">                     
                    <b>How do I subscribe to this podcast?</b>
                    <p>Copy the URL in the box below into your preferred podcasting tool software (e.g. Odeo, iTunes, iPodder). You will automatically receive this podcast each time it's published.</p>                                               
                    <input type="text" size="35" id="podurl" value="" onclick="this.select();" />                                               
                </div>                  

				<div class="item"> </div>                    
				
				<h3>Contents:</h3>

                <xsl:apply-templates select="item" />               
            </div>
            
            <div id ="footer">
            	<p><a><xsl:attribute name="href"><xsl:value-of select="link" /></xsl:attribute><xsl:value-of select="copyright" /></a></p>                   
            </div>  
        </div>      
        </body> 
    </xsl:template>         

    <xsl:template match="item">     
        <div class="item">
            <p><a><xsl:attribute name="href"><xsl:value-of select="./enclosure/@url" /></xsl:attribute><strong><xsl:value-of select="title" /></strong></a><br />           
            <xsl:value-of select="description" /><br />                     
            <em><xsl:value-of select="pubDate" /></em></p>      
        </div>          
    </xsl:template> 

</xsl:stylesheet>