import React from 'react';
import './UserCanvas.css';

const height = 225;
const width = 325;

export class UserCanvas extends React.Component{
  constructor(props){
    super(props);
    this.loadImage = this.loadImage.bind(this);
  }

  componentDidUpdate(){
    this.loadImage(this.props.image);
  }

  loadImage = (img) => {
    const canv = this.refs.canvas;
    const contxt = canv.getContext('2d');
    contxt.clearRect(0, 0, width, height);
    if(img!==''){
      let imag = new Image();
      imag.src = img;
      imag.onload = function(){
        contxt.drawImage(imag,0,0,imag.width, imag.height, 0, 0, width, height);
      }
    }
  }
  render(){
    return(
      <div>
        <canvas ref='canvas' id='canvas' className='Canvas'
        width={width} height = {height} style={this.props.style}>
        </canvas>
      </div>
    )
  }
}
