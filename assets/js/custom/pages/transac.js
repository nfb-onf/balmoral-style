var transac = (function () {
    function init() {
        initFormValidation();
        boostrapifyForm();
        $('.selectpicker').selectpicker({mobile: Utils.isMobile.any()}).change(function () {
            var $monForm = $(this).closest('form');
            var nameChamps = $(this).attr('name');
            $monForm.formValidation('revalidateField', nameChamps);

            if (nameChamps=="country"){
               $monForm.formValidation('revalidateField', 'postal_code');
               $("#id_state option:not(:first)").remove();
                var country_code = $(this).val();
                $.get("/remote/secure/country/"+country_code+"/admin_areas/", {}, function(data){
                    $.each(eval(data), function(val, text) {
                        $('#id_state').append(
                            $('<option></option>').val(text.optionValue).html(text.optionDisplay)
                        ).selectpicker('refresh');;
                    });
                });
            }

        });
    }

    var creditCardFormEnabled = false;
    function enableCreditCardForm(enabled) {
        var formValidation = $('#payForm').data('formValidation');
        creditCardFormEnabled = enabled;
        $('.cc-form-group').toggle(enabled);
        $('.cc-form-group input,.cc-form-group select').prop('disabled', !enabled);
        ['credit_type', 'month_expires', 'year_expires', 'ccv'].forEach(function(field) {
            formValidation.enableFieldValidators(field);
            formValidation.revalidateField(field);
        });
    }

    function boostrapifyForm(){
       $('input:not(:checkbox)').addClass('form-control');
        $('select').addClass('selectpicker full-width').attr('data-style','formSelect').attr('data-width','100%');
    }


    function initFormValidation(){
        var localValidation=['en_US'];
        if ($('html').attr('lang')=="fr"){
            localValidation=['fr_FR'];
        }
        var $serveurErrorInContext=$('.server-error-in-context');
        $(".bootstrapValidation").formValidation({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            locale: localValidation,
            live: 'enabled',
            submitButtons: 'button[type="submit"]',
            excluded:[':disabled'],
            verbose: false,
            fields: {
                first_name:{
                    validators: {
                        notEmpty: {}
                    }
                },
                last_name:{
                    validators: {
                        notEmpty: {}
                    }
                },
                email:{
                    validators: {
                        notEmpty: {},
                        email: {}
                    }
                },
                street1:{
                    validators: {
                        notEmpty: {}
                    }
                },
                city:{
                    validators: {
                        notEmpty: {}
                    }
                },
                country:{
                    validators: {
                        notEmpty: {}
                    }
                },
                state:{
                    validators: {
                        notEmpty: {}
                    }
                },
                postal_code: {
                    validators: {
                        notEmpty: {},
                        callback: {
                            message: FormValidation.I18n[localValidation].zipCode.default,
                            callback: function (value, validator, $field) {
                                var rules = {
                                    231 : /^[0-9]{5}(?:-[0-9]{4})?$/
                                    ,39 : /^[a-zA-Z]{1}\d{1}[a-zA-Z]{1}[ ]?\d{1}[a-zA-Z]{1}\d{1}$/
                                };
                                return ((rules.hasOwnProperty($("#id_country").val())) ? rules[$("#id_country").val()].test(value): true);
                            }
                        }
                    }
                },
                discount:{
                    validators: {
                        remote: {
                            message: $("#label_discount").attr('data-message-discount'),
                            validKey: 'is_valid',
                            url: urlDiscountCheck,
                            type: 'POST'
                        }
                    },
                    onSuccess: function(e, data) {
                        if (data.element.val() == "") {
                            enableCreditCardForm(true);
                        }
                        else if (data.validator == 'remote') {
                            if (data.result.discount_type === "percentage"  && data.result.discount_value === 100 ) {
                                enableCreditCardForm(false);
                            }
                            else {
                                enableCreditCardForm(true);
                            }
                        }
                    },
                    onError: function(e, data) {
                        enableCreditCardForm(true);
                    }
                },
                credit_type:{
                    validators: {
                        notEmpty: {}
                    }
                },

                month_expires: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        callback: {
                            message: $("#label_cc").attr('data-message-cc-expires'),
                            callback: function(value, validator, $field) {
                                value = parseInt(value, 10);
                                var year         = validator.getFieldElements('year_expires').val(),
                                    currentMonth = new Date().getMonth() + 1,
                                    currentYear  = new Date().getFullYear();
                                year = parseInt(year, 10);
                                if (year > currentYear || (year === currentYear && value >= currentMonth)) {
                                    validator.updateStatus('year_expires', 'VALID');
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                },
                year_expires: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        callback: {
                            message: $("#label_cc").attr('data-message-cc-expires'),
                            callback: function(value, validator, $field) {
                                value = parseInt(value, 10);
                                var month        = validator.getFieldElements('month_expires').val(),
                                    currentMonth = new Date().getMonth() + 1,
                                    currentYear  = new Date().getFullYear();
                                month = parseInt(month, 10);
                                if (value > currentYear || (value === currentYear && month >= currentMonth)) {
                                    validator.updateStatus('month_expires', 'VALID');
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                },
                ccv: {
                    validators: {
                        notEmpty: {}
                    }
                }
            },
            trigger: "blur"
        }).on('err.validator.fv', function() {
            $serveurErrorInContext.remove();
        }).on('success.validator.fv', function(e, data) {
            $serveurErrorInContext.remove();
        }).on('success.form.fv', handlePayFormSubmit);
    }

    function handlePayFormSubmit(event) {
        var checkBox = $("#newsletter-subscription-checkbox");
        if (checkBox.is(":checked")) {
            Analytics.push(_gaq, {
                    'type':'event',
                    'category':'Newsletter',
                    'action': 'Subscribe - Newsletter subscription',
                    'label': $('html').attr('lang') == 'fr' ? '/bulletin_onf' : '/bulletin_nfb',
                }
            );
        }
        event.preventDefault();
        var monerisFrame = document.getElementById('monerisFrame');
        if (monerisFrame && creditCardFormEnabled) {
            monerisFrame.contentWindow.postMessage('', postUrl);
        }
        else {
            $(event.target).data('formValidation').defaultSubmit();
        }
    }

    function monerisCallback(event) {
        var msg = JSON.parse(event.data);
        if (msg.responseCode == "001") {
            // la carte de crédit est valide
            $('#id_credit_number').val(msg.dataKey);
            $("#credit_card_number_error").hide();
            $("#ccNumberContainer").removeClass('has-feedback has-error');
            $('#submit_button').prop('disabled', true);
            $('#payForm').data('formValidation').defaultSubmit();
        }
        else {
            var errorMsg = msg.responseCode == '943' ? invalidCardMsg : msg.responseCode + '-' + msg.errorMessage;
            $('#credit_card_number_error').text(errorMsg);
            $("#ccNumberContainer").addClass('has-feedback has-error');
        }
    }

    if (window.addEventListener) {
        window.addEventListener ("message", monerisCallback, false);
    }
    else if (window.attachEvent) {
        window.attachEvent("onmessage", monerisCallback);
    }

    return {
        init: init
    };

})();

$('document').ready(function(){
    transac.init();
});

