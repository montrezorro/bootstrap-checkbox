/* ===========================================================
 * bootstrap-checkbox.js
 * ===========================================================
 * Copyright 2013 Roberto Montresor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function($) {
    var Checkbox = function(element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.$newElement = null;
        this.button = null;
        this.label = null;
        this.labelPrepend = null;
        this.options = $.extend({}, $.fn.checkbox.defaults, this.$element.data(), typeof options == 'object' && options);
        this.displayAsButton =  this.options.displayAsButton;
        this.buttonStyle = this.options.buttonStyle;
        this.buttonStyleChecked = this.options.buttonStyleChecked;
        this.defaultState = this.options.defaultState;
        this.defaultEnabled = this.options.defaultEnabled;
        this.init();
    };

    Checkbox.prototype = {

        constructor: Checkbox,

        init: function (e) {
            this.$element.hide();
            this.$element.attr('autocomplete', 'off');
            var template = this.getTemplate();
            this.$element.after(template);
            this.$newElement = this.$element.next('.bootstrap-checkbox');
            this.button = this.$newElement.find('button');
            this.label = this.$newElement.find('span.label-checkbox');
            this.labelPrepend = this.$newElement.find('span.label-prepend-checkbox');
             
            if (this.$element.data('default-state') != undefined){
                this.defaultState = this.$element.data('default-state');
            }
            if (this.$element.data('default-enabled') != undefined){
                this.defaultEnabled = this.$element.data('default-enabled');
            }
            
            this.addClasses(this.$element,this.$element.attr('class'),'checkbox');
            this.addClasses(this.button,this.buttonStyle);
             
            this.checkEnabled();
            this.checkChecked();
            this.checkTabIndex();
            this.clickListener();
        },
        
        addClasses:function(element,classlist,skipclass){
            var classList = classlist !== undefined ? classlist.split(/\s+/) : '';
            for (var i = 0; i < classList.length; i++) {
                if (!skipclass){
                    element.addClass(classList[i]);
                }else{
                    if(classList[i] != skipclass) {
                       element.addClass(classList[i]); 
                    }
                }
            }
        },
        
        removeClasses:function(element,classlist){
            var classList = classlist !== undefined ? classlist.split(/\s+/) : '';
            for (var i = 0; i < classList.length; i++) {
                 element.removeClass(classList[i]);
            }
        },
        
        getTemplate: function() {
            var templateStart = '';
            var templateInner = '';
            var templateEnd = '';
            var extraClass = '';
            
            var label = this.$element.data('label') ? '<span class="label-checkbox">'+this.$element.data('label')+'</span>' : '',
                labelPrepend = this.$element.data('label-prepend') ? '<span class="label-prepend-checkbox">'+this.$element.data('label-prepend')+'</span>' : '';
 
            if (this.$element.data('label') || this.$element.data('label-prepend')) {
                if (this.displayAsButton == true){
                    templateInner = label; //only support label after icon
                     extraClass = "bootstrap-checkboxbutton";
                }else{
                    templateStart = '<label class="checkbox bootstrap-checkbox">' + labelPrepend;
                    templateEnd = label +'</label>';
                }
            }
            
            
            var template = 
                templateStart+
                '<span class="button-checkbox bootstrap-checkbox '+extraClass+'">' +
                    '<button type="button" class="btn clearfix">' +
                        '<span class="icon '+this.options.checkedClass+'" style="display:none;"></span>' +
                        '<span class="icon '+this.options.uncheckedClass+'"></span>' +
                        templateInner+
                    '</button>' +
                '</span>' +
                templateEnd;
                
           return template; 

        },

        checkEnabled: function() {
            this.button.attr('disabled', this.$element.is(':disabled'));
            this.$newElement.toggleClass('disabled', this.$element.is(':disabled'));
        },
        
        checkTabIndex: function() {
            if (this.$element.is('[tabindex]')) {
                var tabindex = this.$element.attr("tabindex");
                this.button.attr('tabindex', tabindex);
            }
        },
        
        checkChecked: function() {
            var whitePattern = /\s/g, replaceChar = '.';
            if (this.$element.is(':checked')) {
                this.button.find('span.'+this.options.checkedClass.replace(whitePattern, replaceChar)).show();
                this.button.find('span.'+this.options.uncheckedClass.replace(whitePattern, replaceChar)).hide();
                if (this.buttonStyleChecked){
                    this.removeClasses(this.button,this.buttonStyle);
                    this.addClasses(this.button,this.buttonStyleChecked);
                }
            } else {
                this.button.find('span.'+this.options.checkedClass.replace(whitePattern, replaceChar)).hide();
                this.button.find('span.'+this.options.uncheckedClass.replace(whitePattern, replaceChar)).show();
                if (this.buttonStyleChecked){
                    this.removeClasses(this.button,this.buttonStyleChecked);
                    this.addClasses(this.button,this.buttonStyle);
                }
            }
        },

        clickListener: function() {
            var _this = this;
            this.button.on('click', function(e){
                e.preventDefault();
                _this.$element.click();
                _this.checkChecked();
            });
        this.$element.on('change', function(e) {
            _this.checkChecked();
        });
        this.$element.parents('form').on('reset', function(e) {
                    _this.$element.prop('checked', _this.defaultState);
                    _this.$element.prop('disabled', !_this.defaultEnabled);
                    _this.checkEnabled();
                    _this.checkChecked();
                    e.preventDefault();
        });
        },
        
        setOptions: function(option, event){
            if (option.checked != undefined) {
                this.setChecked(option.checked);
            }
            if (option.enabled != undefined) {
                this.setEnabled(option.enabled);
            }
        },
        
        setChecked: function(checked){
            this.$element.prop("checked", checked);
            this.checkChecked();
        },
        
        click: function(event){
            this.$element.click();
            this.checkChecked();
        },
        
        change: function(event){
            this.$element.change();
        },
        
        setEnabled: function(enabled){
            this.$element.attr('disabled', !enabled);
            this.checkEnabled();
        },
        
        toggleEnabled: function(event){
            this.$element.attr('disabled', !this.$element.is(':disabled'));
            this.checkEnabled();
        }

    };

    $.fn.checkbox = function(option, event) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('checkbox'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('checkbox', (data = new Checkbox(this, options, event)));
                if (data.options.constructorCallback != undefined){
                    data.options.constructorCallback(data.$element, data.button, data.label, data.labelPrepend);
                }
            } else {
                if (typeof option == 'string') {
                    data[option](event);
                } else {
                    data.setOptions(option, event);
                }
            }
        });
    };

    $.fn.checkbox.defaults = {
        displayAsButton:false,
        buttonStyle: 'btn-link',
        buttonStyleChecked: null,
        checkedClass: 'cb-icon-check',
        uncheckedClass: 'cb-icon-check-empty',
        defaultState: false,
        defaultEnabled: true,
        constructorCallback: null
    };

}(window.jQuery);
