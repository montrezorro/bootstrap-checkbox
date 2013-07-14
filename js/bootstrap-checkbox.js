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
            var classList = this.$element.attr('class') !== undefined ? this.$element.attr('class').split(/\s+/) : '';
            var template = this.getTemplate();
            this.$element.after(template);
            this.$newElement = this.$element.next('.bootstrap-checkbox');
            this.button = this.$newElement.find('button');
            this.label = this.$newElement.find('span.label-checkbox');
            this.labelPrepend = this.$newElement.find('span.label-prepend-checkbox');
            for (var i = 0; i < classList.length; i++) {
                if(classList[i] != 'checkbox') {
                    this.$newElement.addClass(classList[i]);
                }
            }
            this.button.addClass(this.buttonStyle);
            
            if (this.$element.data('default-state') != undefined){
            	this.defaultState = this.$element.data('default-state');
            }
            if (this.$element.data('default-enabled') != undefined){
            	this.defaultEnabled = this.$element.data('default-enabled');
            }
            
            this.checkEnabled();
            this.checkChecked();
            this.checkTabIndex();
            this.clickListener();
        },
        
        getTemplate: function() {
            var template = 
            	'<span class="button-checkbox bootstrap-checkbox">' +
            		'<button type="button" class="btn clearfix">' +
	                    '<span class="icon '+this.options.checkedClass+'" style="display:none;"></span>' +
	                    '<span class="icon '+this.options.uncheckedClass+'"></span>' +
	                '</button>' +
	            '</span>';
            
            var label = this.$element.data('label') ? '<span class="label-checkbox">'+this.$element.data('label')+'</span>' : '',
            	labelPrepend = this.$element.data('label-prepend') ? '<span class="label-prepend-checkbox">'+this.$element.data('label-prepend')+'</span>' : '';

            if (this.$element.data('label') || this.$element.data('label-prepend')) {
            	template =
            		'<label class="checkbox bootstrap-checkbox">' +
            			labelPrepend + template + label+
		            '</label>';
            }
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
			if (this.$element.is(':checked')) {
				this.button.find('span.'+this.options.checkedClass).show();
				this.button.find('span.'+this.options.uncheckedClass).hide();
				if (this.buttonStyleChecked){
					this.button.addClass(this.buttonStyleChecked);
					this.button.removeClass(this.buttonStyle);
				}
        	} else {
        		this.button.find('span.'+this.options.checkedClass).hide();
        		this.button.find('span.'+this.options.uncheckedClass).show();
        		if (this.buttonStyleChecked){
        			this.button.addClass(this.buttonStyle);
        			this.button.removeClass(this.buttonStyleChecked);
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
        buttonStyle: 'btn-link',
        buttonStyleChecked: null,
        checkedClass: 'cb-icon-check',
        uncheckedClass: 'cb-icon-check-empty',
        defaultState: false,
        defaultEnabled: true,
        constructorCallback: null
    };

}(window.jQuery);
