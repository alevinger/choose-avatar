( function( $ ) {

    var AvatarPicker = function(element, options) {
        this.$element = $( element );
        this.modal = this.$element.find('.modal');
        this.init( options );
        this.$element.data('avatarpicker', this);
        return this;
    };


    AvatarPicker.prototype = {
        defaultOptions : {
            avatarList: [],
            currentAvatarId: null,
            previewContainer: 'avatarView',
            thumbnailsContainer: 'thumbnailsContainer',
            test: 1
        },
        constructor: AvatarPicker,
        init: function (options) {
            var self = this;
            self.options = $.extend({}, this.defaultOptions, options);
            self.thumbnailsContainer = $('#'+self.options.thumbnailsContainer);
            self.previewContainer = $('#'+self.options.previewContainer);

            if(self.options.avatarList.length) {
                var list = $( "<ul></ul>" );
                self.thumbnailsContainer.append( list );
                var el, cnames;

                $.each( self.options.avatarList, function( index, avatar ) {
                    el = $("<li data-id='"+avatar.id+"'><img src='"+avatar.src+"'/></li>");
                    list.append(el);
                    self.bind(el, avatar);
                });
            };

            self.setSelection(self.options.currentAvatarId);
        },

        setSelection: function ( id ) {
            this.thumbnailsContainer.find('li').each( function() {
                if( $(this).data("id") == id ) {
                    $(this).addClass('active');
                }
                else {
                    $(this).removeClass('active').removeClass('loader');
                }
            })
        },

        bind: function (container, args) {
            var self = this;
            container.on('click', '', {self, args}, function (e) {

                $(this).addClass('loader');

                setTimeout(updateAndClose, 2000);

                function updateAndClose() {
                    var container = e.data.self.previewContainer;
                    var av = e.data.args;

                    container.data("id", av.id).attr("src", av.src);
                    e.data.self.close();
                    self.setSelection(av.id);
                    Cookies.set("currentAvatar", av.id);
                }
            });
        },

        open: function() {
            this.modal.show("slow");

        },

        close: function (){
            this.modal.hide("fast")
        }

    };




    $.fn.avatarPicker = function ( options, arg ) {
         if (options && typeof(options) == 'object') {
            this.each( function() {
                return new AvatarPicker( this, options );
            });
        }
        else if (options && typeof(options) == 'string') {
            if (options =='open') {
               this.data('avatarpicker').open();
            }
            if (options =='close') {
                this.data('avatarpicker').close();
            }
        }

    };


    $.fn.avatarPicker.Constructor = AvatarPicker;




}( jQuery ) );