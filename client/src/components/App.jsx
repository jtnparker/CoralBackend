import React from 'react';
// import css from '../../dist/style.css';

import axios from 'axios';


class App extends React.Component {
    constructor(props){
      super(props);
      this.whatRef = React.createRef();
      this.whoRef = React.createRef();
      this.contactRef = React.createRef();
      this.howRef = React.createRef();
      this.landingRef = React.createRef();
      this.pluginRef = React.createRef();
      this.state = {
        valuesList: [],
        privacy: true,
        email: '',
        value: '',
        id: 1,
        peta: 0,
        hrc: 0,
        fla: 0
        
    }
    // this.togglePrivacy = this.togglePrivacy.bind(this);
    // this.scrollToWhat = this.scrollToWhat.bind(this);
    // this.scrollToWho = this.scrollToWho.bind(this);
    // this.scrollToContact = this.scrollToContact.bind(this);
    // this.scrollToHow = this.scrollToHow.bind(this);
    // this.scrollToLanding = this.scrollToLanding.bind(this);
    // this.scrollToPlugin = this.scrollToPlugin.bind(this);
    // this.scrollToTop = this.scrollToTop.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleChangeName = this.handleChangeName.bind(this);
    // this.postEmail = this.postEmail.bind(this);
     this.getValuesToInput = this.getValuesToInput.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.postValues = this.postValues.bind(this);
     this.deleteValue = this.deleteValue.bind(this);
     this.handleChangeCount = this.handleChangeCount.bind(this);
     
}

componentDidMount() {
    this.getValuesToInput();
     
};

handleChange(event) {
    let index = this.state.valuesList.find(element => element.brand === event.target.value)
    // console.log(this.state.valuesList);
    index = index.id;
    console.log(index);
    this.setState({
        value: event.target.value,
        id: index
        });
  }

  postValues(brand, peta, hrc, fla, id) {
    axios
    .post('/api/values', {brand: brand, peta: peta, hrc: hrc, fla: fla}) // so todo:todo  //gets from req.body. axios will get it. => ({item:item}, {quantity:quantity})
    .then(() => {
        this.deleteValue(id)
    })
    .catch((err) => {
  
    console.error(err);
    });
  
  };
  deleteValue(id) {
    console.log(id);
    axios
    .delete(`/api/values/${id}`)
    .then(() => {
        this.getValuesToInput();
    })
    .catch((err) => console.error(err));
  };



getValuesToInput() {
    axios
    .get(`api/values`)
    .then((data) => {

        data.data.sort(function(a, b) {
            var nameA = a.brand// ignore upper and lowercase
            var nameB = b.brand // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
      
            // names must be equal
            return 0;
          });

        this.setState({
            valuesList: data.data,
            value: data.data[0].brand,
            id: data.data[0].id
          })

    })
}

handleSubmit(event) {
    event.preventDefault();
    this.postValues(this.state.value, this.state.peta, this.state.hrc, this.state.fla, this.state.id);
    event.target.reset();
  };

  handleChangeCount(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

 render() {
    return(
        <div>
             <form onSubmit={this.handleSubmit}>
                <label>
                     Pick the Brand Name:
                    <select  value = {this.state.value} onChange={this.handleChange}>{this.state.valuesList.map((x) => <option key={x.id}  value = {x.brand}>{x.brand}</option>)}</select>;
                    
                    </label>
        <label>PETA</label>
        <input type  = "number" name = "peta" onChange={this.handleChangeCount} required max="100" />
        <label>HRC</label>
        <input type  = "number" name = "hrc" onChange={this.handleChangeCount} required max="100" />
        <label>Fair Labor Association</label>
        <input type  = "number" name = "fla" onChange={this.handleChangeCount} required max="100" />
        
                    <input type="submit" value="Submit" />
            </form>
        </div>


      )
    }
}
export default App;