let React = require('react');

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      greeting: props.greeting
    };
  }

  render() {
    return (
      <div className="Testing">
        {this.state.greeting}
      </div>
    );
  }
}

App.defaultProps = {
  greeting: 'Hello World!'
};

module.exports = App;