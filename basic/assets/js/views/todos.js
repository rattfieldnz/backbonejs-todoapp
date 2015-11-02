/**
 * Created by robattfield on 02-Nov-2015.
 */
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
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },

    // Listening to any changes made to the view's Todo model.
    // If there are changes, the todo item's view is re-rendered.
    initialize: function(){
        this.listenTo(this.model, 'change', this.render);
    },

    // Re-renders titles for todo item.
    render: function(){
        this.$el.html(this.template(this.model.attributes));
        this.$input = this.$('.edit');
        return this;
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
        }
        this.$el.removeClass('editing');
    },

    // Finish editing the todo item by pressing the Enter/Return key.
    updateOnEnter: function(event){
        if(event.which == ENTER_KEY){
            this.close();
        }
    }
});