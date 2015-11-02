/**
 * Created by robattfield on 02-Nov-2015.
 */
var app = app || {};

app.Todo = Backbone.Model.extend({
    // Default attributes for a to-do item
    defaults: {
        title: '',
        completed: false
    },
    // Toggle the completion status of the to-do item.
    toggle: function(){
        this.save({
            completed: !this.get('completed')
        });
    }
});