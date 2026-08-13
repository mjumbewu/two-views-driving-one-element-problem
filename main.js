// Views
// -----

const HomeView = Backbone.View.extend({
  render: function() {
    const tpl = document.querySelector('#home-tpl').innerHTML;
    this.$el.html(tpl);
    return this;
  }
});

const ListView = Backbone.View.extend({
  // Backbone will automatically add events in the `events` attribute for
  // elements under the view's root element (this.el) based on the given event
  // type and the element selector. Crucially, Backbone will also keep track of
  // these event bindings, and automatically unbind them when the view is
  // removed. This is important for preventing memory leaks and ensuring that
  // event handlers are not left dangling after a view is no longer in use.
  events: {
    'click #add-item-btn': 'addItem'
  },

  addItem: function() {
    const newItem = this.el.querySelector('#new-item-input').value;
    console.log(this.el);
    if (newItem) {
      console.log('Adding the item to the list:', newItem);
      this.el.querySelector('#item-list').insertAdjacentHTML('beforeend', `<li>${newItem}</li>`);
      console.log('Clearing the input field');
      this.el.querySelector('#new-item-input').value = '';
    } else {
      alert('Please enter an item.');
    }
  },

  render: function() {
    const tpl = document.querySelector('#list-tpl').innerHTML;
    this.$el.html(tpl);
    return this;
  }
});

// The AppView is just a coordinator. It makes sure that `internal` links are
// routed through Backbone's router instead of requiring a page reload, and it
// manages the current view. It does not have its own template, but instead
// renders the current view into its root element.
const AppView = Backbone.View.extend({
  events: {
    'click a[data-internal="true"]': 'navigateInternalLink'
  },

  initialize: function (options) {
    this.router = options.router;
  },

  navigateInternalLink: function(evt) {
    if (evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) return;

    evt.preventDefault();

    var href = $(evt.currentTarget).attr('href'),
        fragment = href.replace(/^\//, '');

    this.router.navigate(fragment, { trigger: true });
  },

  showHome: function () {
    if (this.currentView) this.currentView.remove();
    this.currentView = new HomeView().render();
    this.el.append(this.currentView.el);
  },

  showList: function () {
    if (this.currentView) this.currentView.remove();
    this.currentView = new ListView().render();
    this.el.append(this.currentView.el);
  }
});


// Router
// ------

const Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'list': 'list'
  },

  initialize: function (options) {
    this.appView = new AppView({ el: '#app', router: this });

    // Start tracking the history
    var historyOptions = { pushState: true };
    Backbone.history.start(historyOptions);
  },

  home: function () {
    this.appView.showHome();
  },

  list: function () {
    this.appView.showList();
  }
});

// Creating an instance of the router will automatically start the application
// and render the initial view based on the current URL fragment.
const router = new Router();
