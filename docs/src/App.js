import React from 'react';
import './App.css';
import './GreenScreen.css';
import {GreenScreen} from './GreenScreen.js'
import {UserCanvas} from './UserCanvas.js';

const height = 225;
const width = 325;
const green = '#009933';
const blue = '#0047bb';

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      image1: '',
      image2: '',
      canvasSelect:'',
      chromaKey: '#009933'
    }
    this.loadImage = this.loadImage.bind(this);
    this.changeCanvas = this.changeCanvas.bind(this);
    this.toggleKey = this.toggleKey.bind(this);
  }
  changeCanvas = (e) => { // set canvas selection
    const num = e.target.id;
    this.setState({canvasSelect:num});
  }
  toggleKey = () => {
    if(this.state.chromaKey === green){
      this.setState({chromaKey:blue});
    }
    else {
      this.setState({chromaKey:green});
    }
  }
  loadImage = (e) => {
    let file = e.target.files[0];
    if(file){
      let reader = new FileReader();
      reader.onload = (e) => { // load user uploaded image
        let imag = new Image();
        imag.src = e.target.result;
        imag.onload = function(){
          if (this.state.canvasSelect === '1'){ // if image is for foreground
            if(file.type.match('image.png')){
              const tempCan = document.createElement('canvas'); // create temp canvas to fill png with green
              const tempContxt = tempCan.getContext('2d');
              tempCan.width = width;
              tempCan.height = height;
              tempContxt.fillStyle = green;
              tempContxt.fillRect(0,0,width,height);
              tempContxt.drawImage(imag,0,0,imag.width, imag.height, 0, 0, width, height);
              this.setState({image1:tempCan.toDataURL('image/jpeg', 1.0)}); // set image1 state to new filled image
            }
            else{
             this.setState({image1:URL.createObjectURL(file)});
           }
         }
        else {
          this.setState({image2:URL.createObjectURL(file)});
        }
      }.bind(this);
    }
    reader.readAsDataURL(file);
  }
}
clearCanvas = () => { // set state triggers rerender, images will clear
  this.setState({image1:''});
  this.setState({image2:''});
}

  render(){
    return (
      <div className="App">
        <header>
          <h1 className='Title'>Green Screen Generator</h1>
          <img src={require('./titleImg1.png')} className='TitleImg' alt='titleImg'/>
        </header>
        <p className='TextBox'>
          Choose two images from your files: <br></br>
          1. A foreground image with a green background. <br></br>
          2. A background image to replace the green screen. <br></br>
          <br></br>
          If you upload a .PNG file for the foreground, the transparency will be filled with chroma key green. <br></br>
          <br></br>
          When you're ready, hit the magic button!
        </p>
        <div className='Toggle'>
          <input type="checkbox" id="switch" className="KeyToggle" onClick={this.toggleKey} />
          <label for="switch" className="ToggleLabel"></label>
        </div>
          {/* Foreground Canvas and Upload Button */}
            <h2 className='CanvasTitle' style={{left:'40%'}}>
            Step One:<br></br>
            Foreground
            </h2>
            <UserCanvas image = {this.state.image1} style={{left:'40%'}} />
            <div className='FG-Input'>
              <label for='FGUpload'className='Upload-Button' id='1' onClick={this.changeCanvas}>Upload Image</label>
              <input type = "file" id='FGUpload' style={{display:'none'}} accept='image/*' multiple = 'false'
              onChange = {this.loadImage}/>
            </div>
            <h1 style={{position:'fixed', top:'35%', left:'66%', color:'#3C2626'}}>+</h1>
          {/* Background Canvas and Upload Button */}
            <h2 className='CanvasTitle' style={{left:'70%'}}>
            Step Two:<br></br>
            Background</h2>
            <UserCanvas image = {this.state.image2} style={{left:'70%'}} />
            <div className='BG-Input'>
              <label for='BGUpload' className='Upload-Button' id='2' onClick={this.changeCanvas}>Upload Image</label>
              <input type = "file" id='BGUpload' style={{display:'none'}} accept='image/*' multiple = 'false'
              onChange = {this.loadImage}/>
            </div>
          {/* Green Screen Component */}
            <h2 className='CanvasTitle' style={{top:'58%', left:'55%'}}>
            Step Three:</h2>
            <GreenScreen image1={this.state.image1} image2={this.state.image2} clearCanvas={this.clearCanvas} chromaKey = {this.state.chromaKey}/>
      </div>
    );
  }
}
