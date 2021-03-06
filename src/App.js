import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey:'75796ca1046a4b5fa23a97c903d5ae17'
});

const particlesOptions = {
  particles: {
      number: {
        value:40,
        density: {
        enable: true,     
        value_area : 800
        }         
      }  
   }
}
class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl: '',
      box:{},
      route:'Signin'
    }
  }
  calculateFaceLocation =(data)=>{
   const clarifaiFace= data.output[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
 return{
    leftCol: clarifaiFace.left_col * width ,
    topRow: clarifaiFace.top_row * height ,
    rightCol: width -(clarifaiFace.right_col * width) ,
    bottomRow: height -(clarifaiFace.bottom_row * height) ,
  }
 }
displayFaceBox =(box)=>{
  this.setState({box: box});
}

  onInputChange =(event)=>{
    this.setState({input:event.target.value});
}

   onSubmit =()=>{
     this.setState({imageUrl:this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err)) ;
      
    } 
    onRouteChange =(route)=>{
      this.setState({route:route});

    }
  
  render() {
    return (
      <div className="App">
         <Particles className='particles'
         params={particlesOptions}
         />
         <Navigation   onRouteChange ={this.onRouteChange}/>
         {this.state.route==='Signin'
         ? <Signin onRouteChange ={this.onRouteChange}/>
         :<div>
         <Logo/>
         <Rank/>
         <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
         <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />  
         </div> 
         }     
      </div>
    );
  }  
}

export default App;
