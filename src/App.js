import React from 'react';
import './App.css';
//import logo from './logo.png';

const axios = require('axios');

function Header(){
  return(
    <div className="topOfPage">
      <Logo/>
      <div className="Header">
        <h2> <a href="home">Home</a> <a href="poets">Poets</a> <a href="about">About</a></h2>
      </div>
      <div className="Bigass-Line">
        <hr/>
      </div>
    </div>
  );
}

function Logo(){
  return(
    <img src={"./logo.png"} alt="Site Logo" className="Logo"/>
  );
}
class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      poem : <h1>'Poem Loading...'</h1>,
      loaded : false
    }
  }

  render() {
    if(!this.state.loaded){
      axios.get('https://api.poems.one/pod')
      .then( resp =>{
        const htmlPoem = JSON.stringify(resp.data.contents.poems[0].poem.poem).replace(/^"(.*)"$/, '$1').split("\\r\\n");
        const mappedPoem = htmlPoem.map((x) => 
            <div callName="poemLine">
              <li>
                {x}
              </li>
            </div>

        );
        axios.get("https://en.wikipedia.org/w/api.php?srsearch=" + resp.data.contents.poems[0].poem.author + "&format=json&action=query&list=search&origin=*")
        .then(wikiResp => {
          this.setState({
            poem : <ul className="Full-poem">{mappedPoem}</ul>,
            title : JSON.stringify(resp.data.contents.poems[0].poem.title).replace(/^"(.*)"$/, '$1'),
            author : JSON.stringify(resp.data.contents.poems[0].poem.author).replace(/^"(.*)"$/, '$1'),
            authorPageId : "http://en.wikipedia.org/?curid=" + JSON.stringify(wikiResp.data.query.search[0].pageid),
            loaded : true
          });
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      });
    }
    return(
      <div className="Everything">
        <Header/>
        <div className="App">
          <h1 className="Title">{this.state.title}</h1>
          <h2 className="Author"><a href={this.state.authorPageId} target="_blank" rel="noreferrer">{this.state.author}</a></h2>
          {this.state.poem}
        </div>
      </div>
    );
  }
  
}
export default App;