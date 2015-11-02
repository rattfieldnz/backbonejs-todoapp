/**
 * Created by robattfield on 02-Nov-2015.
 */
var app = app || {};

/**
 * The collection of Todos, stored in local storage with Backbone's *localStorage*.
 */
var TodoList = Backbone.Collection.extend({
    // Reference model which todos are created with.
    model: app.Todo,

    // Save the collection in local storage, within the 'todos-backbone' namespace.
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    // Filter todo items that are finished.
    completed: function(){
        return this.filter(function(todo){
            return todo.get('completed');
        });
    },

    // Filter todo items that are not finished.
    remaining: function(){
        return this.without.apply(this, this.completed());
    },
    // Keep todos in sequential order, despite being stored by unordered GUID
    // in database. Returned output is next order number.
    nextOrder: function(){
        if(!this.length){
            return 1;
        }
        return this.last().get('order') + 1;
    },
    
    // Sort todos by original insertion order.
    comparator: function(todo){
        return todo.get('order');
    }
});

app.Todos = new TodoList();