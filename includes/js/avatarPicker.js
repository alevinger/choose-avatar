( function( $ ) {

    var AvatarPicker = function(element, options) {
        this.$element = $( element );
        //this.modal = this.$element.find('.modal');
        this.init( options );
        this.$element.data('avatarpicker', this);
        this.curretAvatarId = null;
        return this;
    };


    AvatarPicker.prototype = {
        defaultOptions : {
            avatarList: [
                {"src": "./includes/images/img6.png", "id": 1},
                { "src": "./includes/images/img5.png", "id": 2 },
                { "src": "./includes/images/img4.png", "id": 3 },
                { "src": "./includes/images/img3.png", "id": 4 },
                { "src": "./includes/images/img2.png", "id": 5 },
                { "src": "./includes/images/img1.png", "id": 6 }
            ],
            placeholder: "",
            defaultAvatarId: 1,
            previewContainer: 'avatarView',
            thumbnailsContainer: 'thumbnailsContainer',
        },
        constructor: AvatarPicker,
        init: function (options) {
            var self = this;
            self.options = $.extend({}, this.defaultOptions, options);

            self.curretAvatarId =  Cookies.get("currentAvatar") != undefined ? Cookies.get("currentAvatar") : self.options.defaultAvatarId;

            self.createPreview();
            self.createModal();
        },

        createPreview: function() {
            var self = this;
            var preview = $("<img id='avatarView' class='img-circle'/>");
            self.$element.append(preview);
            self.previewContainer = $('#'+self.options.previewContainer);

            var currentAvatarObj = self.options.avatarList.find( function (x) { return x.id == self.curretAvatarId } );
            self.previewContainer.data("id", currentAvatarObj.id).attr("src", currentAvatarObj.src);
        },

        createModal: function() {
            var self = this;

            var modal = $(
                "<div class='modal'  id='avatarsSpace' style='display: none;'>" +
                "<div class='modal-dialog'><div class='modal-content'>" +
                "<div class='modal-header'><div id='triangle'></div></div>" +
                "<div class='modal-body'><p class='title'>"+self.options.placeholder+"</p>"+
                "<div id='thumbnailsContainer'></div></div></div></div></div>"
            );

            self.$element.append(modal);
            self.modal = self.$element.find('.modal');
            self.thumbnailsContainer = self.modal.find('#'+self.options.thumbnailsContainer);
            self.populateThumbnailsContainer();
        },

        populateThumbnailsContainer: function() {
            var self = this;

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
            self.bindPreview();
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

        bindPreview: function() {
            var self = this;
            self.$element.find('#'+self.options.previewContainer).on('click', '', self, function (e) {
                self.open();
            });
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