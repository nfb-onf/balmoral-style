//applique une couleur de branding en fonction de la couleur dominante d'une image
var imgSwitchColor=[];
var m_switchColor = (function () {
    
    function init(){
        $('.is-switch-color').each(function(){
            var $element=$(this);
            var imgId=$element.attr('data-switchColorIdImg');
            var cssProperty=$element.attr('data-switchColorCssProperty');
            if ($("#"+imgId).length>=1){
                    //si ce colorThief est deja en cours
                    if (!verifColorThiefDejaFait(imgId)){
                         
                        $.when(colorThief($("#"+imgId).attr('src'))).done(function(rgb) {
                            var color = tinycolor("rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")");
                            var hsl=color.toHsl();
                            var dominantColorHex=color.toHexString();
                            var brandColor=determineBrandColor(hsl.h);
                            var disabledColor=determineBrandColorDisabled(hsl.h);

                            for ( var i=0 ; i < imgSwitchColor.length; i++) {
                                var elementCourant=imgSwitchColor[i];
                                var $elementCourant=elementCourant.element;
                                var $textElement=$($elementCourant.attr('data-switchColorTextElement'));
                                var colorType=$elementCourant.attr('data-switchColorType');

                                if (elementCourant.imgID===imgId){
                                    modifierCouleur(elementCourant.element,elementCourant.cssProperty,dominantColorHex,brandColor,disabledColor,colorType,$textElement);
                                }
                            }
                        });
                    }
               
                var imgSwitchColorArray={"imgID":imgId,"element":$element,"cssProperty":cssProperty};
                imgSwitchColor.push(imgSwitchColorArray);
            }else{
                //si l'image ne load pas -> jaune
                var $textElement=$($element.attr('data-switchColorTextElement'));
                modifierCouleur($element,cssProperty,'#ffd100','#ffd100','brandColor',$textElement);
            }
        });
    }



    function verifColorThiefDejaFait(imgId){
        var retour=false;
        for ( var i=0 ; i < imgSwitchColor.length; i++) {
            var elementCourant=imgSwitchColor[i];
            if (elementCourant.imgID===imgId){
                retour=true;
            }
        }
        return retour;
    }

    function modifierCouleur($element,cssProperty,dominantColor,brandColor,disabledColor,colorType,$textElement){
        var maCouleur=brandColor;
        var textColor = getContrast(brandColor.replace('#',''));

        if (colorType==="dominantColor"){
            maCouleur=dominantColor;
            textColor = getContrast(dominantColor.replace('#',''));
        }else if (colorType==="brandColorDisabled"){
            maCouleur=disabledColor;
            //se fie à la couleur de branding standard pour déterminer la couleur du texte
            textColor = getContrast(brandColor.replace('#',''));
        }

        var arraySplit = cssProperty.split(',');
        for(var i = 0; i < arraySplit.length; i++){
            if (arraySplit[i]==="background-color" || arraySplit[i]==="background"){
                $element.css("color",textColor);
            }
            if ($textElement){
                $textElement.css("color",textColor);
            }
            $element.css(arraySplit[i],maCouleur);

            //car le removeClass ne fonctionne pas sur les path svg
            var currentClass=$element.attr('class');
            var newClass=currentClass.replace('invisible','');
            $element.attr('class',newClass);
        }
    }

    function colorThief(imgLink) {
        var r = $.Deferred();
        var rgb=[255,218,21]; //jaune par défaut
        var img = document.createElement('img');
        img.onload = function(e) {
            try {
              //facon de loader standard pour les browser moderne 
              var colorThief = new ColorThief();
              rgb=colorThief.getColor(img);
              r.resolve(rgb);
            } catch (e) {
                //avec preload.js pour ie10 a cause du cross browser
              $.getScript(preloadJsLink, function( data, textStatus, jqxhr ) {
                var preload = new createjs.LoadQueue();
                preload.addEventListener("fileload", handleFileComplete);
                preload.loadFile(imgLink);
                function handleFileComplete(event) {
                    event.result.crossOrigin='anonymus';
                    var colorThief = new ColorThief();
                    try {
                    rgb=colorThief.getColor(event.result,5);
                    r.resolve(rgb);
                    } catch (e) {
                    //sinon jaune
                      r.resolve(rgb);
                    }
                }
              })
            };
        };
        img.onerror = function(){
        r.resolve(rgb); //jaune
        }
        img.crossOrigin = '';
        img.src = imgLink;
      
      return r;
    }

    function determineBrandColor(hslH){
        var colorBranding="#FF5C39"; //orange
        if(hslH>30 && hslH<=57){
            colorBranding="#FFD100"; //jaune
        }else if(hslH>57 && hslH<=120.5){
            colorBranding="#C4D600"; //vert
        }else if(hslH>120.5 && hslH<=188){
            colorBranding="#00BFB3"; //turquoise
        }else if(hslH>188 && hslH<=244.5){
            colorBranding="#0085CA"; //bleu
        }else if(hslH>244.5 && hslH<=317.5){
            colorBranding="#87319A"; //mauve
        }else if(hslH>317.5 && hslH<=356){
            colorBranding="#F6416C"; //rose
        }else if (hslH>356 || hslH<=6){
            colorBranding="#E31D1A"; //rouge
        }
        return colorBranding;
    }

    function determineBrandColorDisabled(hslH){
        var colorDisabled="#90574b"; //orange
        if(hslH>30 && hslH<=57){
            colorDisabled="#86762d"; //jaune
        }else if(hslH>57 && hslH<=120.5){
            colorDisabled="#6a7025"; //vert
        }else if(hslH>120.5 && hslH<=188){
            colorDisabled="#216460"; //turquoise
        }else if(hslH>188 && hslH<=244.5){
            colorDisabled="#23516a"; //bleu
        }else if(hslH>244.5 && hslH<=317.5){
            colorDisabled="#523459"; //mauve
        }else if(hslH>317.5 && hslH<=356){
            colorDisabled="#8d4e5d"; //rose
        }else if (hslH>356 || hslH<=6){
            colorDisabled="#7b3635"; //rouge
        }
        return colorDisabled;
    }

    function getContrast(hexcolor) {
        var color = tinycolor('#'+hexcolor);
        var monRgb=color.toRgb();
        var o = Math.round(((parseInt(monRgb.r) * 299) + (parseInt(monRgb.g) * 587) + (parseInt(monRgb.b) * 114)) /1000);
        var textColor= "white";
        if(o > 125) {
            textColor= "black";
        }
        return  textColor;
    }



    // Reveal public pointers to
    // private functions and properties
    return {
        init: init,
    };
})();

$('document').ready(function(){
    m_switchColor.init();
});