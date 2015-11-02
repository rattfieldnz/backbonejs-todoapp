/**
 * Created by robattfield on 02-Nov-2015.
 */
var app = app || {};

/**
 * The main view for the Todo app.
 */
app.AppView = Backbone.View.extend({

    // Bind the view to an already existing element.
    el: '#todoapp',

    // The template to display stats information.
    statsTemplate: _.template($('#stats-template').html()),

    events: {
        'keypress #new-todo': 'createOnEnter',
        'click .clear-completed': 'clearCompleted',
        'click .toggle-all': 'toggleAllComplete'
    },

    // When view is initialised, bind related events to the Todos' collection.
    initialize: function(){
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);
        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch();
    },

    // Add a single todo item by creating a view for it,
    // then add it to the unordered list.
    addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
    },

    // Add all current todo items at the same time.
    addAll: function(){
        this.$('#todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    filterOne: function(todo){
        todo.trigger('visible');
    },

    filterAll: function(){
        app.Todos.each(this.filterOne, this);
    },

    // Generate attributes for a new todo item.
    newAttributes: function(){
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        }
    },

    // Create a new todo item when the Enter/Return key is pressed,
    // while cursor is in main input field. Todo item is then
    // persisted into local storage.
    createOnEnter: function(event){
        if(event.which === ENTER_KEY && this.$input.val().trim()){
            app.Todos.create(this.newAttributes());
            this.$input.val('');
        }
    },

    // Clear and destroy all completed todo items.
    clearCompleted: function(){
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete: function(){
        var completed = this.allCheckbox.checked;

        app.Todos.each(function(todo){
            todo.save({
                'completed': completed
            })
        });
    },

    render: function(){
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if(app.Todos.length){
            this.$main.show();
            this.$footer.show();
            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));
            this.$('#filters li a')
                .removeClass('selected')
                .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckbox.checked = !remaining;
    }
});