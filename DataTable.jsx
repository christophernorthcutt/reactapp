import React from 'react';
//const validator = require("email-validator");

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      fname: '',
      age: '',
      phone: '',
      email: '',
      location: '',
      isEmail: null,
      isEmpty: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.callData = this.callData.bind(this);
  }

  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return (true)
    }
    return (false)
  }

  handleInputChange(name, value) {
    this.setState({
      [name]: value
    })
  }

  handleDelete(id) {
    const data = {data: id};
    fetch('/delete', {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(() => this.callData())
  }

  callData() {
    fetch("/data")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState(() => ({
          isLoaded: true,
          items: result
        }));
      },
      (error) => {
        this.setState(() => ({
          isLoaded: true,
          error
        }));
      }
    )
  }

  handleSubmit(event) {
    event.preventDefault();
    const newItem = {fname: this.state.fname, age: this.state.age, phone: this.state.phone, email: this.state.email, location: this.state.location};
    fetch('/add', {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newItem)
    })
    .then(() => {
      if (!this.validateEmail(this.state.email)) {
        this.setState({isEmail: 'Invalid email'})
      }
      else {
        this.setState({isEmail: null})
      }
      if (this.state.fname == '' || this.state.age == '' || this.state.phone == '' || this.state.location == '') {
        this.setState({isEmpty: 'Do not leave any fields blank'})
      }
      else {
        this.setState({isEmpty: null})
      }
      if (this.state.isEmail === null && this.state.isEmpty === null) {
        this.callData()
      }
    })    
  }

  componentDidMount() {
    this.callData()
  }
  
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <table>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name} {item.age} {item.phone} {item.email} {item.location}
                    <button onClick={this.handleDelete.bind(this, item.id)}>DELETE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <label>
              Name:
              <input type="text" onChange={(e) => this.handleInputChange('fname', e.target.value)} />
            </label><br />
            <label>
              Age:
              <input type="text" onChange={(e) => this.handleInputChange('age', e.target.value)} />
            </label><br />
            <label>
              Phone:
              <input type="text" onChange={(e) => this.handleInputChange('phone', e.target.value)} />
            </label><br />
            <label>
              Email:
              <input type="text" onChange={(e) => this.handleInputChange('email', e.target.value)} />
              {this.state.isEmail}
            </label><br />
            <label>
              Location:
              <input type="text" onChange={(e) => this.handleInputChange('location', e.target.value)} />
            </label><br />
            <input type="submit" value="Add user" />
            {this.state.isEmpty}
          </form>
        </div>
      );
    }
  }
}

export default DataTable;