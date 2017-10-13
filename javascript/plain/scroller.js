/* ******************************************************
scroller.js
Places a horizontal scrolling line of text in any
block element you choose.

Don't forget to set the width and height of the block
element, or you won't see anything.

XHTML compliant.

created: 11/15/07
modified: 2/2/08

Copyright:	John C. Scott, Scott Communications
			jcscott@scottcomm.com

Creative Commons License
****************************************************** */

//Initialize object instance variables
function createScroller(boxID, content, speed, pause) {
    // Locate the scrollBox in the DOM
    this.scrollBoxObj = convertToObj(boxID);
    // Remember the width of the scrollBox.
    this.scrollBoxWidth = this.getElementWidth(this.scrollBoxObj);
    // Set scrollBoxObj default CSS
    this.scrollBoxObj.style.position = "relative";
    this.scrollBoxObj.style.overflow = "hidden";

    this.scrollContent = content;
    // Establish container for the scrollContent
    this.scrollContentObj = null;
    // Set the speed. Slow speed down by 1 for NS4
    //Scroller speed (larger is faster 1-10)
    this.scrollspeed = ((document.layers) ? Math.max(1, speed - 1) : speed);
    // we need to hold on to the scrollspeed.
    this.moverate = this.scrollspeed;
    this.pausespeed = ((pause) ? 0 : this.moverate);

    // Initialize mouse over event method
    // First redirect the object reference to a variable
    // to call object properties from an object's own method.
    var scroller = this;
    this.scrollBoxObj.onmouseover = function() { scroller.moverate = scroller.pausespeed; };
    this.scrollBoxObj.onmouseout = function() { scroller.moverate = scroller.scrollspeed; };

    // Build it and they will see.
    this.populatescroller();
}

createScroller.prototype.getScrollcontent = function(obj) {
    // Get the length of the "array".
    var scrollContentLength = 0;
    for (var item in this.scrollContent) { scrollContentLength++; }

    var list = null;
    var i = 0;
    for (var name in this.scrollContent) {
        var delim = ((i < (scrollContentLength - 1)) ? ", " : "");

        if (this.scrollContent[name] == "") {
            list = document.createTextNode(unescape(name));
        } else {
            list = document.createElement("a");
            list.href = this.scrollContent[name];
            urlText = document.createTextNode(unescape(name));
            list.appendChild(urlText);
        }

        delimText = document.createTextNode(delim);
        obj.appendChild(list);
        obj.appendChild(delimText);
        i++;
    }

    return list;
};

createScroller.prototype.populatescroller = function() {
    // Add content to scroll box.
    this.scrollContentObj = document.createElement("div");
    this.scrollContentObj.id = "scrollContent";

    // Add the content
    this.scrollContentObj.appendChild(this.getScrollcontent(this.scrollContentObj));

    //append scrollContentObj to scrollBoxObj
    this.scrollBoxObj.appendChild(this.scrollContentObj);

    // Set the base CSS
    this.scrollContentObj.style.position = "absolute";
    this.scrollContentObj.style.left = parseInt(this.scrollBoxWidth) + 8 + "px";
    this.scrollContentObj.style.whiteSpace = "nowrap";

    // Remember the width of scrollContent when full.
    this.scrollContentWidth = this.getElementWidth(this.scrollContentObj);

    // Open pop up window from links in the scroll content.
    // Like target="_blank" but XHMTL compliant.
    var links = this.scrollContentObj.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function() {
            window.open(this.href, 'new_window');
            return false;
        };
    }

    // This is how to use setInterval within an object function.
    // Capture a local, closed instance of the function object.
    // This method is calling another method within the same object.
    // The "this" identifier in this case refers to this method
    // (the one you're in now), so the "this" must be passed to
    // another local variable first, then linked to the scrollmarqee method.
    var x = this;
    this.lefttime = setInterval(function() { x.scrollmarquee(); }, 25);
};

createScroller.prototype.scrollmarquee = function() {
    if (parseInt(this.scrollContentObj.style.left) > (this.scrollContentWidth * (-1) + 8)) {
        this.scrollContentObj.style.left = parseInt(this.scrollContentObj.style.left) - this.moverate + "px";
    } else {
        this.scrollContentObj.style.left = parseInt(this.scrollBoxWidth) + 8 + "px";
    }
};

createScroller.prototype.getElementWidth = function(elem) {
    if (document.layers) {
        return elem.clip.width;
    } else {
        return elem.offsetWidth;
    }
};

/* UTILITIES */
// Cross brower object conversion.
function convertToObj(anObj) {
    // if obj is a string, make a DOM object, else return the DOM object (passed by "this")
    if ((anObj != null) && (anObj.constructor == String)) {
        // unescape any url or raw encoded characters
        var obj = unescape(anObj);

        if (document.getElementById) {
            // this is the way the standards work
            return document.getElementById(obj);
        } else if (document.all) {
            // this is the way old msie versions work
            return document.all[obj];
        } else if (document.layers) {
            // this is the way nn4 works
            return document.layers[obj];
        }
    }
    return anObj;
}