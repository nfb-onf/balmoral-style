var openOrCloseNav = (function () {
    function hasClass( target, className ) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
    }

    function init(){
        var el = document.getElementById("l-generalContainer");
        var navIsOpen = false;
        //ouvre la nav au premier load seulement sur desktop


        if(window.matchMedia("(min-width: 990px)").matches && hasClass(document.getElementsByTagName('html')[0], 'brand-resize')  || (window.matchMedia("(min-width: 1200px)").matches && hasClass(document.getElementsByTagName('html')[0], 'legacy-resize'))){
            if(typeof(Storage) !== "undefined") {
                navIsOpen = localStorage.getItem("nav-open");
            }
            if (navIsOpen === "true" || navIsOpen === null) {
                el.className+=" is-nav-open";
            }
            setTimeout(function(){
                 el.className+=" is-activated";
            },100);
        }else{
            el.className+=" is-activated";

        }
    }

    return {
        init: init
    };

})();
