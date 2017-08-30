// ==UserScript==
// @name       Mirkoblocker
// @namespace  https://wykop.pl/
// @version    1.0
// @description  Blokuje wszelkie NSFW
// @match      https://www.wykop.pl/*
// @copyright  2017, @Grizwold
// @updateURL   https://github.com/tomekbielaszewski/mirkoblocker/raw/master/tampermonkey/mirkoblocker.user.js
// @installURL  https://github.com/tomekbielaszewski/mirkoblocker/raw/master/tampermonkey/mirkoblocker.user.js
// @downloadURL https://github.com/tomekbielaszewski/mirkoblocker/raw/master/tampermonkey/mirkoblocker.user.js
// ==/UserScript==

$(function(){
  function getLastSwitchValue() {
    var lastSwitchValue = localStorage.getItem('mirkoblocker_value');
    console.log("get lastSwitchValue: "+lastSwitchValue);
    return lastSwitchValue === 'true';
  }

  var lastSwitchValue = getLastSwitchValue();

  function setLastSwitchValue(val) {
    localStorage.setItem('mirkoblocker_value', val);
    lastSwitchValue = val;
    console.log("set lastSwitchValue: "+val);
  }

  var switchSelector = "#myonoffswitch";
  var blacklist = ["#nsfw",
    "#randomanimeshit",
    "#cycki",
    "#prokuratorboners",
    "#ladnapani",
    "#ladnypan",
    "#bdsm",
    "#zakolanowki",
    "#rajstopyboners",
    "#oczyboners",
    "#anime",
    "#manga",
    "#sadistic",
    "#tyleczki",
    "#discopolo",
    "#furry",
    "#yiff",
    "#hentai",
    "#gentlemanboners",
    "#wolnoscdlapierogownawykopie",
    "#ponczochy",
    "#koreanka"];

  function containsAny(text, array) {
    for (var i = 0; i < array.length; i++) {
      if(text && text.indexOf(array[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  function getEntries() {
    return $("li.entry");
  }

  function blockEntries(entries, blacklist) {
    entries.each(function(i, e){
      var entry = $(e);
      if(containsAny(entry.text(), blacklist)) {
        console.log("Entry BLOCKED!");
        entry.hide();
      }
    });
  }

  function unblockEntries(entries, blacklist) {
    entries.each(function(i, e){
      var entry = $(e);
      entry.show();
    });
  }

  function turnOn() {
    blockEntries(getEntries(), blacklist);
    setLastSwitchValue(true);
  }

  function turnOff() {
    unblockEntries(getEntries(), blacklist);
    setLastSwitchValue(false);
  }

  var switchHtml = '<li><div class="onoffswitch"><input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch"><label class="onoffswitch-label" for="myonoffswitch"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div></li>';
  var switchStyle = '<style>.onoffswitch{position:relative;width:110px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;margin-top:13px}.onoffswitch-checkbox{display:none}.onoffswitch-label{display:block;overflow:hidden;cursor:pointer;border:2px solid #95A5A6;border-radius:0}.onoffswitch-inner{display:block;width:200%;margin-left:-100%;-moz-transition:margin .3s ease-in 0;-webkit-transition:margin .3s ease-in 0;-o-transition:margin .3s ease-in 0;transition:margin .3s ease-in 0}.onoffswitch-inner:before,.onoffswitch-inner:after{display:block;float:left;width:50%;height:20px;padding:0;line-height:16px;font-size:11px;color:#fff;font-family:Trebuchet,Arial,sans-serif;font-weight:700;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;border:2px solid transparent;background-clip:padding-box}.onoffswitch-inner:before{content:"Block NSFW";padding-left:6px;background-color:#E74C3C;color:#FFF}.onoffswitch-inner:after{content:"OFF";padding-right:6px;background-color:#4383AF;color:#FFF;text-align:right}.onoffswitch-switch{display:block;width:22px;margin:0;background:#2E6E99;position:absolute;top:0;bottom:0;right:88px;-moz-transition:all .3s ease-in 0;-webkit-transition:all .3s ease-in 0;-o-transition:all .3s ease-in 0;transition:all .3s ease-in 0}.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner{margin-left:0}.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch{right:0}ul.mainnav{min-width:50%!important}</style>';

  $("head").append($(switchStyle));
  $("#nav > div > ul:nth-child(3)").prepend($(switchHtml));

  $(switchSelector).change(function () {
    var isChecked = $(this).prop('checked');

    if(isChecked) {
      turnOn();
    } else {
      turnOff();
    }
  });

  if(lastSwitchValue) {
    $(switchSelector).prop('checked', true);
    turnOn();
  }

  function onEntriesLoad(event, xhr, settings) {
    if(settings.url && settings.url.indexOf("ajax2/mikroblog") > -1) {
      if(lastSwitchValue) {
        $(switchSelector).prop('checked', true);
        turnOn();
      }
    }
  }

  $(document).ajaxComplete(onEntriesLoad);
});
