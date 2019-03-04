'use strict';
var Handlebars_helper = (function() {
    //commun framework + cinema autochtone
    Handlebars.registerHelper('objectLengthIsGreaterThan', function (object, lengthValue, options) {
        if (object.length > lengthValue) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    
    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length != 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue != rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    //spécifique
    Handlebars.registerHelper("reOrderAlphabetical", function(context, language, options) {
        var ret = ""
        var key09 = "number";
        if (language === "fr"){
            key09 = "nombre";
        }
        var value09 = "";

        Object.keys(context).sort().forEach(function(key) {
            if (key === "0-9"){
                var value09 = context[key];
            } else{
                ret += options.fn({key: key, value: context[key]});
            }
        })
        ret += options.fn({key: key09, value: value09});
        return ret;
    });

    Handlebars.registerHelper('notequal', function(lvalue, rvalue, options) {
        if (arguments.length != 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue != rvalue ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('format_time', function (time) {
        if (time) {
            var time_parts = time.substr(0, 8).split(":");
            var hours = parseInt(time_parts[0]);
            var minutes = parseInt(time_parts[1]);
            var seconds = parseInt(time_parts[2]);
            if (hours) {
                return hours + " h " + minutes + " min";
            }
            else if (minutes) {
                return minutes + " min";
            }
            else if (seconds) {
                return seconds + " s";
            }
        }
        else {
            return;
        }
    });

    Handlebars.registerHelper("displayFilmsRestrictions", function(context, isCampusSubscribed, options) {
        var downloadable = false;
        var streamable_for_free = false;
        var rentable =  false;
        var streamable_for_campus = false;

        context.forEach(function(consumable_type) {
            if (consumable_type === "downloadable"){
                downloadable = true;
            }
            else if (consumable_type === "streamable_for_free"){
                streamable_for_free = true;
            }
            else if (consumable_type === "rentable"){
                rentable =  true;
            }
            else if (consumable_type === "streamable_for_campus"){
                streamable_for_campus =  true;
            }
        });


        if (isCampusSubscribed && streamable_for_campus){
            return '<span class="campus-label label-on">campus</span>'
        }
        else{
            if (!streamable_for_free){
                if (rentable || downloadable){
                    return '<i class="icon-cash-o"></i>';
                }
            }
            if (streamable_for_campus){
                return '<span class="campus-label">campus</span>';
            }
        }
    });


    Handlebars.registerHelper("displayLetterCount", function(lastName, list_by_first_letter, options) {
        var firstLetter = lastName.charAt(0);
        var count = list_by_first_letter[firstLetter.toLowerCase()];
        return count;
    });


    Handlebars.registerHelper("displayPropertyByLanguage", function (property, language) {
        if (!language) return property

        try {
            return property[language]
        }
        catch (e) {
            return '';
        }
     });
})();
