/**
 * Created by robattfield on 02-Nov-2015.
 */
/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

/**
 * The main view for a todo item.
 */
app.TodoView = Backbone.View.extend({
    tagName: 'li',

    // Cache template function for specific item.
    template: _.template($('#item-template').html()),

    // Bind related events specific to an item.
    events: {
        'click .toggle': 'togglecompleted',
        'dblclick label': 'edit',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },

    // Listening to any changes made to the view's Todo model.
    // If there are changes, the todo item's view is re-rendered.
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    // Re-renders titles for todo item.
    render: function(){
        this.$el.html(this.template(this.model.attributes));

        this.$el.toggleClass( 'completed', this.model.get('completed') );
        this.toggleVisible();

        this.$input = this.$('.edit');
        return this;
    },

    toggleVisible : function () {
        this.$el.toggleClass( 'hidden', this.isHidden());
    },

    isHidden : function () {
        var isCompleted = this.model.get('completed');
        return ( // hidden cases only
            (!isCompleted && app.TodoFilter === 'completed')
            || (isCompleted && app.TodoFilter === 'active')
        );
    },

    togglecompleted: function() {
        this.model.toggle();
    },

    // Switches the todo item's view into editing mode.
    edit: function(){
        this.$el.addClass('editing');
        this.$input.focus();
    },

    // Save changes to the todo item and close editing mode.
    close: function(){
        var value = this.$input.val().trim();
        if(value){
            this.model.save({title: value});
        }else {
            this.clear();
        }
        this.$el.removeClass('editing');
    },

    // Finish editing the todo item by pressing the Enter/Return key.
    updateOnEnter: function(event){
        if(event.which === ENTER_KEY){
            this.close();
        }
    },

    clear: function() {
        this.model.destroy();
    }
});